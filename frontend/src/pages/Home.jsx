import { useCallback, useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import api from "../services/api";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Stats from "../components/sections/Stats";
import About from "../components/sections/About/About";
import Skills from "../components/sections/Skills/Skills";
import Projects from "../components/sections/Projects/Projects";
import Experience from "../components/sections/Experience/Experience";
import Education from "../components/sections/Education/Education";
import Certificates from "../components/sections/Certificates/Certificates";
import Contact from "../components/sections/Contact/Contact";
import ScrollTopButton from "../components/ui/ScrollTopButton";


function Home() {

  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(false);

  // State is only set once the request settles, never synchronously.
  const fetchProfile = useCallback(() => {
    api.get("/profile")
      .then((res) => {

        setProfile(res.data);

      })
      .catch((err) => {

        console.error(err);
        setError(true);

      });
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const retry = () => {
    setError(false);
    fetchProfile();
  };

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
      // Show content without the entrance animations for reduced-motion users.
      disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    });
  }, []);

  // The page renders immediately: every section starts its own request at the
  // same time instead of waiting for /api/profile first. Hero and About show
  // their own loading and error states for the profile-driven parts.
  return (
    <>
      <Navbar />

      <Hero profile={profile} error={error} onRetry={retry} />
      <Stats />
      <About profile={profile} error={error} />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Certificates />
      <Contact profile={profile ?? undefined} />

      <ScrollTopButton />
    </>
  );

}

export default Home;
