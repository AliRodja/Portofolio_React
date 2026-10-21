// The API sends DATE columns as ISO timestamps whose time part depends on the
// server's timezone (e.g. "2025-05-31T17:00:00Z" for 1 June in UTC+7). Rounding
// to the nearest UTC day recovers the real calendar date for any server/browser.
export function toDate(value) {
    if (!value) return null;

    const date = new Date(new Date(value).getTime() + 12 * 60 * 60 * 1000);

    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export function formatMonth(date) {
    if (!date) return "Present";

    return date.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
}

// Inclusive month count, LinkedIn style: Jun–Aug = 3 mos.
export function formatDuration(start, end) {
    if (!start) return "";

    const until = end || new Date();
    const months = (until.getUTCFullYear() - start.getUTCFullYear()) * 12
        + (until.getUTCMonth() - start.getUTCMonth()) + 1;

    const years = Math.floor(months / 12);
    const rest = months % 12;
    const parts = [];

    if (years) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
    if (rest) parts.push(`${rest} mo${rest > 1 ? "s" : ""}`);

    return parts.join(" ") || "1 mo";
}
