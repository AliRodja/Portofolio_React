import { TriangleAlert } from "lucide-react";

import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import useEducation from "../../../hooks/useEducation";
import EducationCard from "./EducationCard";

// One shell for every state, so the navbar's #education always has a target.
function EducationShell({ children }) {
    return (
        <section id="education" className="bg-zinc-50 border-y border-zinc-200 py-24 md:py-28">
            <Container>
                <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16">
                    <SectionHeading
                        before="Academic"
                        highlight="journey"
                        intro="My educational background and academic milestones."
                    />
                    <div>{children}</div>
                </div>
            </Container>
        </section>
    );
}

function Education() {
    const { education, loading, error } = useEducation();

    if (loading) {
        return (
            <EducationShell>
                <div className="space-y-6" aria-busy="true">
                    <span className="sr-only">Loading education</span>
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="rounded-xl bg-white border border-zinc-200 p-6 md:p-8 animate-pulse">
                            <div className="h-4 w-24 bg-zinc-200 rounded-lg mb-4" />
                            <div className="h-6 w-2/3 bg-zinc-200 rounded-lg mb-3" />
                            <div className="h-4 w-1/2 bg-zinc-100 rounded-lg" />
                        </div>
                    ))}
                </div>
            </EducationShell>
        );
    }

    if (error) {
        return (
            <EducationShell>
                <p className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
                    {error}
                </p>
            </EducationShell>
        );
    }

    if (education.length === 0) {
        return (
            <EducationShell>
                <p className="text-zinc-600">No education listed yet.</p>
            </EducationShell>
        );
    }

    return (
        <EducationShell>
            <ol className="space-y-6">
                {education.map((item) => (
                    <EducationCard key={item.id} education={item} />
                ))}
            </ol>
        </EducationShell>
    );
}

export default Education;
