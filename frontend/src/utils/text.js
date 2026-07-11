export function parseRichText(text) {
    if (!text) return [];

    const blocks = text
        .split(/\n\s*\n/)
        .map((block) => block.trim())
        .filter(Boolean);

    return blocks.map((block) => {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const bulletLines = lines.filter((line) => line.startsWith("→"));
        const textLines = lines.filter((line) => !line.startsWith("→"));

        if (bulletLines.length > 0) {
            return {
                type: "list",
                heading: textLines.join(" ") || null,
                items: bulletLines.map((line) => line.replace(/^→\s*/, "")),
            };
        }

        return { type: "paragraph", text: textLines.join(" ") };
    });
}
