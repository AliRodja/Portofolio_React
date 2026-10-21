import { useState } from "react";
import { HiOutlineBriefcase, HiChevronDown } from "react-icons/hi2";

import { formatDuration, formatMonth } from "./experienceDates";

const COLLAPSED_ITEMS = 2;

// Lines starting with •, -, * or a number become bullet points; anything else
// is kept as a paragraph.
function parseDescription(text) {
    if (!text) return [];

    return text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const match = line.match(/^(?:[•\-*]|\d+[.)])\s+(.*)$/);

            return match
                ? { type: "bullet", text: match[1] }
                : { type: "text", text: line };
        });
}

function CurrentBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Current
        </span>
    );
}

function DateLine({ start, end }) {
    return (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-slate-400">
            <span>{formatMonth(start)} – {formatMonth(end)}</span>
            <span className="text-slate-500 whitespace-nowrap">
                <span className="text-slate-600 mr-2" aria-hidden="true">·</span>
                {formatDuration(start, end)}
            </span>
            {!end && <CurrentBadge />}
        </div>
    );
}

function Description({ text }) {
    const [expanded, setExpanded] = useState(false);
    const items = parseDescription(text);

    if (items.length === 0) return null;

    const canCollapse = items.length > COLLAPSED_ITEMS + 1;
    const visible = canCollapse && !expanded ? items.slice(0, COLLAPSED_ITEMS) : items;

    return (
        <div className="mt-4">
            <ul className="space-y-2.5">
                {visible.map((item, i) => (
                    item.type === "bullet" ? (
                        <li key={i} className="flex gap-3 text-slate-300/90 leading-relaxed">
                            <span className="mt-[0.6em] w-1.5 h-1.5 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400" />
                            <span>{item.text}</span>
                        </li>
                    ) : (
                        <li key={i} className="text-slate-300/90 leading-relaxed">
                            {item.text}
                        </li>
                    )
                ))}
            </ul>

            {canCollapse && (
                <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    aria-expanded={expanded}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                >
                    {expanded ? "Show less" : `Show ${items.length - COLLAPSED_ITEMS} more`}
                    <HiChevronDown className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
                </button>
            )}
        </div>
    );
}

function OrgLogo({ src, name }) {
    const [failed, setFailed] = useState(false);

    if (src && !failed) {
        return (
            <img
                src={src}
                alt={name}
                onError={() => setFailed(true)}
                className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl object-cover border border-white/10 bg-white/5"
            />
        );
    }

    return (
        <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl bg-gradient-to-br from-blue-500/15 to-cyan-500/10 border border-blue-500/15 flex items-center justify-center text-xl md:text-2xl text-blue-400">
            <HiOutlineBriefcase />
        </div>
    );
}

/**
 * One timeline entry = one organization. A single role renders as a plain
 * card; several roles at the same organization render as a nested
 * progression (most recent first), LinkedIn style.
 */
function ExperienceCard({ group, index }) {
    const { organization, roles, start, end, logo } = group;
    const isCurrent = !end;
    const single = roles.length === 1;

    return (
        <li
            data-aos="fade-up"
            data-aos-delay={Math.min(index, 3) * 100}
            className="relative md:pl-20"
        >
            {/* Timeline node */}
            <span
                aria-hidden="true"
                className="hidden md:flex absolute left-[25px] top-7 items-center justify-center w-[15px] h-[15px] rounded-full bg-slate-900 ring-2 ring-blue-400/60"
            >
                <span className={`w-[7px] h-[7px] rounded-full ${isCurrent ? "bg-emerald-400 animate-pulse" : "bg-blue-400"}`} />
            </span>

            <article
                className="
                    group relative rounded-2xl p-5 sm:p-6 md:p-8
                    bg-white/[0.03] border border-white/[0.06]
                    hover:bg-white/[0.05] hover:border-white/10
                    transition-colors duration-300
                "
            >
                {/* Header */}
                <header className="flex items-start gap-4">
                    <OrgLogo src={logo} name={organization} />

                    <div className="flex-1 min-w-0">
                        {single ? (
                            <>
                                <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                                    {roles[0].position}
                                </h3>
                                <p className="mt-0.5 text-slate-300 font-medium">
                                    {organization}
                                </p>
                                <div className="mt-2">
                                    <DateLine start={roles[0].start} end={roles[0].end} />
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                                    {organization}
                                </h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    {roles.length} roles · {formatDuration(start, end)}
                                </p>
                            </>
                        )}
                    </div>
                </header>

                {/* Body */}
                {single ? (
                    <Description text={roles[0].description} />
                ) : (
                    <ol className="mt-6 space-y-7 border-l border-white/10 ml-1.5 md:ml-7">
                        {roles.map((role) => (
                            <li key={role.id} className="relative pl-5 md:pl-8">
                                <span
                                    aria-hidden="true"
                                    className={`absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full ring-4 ring-slate-900 ${role.end ? "bg-slate-500" : "bg-emerald-400"}`}
                                />
                                <h4 className="font-semibold text-white leading-snug">
                                    {role.position}
                                </h4>
                                <div className="mt-1">
                                    <DateLine start={role.start} end={role.end} />
                                </div>
                                <Description text={role.description} />
                            </li>
                        ))}
                    </ol>
                )}
            </article>
        </li>
    );
}

export default ExperienceCard;
