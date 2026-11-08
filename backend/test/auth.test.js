const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { db, request, adminToken, viewerToken } = require("./helpers");

const PASSWORD = "correct horse";
const user = {
    id: 7,
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    password_hash: bcrypt.hashSync(PASSWORD, 4),
};

describe("POST /api/auth/login", () => {
    it("rejects a missing or malformed body with 400", async () => {
        const empty = await request("POST", "/api/auth/login", { body: {} });
        assert.equal(empty.status, 400);
        assert.deepEqual(empty.body.errors, { email: "is required", password: "is required" });

        const badTypes = await request("POST", "/api/auth/login", { body: { email: "nope", password: { x: 1 } } });
        assert.equal(badTypes.status, 400);
        assert.deepEqual(Object.keys(badTypes.body.errors), ["email", "password"]);

        assert.equal(db.queries.length, 0, "invalid input must not reach the database");
    });

    it("returns 401 for an unknown email, still running bcrypt", async () => {
        const compare = bcrypt.compare;
        let compared = false;
        bcrypt.compare = async (...args) => {
            compared = true;
            return compare(...args);
        };

        try {
            const res = await request("POST", "/api/auth/login", {
                body: { email: "nobody@example.com", password: PASSWORD },
            });

            assert.equal(res.status, 401);
            assert.equal(res.body.message, "Invalid credentials");
            assert.equal(compared, true);
        } finally {
            bcrypt.compare = compare;
        }
    });

    it("returns 401 for a wrong password", async () => {
        db.handler = () => ({ rows: [user] });

        const res = await request("POST", "/api/auth/login", { body: { email: user.email, password: "wrong" } });

        assert.equal(res.status, 401);
        assert.equal(res.body.message, "Invalid credentials");
    });

    it("does not trim the password", async () => {
        db.handler = () => ({ rows: [user] });

        const res = await request("POST", "/api/auth/login", { body: { email: user.email, password: ` ${PASSWORD} ` } });

        assert.equal(res.status, 401);
    });

    it("returns a token carrying the user's role on success", async () => {
        db.handler = () => ({ rows: [user] });

        const res = await request("POST", "/api/auth/login", { body: { email: user.email, password: PASSWORD } });

        assert.equal(res.status, 200);
        assert.deepEqual(res.body.user, { id: 7, username: "admin", email: user.email, role: "admin" });
        assert.equal(res.body.user.password_hash, undefined);

        const payload = jwt.verify(res.body.token, process.env.JWT_SECRET);
        assert.equal(payload.role, "admin");
        assert.equal(payload.id, 7);
    });
});

describe("POST /api/auth/register", () => {
    const valid = { username: "second", email: "second@example.com", password: "long enough" };

    it("requires an admin token", async () => {
        assert.equal((await request("POST", "/api/auth/register", { body: valid })).status, 401);
        assert.equal((await request("POST", "/api/auth/register", { body: valid, token: viewerToken })).status, 403);
    });

    it("enforces password length", async () => {
        const short = await request("POST", "/api/auth/register", {
            body: { ...valid, password: "1234567" },
            token: adminToken,
        });
        assert.equal(short.status, 400);
        assert.equal(short.body.errors.password, "must be at least 8 characters");

        const long = await request("POST", "/api/auth/register", {
            body: { ...valid, password: "x".repeat(73) },
            token: adminToken,
        });
        assert.equal(long.status, 400);
        assert.equal(long.body.errors.password, "must be at most 72 characters");
    });

    it("rejects a taken email or username", async () => {
        db.handler = (sql) => (sql.includes("SELECT id FROM users") ? { rows: [{ id: 1 }] } : { rows: [] });

        const res = await request("POST", "/api/auth/register", { body: valid, token: adminToken });

        assert.equal(res.status, 400);
        assert.equal(res.body.message, "Email or username already exists");
        assert.deepEqual(db.queries[0].params, [valid.email, valid.username]);
    });

    it("stores a bcrypt hash, never the password", async () => {
        db.handler = (sql, params) =>
            sql.includes("INSERT INTO users")
                ? { rows: [{ id: 2, username: params[0], email: params[1], role: "admin" }] }
                : { rows: [] };

        const res = await request("POST", "/api/auth/register", { body: valid, token: adminToken });

        assert.equal(res.status, 201);
        assert.deepEqual(res.body, { id: 2, username: "second", email: "second@example.com", role: "admin" });

        const [, , hash] = db.queries.find((q) => q.sql.includes("INSERT INTO users")).params;
        assert.notEqual(hash, valid.password);
        assert.equal(await bcrypt.compare(valid.password, hash), true);
    });
});
