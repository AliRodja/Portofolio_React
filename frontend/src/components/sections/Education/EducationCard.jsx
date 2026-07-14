import { useState } from "react";
import { HiOutlineAcademicCap } from "react-icons/hi2";
import DescriptionModal from "../../ui/DescriptionModal";

const DESCRIPTION_LIMIT = 180;

function EducationCard({ education, index = 0 }) {
    const [showModal, setShowModal] = useState(false);
    const isLongDescription = education.description && education.description.length > DESCRIPTION_LIMIT;

    return (
        <div
            data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
            className="relative flex items-start gap-6 pl-8 md:pl-12 group"
        >

            {/* Timeline dot */}
            <div className="absolute left-8 md:left-12 -translate-x-1/2 top-8 z-10">
                <div
                    className="
                        w-10 h-10 rounded-full
                        flex items-center justify-center
                        bg-slate-800 border-[3px] border-blue-400/50
                        shadow-lg shadow-blue-500/10
                        group-hover:border-blue-400 group-hover:shadow-blue-500/20
                        transition-all duration-300
                    "
                >
                    <HiOutlineAcademicCap className="text-blue-400 text-lg" />
                </div>
            </div>

            {/* Card content */}
            <div className="ml-10 md:ml-14 flex-1 pb-2">
                <div
                    className="
                        rounded-2xl p-6 md:p-8
                        bg-white/[0.03] border border-white/[0.06]
                        backdrop-blur-sm
                        hover:bg-white/[0.06] hover:border-white/10
                        hover:-translate-y-1
                        transition-all duration-300
                        relative overflow-hidden
                    "
                >

                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/50 via-cyan-500/30 to-transparent" />

                    {/* Year badge */}
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider">
                        {education.start_year} — {education.end_year || "Present"}
                    </span>

                    {/* Institution */}
                    <h3 className="mt-4 text-xl md:text-2xl font-bold text-white leading-snug">
                        {education.institution}
                    </h3>

                    {/* Degree */}
                    <p className="mt-2 text-slate-400 font-medium">
                        {education.degree}
                    </p>

                    {/* Description */}
                    {education.description && (
                        <>
                            <p className="mt-4 text-slate-500 leading-7 line-clamp-3">
                                {education.description}
                            </p>

                            {isLongDescription && (
                                <button
                                    type="button"
                                    onClick={() => setShowModal(true)}
                                    className="mt-2 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    Read more
                                </button>
                            )}
                        </>
                    )}

                </div>
            </div>

            {showModal && (
                <DescriptionModal
                    title={education.institution}
                    subtitle={education.degree}
                    description={education.description}
                    onClose={() => setShowModal(false)}
                />
            )}

        </div>
    );
}

export default EducationCard;