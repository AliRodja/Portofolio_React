import {
    FaBehance,
    FaDiscord,
    FaDribbble,
    FaFacebook,
    FaGithub,
    FaGitlab,
    FaGlobe,
    FaInstagram,
    FaLinkedin,
    FaMedium,
    FaTelegram,
    FaTiktok,
    FaWhatsapp,
    FaYoutube,
} from "react-icons/fa";
import { FaThreads, FaXTwitter } from "react-icons/fa6";

export const SOCIAL_PLATFORMS = [
    {
        key: "github",
        label: "GitHub",
        icon: FaGithub,
        brandColor: "#181717",
        brandBg: "rgba(24, 23, 23, 0.08)",
        darkBrandColor: "#FFFFFF",
        darkBrandBg: "rgba(255, 255, 255, 0.12)",
        placeholder: "https://github.com/username",
    },
    {
        key: "linkedin",
        label: "LinkedIn",
        icon: FaLinkedin,
        brandColor: "#0A66C2",
        brandBg: "rgba(10, 102, 194, 0.08)",
        darkBrandColor: "#38BDF8",
        darkBrandBg: "rgba(56, 189, 248, 0.14)",
        placeholder: "https://linkedin.com/in/username",
    },
    {
        key: "instagram",
        label: "Instagram",
        icon: FaInstagram,
        brandColor: "#E4405F",
        brandBg: "rgba(228, 64, 95, 0.08)",
        darkBrandColor: "#FB7185",
        darkBrandBg: "rgba(251, 113, 133, 0.14)",
        placeholder: "https://instagram.com/username",
    },
    {
        key: "x",
        label: "X / Twitter",
        icon: FaXTwitter,
        brandColor: "#111113",
        brandBg: "rgba(17, 17, 19, 0.08)",
        darkBrandColor: "#FFFFFF",
        darkBrandBg: "rgba(255, 255, 255, 0.12)",
        placeholder: "https://x.com/username",
    },
    {
        key: "youtube",
        label: "YouTube",
        icon: FaYoutube,
        brandColor: "#DC2626",
        brandBg: "rgba(220, 38, 38, 0.08)",
        darkBrandColor: "#F87171",
        darkBrandBg: "rgba(248, 113, 113, 0.14)",
        placeholder: "https://youtube.com/@username",
    },
    {
        key: "tiktok",
        label: "TikTok",
        icon: FaTiktok,
        brandColor: "#111113",
        brandBg: "rgba(17, 17, 19, 0.08)",
        darkBrandColor: "#FFFFFF",
        darkBrandBg: "rgba(255, 255, 255, 0.12)",
        placeholder: "https://tiktok.com/@username",
    },
    {
        key: "threads",
        label: "Threads",
        icon: FaThreads,
        brandColor: "#111113",
        brandBg: "rgba(17, 17, 19, 0.08)",
        darkBrandColor: "#FFFFFF",
        darkBrandBg: "rgba(255, 255, 255, 0.12)",
        placeholder: "https://threads.net/@username",
    },
    {
        key: "facebook",
        label: "Facebook",
        icon: FaFacebook,
        brandColor: "#1877F2",
        brandBg: "rgba(24, 119, 242, 0.08)",
        darkBrandColor: "#60A5FA",
        darkBrandBg: "rgba(96, 165, 250, 0.14)",
        placeholder: "https://facebook.com/username",
    },
    {
        key: "discord",
        label: "Discord",
        icon: FaDiscord,
        brandColor: "#5865F2",
        brandBg: "rgba(88, 101, 242, 0.08)",
        darkBrandColor: "#818CF8",
        darkBrandBg: "rgba(129, 140, 248, 0.14)",
        placeholder: "https://discord.gg/invite",
    },
    {
        key: "telegram",
        label: "Telegram",
        icon: FaTelegram,
        brandColor: "#0088CC",
        brandBg: "rgba(0, 136, 204, 0.08)",
        darkBrandColor: "#38BDF8",
        darkBrandBg: "rgba(56, 189, 248, 0.14)",
        placeholder: "https://t.me/username",
    },
    {
        key: "whatsapp",
        label: "WhatsApp",
        icon: FaWhatsapp,
        brandColor: "#16A34A",
        brandBg: "rgba(22, 163, 74, 0.08)",
        darkBrandColor: "#4ADE80",
        darkBrandBg: "rgba(74, 222, 128, 0.14)",
        placeholder: "https://wa.me/6281234567890",
    },
    {
        key: "dribbble",
        label: "Dribbble",
        icon: FaDribbble,
        brandColor: "#C12E6B",
        brandBg: "rgba(234, 76, 137, 0.09)",
        darkBrandColor: "#F472B6",
        darkBrandBg: "rgba(244, 114, 182, 0.14)",
        placeholder: "https://dribbble.com/username",
    },
    {
        key: "behance",
        label: "Behance",
        icon: FaBehance,
        brandColor: "#1769FF",
        brandBg: "rgba(23, 105, 255, 0.08)",
        darkBrandColor: "#60A5FA",
        darkBrandBg: "rgba(96, 165, 250, 0.14)",
        placeholder: "https://behance.net/username",
    },
    {
        key: "medium",
        label: "Medium",
        icon: FaMedium,
        brandColor: "#111113",
        brandBg: "rgba(17, 17, 19, 0.08)",
        darkBrandColor: "#FFFFFF",
        darkBrandBg: "rgba(255, 255, 255, 0.12)",
        placeholder: "https://medium.com/@username",
    },
    {
        key: "gitlab",
        label: "GitLab",
        icon: FaGitlab,
        brandColor: "#D94814",
        brandBg: "rgba(252, 109, 38, 0.09)",
        darkBrandColor: "#FB923C",
        darkBrandBg: "rgba(251, 146, 60, 0.14)",
        placeholder: "https://gitlab.com/username",
    },
    {
        key: "website",
        label: "Website",
        icon: FaGlobe,
        brandColor: "#1D4ED8",
        brandBg: "rgba(29, 78, 216, 0.08)",
        darkBrandColor: "#60A5FA",
        darkBrandBg: "rgba(96, 165, 250, 0.14)",
        placeholder: "https://yourwebsite.com",
    },
];

