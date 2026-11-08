import { TriangleAlert } from "lucide-react";

import useSkills from "../../../hooks/useSkills";
import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import Reveal from "../../ui/Reveal";
import { findSkillIcon } from "../../../constants/skillIcons";

// Group skills by their category, keeping the API's order (order_index) for
// both the categories and the skills inside them.
function groupByCategory(skills) {
  const groups = new Map();

  skills.forEach((skill) => {
    const category = skill.category?.trim() || "Other";
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push({ name: skill.name, icon: findSkillIcon(skill) });
  });

  return [...groups.entries()].map(([category, items]) => ({ category, items }));
}

function SkillsShell({ children }) {
  return (
    <section id="skills" className="bg-white py-24 md:py-28">
      <Container>
        <SectionHeading before="Tools I" highlight="work with" intro="Grouped by where I use them." />
        <div className="mt-12">{children}</div>
      </Container>
    </section>
  );
}

function Skills() {
  const { skills, loading, error } = useSkills();

  if (loading) {
    return (
      <SkillsShell>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 animate-pulse" aria-busy="true">
          <span className="sr-only">Loading skills</span>
          {[...Array(6)].map((_, i) => (
            <div key={i}>
              <div className="h-5 w-28 rounded-lg bg-zinc-200" />
              <div className="mt-4 flex flex-wrap gap-2">
                {[...Array(4)].map((__, j) => <div key={j} className="h-8 w-20 rounded-md bg-zinc-100" />)}
              </div>
            </div>
          ))}
        </div>
      </SkillsShell>
    );
  }

  if (error) {
    return (
      <SkillsShell>
        <p className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      </SkillsShell>
    );
  }

  if (skills.length === 0) {
    return (
      <SkillsShell>
        <p className="text-zinc-600">No skills listed yet.</p>
      </SkillsShell>
    );
  }

  return (
    <SkillsShell>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10">
        {groupByCategory(skills).map(({ category, items }, i) => (
          <Reveal key={category} delay={(i % 3) * 100} className="border-t border-zinc-200 pt-5">
            <h3 className="font-display text-lg font-bold text-ink">{category}</h3>
            <Reveal as="ul" variant="group" stagger={45} delay={150 + (i % 3) * 100} className="mt-4 flex flex-wrap gap-2">
              {items.map(({ name, icon: Icon }) => (
                <li
                  key={name}
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700"
                >
                  {/* Logos in ink, not brand colours: one palette (DESIGN.md).
                      Skills without a real logo (e.g. Midtrans) show none. */}
                  {Icon && <Icon aria-hidden="true" className="text-base text-ink shrink-0" />}
                  {name}
                </li>
              ))}
            </Reveal>
          </Reveal>
        ))}
      </div>
    </SkillsShell>
  );
}

export default Skills;
