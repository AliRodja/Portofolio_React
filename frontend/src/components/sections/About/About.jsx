import Story from "./Story";
import Quote from "./Quote";
import Journey from "./Journey";

function About({ profile }) {
  return (
    <section id="about" className="relative overflow-hidden">

      {/* Story — dark premium section */}
      <Story profile={profile} />

      {/* Quote — gradient accent band */}
      <Quote />

      {/* Journey — clean light section */}
      <Journey />

    </section>
  );
}

export default About;