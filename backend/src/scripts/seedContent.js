require("dotenv").config();

const pool = require("../config/db");

// Isi konten portfolio dari CV.
//
// Insert-only & idempotent: baris yang sudah ada (dicocokkan lewat nama/judul)
// dilewati, tidak pernah di-update atau dihapus. Aman dijalankan berulang.
//
//   npm run seed:content              -> tulis ke database
//   npm run seed:content -- --dry-run -> hanya tampilkan apa yang akan ditambah

const DRY_RUN = process.argv.includes("--dry-run");

const skills = [
    // Frontend
    { name: "CSS3", category: "Frontend", icon_name: "FaCss3Alt", order_index: 1 },
    { name: "Bootstrap", category: "Frontend", icon_name: "FaBootstrap", order_index: 1 },
    // Backend
    { name: "Node.js", category: "Backend", icon_name: "FaNodeJs", order_index: 2 },
    { name: "Express.js", category: "Backend", icon_name: "SiExpress", order_index: 2 },
    { name: "Laravel", category: "Backend", icon_name: "FaLaravel", order_index: 2 },
    { name: "PHP", category: "Backend", icon_name: "FaPhp", order_index: 2 },
    // Database
    { name: "PostgreSQL", category: "Database", icon_name: "SiPostgresql", order_index: 3 },
    { name: "MySQL", category: "Database", icon_name: "SiMysql", order_index: 3 },
    // Programming Language
    { name: "Java", category: "Programming Language", icon_name: "FaJava", order_index: 4 },
    { name: "C#", category: "Programming Language", icon_name: null, order_index: 4 },
    // Design
    { name: "Figma", category: "Design", icon_name: "FaFigma", order_index: 5 },
    { name: "Canva", category: "Design", icon_name: null, order_index: 5 },
    // Tools
    { name: "Git", category: "Tools & Version Control", icon_name: "FaGitAlt", order_index: 6 },
    { name: "Unity", category: "Tools & Version Control", icon_name: null, order_index: 6 },
    { name: "WordPress", category: "Tools & Version Control", icon_name: null, order_index: 6 },
    { name: "Midtrans", category: "Tools & Version Control", icon_name: null, order_index: 6 },
];

const projects = [
    {
        title: "Inventory Management Information System",
        category: "Full-Stack · Undergraduate Thesis",
        featured: true,
        tech_stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Node.js", "Express.js", "PostgreSQL"],
        description:
            "Undergraduate thesis (2025–2026) — role: Full-Stack Developer.\n\n" +
            "A web-based asset management system for the Informatics Engineering Study Program at UNPAS, " +
            "replacing manual processes with an integrated digital system. Features room-based asset grouping, " +
            "automated item coding, a borrowing procedure with PDF e-letters, photo-based return verification, " +
            "barcode-based asset tracking, and automated periodic reporting.",
    },
    {
        title: "SkillConnect",
        category: "Web App · Coursework",
        featured: true,
        tech_stack: ["React", "Laravel", "Midtrans"],
        description:
            "Software Engineering Project (PPL) coursework (2025) — role: Data Analyst.\n\n" +
            "A platform connecting users with service providers (e.g. report writing services). " +
            "In a class split into 8 module-based teams, my team owned the payment gateway module using Midtrans.",
    },
    {
        title: "BookRN",
        category: "Web App · Coursework",
        featured: true,
        tech_stack: ["Laravel", "PHP Blade", "Tailwind CSS"],
        description:
            "Web Practicum coursework (2024) — role: Backend Developer.\n\n" +
            "A concert ticket booking website built as a team project, covering the booking system, " +
            "API integration, and payment gateway. Primarily responsible for the backend, " +
            "with additional contributions to the frontend.",
    },
    {
        title: "Always Healthy",
        category: "Web App · Coursework",
        featured: false,
        tech_stack: ["PHP"],
        description:
            "Web Programming coursework (2023) — role: Full-Stack Developer.\n\n" +
            "A dynamic medicine e-commerce website with login, registration, and full CRUD functionality, " +
            "built with native PHP.",
    },
    {
        title: "Dashboard Management System",
        category: "UI/UX Design · Coursework",
        featured: false,
        tech_stack: ["Figma", "Java"],
        description:
            "Programming Practicum II coursework (2025) — role: UI/UX Designer.\n\n" +
            "Designed the dashboard management interface for a collaborative multi-team project in Figma, " +
            "before it was implemented as a Java-based application.",
    },
    {
        title: "Shooter Game",
        category: "Game · Coursework",
        featured: false,
        tech_stack: ["Unity", "C#"],
        description:
            "Game Practicum coursework (2025) — role: Team Leader & Developer.\n\n" +
            "Led the team and developed the core gameplay mechanics of a shooter-themed game, " +
            "while other members handled visual assets and character art.",
    },
    {
        title: "E-Waste Mobile Application",
        category: "Mobile · UI/UX",
        featured: false,
        tech_stack: ["Figma", "ClickUp"],
        description:
            "Team project (Aug 2024 – Jan 2025) — role: Team Leader.\n\n" +
            "• Led and coordinated a cross-functional team in designing and developing the core flow of the " +
            "E-Waste app, including authentication (login/register) and profile management.\n" +
            "• Handled task allocation, schedule oversight, and making sure the team hit its targets.",
    },
    {
        title: "AREI Company Profile",
        category: "Static Website · Coursework",
        featured: false,
        tech_stack: ["HTML", "CSS", "JavaScript", "Bootstrap"],
        description: "Internet Web Technology coursework (2022). A static company profile website.",
    },
    {
        title: "Portfolio Website (2022)",
        category: "Static Website · Coursework",
        featured: false,
        tech_stack: ["HTML", "CSS", "JavaScript"],
        description: "Internet Web Technology coursework (2022). My first static personal portfolio website.",
    },
];

