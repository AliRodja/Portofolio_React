import Container from "../../ui/Container";
import SectionTitle from "../../ui/SectionTitle";

import useExperience from "../../../hooks/useExperience";
import ExperienceCard from "./ExperienceCard";

function Experience() {

    const {
        experiences,
        loading,
        error,
    } = useExperience();

    if (loading)
        return (
            <section className="py-28">
                <Container>

                    <p className="text-center">

                        Loading...

                    </p>

                </Container>
            </section>
        );

    if (error)
        return (
            <section className="py-28">
                <Container>

                    <p className="text-center text-red-500">

                        {error}

                    </p>

                </Container>
            </section>
        );

    return (
        <section
            id="experience"
            className="py-28 bg-white"
        >

            <Container>

                <SectionTitle
                    subtitle="Experience"
                    title="Leadership & Organization"
                    center
                />

                <div className="mt-16 space-y-8">

                    {experiences.map((experience) => (

                        <ExperienceCard
                            key={experience.id}
                            experience={experience}
                        />

                    ))}

                </div>

            </Container>

        </section>
    );
}

export default Experience;