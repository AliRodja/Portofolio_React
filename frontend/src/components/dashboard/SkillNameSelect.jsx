import { useEffect, useMemo, useRef, useState } from "react";
import { SKILL_ICONS } from "../../constants/skillIcons";

const inputClass = "w-full border border-slate-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition";

// Lets the user either pick a name from the same icon set shown in the
// public Skills section (which also fills in the matching icon), or type
// a custom name for a skill that has no curated icon.
function SkillNameSelect({ value, onChange, onSelectPreset }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    const suggestions = useMemo(() => {
        if (!value.trim()) return SKILL_ICONS;

        return SKILL_ICONS.filter((item) =>
            item.label.toLowerCase().includes(value.trim().toLowerCase())
        );
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (item) => {
        onSelectPreset(item.label, item.key);
        setOpen(false);
    };

    return (
        <div className="relative" ref={ref}>

            <input
                type="text"
                placeholder="e.g. React"
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
                                No matching icon — this will be saved as a custom name.
                            </p>
                        ) : (
                            suggestions.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.key}
                                        type="button"
                                        onClick={() => handleSelect(item)}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-left hover:bg-slate-50 transition"
                                    >
                                        <Icon className="text-base text-slate-500 shrink-0" />
                                        <span className="text-slate-700">{item.label}</span>
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

export default SkillNameSelect;
