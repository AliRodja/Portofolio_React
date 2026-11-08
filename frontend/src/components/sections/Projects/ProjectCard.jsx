import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { ExternalLink } from "lucide-react";
import DescriptionModal from "../../ui/DescriptionModal";

const DESCRIPTION_LIMIT = 140;

const STATUS_LABEL = { completed: "Completed", in_progress: "In progress" };

function ProjectCard({ project }) {
  const [imageError, setImageError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const isLongDescription = project.description && project.description.length > DESCRIPTION_LIMIT;

  return (
    <article
      className="
        h-full flex flex-col
        rounded-xl overflow-hidden
        bg-white border border-zinc-200
        hover:border-zinc-400
        transition-colors duration-200
      "
    >
      {/* Image */}
      <div className="relative h-48 shrink-0 bg-zinc-100 border-b border-zinc-200">
        {project.image_url && !imageError ? (
          <img
            src={project.image_url}
            alt={project.title}
            width={640}
            height={384}
            loading="lazy"
            draggable={false}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <p className="w-full h-full flex items-center justify-center text-sm text-zinc-600">
            No preview image
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {(project.category || project.status) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {project.category && (
              <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-800">
                {project.category}
              </span>
            )}
            {project.status && (
              <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                {STATUS_LABEL[project.status] || project.status}
              </span>
            )}
          </div>
        )}

        <h3 className="font-display text-xl font-bold leading-snug text-ink">
          {project.title}
        </h3>

        <p className="mt-3 text-zinc-600 leading-relaxed line-clamp-3">
          {project.description}
        </p>

        {isLongDescription && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="self-start inline-flex items-center min-h-11 text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline focus-visible:outline-2 focus-visible:outline-blue-700 rounded"
          >
            Read more
          </button>
        )}

        {project.tech_stack && project.tech_stack.length > 0 && (
          <ul className="flex flex-wrap gap-2 mt-5 mb-6" aria-label="Tech stack">
            {project.tech_stack.map((tech) => (
              <li key={tech} className="rounded-md bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700">
                {tech}
              </li>
            ))}
          </ul>
        )}

        {/* Links. No date here: the only date stored is created_at (when the
            row was added), not when the project happened; the real year is
            already in the description. */}
        {(project.repo_link || project.demo_link) && (
          <div className="flex items-center gap-3 mt-auto pt-5 border-t border-zinc-200">
            {project.repo_link && (
              <a
                href={project.repo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center gap-2
                  min-h-11 min-w-11 px-4 rounded-lg
                  border border-zinc-300 text-sm font-medium text-ink
                  hover:border-ink hover:bg-zinc-100 active:bg-zinc-200
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700
                  transition-colors duration-200
                "
              >
                <FaGithub aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Code</span>
              </a>
            )}

            {project.demo_link && (
              <a
                href={project.demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center justify-center gap-2
                  min-h-11 min-w-11 px-4 rounded-lg
                  bg-ink text-sm font-medium text-white
                  hover:bg-zinc-800 active:bg-black
                  focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700
                  transition-colors duration-200
                "
              >
                <ExternalLink className="size-4" aria-hidden="true" />
                <span className="sr-only sm:not-sr-only">Demo</span>
              </a>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <DescriptionModal
          title={project.title}
          subtitle={project.category}
          description={project.description}
          onClose={() => setShowModal(false)}
        />
      )}
    </article>
  );
}

export default ProjectCard;
