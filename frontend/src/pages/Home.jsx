import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import useCertificates from "../hooks/useCertificates";

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

  // Fetched here rather than inside Certificates: the navbar also needs to
  // know whether that section exists, to hide its link while it doesn't.
  const certificates = useCertificates();

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

  // The page renders immediately: every section starts its own request at the
  // same time instead of waiting for /api/profile first. Hero and About show
  // their own loading and error states for the profile-driven parts.
  // font-body / text-ink scope the public design (DESIGN.md) to this page,
  // leaving Login and the dashboard as they are.
  return (
    <div className="font-body text-ink">
      <Navbar showCertificates={certificates.certificates.length > 0} />

      <main>
        <Hero profile={profile} error={error} onRetry={retry} />
        <Stats />
        <About profile={profile} error={error} />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Certificates {...certificates} />
        <Contact profile={profile ?? undefined} />
      </main>

      <ScrollTopButton />
    </div>
  );

}

export default Home;
