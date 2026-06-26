import Container from "../../ui/Container";
import SectionTitle from "../../ui/SectionTitle";

import ProjectCard from "./ProjectCard";
import useProjects from "../../../hooks/useProjects";

function Projects() {
    const { projects, loading, error } = useProjects();

    if (loading) {
        return (
            <section className="py-28">
                <Container>
                    <p className="text-center text-slate-500">
                        Loading projects...
                    </p>
                </Container>
            </section>
        );
    }

    if (error) {
        return (
            <section className="py-28">
                <Container>
                    <p className="text-center text-red-500">
                        {error}
                    </p>
                </Container>
            </section>
        );
    }

    return (
        <section
            id="projects"
            className="py-28 bg-slate-50"
        >
            <Container>

                <SectionTitle
                    subtitle="Featured Projects"
                    title="Some Things I've Built"
                    center
                />

                <div className="grid lg:grid-cols-2 gap-8 mt-16">

                    {projects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                        />
                    ))}

                </div>

            </Container>
        </section>
    );
}

export default Projects;