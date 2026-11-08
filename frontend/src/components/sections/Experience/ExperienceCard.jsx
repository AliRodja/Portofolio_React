import { useState } from "react";
import { Briefcase, ChevronDown } from "lucide-react";

import { formatDuration, formatMonth } from "./experienceDates";
import Reveal from "../../ui/Reveal";

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
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold">
            <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            Current
        </span>
    );
}

function DateLine({ start, end }) {
    return (
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-zinc-600">
            <span>{formatMonth(start)} – {formatMonth(end)}</span>
            <span className="whitespace-nowrap">
                <span className="text-zinc-400 mr-2" aria-hidden="true">·</span>
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
                        <li key={i} className="flex gap-3 text-zinc-700 leading-relaxed">
                            <span aria-hidden="true" className="mt-[0.6em] w-1.5 h-1.5 shrink-0 rounded-full bg-blue-700" />
                            <span>{item.text}</span>
                        </li>
                    ) : (
                        <li key={i} className="text-zinc-700 leading-relaxed">
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
                    className="mt-1 inline-flex items-center gap-1 min-h-11 text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline focus-visible:outline-2 focus-visible:outline-blue-700 rounded transition-colors"
                >
                    {expanded ? "Show less" : `Show ${items.length - COLLAPSED_ITEMS} more`}
                    <ChevronDown aria-hidden="true" className={`size-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
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
                width={56}
                height={56}
                className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl object-cover border border-zinc-200 bg-zinc-100"
            />
        );
    }

    return (
        <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center text-xl md:text-2xl text-zinc-600">
            <Briefcase aria-hidden="true" className="size-5 md:size-6" />
        </div>
    );
}

/**
 * One timeline entry = one organization. A single role renders as a plain
 * card; several roles at the same organization render as a nested
 * progression (most recent first), LinkedIn style.
 */
function ExperienceCard({ group }) {
    const { organization, roles, start, end, logo } = group;
    const isCurrent = !end;
    const single = roles.length === 1;

    return (
        <Reveal as="li" className="relative md:pl-20">
            {/* Timeline node */}
            <span
                aria-hidden="true"
                className="hidden md:flex absolute left-[25px] top-7 items-center justify-center w-[15px] h-[15px] rounded-full bg-white ring-2 ring-blue-700"
            >
                <span className={`w-[7px] h-[7px] rounded-full ${isCurrent ? "bg-emerald-600" : "bg-blue-700"}`} />
            </span>

            <article
                className="
                    relative rounded-xl p-5 sm:p-6 md:p-8
                    bg-white border border-zinc-200
                "
            >
                {/* Header */}
                <header className="flex items-start gap-4">
                    <OrgLogo src={logo} name={organization} />

                    <div className="flex-1 min-w-0">
                        {single ? (
                            <>
                                <h3 className="font-display text-lg md:text-xl font-bold text-ink leading-snug">
                                    {roles[0].position}
                                </h3>
                                <p className="mt-0.5 text-zinc-700 font-medium">
                                    {organization}
                                </p>
                                <div className="mt-2">
                                    <DateLine start={roles[0].start} end={roles[0].end} />
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className="font-display text-lg md:text-xl font-bold text-ink leading-snug">
                                    {organization}
                                </h3>
                                <p className="mt-1 text-sm text-zinc-600">
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
                    <ol className="mt-6 space-y-7 border-l border-zinc-200 ml-1.5 md:ml-7">
                        {roles.map((role) => (
                            <li key={role.id} className="relative pl-5 md:pl-8">
                                <span
                                    aria-hidden="true"
                                    className={`absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full ring-4 ring-white ${role.end ? "bg-zinc-400" : "bg-emerald-600"}`}
                                />
                                <h4 className="font-semibold text-ink leading-snug">
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
        </Reveal>
    );
}

export default ExperienceCard;
