import {
  FaReact,
  FaNodeJs,
  FaLaravel,
  FaPhp,
  FaGitAlt,
  FaGithub,
  FaFigma,
  FaBootstrap,
} from "react-icons/fa";

import {
  SiNextdotjs,
  SiJavascript,
  SiTailwindcss,
  SiPostgresql,
  SiMysql,
  SiExpress,
} from "react-icons/si";

import { VscCode } from "react-icons/vsc";

const allSkills = [
  { name: "React", icon: <FaReact />, color: "text-cyan-400" },
  { name: "Next.js", icon: <SiNextdotjs />, color: "text-white" },
  { name: "JavaScript", icon: <SiJavascript />, color: "text-yellow-400" },
  { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "text-cyan-400" },
  { name: "Bootstrap", icon: <FaBootstrap />, color: "text-purple-400" },
  { name: "Node.js", icon: <FaNodeJs />, color: "text-green-400" },
  { name: "Express.js", icon: <SiExpress />, color: "text-slate-300" },
  { name: "Laravel", icon: <FaLaravel />, color: "text-red-400" },
  { name: "PHP", icon: <FaPhp />, color: "text-indigo-400" },
  { name: "PostgreSQL", icon: <SiPostgresql />, color: "text-blue-400" },
  { name: "MySQL", icon: <SiMysql />, color: "text-orange-400" },
  { name: "Git", icon: <FaGitAlt />, color: "text-orange-400" },
  { name: "GitHub", icon: <FaGithub />, color: "text-slate-300" },
  { name: "VS Code", icon: <VscCode />, color: "text-blue-400" },
  { name: "Figma", icon: <FaFigma />, color: "text-pink-400" },
];

// Split into two rows for visual variety
const row1 = allSkills.slice(0, 8);
const row2 = allSkills.slice(8);

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
        {items.map((skill, i) => (
          <div
            key={`${skill.name}-${i}`}
            className="flex items-center gap-3 shrink-0"
          >
            <span className={`text-2xl md:text-3xl ${skill.color} transition-transform duration-300`}>
              {skill.icon}
            </span>
            <span className="text-slate-400 text-base md:text-lg font-medium whitespace-nowrap">
              {skill.name}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}

function Skills() {
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
          <MarqueeRow skills={row2} reverse />
        </div>

      </div>

    </section>
  );
}

export default Skills;