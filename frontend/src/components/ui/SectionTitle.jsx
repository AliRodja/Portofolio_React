function SectionTitle({
  title,
  subtitle,
  description,
  center = false,
  light = false,
}) {
  return (
    <div
      className={`mb-16 ${center ? "text-center" : ""}`}
    >

      {/* Pill tag */}
      <div
        className={`
          inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-8
          ${light
            ? "bg-white/5 border border-white/10 backdrop-blur-sm"
            : "bg-blue-50 border border-blue-100"
          }
        `}
      >
        <span
          className={`w-2 h-2 rounded-full animate-pulse ${
            light ? "bg-blue-400" : "bg-blue-500"
          }`}
        />
        <span
          className={`text-sm font-medium tracking-wider uppercase ${
            light ? "text-blue-300" : "text-blue-600"
          }`}
        >
          {subtitle}
        </span>
      </div>

      {/* Title */}
      <h2
        className={`text-4xl md:text-5xl font-bold tracking-tight ${
          light ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>

      {/* Optional description */}
      {description && (
        <p
          className={`mt-4 text-lg max-w-2xl ${
            center ? "mx-auto" : ""
          } ${light ? "text-slate-400" : "text-slate-500"}`}
        >
          {description}
        </p>
      )}

    </div>
  );
}

export default SectionTitle;