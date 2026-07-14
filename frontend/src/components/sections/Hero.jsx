import profileImage from "../../assets/images/profile.png";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";
// import { HiArrowDown } from "react-icons/hi2";

import Container from "../ui/Container";
import Button from "../ui/Button";

function Hero({ profile }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 bg-slate-900 flex items-center overflow-hidden"
    >

      {/* ── Background decorations ── */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left glow */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500/8 blur-[140px] animate-pulse-glow" />
        {/* Center glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-indigo-500/5 blur-[180px]" />
        {/* Bottom-right glow */}
        <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[120px] animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Content ── */}
      <Container className="relative z-10 w-full">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* ── LEFT — Text ── */}
          <div>

            {/* Tag */}
            <div
              data-aos="fade-down"
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-slate-300 font-medium">
                Available for work
              </span>
            </div>

            {/* Name */}
            <h1
              data-aos="fade-up"
              data-aos-delay="100"
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-white"
            >
              {profile.full_name?.split(" ").map((word, i, arr) =>
                i === arr.length - 1 ? (
                  <span key={i}>
                    <br className="hidden sm:block" />
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {word}
                    </span>
                  </span>
                ) : (
                  <span key={i}>{word} </span>
                )
              )}
            </h1>

            {/* Headline */}
            <h2
              data-aos="fade-up"
              data-aos-delay="200"
              className="text-xl lg:text-2xl text-slate-400 mt-6 font-light"
            >
              {profile.headline}
            </h2>

            {/* Short intro */}
            <p
              data-aos="fade-up"
              data-aos-delay="300"
              className="mt-8 leading-8 text-slate-400 max-w-xl"
            >
              {profile.short_bio}
            </p>

            {/* Buttons */}
            <div
              data-aos="fade-up"
              data-aos-delay="400"
              className="flex flex-wrap gap-4 mt-10"
            >

              <Button href="#projects">
                View Projects
              </Button>

              {profile.resume_url && (
                <Button
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="secondary"
                >
                  Download CV
                </Button>
              )}

            </div>

            {/* Social icons */}
            <div
              data-aos="fade-up"
              data-aos-delay="500"
              className="flex gap-5 mt-10"
            >

              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  aria-label="GitHub"
                  rel="noopener noreferrer"
                  className="
                    w-12 h-12 rounded-xl
                    bg-white/5 border border-white/10
                    flex items-center justify-center
                    text-xl text-slate-400
                    hover:text-white hover:bg-white/10 hover:border-white/20
                    hover:-translate-y-1
                    transition-all duration-300
                  "
                >
                  <FaGithub />
                </a>
              )}

              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  aria-label="LinkedIn"
                  rel="noopener noreferrer"
                  className="
                    w-12 h-12 rounded-xl
                    bg-white/5 border border-white/10
                    flex items-center justify-center
                    text-xl text-slate-400
                    hover:text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/30
                    hover:-translate-y-1
                    transition-all duration-300
                  "
                >
                  <FaLinkedin />
                </a>
              )}

              {profile.instagram_url && (
                <a
                  href={profile.instagram_url}
                  target="_blank"
                  aria-label="Instagram"
                  rel="noopener noreferrer"
                  className="
                    w-12 h-12 rounded-xl
                    bg-white/5 border border-white/10
                    flex items-center justify-center
                    text-xl text-slate-400
                    hover:text-pink-400 hover:bg-pink-500/10 hover:border-pink-500/30
                    hover:-translate-y-1
                    transition-all duration-300
                  "
                >
                  <FaInstagram />
                </a>
              )}

            </div>

          </div>

          {/* ── RIGHT — Profile image ── */}
          <div
            data-aos="zoom-in"
            data-aos-delay="200"
            className="relative flex justify-center items-center"
          >

            {/* Outer glow ring */}
            <div className="absolute w-[340px] h-[340px] lg:w-[420px] lg:h-[420px] rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/15 blur-3xl animate-float" />

            {/* Rotating ring */}
            <div
              className="absolute w-[320px] h-[320px] lg:w-[400px] lg:h-[400px] rounded-full border border-white/10"
              style={{
                background: "conic-gradient(from 0deg, transparent 0%, rgba(56,189,248,0.15) 25%, transparent 50%, rgba(96,165,250,0.15) 75%, transparent 100%)",
              }}
            />

            {/* Inner gradient circle */}
            <div className="absolute w-[280px] h-[280px] lg:w-[350px] lg:h-[350px] rounded-full bg-gradient-to-br from-blue-500/10 to-cyan-500/10" />

            {/* Profile image with gradient border */}
            <div className="relative rounded-full p-[3px] bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-500">
              <div className="rounded-full overflow-hidden bg-slate-800">
                <img
                  src={profile.profile_image || profileImage}
                  alt={profile.full_name}
                  className="w-[260px] h-[260px] lg:w-[330px] lg:h-[330px] object-cover object-top"
                />
              </div>
            </div>

            {/* Floating accent dots */}
            <div className="absolute top-6 right-10 lg:top-4 lg:right-8 w-4 h-4 rounded-full bg-blue-400 shadow-lg shadow-blue-400/40 animate-float" />
            <div className="absolute bottom-10 left-6 lg:bottom-8 lg:left-4 w-3 h-3 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/40 animate-float-delayed" />
            <div className="absolute top-1/2 -right-2 w-2 h-2 rounded-full bg-indigo-400 opacity-60 animate-float-delayed" />

          </div>

        </div>

      </Container>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <a
          href="#stats"
          className="
            flex flex-col items-center gap-2
            text-slate-500 hover:text-blue-400
            transition-all duration-300
            group
          "
        >
          <span className="text-xs tracking-widest uppercase font-medium">Scroll</span>
          <span className="w-8 h-12 rounded-full border-2 border-current flex items-start justify-center p-2">
            <span className="w-1.5 h-3 rounded-full bg-current animate-bounce" />
          </span>
        </a>
      </div>

    </section>
  );
}

export default Hero;