const experiences = [
    {
        position: "Web Developer Intern",
        organization: "PT Afarco Solusi Teknologi",
        start_date: "2025-06-01",
        end_date: "2025-08-31",
        description:
            "• Developed and maintained 2 client websites on WordPress, including layout, content, " +
            "and functionality customization based on client needs.\n" +
            "• Coordinated with the team to ensure websites met quality standards and deadlines.",
    },
    {
        position: "General Chairman",
        organization: "HMTIF-UNPAS",
        start_date: "2025-06-01",
        end_date: "2026-06-30",
        description:
            "• Held overall leadership and set general organizational policy.\n" +
            "• Served as the highest decision-maker after receiving input and recommendations from the " +
            "board on issues within the study program.\n" +
            "• Held full accountability for all HMTIF-UNPAS programs and activities during the term.",
    },
    {
        position: "Coordinator, Social & Political Division",
        organization: "HMTIF-UNPAS",
        start_date: "2024-09-01",
        end_date: "2025-06-30",
        description:
            "• Organized social and community-oriented activities.\n" +
            "• Gathered input and aspirations from Informatics Engineering students at UNPAS.\n" +
            "• Advocated for and supported students on academic matters.",
    },
];

const education = [
    {
        institution: "Universitas Pasundan",
        degree: "Bachelor of Engineering (S.T.) — Informatics Engineering",
        start_year: 2022,
        end_year: 2026,
        description:
            "Undergraduate thesis: a web-based Inventory Management Information System for the " +
            "Informatics Engineering Study Program (Next.js, Express.js, PostgreSQL).",
    },
];

async function insertMissing(client, { label, table, rows, existsSql, existsParams, insertSql, insertParams }) {
    let added = 0;

    for (const row of rows) {
        const exists = await client.query(existsSql, existsParams(row));

        if (exists.rows.length > 0) {
            console.log(`  skip  ${label}: ${row.name || row.title || row.position || row.institution}`);
            continue;
        }

        if (!DRY_RUN) {
            await client.query(insertSql, insertParams(row));
        }

        added++;
        console.log(`  add   ${label}: ${row.name || row.title || row.position || row.institution}`);
    }

    console.log(`  → ${table}: ${added} ditambahkan\n`);
}

async function run() {
    const client = await pool.connect();

    try {
        console.log(DRY_RUN ? "DRY RUN — tidak ada yang ditulis\n" : "Menulis ke database...\n");

        await client.query("BEGIN");

        await insertMissing(client, {
            label: "skill",
            table: "skills",
            rows: skills,
            existsSql: "SELECT 1 FROM skills WHERE lower(name) = lower($1)",
            existsParams: (s) => [s.name],
            insertSql: "INSERT INTO skills (name, category, icon_name, order_index) VALUES ($1, $2, $3, $4)",
            insertParams: (s) => [s.name, s.category, s.icon_name, s.order_index],
        });

        await insertMissing(client, {
            label: "project",
            table: "projects",
            rows: projects,
            existsSql: "SELECT 1 FROM projects WHERE lower(title) = lower($1)",
            existsParams: (p) => [p.title],
            insertSql: `
                INSERT INTO projects (title, description, tech_stack, category, featured)
                VALUES ($1, $2, $3, $4, $5)
            `,
            insertParams: (p) => [p.title, p.description, p.tech_stack, p.category, p.featured],
        });

        await insertMissing(client, {
            label: "experience",
            table: "experiences",
            rows: experiences,
            existsSql: "SELECT 1 FROM experiences WHERE lower(position) = lower($1) AND lower(organization) = lower($2)",
            existsParams: (e) => [e.position, e.organization],
            insertSql: `
                INSERT INTO experiences (position, organization, start_date, end_date, description)
                VALUES ($1, $2, $3, $4, $5)
            `,
            insertParams: (e) => [e.position, e.organization, e.start_date, e.end_date, e.description],
        });

        await insertMissing(client, {
            label: "education",
            table: "education",
            rows: education,
            existsSql: "SELECT 1 FROM education WHERE lower(institution) = lower($1)",
            existsParams: (e) => [e.institution],
            insertSql: `
                INSERT INTO education (institution, degree, start_year, end_year, description)
                VALUES ($1, $2, $3, $4, $5)
            `,
            insertParams: (e) => [e.institution, e.degree, e.start_year, e.end_year, e.description],
        });

        await client.query(DRY_RUN ? "ROLLBACK" : "COMMIT");
        console.log(DRY_RUN ? "Selesai (dry run)." : "Selesai.");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
        await pool.end();
    }
}

run().catch((err) => {
    console.error(err.message);
    process.exitCode = 1;
});
