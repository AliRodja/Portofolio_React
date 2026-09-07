// Vercel serverless entry point.
// server.js is only used for local `npm run dev`; on Vercel the platform
// imports this file and calls the exported Express app as the handler.
require("dotenv").config();

module.exports = require("../src/app");
