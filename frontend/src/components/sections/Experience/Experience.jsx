import { useMemo } from "react";
import { TriangleAlert } from "lucide-react";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import Reveal from "../../ui/Reveal";
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
        <section id="experience" className="bg-white py-24 md:py-28">
            <Container>
                <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
                    <SectionHeading
                        before="Work &"
                        highlight="leadership"
                        intro="Where I've worked and the roles I've led, most recent first."
                    />
                    <div>{children}</div>
                </div>
            </Container>
        </section>
    );
}

function TimelineRail() {
    return (
        <Reveal
            as="span"
            variant="draw-y"
            aria-hidden="true"
            className="hidden md:block absolute left-8 top-2 bottom-2 w-px bg-zinc-300"
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
                            <div className="rounded-xl bg-white border border-zinc-200 p-6 md:p-8 animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-zinc-200" />
                                    <div className="flex-1">
                                        <div className="h-5 w-1/2 bg-zinc-200 rounded-lg mb-3" />
                                        <div className="h-4 w-1/3 bg-zinc-100 rounded-lg mb-3" />
                                        <div className="h-3 w-1/4 bg-zinc-100 rounded-lg" />
                                    </div>
                                </div>
                                <div className="mt-6 h-4 w-full bg-zinc-100 rounded-lg mb-2" />
                                <div className="h-4 w-4/5 bg-zinc-100 rounded-lg" />
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
                <p className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
                    {error}
                </p>
            </SectionShell>
        );
    }

    // Keep the section (and the navbar's #experience target) even when empty.
    if (groups.length === 0) {
        return (
            <SectionShell>
                <p className="text-zinc-600">No experience listed yet.</p>
            </SectionShell>
        );
    }

    return (
        <SectionShell>
            <ol className="relative space-y-8 md:space-y-10">
                <TimelineRail />
                {groups.map((group) => (
                    <ExperienceCard key={group.key} group={group} />
                ))}
            </ol>
        </SectionShell>
    );
}

export default Experience;
