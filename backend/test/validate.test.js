const { describe, it } = require("node:test");
const assert = require("node:assert/strict");

const { validateBody, validateId } = require("../src/middleware/validate");

// Runs a middleware against a fake req/res and reports what it did.
function run(middleware, req) {
    const result = { nextCalled: false, status: null, body: null };
    const res = {
        status(code) {
            result.status = code;
            return this;
        },
        json(body) {
            result.body = body;
            return this;
        },
    };

    middleware(req, res, () => {
        result.nextCalled = true;
    });

    return { ...result, req };
}

describe("validateBody", () => {
    const schema = {
        title: { type: "string", required: true, max: 10 },
        note: { type: "string" },
        count: { type: "integer", min: 0, max: 5, default: 0 },
        featured: { type: "boolean", default: false },
        link: { type: "url" },
        email: { type: "email" },
        day: { type: "date" },
        tags: { type: "stringArray", maxItems: 2, maxItemLength: 5 },
        secret: { type: "string", min: 3, trim: false },
    };

    it("cleans valid input and drops unknown fields", () => {
        const { nextCalled, req } = run(validateBody(schema), {
            body: {
                title: "  Hello ",
                count: "3",
                featured: "true",
                tags: [" a ", "", "b"],
                secret: " pw ",
                extra: "dropped",
            },
        });

        assert.equal(nextCalled, true);
        assert.deepEqual(req.body, {
            title: "Hello",
            note: null,
            count: 3,
            featured: true,
            link: null,
            email: null,
            day: null,
            tags: ["a", "b"],
            secret: " pw ",
        });
    });

    it("applies defaults to blank optional fields", () => {
        const { req } = run(validateBody(schema), { body: { title: "x", count: "", featured: null } });

        assert.equal(req.body.count, 0);
        assert.equal(req.body.featured, false);
    });

    it("rejects with a 400 listing every invalid field", () => {
        const { nextCalled, status, body } = run(validateBody(schema), {
            body: {
                title: "   ",
                count: 9,
                featured: "yes",
                link: "javascript:alert(1)",
                email: "not-an-email",
                day: "2025-02-31",
                tags: ["a", "b", "c"],
                secret: "ab",
            },
        });

        assert.equal(nextCalled, false);
        assert.equal(status, 400);
        assert.deepEqual(body.errors, {
            title: "is required",
            count: "must be at most 5",
            featured: "must be true or false",
            link: "must be a valid http(s) URL",
            email: "must be a valid email",
            day: "must be a valid date (YYYY-MM-DD)",
            tags: "must have at most 2 items",
            secret: "must be at least 3 characters",
        });
        assert.match(body.message, /^title is required; /);
    });

    it("rejects text over the max length and non-text values", () => {
        const { body } = run(validateBody(schema), { body: { title: "x".repeat(11), note: { a: 1 } } });

        assert.equal(body.errors.title, "must be at most 10 characters");
        assert.equal(body.errors.note, "must be text");
    });

    it("runs the refine step only once every field is valid", () => {
        const range = {
            start: { type: "integer", required: true },
            end: { type: "integer" },
        };
        const refine = ({ start, end }) => (end !== null && end < start ? { end: "cannot be earlier than start" } : null);

        const backwards = run(validateBody(range, refine), { body: { start: 2020, end: 2019 } });
        assert.equal(backwards.status, 400);
        assert.deepEqual(backwards.body.errors, { end: "cannot be earlier than start" });

        const missing = run(validateBody(range, refine), { body: { end: 2019 } });
        assert.deepEqual(missing.body.errors, { start: "is required" });

        const ok = run(validateBody(range, refine), { body: { start: 2019, end: 2020 } });
        assert.equal(ok.nextCalled, true);
    });

    it("treats a missing body as empty", () => {
        const { status, body } = run(validateBody(schema), {});

        assert.equal(status, 400);
        assert.deepEqual(body.errors, { title: "is required" });
    });
});

describe("validateId", () => {
    for (const id of ["1", "42", "2147483647"]) {
        it(`accepts ${id}`, () => {
            assert.equal(run(validateId, { params: { id } }).nextCalled, true);
        });
    }

    for (const id of ["0", "-1", "abc", "1.5", "2147483648", "1;DROP TABLE"]) {
        it(`rejects ${JSON.stringify(id)}`, () => {
            const { nextCalled, status } = run(validateId, { params: { id } });

            assert.equal(nextCalled, false);
            assert.equal(status, 400);
        });
    }
});
