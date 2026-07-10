import { useEffect, useState } from "react";
import {
  HiOutlineRocketLaunch,
  HiOutlineCpuChip,
  HiOutlineBriefcase,
  HiOutlineTrophy,
} from "react-icons/hi2";

import api from "../../services/api";
import Container from "../ui/Container";

const icons = [
  <HiOutlineRocketLaunch />,
  <HiOutlineCpuChip />,
  <HiOutlineBriefcase />,
  <HiOutlineTrophy />,
];

function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api
      .get("/stats")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, []);

  if (!stats) return null;

  const data = [
    { number: `${stats.projects}+`, title: "Projects", icon: icons[0] },
    { number: `${stats.skills}+`, title: "Skills", icon: icons[1] },
    { number: `${stats.experiences}+`, title: "Experience", icon: icons[2] },
    { number: `${stats.certificates}+`, title: "Certificates", icon: icons[3] },
  ];

  return (
    <section id="stats" className="relative py-24 bg-slate-800/50 border-y border-white/5">

      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-blue-500/5 blur-[120px]" />
      </div>

      <Container className="relative z-10">

        {/* Section header */}
        <div className="text-center mb-16">
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

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {data.map((item, i) => (
            <div
              key={item.title}
              className="
                group relative
                rounded-2xl p-6 md:p-8
                bg-white/[0.03] border border-white/[0.06]
                backdrop-blur-sm
                hover:bg-white/[0.06] hover:border-white/10
                hover:-translate-y-1
                transition-all duration-300
                text-center
              "
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
                {item.number}
              </h3>

              {/* Title */}
              <p className="mt-3 text-slate-500 font-medium text-sm tracking-wide">
                {item.title}
              </p>

              {/* Bottom accent line on hover */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-12 h-[2px] bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-300" />

            </div>
          ))}
        </div>

      </Container>

    </section>
  );
}

export default Stats;