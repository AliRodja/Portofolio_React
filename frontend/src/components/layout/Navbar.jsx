import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";

// Floating pill navbar, after the reference the owner chose (2026-11-08).
// Experience, Education and Certificates sit under one "Journey" dropdown so
// the bar holds six items, as in the reference.
const NAV_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  {
    label: "Journey",
    children: [
      { label: "Experience", href: "#experience" },
      { label: "Education", href: "#education" },
      { label: "Certificates", href: "#certificates" },
    ],
  },
  
];

// A section counts as "current" once its top passes this line (px from the
// top of the viewport), just under the floating bar.
const ACTIVE_LINE = 120;

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";

// Soft blue glow under the current link, as in the reference.
function ActiveGlow() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 -bottom-2.5 h-1.5 w-10 -translate-x-1/2 rounded-full bg-blue-500/70 blur-[6px]"
    />
  );
}

function linkClass(active) {
  return `
    relative flex items-center gap-1 min-h-11 px-3 rounded-full
    text-sm whitespace-nowrap transition-colors duration-200 ${FOCUS_RING}
    ${active ? "font-semibold text-blue-700" : "font-medium text-zinc-600 hover:text-ink"}
  `;
}

// "Journey" disclosure: a button that shows a short list of links. Closes on
// Escape (focus returns to the button), on a click outside, when focus
// leaves it, and after a link is chosen.
function JourneyMenu({ item, activeHref, open, setOpen }) {
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const active = item.children.some((child) => child.href === activeHref);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!wrapperRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, setOpen]);

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onBlur={(event) => {
        if (!wrapperRef.current?.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="journey-menu"
        className={linkClass(active)}
      >
        {item.label}
        <ChevronDown
          aria-hidden="true"
          className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
        {active && <ActiveGlow />}
      </button>

      {open && (
        <ul
          id="journey-menu"
          className="animate-modal-in absolute left-1/2 top-full mt-3 w-52 -translate-x-1/2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-[0_16px_40px_-16px_rgba(17,17,19,0.25)]"
        >
          {item.children.map((child) => {
            const current = child.href === activeHref;
            return (
              <li key={child.href}>
                <a
                  href={child.href}
                  onClick={() => setOpen(false)}
                  aria-current={current ? "true" : undefined}
                  className={`
                    flex items-center min-h-11 px-3 rounded-xl text-sm transition-colors ${FOCUS_RING}
                    ${current ? "font-semibold text-blue-700 bg-blue-50" : "font-medium text-zinc-700 hover:text-ink hover:bg-zinc-100"}
                  `}
                >
                  {child.label}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// showCertificates: the Certificates section only renders once there is at
// least one certificate, so its link must not point at nothing before that.
function Navbar({ showCertificates = true }) {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [activeHref, setActiveHref] = useState("#hero");
  const lastScrollY = useRef(0);

  const items = NAV_ITEMS.map((item) =>
    item.children
      ? { ...item, children: item.children.filter((child) => showCertificates || child.href !== "#certificates") }
      : item
  );
  // Flat list for the mobile drawer and for working out the current section.
  const flatLinks = items.flatMap((item) => item.children ?? [item]);
  const hrefKey = flatLinks.map((link) => link.href).join(" ");

  useEffect(() => {
    const hrefs = hrefKey.split(" ");

    // The current section is the last one whose top has passed ACTIVE_LINE;
    // at the very bottom of the page it is the last section. Measured on
    // scroll rather than observed once, because sections arrive after their
    // data loads.
    const findActive = () => {
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = hrefs[0];
      for (const href of hrefs) {
        const section = document.querySelector(href);
        if (!section) continue;
        if (atBottom || section.getBoundingClientRect().top <= ACTIVE_LINE) current = href;
      }
      setActiveHref(current);
    };

    const onScroll = () => {
      const currentScrollY = window.scrollY;
      const goingDown = currentScrollY > lastScrollY.current && currentScrollY > 120;

      setHidden(goingDown);
      if (goingDown) setJourneyOpen(false);
      lastScrollY.current = currentScrollY;
      findActive();
    };

    findActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hrefKey]);

  return (
    <header
      className={`
        fixed top-0 left-0 w-full z-50 pt-3
        px-4 sm:px-10 lg:px-20 xl:px-24 2xl:px-32
        transition-transform duration-300
        ${hidden && !mobileOpen ? "-translate-y-[calc(100%+1rem)]" : "translate-y-0"}
      `}
    >
      <div className="flex items-center justify-between gap-4 h-16 pl-3 pr-2 sm:pl-4 rounded-full bg-white border border-zinc-200 shadow-[0_8px_28px_-14px_rgba(17,17,19,0.22)]">

        {/* Logo and name */}
        <a href="#hero" className={`shrink-0 flex items-center gap-2.5 min-h-11 pr-2 rounded-full ${FOCUS_RING}`}>
          <img src="/logoAli.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
          <span className="font-display text-lg font-bold text-ink">Ali Imran Rodja</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden lg:block" aria-label="Sections">
          <ul className="flex items-center gap-0.5">
            {items.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <JourneyMenu item={item} activeHref={activeHref} open={journeyOpen} setOpen={setJourneyOpen} />
                ) : (
                  <a
                    href={item.href}
                    aria-current={item.href === activeHref ? "true" : undefined}
                    className={linkClass(item.href === activeHref)}
                  >
                    {item.label}
                    {item.href === activeHref && <ActiveGlow />}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA (desktop) */}
        <a
          href="#contact"
          className={`
            hidden lg:inline-flex items-center justify-center shrink-0
            min-h-11 px-5 rounded-full
            bg-ink text-sm font-medium text-white
            hover:bg-zinc-800 active:bg-zinc-700
            transition-colors duration-200 ${FOCUS_RING}
          `}
        >
          Contact Me
        </a>

        {/* Mobile / tablet menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`lg:hidden text-ink p-2.5 rounded-full hover:bg-zinc-100 active:bg-zinc-200 transition-colors ${FOCUS_RING}`}
          aria-label="Menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X aria-hidden="true" className="size-6" /> : <Menu aria-hidden="true" className="size-6" />}
        </button>

      </div>

      {/* Mobile / tablet drawer, a card under the bar. inert while closed: it
          is only collapsed to zero height, so without it Tab would still
          reach the hidden links. */}
      <div
        id="mobile-menu"
        inert={!mobileOpen}
        className={`
          lg:hidden overflow-hidden rounded-3xl bg-white
          transition-[max-height,opacity,margin] duration-300 ease-in-out
          ${mobileOpen ? "mt-2 max-h-[calc(100vh-6.5rem)] opacity-100 border border-zinc-200 shadow-[0_16px_40px_-16px_rgba(17,17,19,0.25)]" : "max-h-0 opacity-0"}
        `}
      >
        <nav className="p-3 max-h-[calc(100vh-6.5rem)] overflow-y-auto" aria-label="Sections">
          <ul className="flex flex-col gap-1">
            {flatLinks.map((link) => {
              const current = link.href === activeHref;
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    aria-current={current ? "true" : undefined}
                    className={`
                      block px-4 py-3 rounded-2xl transition-colors
                      ${current ? "font-semibold text-blue-700 bg-blue-50" : "font-medium text-zinc-700 hover:text-ink hover:bg-zinc-100"}
                    `}
                  >
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href="#contact"
            onClick={() => setMobileOpen(false)}
            className="mt-3 flex items-center justify-center min-h-12 rounded-full bg-ink text-white text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Contact Me
          </a>
        </nav>
      </div>

    </header>
  );
}

export default Navbar;
