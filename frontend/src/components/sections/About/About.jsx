import Story from "./Story";
import Quote from "./Quote";

function About({ profile, error }) {
  return (
    <section id="about" className="relative overflow-hidden">

      {/* Story — dark premium section */}
      <Story profile={profile} error={error} />

      {/* Quote — gradient accent band */}
      <Quote />

    </section>
  );
}

export default About;