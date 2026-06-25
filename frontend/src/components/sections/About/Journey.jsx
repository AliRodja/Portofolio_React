import Container from "../../ui/Container";
import JourneyItem from "./JourneyItem";

function Journey() {

    return (

        <section className="py-32 bg-slate-50">

            <Container>

                <div className="text-center">

                    <p className="uppercase tracking-[0.3em] text-blue-600 font-semibold">

                        My Journey

                    </p>

                </div>

                <div className="mt-20 flex flex-col items-center gap-10">

                    <JourneyItem
                        year="2022"
                        title="Started Learning Web Development"
                    />

                    <JourneyItem
                        year="2023"
                        title="Built My First Web Project"
                    />

                    <JourneyItem
                        year="2024"
                        title="Chairman of HMTI"
                    />

                    <JourneyItem
                        year="2025"
                        title="Building Full Stack Applications"
                    />

                    <JourneyItem
                        year="2026"
                        title="Project Aurora"
                        last
                    />

                </div>

            </Container>

        </section>

    );

}

export default Journey;