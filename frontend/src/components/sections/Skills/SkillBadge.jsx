function SkillBadge({ icon, name, color = "text-blue-400" }) {
  return (
    <div
      className="
        group/badge
        inline-flex items-center gap-2.5
        px-4 py-2.5
        rounded-xl
        bg-white/[0.04] border border-white/[0.08]
        text-slate-300 text-sm font-medium
        hover:bg-white/[0.08] hover:border-white/15
        hover:-translate-y-0.5
        hover:shadow-lg hover:shadow-black/20
        transition-all duration-300
        cursor-default
      "
    >
      <span className={`text-lg ${color} transition-transform duration-300 group-hover/badge:scale-110`}>
        {icon}
      </span>
      <span>{name}</span>
    </div>
  );
}

export default SkillBadge;