import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToHero = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("hero")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToHero}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`
        fixed bottom-6 right-6 z-40
        w-12 h-12 rounded-xl
        bg-ink text-white text-xl
        ring-1 ring-zinc-500
        flex items-center justify-center
        hover:bg-zinc-800 active:bg-black
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700
        transition-[opacity,background-color] duration-200
        ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
    >
      <ArrowUp aria-hidden="true" className="size-5" />
    </button>
  );
}

export default ScrollTopButton;
