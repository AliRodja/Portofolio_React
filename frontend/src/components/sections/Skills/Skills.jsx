import useSkills from "../../../hooks/useSkills";
import { getSkillIcon } from "../../../constants/skillIcons";
import { FaCode } from "react-icons/fa";

const SKILL_COLORS = [
  "text-cyan-400",
  "text-blue-400",
  "text-yellow-400",
  "text-green-400",
  "text-purple-400",
  "text-red-400",
  "text-indigo-400",
  "text-pink-400",
  "text-orange-400",
  "text-slate-300",
];

function MarqueeRow({ skills, reverse = false }) {
  // Duplicate for seamless loop
  const items = [...skills, ...skills];

  return (
    <div className="relative overflow-hidden py-4 group/marquee">

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

      <div
        className={`
          flex items-center gap-10 md:gap-14 w-max
          ${reverse ? "animate-marquee-reverse" : "animate-marquee"}
          group-hover/marquee:[animation-play-state:paused]
        `}
      >
        {items.map((skill, i) => {
          const Icon = skill.icon || FaCode;

          return (
            <div
              key={`${skill.name}-${i}`}
              className="flex items-center gap-3 shrink-0"
            >
              <span className={`text-2xl md:text-3xl ${skill.color} transition-transform duration-300`}>
                <Icon />
              </span>
              <span className="text-slate-400 text-base md:text-lg font-medium whitespace-nowrap">
                {skill.name}
              </span>
            </div>
          );
        })}
      </div>

    </div>
  );
}

function Skills() {
  const { skills, loading, error } = useSkills();

  if (loading || error || skills.length === 0) {
    return null;
  }

  const skillsWithVisuals = skills.map((skill, i) => ({
    ...skill,
    icon: getSkillIcon(skill.icon_name),
    color: SKILL_COLORS[i % SKILL_COLORS.length],
  }));

  const midpoint = Math.ceil(skillsWithVisuals.length / 2);
  const row1 = skillsWithVisuals.slice(0, midpoint);
  const row2 = skillsWithVisuals.slice(midpoint);

  return (
    <section id="skills" className="relative py-28 md:py-32 bg-slate-900 overflow-hidden">

      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -right-32 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[140px]" />
        <div className="absolute bottom-20 -left-32 w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10">

        {/* Section header */}
        <div className="text-center mb-16 px-6">

          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm text-cyan-300 font-medium tracking-wider uppercase">
              My Skills
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Technologies I
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Work With
            </span>
          </h2>

          <p className="mt-4 text-lg text-slate-400 max-w-xl mx-auto">
            Tools and technologies I use to bring ideas to life.
          </p>

        </div>

        {/* Marquee rows */}
        <div className="space-y-2">
          <MarqueeRow skills={row1} />
          {row2.length > 0 && <MarqueeRow skills={row2} reverse />}
        </div>

      </div>

    </section>
  );
}

export default Skills;