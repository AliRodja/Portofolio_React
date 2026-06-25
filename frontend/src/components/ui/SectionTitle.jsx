function SectionTitle({
  title,
  subtitle,
  center = false,
}) {
  return (
    <div
      className={`mb-16 ${
        center ? "text-center" : ""
      }`}
    >

      <p className="text-blue-600 font-semibold uppercase tracking-widest">
        {subtitle}
      </p>

      <h2 className="text-4xl font-bold text-slate-900 mt-3">
        {title}
      </h2>

    </div>
  );
}

export default SectionTitle;