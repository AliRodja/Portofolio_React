import { useState } from "react";
import { FaGithub, FaExternalLinkAlt, FaCalendarAlt } from "react-icons/fa";
import { HiOutlineArrowUpRight, HiOutlineRocketLaunch } from "react-icons/hi2";

function ProjectCard({ project, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <div
      className="
        group relative
        rounded-2xl
        bg-white/[0.03] border border-white/[0.06]
        backdrop-blur-sm
        overflow-hidden
        hover:bg-white/[0.05] hover:border-white/10
        hover:-translate-y-2
        transition-all duration-500
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 150}ms`,
      }}
    >
      {/* ── Image Section ── */}
      <div className="relative overflow-hidden h-56 md:h-64">
        {/* Image */}
        {project.image_url && !imageError ? (
          <img
            src={project.image_url}
            alt={project.title}
            className="
              w-full h-full object-cover
              group-hover:scale-110
              transition-transform duration-700 ease-out
            "
            onError={() => setImageError(true)}
          />
        ) : (
          /* Placeholder gradient when no image */
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 via-indigo-500/15 to-cyan-500/20 flex items-center justify-center">
            <HiOutlineRocketLaunch className="text-5xl text-white opacity-40" />
          </div>
        )}

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent" />

        {/* Hover overlay with quick-action links */}
        <div
          className={`
            absolute inset-0
            bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent
            flex items-center justify-center gap-4
            transition-all duration-400
            ${isHovered ? "opacity-100" : "opacity-0"}
          `}
        >
          {project.repo_link && (
            <a
              href={project.repo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-12 h-12 rounded-xl
                bg-white/10 border border-white/20
                backdrop-blur-md
                flex items-center justify-center
                text-white text-lg
                hover:bg-white/20 hover:border-white/30
                hover:scale-110
                transition-all duration-300
              "
              aria-label="View source code on GitHub"
            >
              <FaGithub />
            </a>
          )}

          {project.demo_link && (
            <a
              href={project.demo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-12 h-12 rounded-xl
                bg-white/10 border border-white/20
                backdrop-blur-md
                flex items-center justify-center
                text-white text-lg
                hover:bg-white/20 hover:border-white/30
                hover:scale-110
                transition-all duration-300
              "
              aria-label="View live demo"
            >
              <HiOutlineArrowUpRight />
            </a>
          )}
        </div>

        {/* Category badge floating top-left */}
        {project.category && (
          <div className="absolute top-4 left-4 z-10">
            <span
              className="
                px-3 py-1.5 rounded-full
                bg-blue-500/20 border border-blue-400/30
                backdrop-blur-md
                text-xs font-semibold text-blue-300
                uppercase tracking-wider
              "
            >
              {project.category}
            </span>
          </div>
        )}

        {/* Status indicator top-right */}
        {project.status && (
          <div className="absolute top-4 right-4 z-10">
            <span
              className={`
                inline-flex items-center gap-1.5
                px-3 py-1.5 rounded-full
                backdrop-blur-md
                text-xs font-medium tracking-wide
                ${
                  project.status === "completed"
                    ? "bg-emerald-500/20 border border-emerald-400/30 text-emerald-300"
                    : project.status === "in_progress"
                    ? "bg-amber-500/20 border border-amber-400/30 text-amber-300"
                    : "bg-slate-500/20 border border-slate-400/30 text-slate-300"
                }
              `}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  project.status === "completed"
                    ? "bg-emerald-400"
                    : project.status === "in_progress"
                    ? "bg-amber-400 animate-pulse"
                    : "bg-slate-400"
                }`}
              />
              {project.status === "completed"
                ? "Completed"
                : project.status === "in_progress"
                ? "In Progress"
                : project.status}
            </span>
          </div>
        )}
      </div>

      {/* ── Content Section ── */}
      <div className="p-6 md:p-7">
        {/* Title */}
        <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-blue-300 transition-colors duration-300">
          {project.title}
        </h3>

        {/* Description */}
        <p className="mt-3 text-slate-400 leading-relaxed text-sm md:text-base line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack */}
        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-5">
            {project.tech_stack.map((tech) => (
              <span
                key={tech}
                className="
                  px-3 py-1 rounded-lg
                  bg-white/[0.04] border border-white/[0.08]
                  text-xs font-medium text-slate-300
                  group-hover:bg-white/[0.08] group-hover:border-white/[0.12]
                  transition-all duration-300
                "
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        {/* Footer — Date + Links */}
        <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/[0.06]">
          {/* Date */}
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <FaCalendarAlt className="text-[10px]" />
            <span>{formatDate(project.created_at) || "Recent"}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {project.repo_link && (
              <a
                href={project.repo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-lg
                  bg-white/[0.04] border border-white/[0.08]
                  text-sm text-slate-300 font-medium
                  hover:bg-white/[0.10] hover:border-white/[0.15] hover:text-white
                  transition-all duration-300
                "
              >
                <FaGithub className="text-sm" />
                <span className="hidden sm:inline">Code</span>
              </a>
            )}

            {project.demo_link && (
              <a
                href={project.demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-2
                  px-4 py-2 rounded-lg
                  bg-gradient-to-r from-blue-500/20 to-cyan-500/20
                  border border-blue-400/20
                  text-sm text-blue-300 font-medium
                  hover:from-blue-500/30 hover:to-cyan-500/30
                  hover:border-blue-400/40 hover:text-blue-200
                  transition-all duration-300
                "
              >
                <FaExternalLinkAlt className="text-xs" />
                <span className="hidden sm:inline">Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-24 h-[2px] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500" />
    </div>
  );
}

export default ProjectCard;