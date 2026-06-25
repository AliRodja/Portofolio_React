import profileImage from "../../assets/images/profile.png";

import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
} from "react-icons/fa";

// import {
//   HiArrowDownTray,
// } from "react-icons/hi2";

import Container from "../ui/Container";
import Button from "../ui/Button";

function Hero({ profile }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 bg-slate-50 flex items-center overflow-hidden "
    >
      {/* Background Decoration */}
      <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-blue-100 blur-3xl opacity-40" />

      <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-cyan-100 blur-3xl opacity-40" />

      <Container className="w-full">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">

          {/* LEFT */}
          <div>

            <p className="text-blue-600 font-semibold text-lg">
              👋 Hello, I'm
            </p>

            <h1 className="text-5xl md:text-6xl lg:text-7xl  font-extrabold leading-tight text-slate-900 mt-3">
              {profile.full_name}
            </h1>

            <h2 className="text-xl lg:text-2xl text-slate-600 mt-5">
              {profile.headline}
            </h2>

            <p className="mt-8 leading-8 text-slate-700 max-w-xl">
              {profile.about}
            </p>

            {/* BUTTON */}
            <div className="flex flex-wrap gap-4 mt-10">

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

            {/* SOCIAL */}
            <div className="flex gap-6 mt-10 text-3xl text-slate-600">

              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  aria-label="GitHub"
                  rel="noopener noreferrer"
                  className="hover:text-black transition duration-300 hover:-translate-y-1"
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
                  className="hover:text-blue-600 transition duration-300 hover:-translate-y-1"
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
                  className="hover:text-pink-500 transition duration-300 hover:-translate-y-1"
                >
                  <FaInstagram />
                </a>
              )}

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center items-center">

            {/* Gradient Blur */}
            <div className="absolute w-80 h-80 rounded-full bg-gradient-to-br from-blue-300 to-cyan-300 blur-3xl opacity-50" />

            {/* Circle */}
            <div className="absolute w-96 h-96 rounded-full bg-blue-100" />

            {/* Profile Image */}
            <img
              src={profileImage}
              alt={profile.full_name}
              className="relative w-[520px] lg:w-[600px] drop-shadow-2xl"
            />

          </div>

        </div>

      </Container>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">

        <a
          href="#about"
          className="text-3xl text-slate-500 hover:text-blue-600 transition"
        >
          ↓
        </a>

      </div>

    </section>
  );
}

export default Hero;