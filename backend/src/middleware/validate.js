/**
 * Tiny request validation, no extra dependency.
 *
 * validateBody(schema, refine?) checks req.body against `schema`, then
 * REPLACES req.body with the cleaned values (strings trimmed, numbers parsed,
 * empty optional fields turned into null, unknown fields dropped), so the
 * controllers only ever see well-formed data.
 *
 * On failure it answers 400:
 *   { message: "title is required; demo_link must be a valid URL", errors: { title: "...", ... } }
 */

const isBlank = (value) =>
    value === undefined || value === null || (typeof value === "string" && value.trim() === "");

const isValidDate = (value) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;

    const date = new Date(`${value}T00:00:00Z`);

    // Rejects things like 2025-02-31, which Date would silently roll over.
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const isValidUrl = (value) => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

// Each checker returns [cleanValue] on success or [undefined, "error"] on failure.
const checkers = {
    string(value, rule) {
        if (typeof value !== "string" && typeof value !== "number") return [undefined, "must be text"];

        // Passwords set trim: false — leading/trailing spaces are part of them.
        const clean = rule.trim === false ? String(value) : String(value).trim();

        if (rule.min && clean.length < rule.min) return [undefined, `must be at least ${rule.min} characters`];
        if (rule.max && clean.length > rule.max) return [undefined, `must be at most ${rule.max} characters`];

        return [clean];
    },

    email(value, rule) {
        const [clean, error] = checkers.string(value, { max: rule.max || 255 });

        if (error) return [undefined, error];
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) return [undefined, "must be a valid email"];

        return [clean];
    },

    url(value, rule) {
        const [clean, error] = checkers.string(value, { max: rule.max || 500 });

        if (error) return [undefined, error];
        if (!isValidUrl(clean)) return [undefined, "must be a valid http(s) URL"];

        return [clean];
    },

    integer(value, rule) {
        const number = typeof value === "string" ? Number(value.trim()) : value;

        if (!Number.isInteger(number)) return [undefined, "must be a whole number"];
        if (rule.min !== undefined && number < rule.min) return [undefined, `must be at least ${rule.min}`];
        if (rule.max !== undefined && number > rule.max) return [undefined, `must be at most ${rule.max}`];

        return [number];
    },

    date(value) {
        if (typeof value !== "string" || !isValidDate(value.trim())) {
            return [undefined, "must be a valid date (YYYY-MM-DD)"];
        }

        return [value.trim()];
    },

    boolean(value) {
        if (value === true || value === "true") return [true];
        if (value === false || value === "false") return [false];

        return [undefined, "must be true or false"];
    },

    stringArray(value, rule) {
        if (!Array.isArray(value)) return [undefined, "must be a list"];

        const items = value
            .map((item) => (typeof item === "string" ? item.trim() : item))
            .filter((item) => item !== "");

        if (items.some((item) => typeof item !== "string")) return [undefined, "must be a list of text"];
        if (rule.maxItems && items.length > rule.maxItems) return [undefined, `must have at most ${rule.maxItems} items`];
        if (rule.maxItemLength && items.some((item) => item.length > rule.maxItemLength)) {
            return [undefined, `items must be at most ${rule.maxItemLength} characters`];
        }

        return [items];
    },
};

function validateBody(schema, refine) {
    return (req, res, next) => {
        const body = req.body && typeof req.body === "object" ? req.body : {};
        const clean = {};
        const errors = {};

        for (const [field, rule] of Object.entries(schema)) {
            const raw = body[field];
            const blank = isBlank(raw) || (rule.type === "stringArray" && Array.isArray(raw) && raw.every(isBlank));

            if (blank) {
                if (rule.required) {
                    errors[field] = "is required";
                } else {
                    clean[field] = rule.default !== undefined ? rule.default : null;
                }
                continue;
            }

            const [value, error] = checkers[rule.type](raw, rule);

            if (error) {
                errors[field] = error;
            } else {
                clean[field] = value;
            }
        }

        // Cross-field rules (e.g. end date after start date) only run once
        // every individual field is valid.
        if (Object.keys(errors).length === 0 && refine) {
            Object.assign(errors, refine(clean) || {});
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).json({
                message: Object.entries(errors).map(([field, msg]) => `${field} ${msg}`).join("; "),
                errors,
            });
        }

        req.body = clean;
        next();
    };
}

// Rejects /:id values that aren't a positive 32-bit integer, so a request
// like DELETE /api/projects/abc gets a clean 400 instead of a Postgres error.
function validateId(req, res, next) {
    const { id } = req.params;

    if (!/^\d+$/.test(id) || Number(id) < 1 || Number(id) > 2147483647) {
        return res.status(400).json({ message: "Invalid id." });
    }

    next();
}

module.exports = { validateBody, validateId };
