import { useState } from "react";
import {
  HiOutlineExclamationTriangle,
  HiOutlineWrenchScrewdriver,
  HiOutlineChevronDown,
} from "react-icons/hi2";
import Container from "../../ui/Container";
import ProjectCard from "./ProjectCard";
import useProjects from "../../../hooks/useProjects";

function Projects() {
  const { projects, loading, error } = useProjects();
  const [showAll, setShowAll] = useState(false);

  // Show first 4 by default, or all if "Show All" is clicked
  const INITIAL_COUNT = 4;
  const displayedProjects = showAll
    ? projects
    : projects.slice(0, INITIAL_COUNT);
  const hasMore = projects.length > INITIAL_COUNT;

  if (loading) {
    return (
      <section id="projects" className="relative py-32 bg-slate-900 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[140px]" />
          <div className="absolute bottom-20 -right-32 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px]" />
        </div>

        <Container className="relative z-10">
          {/* Skeleton loaders */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-sm text-blue-300 font-medium tracking-wider uppercase">
                Loading Projects
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden animate-pulse"
              >
                <div className="h-56 md:h-64 bg-white/[0.05]" />
                <div className="p-6 md:p-7 space-y-4">
                  <div className="h-6 w-2/3 bg-white/[0.05] rounded-lg" />
                  <div className="h-4 w-full bg-white/[0.04] rounded-lg" />
                  <div className="h-4 w-4/5 bg-white/[0.04] rounded-lg" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-7 w-16 bg-white/[0.04] rounded-lg" />
                    <div className="h-7 w-20 bg-white/[0.04] rounded-lg" />
                    <div className="h-7 w-14 bg-white/[0.04] rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="relative py-32 bg-slate-900 overflow-hidden">
        <Container className="relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
              <span className="text-red-400"><HiOutlineExclamationTriangle /></span>
              <span className="text-red-300 text-sm font-medium">{error}</span>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      id="projects"
      className="relative py-32 bg-slate-900 overflow-hidden"
    >
      {/* ── Background decorations ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[140px]" />
        <div className="absolute bottom-40 -right-32 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-cyan-500/3 blur-[180px]" />
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
        {/* ── Section Header ── */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-sm text-indigo-300 font-medium tracking-wider uppercase">
              Featured Projects
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Some Things I've
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Built
            </span>
          </h2>

          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            A collection of projects I've worked on — from full-stack web apps to
            creative experiments.
          </p>
        </div>

        {/* ── Project count badge ── */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-sm text-slate-400">
            <span className="font-bold text-white">{projects.length}</span>
            <span>projects in total</span>
          </div>
        </div>

        {/* ── Projects Grid ── */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {displayedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>

        {/* ── Show All / Show Less button ── */}
        {hasMore && (
          <div className="text-center mt-14">
            <button
              onClick={() => setShowAll(!showAll)}
              className="
                inline-flex items-center gap-3
                px-8 py-4 rounded-xl
                bg-white/[0.03] border border-white/[0.08]
                text-slate-300 font-semibold
                hover:bg-white/[0.06] hover:border-white/[0.15] hover:text-white
                hover:-translate-y-1
                transition-all duration-300
                backdrop-blur-sm
                group
              "
            >
              <span>
                {showAll ? "Show Less" : `Show All Projects (${projects.length})`}
              </span>
              <span
                className={`
                  transition-transform duration-300
                  ${showAll ? "rotate-180" : ""}
                  group-hover:translate-y-0.5
                `}
              >
                <HiOutlineChevronDown />
              </span>
            </button>
          </div>
        )}

        {/* ── Empty state ── */}
        {projects.length === 0 && (
          <div className="text-center py-20">
            <div className="flex justify-center text-6xl text-slate-600 mb-6"><HiOutlineWrenchScrewdriver /></div>
            <h3 className="text-2xl font-bold text-white mb-3">
              No Projects Yet
            </h3>
            <p className="text-slate-400 max-w-md mx-auto">
              Projects are coming soon. Stay tuned for some awesome work!
            </p>
          </div>
        )}
      </Container>
    </section>
  );
}

export default Projects;