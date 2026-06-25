import { useEffect, useState } from "react";

import api from "../../services/api";

import Container from "../ui/Container";
import SectionTitle from "../ui/SectionTitle";
import Card from "../ui/Card";

function Stats() {

    const [stats, setStats] = useState(null);

    useEffect(() => {

        api.get("/stats")
            .then((res) => {

                setStats(res.data);

            })
            .catch(console.error);

    }, []);

    if (!stats) {

        return null;

    }

    const data = [

        {
            number: `${stats.projects}+`,
            title: "Projects"
        },

        {
            number: `${stats.skills}+`,
            title: "Skills"
        },

        {
            number: `${stats.experiences}+`,
            title: "Experience"
        },

        {
            number: `${stats.certificates}+`,
            title: "Certificates"
        }

    ];

    return (

        <section
            id="stats"
            className="py-28 bg-white"
        >

            <Container>

                <SectionTitle
                    title="Quick Overview"
                    subtitle="Portfolio"
                    center
                />

                <div
                    className="
                        grid
                        grid-cols-2
                        lg:grid-cols-4
                        gap-6
                    "
                >

                    {

                        data.map((item) => (

                            <Card
                                key={item.title}
                                className="text-center"
                            >

                                <h3
                                    className="
                                        text-5xl
                                        font-bold
                                        text-blue-600
                                    "
                                >

                                    {item.number}

                                </h3>

                                <p
                                    className="
                                        mt-4
                                        text-slate-600
                                        font-medium
                                    "
                                >

                                    {item.title}

                                </p>

                            </Card>

                        ))

                    }

                </div>

            </Container>

        </section>

    );

}

export default Stats;