import { useEffect, useRef, useState } from "react";

import api from "../../services/api";
import Container from "../ui/Container";
import Reveal from "../ui/Reveal";

// Exact numbers from the database, shown as-is: no "+" (it implied "more than").
// experience_years is whole years across all experiences, rounded down by
// the API (owner's choice, 2026-11-08), so it never overstates.
// Kept as a bar under the Hero by the owner's choice (DESIGN.md, exceptions).
const ITEMS = [
  { key: "projects", title: "Projects" },
  { key: "skills", title: "Skills" },
  { key: "experience_years", title: "Years of Experience", singular: "Year of Experience" },
  { key: "certificates", title: "Certificates" },
];

const labelFor = (item, value) => (value === 1 && item.singular) || item.title;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Counts from 0 up to the real value when the bar scrolls into view, ending
// exactly on the database number. Screen readers get the final value only.
function CountUp({ value }) {
  const ref = useRef(null);
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    if (prefersReducedMotion()) return undefined;

    let frame = 0;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();

      const start = performance.now();
      const duration = 1100;
      const tick = (now) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - progress) ** 4;
        setDisplay(Math.round(eased * value));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    // Start as soon as any part of the number is on screen, so nobody is
    // left looking at a "0" that isn't the real count.
    }, { threshold: 0 });

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <>
      <span ref={ref} aria-hidden="true">{display}</span>
      <span className="sr-only">{value}</span>
    </>
  );
}

// The bar sits on the seam between the white Hero and the dark About band:
// the section's background is half white, half ink.
function StatsShell({ children }) {
  return (
    <section
      id="stats"
      aria-label="Overview"
      className="bg-[linear-gradient(to_bottom,#ffffff_50%,var(--color-ink)_50%)]"
    >
      <Container>
        <Reveal className="mx-auto max-w-3xl rounded-2xl bg-white border border-zinc-200 shadow-[0_12px_32px_-12px_rgba(17,17,19,0.25)]">
          {children}
        </Reveal>
      </Container>
    </section>
  );
}

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/stats")
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error(err);
        setError("The overview couldn't be loaded.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <StatsShell>
        <div className="flex justify-around gap-4 px-6 py-6 animate-pulse" aria-busy="true">
          <span className="sr-only">Loading overview</span>
          {ITEMS.slice(0, 3).map((item) => (
            <div key={item.key} className="flex items-center gap-3">
              <div className="h-9 w-10 rounded-lg bg-zinc-200" />
              <div className="h-4 w-16 rounded-lg bg-zinc-100" />
            </div>
          ))}
        </div>
      </StatsShell>
    );
  }

  if (error) {
    return (
      <StatsShell>
        <p className="px-6 py-6 text-center text-sm text-red-700">{error}</p>
      </StatsShell>
    );
  }

  // A zero count is not a statistic worth showing ("0 Certificates").
  const data = ITEMS.filter((item) => Number(stats?.[item.key]) > 0);

  if (data.length === 0) return null;

  return (
    <StatsShell>
      <dl className="flex divide-x divide-zinc-200">
        {data.map((item) => (
          <div
            key={item.key}
            className="flex-1 flex flex-col sm:flex-row items-center justify-start sm:justify-center gap-1 sm:gap-3 px-3 py-5 sm:py-6"
          >
            {/* dt must come first in the DOM; `order` shows the number first.
                On phones a two-line label stays centred and the numbers stay
                on one line, because cells line up from the top. */}
            <dt className="order-2 text-center sm:text-left text-sm text-zinc-600">
              {labelFor(item, Number(stats[item.key]))}
            </dt>
            <dd className="order-1 font-display text-3xl sm:text-4xl font-bold text-ink tabular-nums">
              <CountUp value={Number(stats[item.key])} />
            </dd>
          </div>
        ))}
      </dl>
    </StatsShell>
  );
}

export default Stats;
