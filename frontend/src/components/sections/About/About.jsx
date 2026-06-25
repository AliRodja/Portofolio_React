import Story from "./Story";

import Quote from "./Quote";
import Journey from "./Journey";

function About({ profile }) {
  return (
    <section id="about" className="bg-slate-50 py-28">
      <Story profile={profile} />

      <Quote />

      <Journey />
    </section>
  );
}

export default About;