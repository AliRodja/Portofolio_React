import { useEffect, useState } from "react";
import {
  HiOutlineRocketLaunch,
  HiOutlineCpuChip,
  HiOutlineBriefcase,
  HiOutlineTrophy,
  HiOutlineExclamationTriangle,
} from "react-icons/hi2";

import api from "../../services/api";
import Container from "../ui/Container";

// Exact counts from the database, shown as-is: no "+" (it implied "more than"),
// and "Roles" instead of "Experience" so 3 positions don't read as 3 years.
const ITEMS = [
  { key: "projects", title: "Projects", icon: <HiOutlineRocketLaunch /> },
  { key: "skills", title: "Skills", icon: <HiOutlineCpuChip /> },
  { key: "experiences", title: "Roles", icon: <HiOutlineBriefcase /> },
  { key: "certificates", title: "Certificates", icon: <HiOutlineTrophy /> },
];

// Static class names so Tailwind can see them.
const LG_COLS = ["", "lg:grid-cols-1", "lg:grid-cols-2", "lg:grid-cols-3", "lg:grid-cols-4"];

const CARD_CLASS = `
  group relative
  rounded-2xl p-6 md:p-8
  bg-white/[0.03] border border-white/[0.06]
  backdrop-blur-sm
  text-center
`;

function StatsShell({ children }) {
  return (
    <section id="stats" className="relative py-24 bg-slate-800/50 border-y border-white/5">

      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <Container className="relative z-10">

        {/* Section header */}
        <div data-aos="fade-up" className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm text-blue-300 font-medium tracking-wider uppercase">
              Portfolio
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Quick Overview
          </h2>
        </div>

        {children}

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
        setError("Failed to load the overview.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <StatsShell>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" aria-busy="true" aria-label="Loading overview">
          {ITEMS.map((item) => (
            <div key={item.key} className={`${CARD_CLASS} animate-pulse`}>
              <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white/[0.05]" />
              <div className="h-10 w-16 mx-auto rounded-lg bg-white/[0.05]" />
              <div className="h-4 w-20 mx-auto mt-3 rounded-lg bg-white/[0.04]" />
            </div>
          ))}
        </div>
      </StatsShell>
    );
  }

  if (error) {
    return (
      <StatsShell>
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
            <span className="text-red-400"><HiOutlineExclamationTriangle /></span>
            <span className="text-red-300 text-sm font-medium">{error}</span>
          </div>
        </div>
      </StatsShell>
    );
  }

  // A zero count is not a statistic worth showing ("0 Certificates").
  const data = ITEMS.filter((item) => Number(stats?.[item.key]) > 0);

  if (data.length === 0) {
    // Nothing to count yet: show no numbers, but keep the #stats anchor that
    // the Hero's scroll indicator points to.
    return <div id="stats" />;
  }

  return (
    <StatsShell>
      <div className={`grid grid-cols-2 ${LG_COLS[data.length]} gap-4 md:gap-6`}>
        {data.map((item, i) => (
          <div
            key={item.key}
            data-aos="fade-up"
            data-aos-delay={(i % 4) * 100}
            className={`
              ${CARD_CLASS}
              hover:bg-white/[0.06] hover:border-white/10
              hover:-translate-y-1
              transition-all duration-300
            `}
          >

            {/* Icon */}
            <div className="
              w-14 h-14 mx-auto mb-5
              rounded-2xl
              bg-gradient-to-br from-blue-500/10 to-cyan-500/10
              border border-blue-500/10
              flex items-center justify-center
              text-2xl text-blue-400
              group-hover:from-blue-500/20 group-hover:to-cyan-500/20
              group-hover:border-blue-500/20
              transition-all duration-300
            ">
              {item.icon}
            </div>

            {/* Number */}
            <h3 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {Number(stats[item.key])}
            </h3>

            {/* Title */}
            <p className="mt-3 text-slate-400 font-medium text-sm tracking-wide">
              {item.title}
            </p>

            {/* Bottom accent line on hover */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-12 h-[2px] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-300" />

          </div>
        ))}
      </div>
    </StatsShell>
  );
}

export default Stats;
