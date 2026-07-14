import { useState, useEffect } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Certificates", href: "#certificates" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50
        transition-all duration-500
        ${
          scrolled
            ? "bg-slate-900/80 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10"
            : "bg-transparent"
        }
      `}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <a
          href="#hero"
          className="text-2xl font-extrabold tracking-tight text-white"
        >
          Ali
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            .
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:block">
          <ul className="flex gap-0.5 xl:gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="
                    relative px-2.5 xl:px-4 py-2 rounded-lg
                    text-sm font-medium text-slate-400 whitespace-nowrap
                    hover:text-white
                    transition-all duration-300
                    hover:bg-white/5
                  "
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Button — desktop */}
        <a
          href="#contact"
          className="
            hidden lg:inline-flex items-center gap-2
            px-5 py-2.5 rounded-xl
            text-sm font-semibold text-white
            bg-gradient-to-r from-blue-500 to-cyan-500
            hover:from-blue-400 hover:to-cyan-400
            shadow-lg shadow-blue-500/20
            hover:shadow-blue-400/30
            transition-all duration-300
            hover:-translate-y-0.5
            shrink-0
          "
        >
          Let's Talk
        </a>

        {/* Mobile / tablet hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white text-2xl p-2 rounded-lg hover:bg-white/10 transition"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiX /> : <HiMenuAlt3 />}
        </button>

      </div>

      {/* Mobile / tablet drawer */}
      <div
        className={`
          lg:hidden overflow-hidden
          transition-all duration-300 ease-in-out
          ${mobileOpen ? "max-h-[calc(100vh-4.5rem)] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <nav className="px-6 pb-6 pt-2 bg-slate-900/95 backdrop-blur-xl border-t border-white/5 max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="
                    block px-4 py-3 rounded-xl
                    text-slate-300 font-medium
                    hover:text-white hover:bg-white/5
                    transition-all duration-200
                  "
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="
              mt-4 w-full block text-center
              px-5 py-3 rounded-xl
              text-sm font-semibold text-white
              bg-gradient-to-r from-blue-500 to-cyan-500
              shadow-lg shadow-blue-500/20
              transition-all duration-300
            "
          >
            Let's Talk
          </a>
        </nav>
      </div>

    </header>
  );
}

export default Navbar;