// Platforms already managed on the main Profile card.
export const EXTRA_SOCIAL_PLATFORMS = SOCIAL_PLATFORMS.filter(
    (p) => !["github", "linkedin", "instagram"].includes(p.key)
);

export function getSocialPlatform(keyOrName) {
    const normalized = (keyOrName || "").trim().toLowerCase();
    return (
        SOCIAL_PLATFORMS.find(
            (p) => p.key === normalized || p.label.toLowerCase() === normalized
        ) || SOCIAL_PLATFORMS[SOCIAL_PLATFORMS.length - 1]
    );
}

// Merge the 3 fixed profile social fields with any extra rows from /api/social-links.
export function buildSocialItems(profile = {}, socialLinks = []) {
    const base = [
        profile.github_url && { ...getSocialPlatform("github"), href: profile.github_url, key: "profile-github" },
        profile.linkedin_url && { ...getSocialPlatform("linkedin"), href: profile.linkedin_url, key: "profile-linkedin" },
        profile.instagram_url && { ...getSocialPlatform("instagram"), href: profile.instagram_url, key: "profile-instagram" },
    ].filter(Boolean);

    const extras = (Array.isArray(socialLinks) ? socialLinks : [])
        .filter((link) => link?.url)
        .map((link) => {
            const meta = getSocialPlatform(link.icon_name || link.platform);
            return {
                ...meta,
                label: link.platform || meta.label,
                href: link.url,
                key: `extra-${link.id}`,
            };
        });

    return [...base, ...extras];
}
