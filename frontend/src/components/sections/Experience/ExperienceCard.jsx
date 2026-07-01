function ExperienceCard({ experience }) {

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
        relative
        bg-white
        border
        border-slate-200
        rounded-2xl
        p-8
        shadow-sm
        transition
        hover:shadow-xl
        hover:-translate-y-1
      "
        >

            <p className="text-sm text-blue-600 font-semibold">

                {formatDate(experience.start_date)} —{" "}
                {formatDate(experience.end_date)}

            </p>

            <h3 className="text-2xl font-bold mt-3">

                {experience.position}

            </h3>

            <p className="text-slate-500 mt-1">

                {experience.organization}

            </p>

            <p className="mt-6 text-slate-600 leading-8">

                {experience.description}

            </p>

        </div>
    );
}

export default ExperienceCard;