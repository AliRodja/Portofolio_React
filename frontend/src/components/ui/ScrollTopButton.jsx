import { useEffect, useState } from "react";
import { HiOutlineArrowUp } from "react-icons/hi2";

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToHero = () => {
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToHero}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`
        fixed bottom-6 right-6 z-40
        w-12 h-12 rounded-full
        bg-gradient-to-r from-blue-500 to-cyan-500
        text-white text-xl
        shadow-lg shadow-blue-500/30
        flex items-center justify-center
        hover:shadow-blue-400/40 hover:-translate-y-1
        transition-all duration-300
        ${visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}
      `}
    >
      <HiOutlineArrowUp />
    </button>
  );
}

export default ScrollTopButton;
