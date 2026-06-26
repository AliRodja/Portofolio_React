import { useEffect, useState } from "react";
import api from "../services/api";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";
import Stats from "../components/sections/Stats";
import About from "../components/sections/About/About";
import Skills from "../components/sections/Skills/Skills";
import Projects from "../components/sections/Projects/Projects";


function Home() {

  const [profile, setProfile] = useState(null);

  useEffect(() => {

    api.get("/profile")
      .then((res) => {

        setProfile(res.data);

      })
      .catch(console.error);

  }, []);

  if (!profile) {

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <div className="w-10 h-10 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" />
        <p className="mt-4 text-slate-500 text-sm tracking-wider">Loading...</p>
      </div>
    );

  }

  return (
    <>
      <Navbar />

      <Hero profile={profile} />
      <Stats />
      <About profile={profile} />
      <Skills />
      <Projects />
    </>
  );

}

export default Home;