import Container from "../../ui/Container";
import SectionTitle from "../../ui/SectionTitle";

import useEducation from "../../../hooks/useEducation";
import EducationCard from "./EducationCard";

function Education() {

    const {
        education,
        loading,
        error,
    } = useEducation();

    if (loading) {
        return (
            <section className="py-28">
                <Container>
                    <p className="text-center">Loading...</p>
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
            id="education"
            className="py-28 bg-slate-50"
        >

            <Container>

                <SectionTitle
                    subtitle="Education"
                    title="Academic Journey"
                    center
                />

                <div className="max-w-4xl mx-auto mt-16">

                    {education.map((item) => (
                        <EducationCard
                            key={item.id}
                            education={item}
                        />
                    ))}

                </div>

            </Container>

        </section>
    );
}

export default Education;