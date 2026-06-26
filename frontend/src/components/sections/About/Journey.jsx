import Container from "../../ui/Container";
import JourneyItem from "./JourneyItem";

const milestones = [
  {
    year: "2022",
    title: "Started Learning Web Development",
    description: "Took the first step into the world of programming and web technologies.",
    icon: "🚀",
  },
  {
    year: "2023",
    title: "Built My First Web Project",
    description: "Turned knowledge into action — shipped a real project from scratch.",
    icon: "💻",
  },
  {
    year: "2024",
    title: "Chairman of HMTI",
    description: "Led the student organization, sharpening leadership and management skills.",
    icon: "👑",
  },
  {
    year: "2025",
    title: "Building Full Stack Applications",
    description: "Mastering both frontend and backend to deliver end-to-end solutions.",
    icon: "⚡",
  },
  {
    year: "2026",
    title: "Project Aurora",
    description: "Pursuing the next big milestone — pushing boundaries and building the future.",
    icon: "✨",
  },
];

function Journey() {
  return (
    <div className="relative bg-slate-50 py-32 overflow-hidden">

      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 rounded-full bg-blue-100/60 blur-[100px]" />
      <div className="absolute bottom-20 left-0 w-80 h-80 rounded-full bg-cyan-100/60 blur-[100px]" />

      <Container>

        {/* Section header */}
        <div className="text-center mb-20">

          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-50 border border-blue-100 mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-sm text-blue-600 font-medium tracking-wider uppercase">
              Timeline
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            My Journey
          </h2>

          <p className="mt-4 text-lg text-slate-500 max-w-lg mx-auto">
            Key milestones that shaped my path in tech and leadership.
          </p>

        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">

          {/* Center line */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-200 via-blue-400 to-cyan-300 rounded-full" />

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