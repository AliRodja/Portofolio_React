import {
  HiOutlineRocketLaunch,
  HiOutlineCodeBracket,
  HiOutlineBriefcase,
  HiOutlineBolt,
  HiOutlineSparkles,
} from "react-icons/hi2";

import Container from "../../ui/Container";
import JourneyItem from "./JourneyItem";

const milestones = [
  {
    year: "2022",
    title: "Started Learning Web Development",
    description: "Took the first step into the world of programming and web technologies.",
    icon: <HiOutlineRocketLaunch />,
  },
  {
    year: "2023",
    title: "Built My First Web Project",
    description: "Turned knowledge into action — shipped a real project from scratch.",
    icon: <HiOutlineCodeBracket />,
  },
  {
    year: "2024",
    title: "Chairman of HMTI",
    description: "Led the student organization, sharpening leadership and management skills.",
    icon: <HiOutlineBriefcase />,
  },
  {
    year: "2025",
    title: "Building Full Stack Applications",
    description: "Mastering both frontend and backend to deliver end-to-end solutions.",
    icon: <HiOutlineBolt />,
  },
  {
    year: "2026",
    title: "Project Aurora",
    description: "Pursuing the next big milestone — pushing boundaries and building the future.",
    icon: <HiOutlineSparkles />,
  },
];

function Journey() {
  return (
    <div className="relative bg-slate-900 py-32 overflow-hidden">

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
              Timeline
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            My
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Journey
            </span>
          </h2>

          <p className="mt-4 text-lg text-slate-400 max-w-lg mx-auto">
            Key milestones that shaped my path in tech and leadership.
          </p>

        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">

          {/* Center line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/40 via-cyan-500/30 to-transparent rounded-full" />

          <div className="space-y-12 md:space-y-16">
            {milestones.map((m, i) => (
              <JourneyItem
                key={m.year}
                year={m.year}
                title={m.title}
                description={m.description}
                icon={m.icon}
                isLeft={i % 2 === 0}
                isLast={i === milestones.length - 1}
              />
            ))}
          </div>

        </div>

      </Container>

    </div>
  );
}

export default Journey;