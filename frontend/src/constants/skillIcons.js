import {
    FaReact,
    FaNodeJs,
    FaLaravel,
    FaPhp,
    FaGitAlt,
    FaGithub,
    FaFigma,
    FaBootstrap,
    FaVuejs,
    FaAngular,
    FaPython,
    FaJava,
    FaHtml5,
    FaCss3Alt,
    FaDocker,
    FaAws,
    FaSass,
    FaLinux,
    FaNpm,
} from "react-icons/fa";

import {
    SiNextdotjs,
    SiJavascript,
    SiTypescript,
    SiTailwindcss,
    SiPostgresql,
    SiMysql,
    SiMongodb,
    SiExpress,
    SiRedux,
    SiGraphql,
    SiFirebase,
    SiVite,
    SiJest,
    SiWebpack,
    SiPostman,
    SiFlutter,
    SiKotlin,
    SiSwift,
    SiDjango,
    SiSpring,
    SiUnity,
    SiWordpress,
    SiCanva,
} from "react-icons/si";
import { TbBrandCSharp } from "react-icons/tb";

import { VscCode } from "react-icons/vsc";

export const SKILL_ICONS = [
    { key: "FaReact", label: "React", icon: FaReact },
    { key: "SiNextdotjs", label: "Next.js", icon: SiNextdotjs },
    { key: "FaVuejs", label: "Vue.js", icon: FaVuejs },
    { key: "FaAngular", label: "Angular", icon: FaAngular },
    { key: "SiJavascript", label: "JavaScript", icon: SiJavascript },
    { key: "SiTypescript", label: "TypeScript", icon: SiTypescript },
    { key: "SiTailwindcss", label: "Tailwind CSS", icon: SiTailwindcss },
    { key: "FaBootstrap", label: "Bootstrap", icon: FaBootstrap },
    { key: "FaSass", label: "Sass", icon: FaSass },
    { key: "FaHtml5", label: "HTML5", icon: FaHtml5 },
    { key: "FaCss3Alt", label: "CSS3", icon: FaCss3Alt },
    { key: "SiRedux", label: "Redux", icon: SiRedux },
    { key: "SiVite", label: "Vite", icon: SiVite },
    { key: "FaNodeJs", label: "Node.js", icon: FaNodeJs },
    { key: "SiExpress", label: "Express.js", icon: SiExpress },
    { key: "FaLaravel", label: "Laravel", icon: FaLaravel },
    { key: "FaPhp", label: "PHP", icon: FaPhp },
    { key: "SiDjango", label: "Django", icon: SiDjango },
    { key: "SiSpring", label: "Spring", icon: SiSpring },
    { key: "FaPython", label: "Python", icon: FaPython },
    { key: "FaJava", label: "Java", icon: FaJava },
    { key: "TbBrandCSharp", label: "C#", icon: TbBrandCSharp },
    { key: "SiGraphql", label: "GraphQL", icon: SiGraphql },
    { key: "SiPostgresql", label: "PostgreSQL", icon: SiPostgresql },
    { key: "SiMysql", label: "MySQL", icon: SiMysql },
    { key: "SiMongodb", label: "MongoDB", icon: SiMongodb },
    { key: "SiFirebase", label: "Firebase", icon: SiFirebase },
    { key: "FaAws", label: "AWS", icon: FaAws },
    { key: "FaDocker", label: "Docker", icon: FaDocker },
    { key: "FaLinux", label: "Linux", icon: FaLinux },
    { key: "FaGitAlt", label: "Git", icon: FaGitAlt },
    { key: "FaGithub", label: "GitHub", icon: FaGithub },
    { key: "SiPostman", label: "Postman", icon: SiPostman },
    { key: "SiJest", label: "Jest", icon: SiJest },
    { key: "SiWebpack", label: "Webpack", icon: SiWebpack },
    { key: "FaNpm", label: "npm", icon: FaNpm },
    { key: "FaFigma", label: "Figma", icon: FaFigma },
    { key: "SiCanva", label: "Canva", icon: SiCanva },
    { key: "SiUnity", label: "Unity", icon: SiUnity },
    { key: "SiWordpress", label: "WordPress", icon: SiWordpress },
    { key: "VscCode", label: "VS Code", icon: VscCode },
    { key: "SiFlutter", label: "Flutter", icon: SiFlutter },
    { key: "SiKotlin", label: "Kotlin", icon: SiKotlin },
    { key: "SiSwift", label: "Swift", icon: SiSwift },
];

export function getSkillIcon(key) {
    return SKILL_ICONS.find((item) => item.key === key)?.icon || null;
}

// Icon for a skill row: its saved icon_name first, otherwise the icon whose
// label matches the skill name (e.g. "WordPress" with no icon_name saved).
// Returns null when there is no real logo, rather than a generic glyph.
export function findSkillIcon(skill) {
    const name = (skill.name || "").trim().toLowerCase();

    return getSkillIcon(skill.icon_name)
        || SKILL_ICONS.find((item) => item.label.toLowerCase() === name)?.icon
        || null;
}
