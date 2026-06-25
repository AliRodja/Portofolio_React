import { useEffect, useState } from "react";
import api from "../services/api";

import Navbar from "../components/layout/Navbar";
import Hero from "../components/sections/Hero";

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
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  }

  return (
    <>
      <Navbar />

      <Hero profile={profile} />
    </>
  );

}

export default Home;