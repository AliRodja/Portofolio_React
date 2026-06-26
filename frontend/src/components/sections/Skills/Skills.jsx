import Container from "../../ui/Container";
import SkillBadge from "./SkillBadge";

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

const skillCategories = [
  {
    title: "Frontend",
    emoji: "🎨",
    skills: [
      { name: "React", icon: <FaReact />, color: "text-cyan-400" },
      { name: "Next.js", icon: <SiNextdotjs />, color: "text-white" },
      { name: "JavaScript", icon: <SiJavascript />, color: "text-yellow-400" },
      { name: "Tailwind CSS", icon: <SiTailwindcss />, color: "text-cyan-400" },
      { name: "Bootstrap", icon: <FaBootstrap />, color: "text-purple-400" },
    ],
  },
  {
    title: "Backend",
    emoji: "⚙️",
    skills: [
      { name: "Node.js", icon: <FaNodeJs />, color: "text-green-400" },
      { name: "Express.js", icon: <SiExpress />, color: "text-slate-300" },
      { name: "Laravel", icon: <FaLaravel />, color: "text-red-400" },
      { name: "PHP", icon: <FaPhp />, color: "text-indigo-400" },
    ],
  },
  {
    title: "Database",
    emoji: "🗄️",
    skills: [
      { name: "PostgreSQL", icon: <SiPostgresql />, color: "text-blue-400" },
      { name: "MySQL", icon: <SiMysql />, color: "text-orange-400" },
    ],
  },
  {
    title: "Tools",
    emoji: "🛠️",
    skills: [
      { name: "Git", icon: <FaGitAlt />, color: "text-orange-400" },
      { name: "GitHub", icon: <FaGithub />, color: "text-slate-300" },
      { name: "VS Code", icon: <VscCode />, color: "text-blue-400" },
      { name: "Figma", icon: <FaFigma />, color: "text-pink-400" },
    ],
  },
];

function Skills() {
  return (
    <section id="skills" className="relative py-32 bg-slate-900 overflow-hidden">

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

      <Container className="relative z-10">

        {/* Section header */}
        <div className="text-center mb-20">
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

        {/* Skill categories grid */}
        <div className="grid md:grid-cols-2 gap-6">

          {skillCategories.map((category) => (

            <div
              key={category.title}
              className="
                group
                rounded-2xl p-8
                bg-white/[0.03] border border-white/[0.06]
                backdrop-blur-sm
                hover:bg-white/[0.05] hover:border-white/10
                transition-all duration-300
              "
            >

              {/* Category header */}
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">{category.emoji}</span>
                <h3 className="text-lg font-semibold text-white tracking-wide">
                  {category.title}
                </h3>
                <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
              </div>

              {/* Skill badges */}
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill) => (
                  <SkillBadge
                    key={skill.name}
                    icon={skill.icon}
                    name={skill.name}
                    color={skill.color}
                  />
                ))}
              </div>

            </div>

          ))}

        </div>

      </Container>

    </section>
  );
}

export default Skills;