import { useEffect, useMemo, useRef, useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { SKILL_ICONS } from "../../constants/skillIcons";

function IconPicker({ value, onChange }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const ref = useRef(null);

    const filtered = useMemo(() => {
        if (!query.trim()) return SKILL_ICONS;

        return SKILL_ICONS.filter((item) =>
            item.label.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    const selected = SKILL_ICONS.filter((item) => item.key === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (key) => {
        onChange(key);
        setOpen(false);
        setQuery("");
    };

    return (
        <div className="relative" ref={ref}>

            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-3 border border-slate-200 rounded-xl p-3 text-sm hover:border-blue-300 transition"
            >
                {selected.length === 0 && (
                    <span className="text-slate-400">Pilih icon...</span>
                )}

                {selected.map((item) => {
                    const Icon = item.icon;

                    return (
                        <span key={item.key} className="flex items-center gap-3">
                            <Icon className="text-lg text-slate-600 shrink-0" />
                            <span className="text-slate-700">{item.label}</span>
                        </span>
                    );
                })}

                <FaChevronDown className={`ml-auto text-xs text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute z-30 mt-2 w-full bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">

                    <div className="p-2 border-b border-slate-100 relative">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                        <input
                            autoFocus
                            type="text"
                            placeholder="Cari icon..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-7 pr-2 py-1.5 text-sm rounded-lg focus:outline-none"
                        />
                    </div>

                    <div className="max-h-56 overflow-y-auto grid grid-cols-4 gap-1 p-2">

                        {filtered.length === 0 ? (
                            <p className="col-span-4 text-center text-sm text-slate-400 py-4">
                                Icon tidak ditemukan.
                            </p>
                        ) : (
                            filtered.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        title={item.label}
                                        onClick={() => handleSelect(item.key)}
                                        className={`
                                            flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition
                                            ${value === item.key
                                                ? "bg-blue-50 text-blue-600 ring-1 ring-blue-200"
                                                : "text-slate-600 hover:bg-slate-50"
                                            }
                                        `}
                                    >
                                        <Icon className="text-lg" />
                                        <span className="truncate w-full text-center">{item.label}</span>
                                    </button>
                                );
                            })
                        )}

                    </div>

                </div>
            )}

        </div>
    );
}

export default IconPicker;
