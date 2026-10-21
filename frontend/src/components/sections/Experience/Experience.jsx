import { useMemo } from "react";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";

import Container from "../../ui/Container";
import useExperience from "../../../hooks/useExperience";
import ExperienceCard from "./ExperienceCard";
import { toDate } from "./experienceDates";

// Collapse roles at the same organization into one timeline entry, keeping
// the API's most-recent-first order for both groups and roles.
function groupByOrganization(experiences) {
    const groups = [];
    const byKey = new Map();

    for (const exp of experiences) {
        const key = (exp.organization || "").trim().toLowerCase();
        const role = { ...exp, start: toDate(exp.start_date), end: toDate(exp.end_date) };

        if (!byKey.has(key)) {
            const group = { key, organization: exp.organization, roles: [] };
            byKey.set(key, group);
            groups.push(group);
        }

        byKey.get(key).roles.push(role);
    }

    return groups.map((group) => {
        const roles = [...group.roles].sort((a, b) => (b.start || 0) - (a.start || 0));
        const ongoing = roles.some((r) => !r.end);

        return {
            ...group,
            roles,
            start: roles.reduce((min, r) => (!min || (r.start && r.start < min) ? r.start : min), null),
            end: ongoing ? null : roles.reduce((max, r) => (!max || r.end > max ? r.end : max), null),
            logo: roles.find((r) => r.image_url)?.image_url || null,
        };
    });
}

function SectionShell({ children }) {
    return (
        <section id="experience" className="relative py-24 md:py-32 bg-slate-900 overflow-hidden">
            {/* Background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[140px]" />
                <div className="absolute bottom-20 -right-32 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
            </div>

            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <Container className="relative z-10">
                {/* Section header */}
                <div data-aos="fade-up" className="text-center mb-14 md:mb-20">
                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-sm text-blue-300 font-medium tracking-wider uppercase">
                            Experience
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Work &
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {" "}Leadership
                        </span>
                    </h2>

                    <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
                        Where I&apos;ve worked and the roles I&apos;ve led — most recent first.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </Container>
        </section>
    );
}

function TimelineRail() {
    return (
        <span
            aria-hidden="true"
            className="hidden md:block absolute left-8 top-2 bottom-2 w-px bg-gradient-to-b from-blue-500/50 via-white/10 to-transparent"
        />
    );
}

function Experience() {
    const { experiences, loading, error } = useExperience();

    const groups = useMemo(() => groupByOrganization(experiences), [experiences]);

    if (loading) {
        return (
            <SectionShell>
                <div className="relative space-y-8" aria-busy="true" aria-label="Loading experience">
                    <TimelineRail />
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="relative md:pl-20">
                            <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 md:p-8 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/[0.05]" />
                                    <div className="flex-1">
                                        <div className="h-5 w-1/2 bg-white/[0.06] rounded-lg mb-3" />
                                        <div className="h-4 w-1/3 bg-white/[0.04] rounded-lg mb-3" />
                                        <div className="h-3 w-1/4 bg-white/[0.04] rounded-lg" />
                                    </div>
                                </div>
                                <div className="mt-6 h-4 w-full bg-white/[0.04] rounded-lg mb-2" />
                                <div className="h-4 w-4/5 bg-white/[0.04] rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </SectionShell>
        );
    }

    if (error) {
        return (
            <SectionShell>
                <div className="text-center">
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                        <span className="text-red-400"><HiOutlineExclamationTriangle /></span>
                        <span className="text-red-300 text-sm font-medium">{error}</span>
                    </div>
                </div>
            </SectionShell>
        );
    }

    if (groups.length === 0) {
        return null;
    }

    return (
        <SectionShell>
            <ol className="relative space-y-8 md:space-y-10">
                <TimelineRail />
                {groups.map((group, index) => (
                    <ExperienceCard key={group.key} group={group} index={index} />
                ))}
            </ol>
        </SectionShell>
    );
}

export default Experience;
