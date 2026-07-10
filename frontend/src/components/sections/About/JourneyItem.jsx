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
            bg-white/[0.03] rounded-2xl border border-white/[0.06]
            backdrop-blur-sm
            p-6 
            hover:bg-white/[0.06] hover:border-white/10 hover:-translate-y-1
            transition-all duration-300
            relative overflow-hidden
          `}
        >

          {/* Top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500/30 via-cyan-500/20 to-transparent" />

          {/* Year badge */}
          <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-wider mb-3">
            {year}
          </span>

          <h3 className="text-lg font-bold text-white leading-snug">
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
            bg-slate-800 border-[3px] border-blue-400/50
            shadow-lg shadow-blue-500/10
            ${isLast ? "ring-4 ring-blue-500/10" : ""}
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
            bg-slate-800 border-[3px] border-blue-400/50
            shadow-lg shadow-blue-500/10
            ${isLast ? "ring-4 ring-blue-500/10" : ""}
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