import { useState } from "react";
import DescriptionModal from "../../ui/DescriptionModal";
import Reveal from "../../ui/Reveal";
import ActivityGallery from "../../ui/ActivityGallery";

const DESCRIPTION_LIMIT = 180;

function EducationCard({ education }) {
    const [showModal, setShowModal] = useState(false);
    const isLongDescription = education.description && education.description.length > DESCRIPTION_LIMIT;

    return (
        <Reveal as="li" className="rounded-xl bg-white border border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 p-6 md:p-8">
            <p className="font-display text-sm font-bold text-blue-700 dark:text-blue-400">
                {education.start_year} – {education.end_year || "Present"}
            </p>

            <h3 className="mt-2 font-display text-xl md:text-2xl font-bold leading-snug text-ink dark:text-white">
                {education.institution}
            </h3>

            {education.degree && (
                <p className="mt-1 font-medium text-zinc-700 dark:text-zinc-300">
                    {education.degree}
                </p>
            )}

            {education.description && (
                <>
                    <p className="mt-4 text-zinc-600 dark:text-zinc-400 leading-7 line-clamp-3">
                        {education.description}
                    </p>

                    {isLongDescription && (
                        <button
                            type="button"
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center min-h-11 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:underline focus-visible:outline-2 focus-visible:outline-blue-700 rounded"
                        >
                            Read more
                        </button>
                    )}
                </>
            )}

            <ActivityGallery
                images={education.activity_images}
                label={education.degree ? `${education.degree} at ${education.institution}` : education.institution}
            />

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
