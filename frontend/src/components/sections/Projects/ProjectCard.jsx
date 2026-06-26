function ProjectCard({ project }) {
    return (
        <div
            className="
        bg-white
        rounded-2xl
        overflow-hidden
        border
        border-slate-200
        shadow-sm
        transition-all
        duration-300
        hover:shadow-xl
        hover:-translate-y-2
      "
        >
            {/* Thumbnail */}
            <img
                src={project.image_url}
                alt={project.title}
                className="w-full h-56 object-cover"
            />

            {/* Content */}
            <div className="p-6">

                <span className="text-sm text-blue-600 font-medium">
                    {project.category}
                </span>

                <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    {project.title}
                </h3>

                <p className="mt-4 text-slate-600 leading-7">
                    {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mt-6">

                    {project.tech_stack?.map((tech) => (
                        <span
                            key={tech}
                            className="
                px-3
                py-1
                rounded-full
                bg-slate-100
                text-sm
                text-slate-700
              "
                        >
                            {tech}
                        </span>
                    ))}

                </div>

                {/* Button */}
                <div className="flex gap-3 mt-8">

                    {project.repo_link && (
                        <a
                            href={project.repo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                px-4
                py-2
                rounded-lg
                bg-slate-900
                text-white
                hover:bg-slate-700
                transition
              "
                        >
                            GitHub
                        </a>
                    )}

                    {project.demo_link && (
                        <a
                            href={project.demo_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                px-4
                py-2
                rounded-lg
                border
                border-slate-300
                hover:border-blue-600
                hover:text-blue-600
                transition
              "
                        >
                            Live Demo
                        </a>
                    )}

                </div>

            </div>
        </div>
    );
}

export default ProjectCard;