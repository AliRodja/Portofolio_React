import { useEffect, useMemo, useRef, useState } from "react";

const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition";

const DEFAULT_CATEGORIES = [
    "Frontend",
    "Backend",
    "Database",
    "DevOps & Cloud",
    "Mobile",
    "Programming Language",
    "Tools & Version Control",
    "Design",
    "Other",
];

// Free-text input backed by a suggestion list, so category names stay
// consistent instead of drifting (e.g. "Frontend" vs "front-end").
function CategorySelect({ value, onChange, extraCategories = [] }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const allCategories = useMemo(() => {
        const merged = [...DEFAULT_CATEGORIES, ...extraCategories];

        return [...new Set(merged.filter(Boolean))].sort((a, b) => a.localeCompare(b));
    }, [extraCategories]);

    const suggestions = useMemo(() => {
        if (!value.trim()) return allCategories;

        return allCategories.filter((category) =>
            category.toLowerCase().includes(value.trim().toLowerCase())
        );
    }, [allCategories, value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (category) => {
        onChange(category);
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>

            <input
                type="text"
                placeholder="e.g. Frontend"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                className={inputClass}
                autoComplete="off"
            />

            {open && (
                <div className="absolute z-30 mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">

                    <div className="max-h-56 overflow-y-auto py-1">

                        {suggestions.length === 0 ? (
                            <p className="px-3 py-3 text-sm text-slate-400">
                                No match — this will be saved as a custom category.
                            </p>
                        ) : (
                            suggestions.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => handleSelect(category)}
                                    className="w-full px-3 py-2 text-sm text-left text-slate-700 hover:bg-slate-50 transition"
                                >
                                    {category}
                                </button>
                            ))
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}

export default CategorySelect;
