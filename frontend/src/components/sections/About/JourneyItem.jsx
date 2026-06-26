function JourneyItem({ year, title, description, icon, isLeft, isLast }) {
  return (
    <div
      className={`
        relative flex items-start gap-6
        md:gap-0
        ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}
      `}
    >
      {/* Content card — mobile: always right of line, desktop: alternates */}
      <div
        className={`
          ml-14 md:ml-0
          md:w-[calc(50%-32px)]
          ${isLeft ? "md:pr-0 md:text-right" : "md:pl-0 md:text-left"}
        `}
      >
        <div
          className={`
            group
            bg-white rounded-2xl border border-slate-200
            p-6 shadow-sm
            hover:shadow-xl hover:border-blue-200 hover:-translate-y-1
            transition-all duration-300
          `}
        >
          {/* Year badge */}
          <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold tracking-wider mb-3">
            {year}
          </span>

          <h3 className="text-lg font-bold text-slate-900 leading-snug">
            {title}
          </h3>

          {description && (
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* Center dot — desktop */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-6 items-center justify-center">
        <div
          className={`
            w-12 h-12 rounded-full
            flex items-center justify-center
            text-lg
            bg-white border-[3px] border-blue-400
            shadow-md shadow-blue-100
            ${isLast ? "ring-4 ring-blue-100" : ""}
          `}
        >
          {icon}
        </div>
      </div>

      {/* Center dot — mobile */}
      <div className="md:hidden absolute left-6 -translate-x-1/2 top-6 flex items-center justify-center">
        <div
          className={`
            w-12 h-12 rounded-full
            flex items-center justify-center
            text-lg
            bg-white border-[3px] border-blue-400
            shadow-md shadow-blue-100
            ${isLast ? "ring-4 ring-blue-100" : ""}
          `}
        >
          {icon}
        </div>
      </div>

      {/* Spacer for the other side — desktop only */}
      <div className="hidden md:block md:w-[calc(50%-32px)]" />

    </div>
  );
}

export default JourneyItem;