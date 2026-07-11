import { HiOutlineExclamationTriangle } from "react-icons/hi2";

import Container from "../../ui/Container";
import useEducation from "../../../hooks/useEducation";
import EducationCard from "./EducationCard";

function Education() {

    const {
        education,
        loading,
        error,
    } = useEducation();

    if (loading) {
        return (
            <section className="relative py-32 bg-slate-900 overflow-hidden">
                <Container className="relative z-10">

                    {/* Skeleton header */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-sm text-blue-300 font-medium tracking-wider uppercase">
                                Loading Education
                            </span>
                        </div>
                    </div>

                    {/* Skeleton cards */}
                    <div className="max-w-4xl mx-auto space-y-8">
                        {[...Array(3)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 animate-pulse"
                            >
                                <div className="h-4 w-24 bg-white/[0.05] rounded-lg mb-4" />
                                <div className="h-6 w-2/3 bg-white/[0.05] rounded-lg mb-3" />
                                <div className="h-4 w-1/2 bg-white/[0.04] rounded-lg mb-4" />
                                <div className="h-4 w-full bg-white/[0.04] rounded-lg" />
                            </div>
                        ))}
                    </div>

                </Container>
            </section>
        );
    }

    if (error) {
        return (
            <section className="relative py-32 bg-slate-900 overflow-hidden">
                <Container className="relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                            <span className="text-red-400"><HiOutlineExclamationTriangle /></span>
                            <span className="text-red-300 text-sm font-medium">{error}</span>
                        </div>
                    </div>
                </Container>
            </section>
        );
    }

    return (
        <section
            id="education"
            className="relative py-32 bg-slate-900 overflow-hidden"
        >

            {/* ── Background decorations ── */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[140px]" />
                <div className="absolute bottom-20 -right-32 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            <Container className="relative z-10">

                {/* ── Section Header ── */}
                <div className="text-center mb-20">

                    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="text-sm text-blue-300 font-medium tracking-wider uppercase">
                            Education
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Academic
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {" "}Journey
                        </span>
                    </h2>

                    <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
                        My educational background and academic milestones.
                    </p>

                </div>

                {/* ── Timeline ── */}
                <div className="relative max-w-4xl mx-auto">

                    {/* Center timeline line */}
                    <div className="absolute left-8 md:left-12 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/40 via-cyan-500/30 to-transparent rounded-full" />

                    <div className="space-y-8">
                        {education.map((item, index) => (
                            <EducationCard
                                key={item.id}
                                education={item}
                                index={index}
                            />
                        ))}
                    </div>

                </div>

            </Container>

        </section>
    );
}

export default Education;