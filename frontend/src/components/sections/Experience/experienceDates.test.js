import { describe, expect, it } from "vitest";
import { formatDuration, formatMonth, toDate } from "./experienceDates";

const utc = (year, month, day = 1) => new Date(Date.UTC(year, month - 1, day));

describe("toDate", () => {
    it("reads the plain YYYY-MM-DD dates the API sends now", () => {
        expect(toDate("2025-06-01")).toEqual(utc(2025, 6, 1));
    });

    it("recovers the calendar date from old timezone-shifted timestamps", () => {
        // 1 June stored by a UTC+7 server, and 1 June stored by a UTC-5 server.
        expect(toDate("2025-05-31T17:00:00.000Z")).toEqual(utc(2025, 6, 1));
        expect(toDate("2025-06-01T05:00:00.000Z")).toEqual(utc(2025, 6, 1));
    });

    it("returns null for an empty value", () => {
        expect(toDate(null)).toBeNull();
        expect(toDate("")).toBeNull();
    });
});

describe("formatMonth", () => {
    it("formats as short month and year", () => {
        expect(formatMonth(utc(2025, 6, 1))).toBe("Jun 2025");
        expect(formatMonth(utc(2024, 12, 31))).toBe("Dec 2024");
    });

    it("shows Present when there is no end date", () => {
        expect(formatMonth(null)).toBe("Present");
    });
});

describe("formatDuration", () => {
    it("counts months inclusively", () => {
        expect(formatDuration(utc(2025, 6), utc(2025, 8))).toBe("3 mos");
        expect(formatDuration(utc(2025, 6), utc(2025, 6))).toBe("1 mo");
    });

    it("rolls whole years into yrs", () => {
        expect(formatDuration(utc(2024, 1), utc(2024, 12))).toBe("1 yr");
        expect(formatDuration(utc(2023, 1), utc(2025, 2))).toBe("2 yrs 2 mos");
        expect(formatDuration(utc(2024, 3), utc(2025, 3))).toBe("1 yr 1 mo");
    });

    it("counts up to today when there is no end date", () => {
        const now = new Date();
        const thisMonth = utc(now.getUTCFullYear(), now.getUTCMonth() + 1);

        expect(formatDuration(thisMonth, null)).toBe("1 mo");
    });

    it("returns an empty string without a start date", () => {
        expect(formatDuration(null, utc(2025, 1))).toBe("");
    });
});
