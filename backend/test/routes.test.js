const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { db, request, adminToken, viewerToken, quietly } = require("./helpers");

// Every route that changes data or exposes private data.
const protectedRoutes = [
    ["POST", "/api/projects"],
    ["PUT", "/api/projects/1"],
    ["DELETE", "/api/projects/1"],
    ["POST", "/api/skills"],
    ["PUT", "/api/skills/1"],
    ["DELETE", "/api/skills/1"],
    ["POST", "/api/experiences"],
    ["PUT", "/api/experiences/1"],
    ["DELETE", "/api/experiences/1"],
    ["POST", "/api/education"],
    ["PUT", "/api/education/1"],
    ["DELETE", "/api/education/1"],
    ["POST", "/api/certificates"],
    ["PUT", "/api/certificates/1"],
    ["DELETE", "/api/certificates/1"],
    ["PUT", "/api/profile"],
    ["GET", "/api/messages"],
    ["DELETE", "/api/messages/1"],
    ["GET", "/api/dashboard/overview"],
    ["POST", "/api/uploads"],
    ["POST", "/api/auth/register"],
];

describe("authorization", () => {
    for (const [method, path] of protectedRoutes) {
        it(`${method} ${path} needs an admin token`, async () => {
            const body = method === "GET" || method === "DELETE" ? undefined : {};

            assert.equal((await request(method, path, { body })).status, 401);
            assert.equal((await request(method, path, { body, token: "not-a-jwt" })).status, 401);
            assert.equal((await request(method, path, { body, token: viewerToken })).status, 403);

            const asAdmin = await quietly(() => request(method, path, { body, token: adminToken }));
            assert.ok(![401, 403].includes(asAdmin.status), `admin got ${asAdmin.status}`);

            // Rejected requests must never reach the database.
            assert.ok(db.queries.length <= 2, "only the admin request may query");
        });
    }

    for (const path of ["/api/profile", "/api/projects", "/api/skills", "/api/experiences", "/api/education", "/api/certificates", "/api/social-links", "/api/stats"]) {
        it(`GET ${path} is public`, async () => {
            db.handler = () => ({ rows: [{}] });

            assert.equal((await request("GET", path)).status, 200);
        });
    }
});

describe("GET /api/stats", () => {
    it("counts everything in a single query", async () => {
        db.handler = () => ({ rows: [{ projects: "3", skills: "12", experiences: "2", certificates: "5", experience_years: "1" }] });

        const res = await request("GET", "/api/stats");

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, { projects: 3, skills: 12, experiences: 2, certificates: 5, experience_years: 1 });
        assert.equal(db.queries.length, 1);
    });

    it("returns 500 when the database fails", async () => {
        db.handler = () => {
            throw new Error("db down");
        };

        const res = await quietly(() => request("GET", "/api/stats"));

        assert.equal(res.status, 500);
        assert.equal(res.body.message, "Failed to fetch stats");
    });
});

describe("GET /api/dashboard/overview", () => {
    it("returns all totals and the latest messages from two queries", async () => {
        const latest = [{ id: 1, name: "A", email: "a@example.com", subject: null, message: "Hi" }];
        db.handler = (sql) =>
            sql.includes("LIMIT 5")
                ? { rows: latest }
                : { rows: [{ projects: "1", skills: "2", experiences: "3", educations: "4", certificates: "5", messages: "6" }] };

        const res = await request("GET", "/api/dashboard/overview", { token: adminToken });

        assert.equal(res.status, 200);
        assert.deepEqual(res.body, {
            totalProjects: 1,
            totalSkills: 2,
            totalExperiences: 3,
            totalEducations: 4,
            totalCertificates: 5,
            totalMessages: 6,
            latestMessages: latest,
        });
        assert.equal(db.queries.length, 2);
    });
});

