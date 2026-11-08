import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import SERVICES from "../../../constants/services";
import { parseRichText } from "../../../utils/text";
import Reveal from "../../ui/Reveal";

// Split the profile's About text into lead paragraphs and point lists. A
// paragraph ending in ":" right before a list ("What I bring to a team:") is
// that list's heading.
function splitAbout(text) {
  const blocks = parseRichText(text);
  const paragraphs = [];
  const lists = [];

  blocks.forEach((block, i) => {
    const next = blocks[i + 1];

    if (block.type === "paragraph" && block.text.endsWith(":") && next?.type === "list" && !next.heading) {
      next.heading = block.text.replace(/:$/, "");
    } else if (block.type === "paragraph") {
      paragraphs.push(block.text);
    } else {
      lists.push({ ...block, heading: block.heading?.replace(/:$/, "") || null });
    }
  });

  return { paragraphs, lists };
}

function NumberedList({ heading, items }) {
  return (
    <div>
      {heading && (
        <h3 className="font-display text-xl md:text-2xl font-bold text-white">{heading}</h3>
      )}
      <Reveal as="ol" variant="group" stagger={120} className="mt-6 divide-y divide-zinc-800 border-y border-zinc-800">
        {items.map((item, i) => (
          <li key={i} className="flex gap-5 py-5">
            <span aria-hidden="true" className="font-display text-sm font-bold text-blue-400 pt-1">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-zinc-300 leading-7">{item}</span>
          </li>
        ))}
      </Reveal>
    </div>
  );
}

function ServiceList() {
  return (
    <div>
      <h3 className="font-display text-xl md:text-2xl font-bold text-white">Services</h3>
      <Reveal as="ul" variant="group" stagger={120} className="mt-6 divide-y divide-zinc-800 border-y border-zinc-800">
        {SERVICES.map(({ icon: Icon, title, description }) => (
          <li key={title} className="flex gap-4 py-5">
            <span aria-hidden="true" className="w-11 h-11 shrink-0 rounded-xl border border-zinc-700 flex items-center justify-center text-lg text-blue-400">
              <Icon className="size-4.5" />
            </span>
            <span>
              <span className="block font-semibold text-white">{title}</span>
              <span className="block mt-1 text-zinc-400 leading-7">{description}</span>
            </span>
          </li>
        ))}
      </Reveal>
    </div>
  );
}

function About({ profile, error }) {
  const { paragraphs, lists } = splitAbout(profile?.about);

  const facts = [
    { label: "Based in", value: profile?.location },
    // "A | B" headlines read better as "A · B" in a wrapped line.
    { label: "Focus area", value: profile?.headline?.split("|").map((part) => part.trim()).filter(Boolean).join(" · ") },
  ].filter((fact) => fact.value);

  return (
    <section id="about" className="bg-ink text-white py-24 md:py-28">
      <Container>
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20">

          {/* Left: who */}
          <div>
            <SectionHeading dark before="About" highlight="me" />

            <Reveal variant="group" delay={100}>
              {!profile && !error && (
                <div aria-busy="true" className="mt-8 space-y-3 animate-pulse">
                  <span className="sr-only">Loading</span>
                  <div className="h-4 w-full rounded-lg bg-zinc-800" />
                  <div className="h-4 w-4/5 rounded-lg bg-zinc-800" />
                </div>
              )}

              {!profile && error && (
                <p className="mt-8 text-zinc-400">
                  This section couldn&apos;t be loaded. Use &ldquo;Try again&rdquo; at the top of the page.
                </p>
              )}

              {paragraphs.map((text, i) => (
                <p key={i} className="mt-6 text-lg leading-8 text-zinc-400">{text}</p>
              ))}

              {facts.length > 0 && (
                <dl className="mt-10 grid sm:grid-cols-2 gap-6">
                  {facts.map((fact) => (
                    <div key={fact.label} className="border-l-2 border-blue-400 pl-4">
                      <dt className="text-sm text-zinc-400">{fact.label}</dt>
                      <dd className="mt-1 font-semibold text-white leading-snug">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {/* With Services on the right, the About text's point lists
                  ("What I bring to a team") stay here instead of disappearing. */}
              {SERVICES.length > 0 && lists.map((list, i) => (
                <div key={i} className="mt-12">
                  <NumberedList heading={list.heading} items={list.items} />
                </div>
              ))}
            </Reveal>
          </div>

          {/* Right: what I offer. Services once the owner has listed them;
              until then, the point lists from the About text. */}
          <Reveal variant="fade" delay={150} className="space-y-12">
            {SERVICES.length > 0 ? (
              <ServiceList />
            ) : (
              lists.map((list, i) => (
                <NumberedList key={i} heading={list.heading} items={list.items} />
              ))
            )}
          </Reveal>

        </div>
      </Container>
    </section>
  );
}

export default About;
