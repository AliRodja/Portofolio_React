import { describe, expect, it } from "vitest";
import { isPdfUrl, toWebpIfImage } from "./file";

describe("isPdfUrl", () => {
    it("detects .pdf URLs regardless of case", () => {
        expect(isPdfUrl("https://x.supabase.co/storage/v1/object/public/uploads/docs/cv.pdf")).toBe(true);
        expect(isPdfUrl("https://example.com/CERT.PDF")).toBe(true);
    });

    it("rejects images and non-strings", () => {
        expect(isPdfUrl("https://example.com/photo.png")).toBe(false);
        expect(isPdfUrl("https://example.com/pdf")).toBe(false);
        expect(isPdfUrl(null)).toBe(false);
        expect(isPdfUrl(undefined)).toBe(false);
    });
});

describe("toWebpIfImage", () => {
    it("returns non-convertible files (PDF, WebP, GIF, null) untouched", async () => {
        const pdf = new File(["%PDF"], "resume.pdf", { type: "application/pdf" });
        const webp = new File(["RIFF"], "photo.webp", { type: "image/webp" });
        const gif = new File(["GIF89a"], "anim.gif", { type: "image/gif" });

        expect(await toWebpIfImage(pdf)).toBe(pdf);
        expect(await toWebpIfImage(webp)).toBe(webp);
        expect(await toWebpIfImage(gif)).toBe(gif);
        expect(await toWebpIfImage(null)).toBe(null);
    });

    it("gracefully falls back to original file when canvas/createImageBitmap is unavailable", async () => {
        const png = new File(["png"], "photo.png", { type: "image/png" });
        expect(await toWebpIfImage(png)).toBe(png);
    });
});
