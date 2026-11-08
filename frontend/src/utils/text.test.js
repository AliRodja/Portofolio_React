import { describe, expect, it } from "vitest";
import { parseRichText } from "./text";

describe("parseRichText", () => {
    it("returns nothing for empty input", () => {
        expect(parseRichText("")).toEqual([]);
        expect(parseRichText(null)).toEqual([]);
        expect(parseRichText(undefined)).toEqual([]);
    });

    it("splits paragraphs on blank lines and joins wrapped lines", () => {
        expect(parseRichText("First line\ncontinues here.\n\n  \nSecond paragraph.")).toEqual([
            { type: "paragraph", text: "First line continues here." },
            { type: "paragraph", text: "Second paragraph." },
        ]);
    });

    it("turns → lines into a list, with the other lines as its heading", () => {
        expect(parseRichText("Responsibilities:\n→ Build the API\n→Write tests")).toEqual([
            { type: "list", heading: "Responsibilities:", items: ["Build the API", "Write tests"] },
        ]);
    });

    it("gives a list without text lines a null heading", () => {
        expect(parseRichText("→ One\n→ Two")).toEqual([{ type: "list", heading: null, items: ["One", "Two"] }]);
    });

    it("handles paragraphs and lists together", () => {
        const blocks = parseRichText("Intro.\n\nStack:\n→ React\n→ Express\n\nOutro.");

        expect(blocks.map((block) => block.type)).toEqual(["paragraph", "list", "paragraph"]);
    });
});
