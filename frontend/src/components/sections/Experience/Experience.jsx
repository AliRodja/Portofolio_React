import { HiOutlineExclamationTriangle } from "react-icons/hi2";

import Container from "../../ui/Container";
import useExperience from "../../../hooks/useExperience";
import ExperienceCard from "./ExperienceCard";

function Experience() {

    const {
        experiences,
        loading,
        error,
    } = useExperience();

    if (loading) {
        return (
            <section className="relative py-32 bg-slate-900 overflow-hidden">
                <Container className="relative z-10">

                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                            <span className="text-sm text-blue-300 font-medium tracking-wider uppercase">
                                Loading Experience
                            </span>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-8 animate-pulse"
                            >
                                <div className="h-4 w-28 bg-white/[0.05] rounded-lg mb-4" />
                                <div className="h-6 w-3/4 bg-white/[0.05] rounded-lg mb-3" />
                                <div className="h-4 w-1/2 bg-white/[0.04] rounded-lg mb-6" />
                                <div className="h-4 w-full bg-white/[0.04] rounded-lg mb-2" />
                                <div className="h-4 w-4/5 bg-white/[0.04] rounded-lg" />
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
            id="experience"
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
                            Experience
                        </span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Leadership &
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            {" "}Organization
                        </span>
                    </h2>

                    <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
                        My leadership roles and organizational experience.
                    </p>

                </div>

                {/* ── Experience count badge ── */}
                <div className="flex justify-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm text-slate-400">
                        <span className="font-bold text-white">{experiences.length}</span>
                        <span>experiences</span>
                    </div>
                </div>

                {/* ── Experience Grid ── */}
                <div className="grid md:grid-cols-2 gap-6">

                    {experiences.map((experience, index) => (
                        <ExperienceCard
                            key={experience.id}
                            experience={experience}
                            index={index}
                        />
                    ))}

                </div>

            </Container>

        </section>
    );
}

export default Experience;