describe("POST /api/projects", () => {
    it("inserts the cleaned body", async () => {
        db.handler = () => ({ rows: [{ id: 1 }] });

        const res = await request("POST", "/api/projects", {
            token: adminToken,
            body: {
                title: "  Portfolio ",
                description: "My site",
                tech_stack: ["React", " ", "Express"],
                category: "Web",
                demo_link: "",
                id: 999,
            },
        });

        assert.equal(res.status, 201);
        assert.deepEqual(db.queries[0].params, [
            "Portfolio",
            "My site",
            null,
            ["React", "Express"],
            null,
            null,
            "Web",
            false,
            null,
        ]);
    });

    it("rejects a malformed started_on", async () => {
        const res = await request("POST", "/api/projects", {
            token: adminToken,
            body: { title: "x", description: "y", category: "z", tech_stack: ["React"], started_on: "2024-13" },
        });

        assert.equal(res.status, 400);
        assert.ok(res.body.errors.started_on);
        assert.equal(db.queries.length, 0);
    });

    it("rejects an invalid project without querying", async () => {
        const res = await request("POST", "/api/projects", {
            token: adminToken,
            body: { title: "x", description: "y", category: "z", tech_stack: [], repo_link: "ftp://x" },
        });

        assert.equal(res.status, 400);
        assert.deepEqual(res.body.errors, { tech_stack: "is required", repo_link: "must be a valid http(s) URL" });
        assert.equal(db.queries.length, 0);
    });

    it("rejects a non-numeric id", async () => {
        const res = await request("DELETE", "/api/projects/abc", { token: adminToken });

        assert.equal(res.status, 400);
        assert.equal(res.body.message, "Invalid id.");
    });
});

describe("POST /api/messages", () => {
    const valid = { name: "Visitor", email: "visitor@example.com", message: "Hello!" };

    it("saves a valid message", async () => {
        db.handler = () => ({ rows: [{ id: 1 }] });

        const res = await request("POST", "/api/messages", { body: { ...valid, name: "  Visitor  " } });

        assert.equal(res.status, 201);
        assert.deepEqual(db.queries[0].params, ["Visitor", "visitor@example.com", null, "Hello!"]);
    });

    it("rejects missing or invalid fields", async () => {
        const res = await request("POST", "/api/messages", { body: { name: "", email: "bad", message: "" } });

        assert.equal(res.status, 400);
        assert.equal(res.body.message, "Invalid or missing field(s): name, email, message");
        assert.equal(db.queries.length, 0);
    });

    it("is rate limited after 5 messages", async () => {
        db.rateLimitHits = 6;

        const res = await request("POST", "/api/messages", { body: valid });

        assert.equal(res.status, 429);
        assert.equal(db.queries.length, 0);
    });
});

describe("POST /api/uploads", () => {
    const upload = (name, type, content = "x") => {
        const form = new FormData();
        form.append("file", new Blob([content], { type }), name);
        return request("POST", "/api/uploads", { form, token: adminToken });
    };

    it("rejects HTML, SVG and mismatched extensions", async () => {
        for (const [name, type] of [
            ["page.html", "text/html"],
            ["logo.svg", "image/svg+xml"],
            ["page.html", "image/png"],
            ["photo.png", "text/html; x=png"],
        ]) {
            const res = await upload(name, type);
            assert.equal(res.status, 400, `${name} (${type}) should be rejected`);
        }
    });

    it("rejects files over 4 MB", async () => {
        const res = await upload("big.png", "image/png", new Uint8Array(4 * 1024 * 1024 + 1));

        assert.equal(res.status, 400);
    });

    it("rejects a request without a file", async () => {
        const res = await request("POST", "/api/uploads", { form: new FormData(), token: adminToken });

        assert.equal(res.status, 400);
        assert.equal(res.body.message, "No file provided.");
    });
});

describe("unknown routes", () => {
    it("return 404 JSON", async () => {
        const res = await request("GET", "/api/nope");

        assert.equal(res.status, 404);
        assert.deepEqual(res.body, { message: "Not found" });
    });
});
