import Container from "../../ui/Container";
// import profileImage from "../../../assets/images/profile.png";

function Story({ profile }) {

    return (

        <Container>
         <div className="max-w-5xl mx-auto text-center">

                <p
                    className="
                        uppercase
                        tracking-[0.35em]
                        text-blue-600
                        font-semibold
                    "
                >

                    The Story

                </p>

                <h2
                    className="
                        mt-6
                        text-5xl
                        md:text-6xl
                        lg:text-7xl
                        font-black
                        leading-none
                        tracking-tight
                        text-slate-900
                    "
                >

                    Behind

                    <br/>

                    The Code

                </h2>

        </div>

            <p
        className="
            mt-8
            text-xl
            leading-9
            md:text-2xl
            text-slate-500
            max-w-2xl
            mx-auto
        "
    >

        More than writing code,
        <br />

        I'm building solutions and growing as a leader.

    </p>

    {/* Story */}

    <div className="max-w-3xl mx-auto mt-16">

        <p
            className="
                mt-16
                text-lg
                md:text-xl
                leading-10
                text-slate-700
                max-w-3xl
                mx-auto
                text-center
                "
        >

            {profile.about}

        </p>

    </div>
    <div className="w-24 h-[2px] bg-blue-600 mx-auto mt-16 rounded-full"></div>


        </Container>

    );

}

export default Story;