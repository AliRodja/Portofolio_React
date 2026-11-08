import { describe, expect, it } from "vitest";
import { isPdfUrl } from "./file";

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
