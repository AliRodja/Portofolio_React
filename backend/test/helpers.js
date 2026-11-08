// Shared setup for the API tests.
//
// The tests never touch a real database: pool.query is replaced with a stub,
// and DATABASE_URL points at a port nothing listens on, so a query that slips
// past the stub fails instead of reaching a real database.
process.env.JWT_SECRET = "test-secret";
process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
process.env.SUPABASE_URL = "https://test.supabase.co";
process.env.SUPABASE_BUCKET = "uploads";

const { after, before, beforeEach } = require("node:test");
const jwt = require("jsonwebtoken");

const pool = require("../src/config/db");
const app = require("../src/app");

const db = {
    // Every query the app ran in the current test (rate-limit queries excluded).
    queries: [],
    // (sql, params) => result. Tests override it to answer the queries they expect.
    handler: () => ({ rows: [] }),
    // What the rate-limit store reports as the hit count for each request.
    rateLimitHits: 1,
};

pool.query = async (sql, params) => {
    if (sql.includes("rate_limits")) {
        return { rows: [{ hits: db.rateLimitHits, reset_at: new Date(Date.now() + 60_000) }] };
    }

    db.queries.push({ sql, params });
    return db.handler(sql, params);
};

let server;
let baseUrl;

before(async () => {
    await new Promise((resolve) => {
        server = app.listen(0, "127.0.0.1", resolve);
    });
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise((resolve) => server.close(resolve)));

beforeEach(() => {
    db.queries = [];
    db.handler = () => ({ rows: [] });
    db.rateLimitHits = 1;
});

const tokenFor = (role) => jwt.sign({ id: 1, username: "tester", role }, process.env.JWT_SECRET);

const adminToken = tokenFor("admin");
const viewerToken = tokenFor("viewer");

// request("POST", "/api/projects", { body, token, form }) -> { status, body }
async function request(method, path, { body, token, form } = {}) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers["Content-Type"] = "application/json";

    const res = await fetch(baseUrl + path, {
        method,
        headers,
        body: form || (body !== undefined ? JSON.stringify(body) : undefined),
    });

    const text = await res.text();

    return { status: res.status, body: text ? JSON.parse(text) : null };
}

// Silences console.error for the duration of fn — controllers log the errors
// that some tests trigger on purpose.
async function quietly(fn) {
    const original = console.error;
    console.error = () => {};
    try {
        return await fn();
    } finally {
        console.error = original;
    }
}

module.exports = { db, request, adminToken, viewerToken, quietly };
