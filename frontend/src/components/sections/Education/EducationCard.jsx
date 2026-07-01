function EducationCard({ education }) {
    return (
        <div className="relative border-l-2 border-blue-500 pl-8 pb-10">

            <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-blue-600"></div>

            <p className="text-blue-600 font-semibold">
                {education.start_year} — {education.end_year || "Present"}
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {education.institution}
            </h3>

            <p className="mt-1 text-slate-600 font-medium">
                {education.degree}
            </p>

            <p className="mt-4 text-slate-600 leading-8">
                {education.description}
            </p>

        </div>
    );
}

export default EducationCard;