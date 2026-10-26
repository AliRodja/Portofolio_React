// Validation rules per resource, used with validateBody() in the routes.
// `max` lengths mirror the VARCHAR sizes in migrations/001_init.sql.

const TEXT_MAX = 5000;

const project = {
    title: { type: "string", required: true, max: 255 },
    description: { type: "string", required: true, max: TEXT_MAX },
    image_url: { type: "url", max: 500 },
    tech_stack: { type: "stringArray", required: true, maxItems: 30, maxItemLength: 50 },
    demo_link: { type: "url", max: 500 },
    repo_link: { type: "url", max: 500 },
    category: { type: "string", required: true, max: 100 },
    featured: { type: "boolean", default: false },
};

const skill = {
    name: { type: "string", required: true, max: 100 },
    category: { type: "string", required: true, max: 100 },
    icon_name: { type: "string", max: 100 },
    order_index: { type: "integer", min: 0, max: 10000, default: 0 },
};

const experience = {
    position: { type: "string", required: true, max: 255 },
    organization: { type: "string", required: true, max: 255 },
    start_date: { type: "date", required: true },
    end_date: { type: "date" },
    description: { type: "string", max: TEXT_MAX },
    image_url: { type: "url", max: 500 },
};

// "YYYY-MM-DD" strings compare correctly as plain strings.
const experienceRefine = ({ start_date, end_date }) =>
    end_date && end_date < start_date
        ? { end_date: "cannot be earlier than start_date" }
        : null;

const education = {
    institution: { type: "string", required: true, max: 255 },
    degree: { type: "string", required: true, max: 255 },
    start_year: { type: "integer", required: true, min: 1950, max: 2100 },
    end_year: { type: "integer", min: 1950, max: 2100 },
    description: { type: "string", max: TEXT_MAX },
};

const educationRefine = ({ start_year, end_year }) =>
    end_year !== null && end_year < start_year
        ? { end_year: "cannot be earlier than start_year" }
        : null;

const certificate = {
    title: { type: "string", required: true, max: 255 },
    issuer: { type: "string", required: true, max: 255 },
    issue_date: { type: "date", required: true },
    image_url: { type: "url", required: true, max: 500 },
    credential_url: { type: "url", max: 500 },
};

const profile = {
    full_name: { type: "string", required: true, max: 255 },
    headline: { type: "string", required: true, max: 255 },
    about: { type: "string", required: true, max: TEXT_MAX },
    short_bio: { type: "string", required: true, max: TEXT_MAX },
    email: { type: "email", required: true, max: 255 },
    phone: { type: "string", max: 50 },
    location: { type: "string", max: 255 },
    github_url: { type: "url", max: 255 },
    linkedin_url: { type: "url", max: 255 },
    instagram_url: { type: "url", max: 255 },
    profile_image: { type: "url", max: 500 },
    resume_url: { type: "url", max: 500 },
};

// Login only checks shape, not strength: an existing password may predate
// the register rules below.
const login = {
    email: { type: "email", required: true, max: 255 },
    password: { type: "string", required: true, max: 200, trim: false },
};

// bcrypt ignores everything past 72 bytes, so cap there instead of letting a
// longer password silently match on its first 72 bytes only.
const register = {
    username: { type: "string", required: true, max: 100 },
    email: { type: "email", required: true, max: 255 },
    password: { type: "string", required: true, min: 8, max: 72, trim: false },
};

module.exports = {
    login,
    register,
    project,
    skill,
    experience,
    experienceRefine,
    education,
    educationRefine,
    certificate,
    profile,
};
