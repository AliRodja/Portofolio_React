import { useState } from "react";
import { HiOutlineBriefcase } from "react-icons/hi2";

function ExperienceCard({ experience, index }) {
    const [imageError, setImageError] = useState(false);
    const isCurrent = !experience.end_date;

    const formatDate = (date) => {
        if (!date) return "Present";

        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div
            className="
                group relative
                rounded-2xl p-6 md:p-8
                bg-white/[0.03] border border-white/[0.06]
                backdrop-blur-sm
                hover:bg-white/[0.06] hover:border-white/10
                hover:-translate-y-1
                transition-all duration-300
                overflow-hidden
            "
            style={{ animationDelay: `${index * 100}ms` }}
        >

            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent" />

            {/* Header row */}
            <div className="flex items-start gap-4">

                {/* Logo / icon */}
                {experience.image_url && !imageError ? (
                    <img
                        src={experience.image_url}
                        alt={experience.organization}
                        onError={() => setImageError(true)}
                        className="
                            w-14 h-14 shrink-0
                            rounded-2xl object-cover
                            border border-white/10
                            bg-white/5
                            group-hover:border-white/20
                            transition-all duration-300
                        "
                    />
                ) : (
                    <div
                        className="
                            w-14 h-14 shrink-0
                            rounded-2xl
                            bg-gradient-to-br from-blue-500/10 to-cyan-500/10
                            border border-blue-500/10
                            flex items-center justify-center
                            text-2xl text-blue-400
                            group-hover:from-blue-500/20 group-hover:to-cyan-500/20
                            group-hover:border-blue-500/20
                            transition-all duration-300
                        "
                    >
                        <HiOutlineBriefcase />
                    </div>
                )}

                <div className="flex-1 min-w-0">

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">

                        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider">
                            {formatDate(experience.start_date)} — {formatDate(experience.end_date)}
                        </span>

                        {isCurrent && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                Current
                            </span>
                        )}

                    </div>

                    {/* Position */}
                    <h3 className="text-xl font-bold text-white leading-snug">
                        {experience.position}
                    </h3>

                    {/* Organization */}
                    <p className="mt-1 text-slate-400 font-medium">
                        {experience.organization}
                    </p>

                </div>

            </div>

            {/* Description */}
            {experience.description && (
                <p className="mt-5 text-slate-500 leading-7">
                    {experience.description}
                </p>
            )}

            {/* Bottom accent line on hover */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-16 h-[2px] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-300" />

        </div>
    );
}

export default ExperienceCard;
