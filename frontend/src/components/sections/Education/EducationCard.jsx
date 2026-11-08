import { useState } from "react";
import DescriptionModal from "../../ui/DescriptionModal";
import Reveal from "../../ui/Reveal";

const DESCRIPTION_LIMIT = 180;

function EducationCard({ education }) {
    const [showModal, setShowModal] = useState(false);
    const isLongDescription = education.description && education.description.length > DESCRIPTION_LIMIT;

    return (
        <Reveal as="li" className="rounded-xl bg-white border border-zinc-200 p-6 md:p-8">
            <p className="font-display text-sm font-bold text-blue-700">
                {education.start_year} – {education.end_year || "Present"}
            </p>

            <h3 className="mt-2 font-display text-xl md:text-2xl font-bold leading-snug text-ink">
                {education.institution}
            </h3>

            {education.degree && (
                <p className="mt-1 font-medium text-zinc-700">
                    {education.degree}
                </p>
            )}

            {education.description && (
                <>
                    <p className="mt-4 text-zinc-600 leading-7 line-clamp-3">
                        {education.description}
                    </p>

                    {isLongDescription && (
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center min-h-11 text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline focus-visible:outline-2 focus-visible:outline-blue-700 rounded"
                        >
                            Read more
                        </button>
                    )}
                </>
            )}

            {showModal && (
                <DescriptionModal
                    title={education.institution}
                    subtitle={education.degree}
                    description={education.description}
                    onClose={() => setShowModal(false)}
                />
            )}
        </Reveal>
    );
}

export default EducationCard;
