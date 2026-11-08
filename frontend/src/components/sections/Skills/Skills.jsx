import { useState } from "react";
import { HiOutlineExclamationTriangle, HiPause, HiPlay } from "react-icons/hi2";
import { FaCode } from "react-icons/fa";

import useSkills from "../../../hooks/useSkills";
import { getSkillIcon } from "../../../constants/skillIcons";

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

function MarqueeRow({ skills, reverse = false, paused }) {
  // The list is rendered twice so the loop is seamless. The second copy is
  // aria-hidden so screen readers read each skill once, and it is removed
  // entirely for reduced-motion users, who get a static wrapped list instead.
  const items = [...skills, ...skills];

  return (
    <div className="marquee-row relative overflow-hidden py-4">

      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none motion-reduce:hidden" />
      <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none motion-reduce:hidden" />

      <ul
        className={`
          marquee-track flex items-center gap-10 md:gap-14 w-max
          ${reverse ? "animate-marquee-reverse" : "animate-marquee"}
          ${paused ? "is-paused" : ""}
          motion-reduce:w-full motion-reduce:flex-wrap
          motion-reduce:justify-center motion-reduce:gap-y-4 motion-reduce:px-6
        `}
      >
        {items.map((skill, i) => {
          const Icon = skill.icon || FaCode;
          const isCopy = i >= skills.length;

          return (
            <li
              key={`${skill.name}-${i}`}
              aria-hidden={isCopy || undefined}
              className={`flex items-center gap-3 shrink-0 ${isCopy ? "motion-reduce:hidden" : ""}`}
            >
              <span className={`text-2xl md:text-3xl ${skill.color} transition-transform duration-300`} aria-hidden="true">
                <Icon />
              </span>
              <span className="text-slate-400 text-base md:text-lg font-medium whitespace-nowrap">
                {skill.name}
              </span>
            </li>
          );
        })}
      </ul>

    </div>
  );
}

function SkillsShell({ children }) {
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
        <div data-aos="fade-up" className="text-center mb-16 px-6">

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

        {children}

      </div>

    </section>
  );
}

function Skills() {
  const { skills, loading, error } = useSkills();
  const [paused, setPaused] = useState(false);

  if (loading) {
    return (
      <SkillsShell>
        <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 px-6" aria-busy="true" aria-label="Loading skills">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-lg bg-white/[0.05]" />
              <div className="h-5 w-20 rounded-lg bg-white/[0.05]" />
            </div>
          ))}
        </div>
      </SkillsShell>
    );
  }

  if (error) {
    return (
      <SkillsShell>
        <div className="text-center px-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
            <span className="text-red-400"><HiOutlineExclamationTriangle /></span>
            <span className="text-red-300 text-sm font-medium">{error}</span>
          </div>
        </div>
      </SkillsShell>
    );
  }

  if (skills.length === 0) {
    return (
      <SkillsShell>
        <p className="text-center text-slate-400 px-6">No skills listed yet.</p>
      </SkillsShell>
    );
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
    <SkillsShell>

      {/* Marquee rows */}
      <div className="space-y-2">
        <MarqueeRow skills={row1} paused={paused} />
        {row2.length > 0 && <MarqueeRow skills={row2} reverse paused={paused} />}
      </div>

      {/* The rows move for longer than 5 seconds, so they need a pause control
          that works without a mouse (hover-to-pause alone doesn't). Hidden for
          reduced-motion users, whose rows don't move at all. */}
      <div className="flex justify-center mt-6 px-6 motion-reduce:hidden">
        <button
          type="button"
          onClick={() => setPaused((value) => !value)}
          className="
            inline-flex items-center gap-2 min-h-11 px-4 rounded-xl
            text-sm font-medium text-slate-300
            bg-white/[0.04] border border-white/[0.1]
            hover:bg-white/[0.1] hover:border-white/20 hover:text-white
            active:bg-white/[0.14]
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400
            transition-colors duration-200
          "
        >
          {paused ? <HiPlay aria-hidden="true" /> : <HiPause aria-hidden="true" />}
          {paused ? "Resume scrolling" : "Pause scrolling"}
        </button>
      </div>

    </SkillsShell>
  );
}

export default Skills;
