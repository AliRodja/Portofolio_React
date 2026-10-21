import { useCallback, useEffect, useRef, useState } from "react";
import {
  HiOutlineExclamationTriangle,
  HiOutlineWrenchScrewdriver,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi2";
import Container from "../../ui/Container";
import ProjectCard from "./ProjectCard";
import useProjects from "../../../hooks/useProjects";

// Card widths per breakpoint: ~1 card + a peek of the next on phones (so it's
// obvious the row scrolls), 2 per view on tablets, 3 on desktop. The calc()
// subtracts the gap-6 (1.5rem) gutters so whole cards line up with the edges.
const SLIDE_WIDTH =
  "w-[85%] sm:w-[70%] md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]";

const DRAG_THRESHOLD = 5;

const scrollBehavior = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

/**
 * Native horizontal scroller with scroll-snap: touch swipe and trackpads work
 * out of the box; this adds prev/next buttons, keyboard arrows, mouse
 * drag-to-scroll, and position tracking for the counter and dots.
 */
function useCarousel(itemCount) {
  const trackRef = useRef(null);
  const drag = useRef(null);
  const suppressClick = useRef(false);

  const [state, setState] = useState({ index: 0, visible: 1, canPrev: false, canNext: false });
  const [dragging, setDragging] = useState(false);

  const metrics = useCallback(() => {
    const track = trackRef.current;
    const first = track?.firstElementChild;
    if (!track || !first) return null;

    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap) || 0;
    const step = first.getBoundingClientRect().width + gap;
    const inner = track.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);

    return { track, step, visible: Math.max(1, Math.round((inner + gap) / step)) };
  }, []);

  const update = useCallback(() => {
    const m = metrics();
    if (!m) return;

    const { track, step, visible } = m;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const maxIndex = Math.max(0, itemCount - visible);
    const atEnd = track.scrollLeft >= maxScroll - 4;

    setState({
      index: atEnd ? maxIndex : Math.min(maxIndex, Math.round(track.scrollLeft / step)),
      visible,
      canPrev: track.scrollLeft > 4,
      canNext: !atEnd,
    });
  }, [itemCount, metrics]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    track.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(track);

    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, [update]);

  const goTo = useCallback((index) => {
    const m = metrics();
    if (!m) return;

    m.track.scrollTo({ left: index * m.step, behavior: scrollBehavior() });
  }, [metrics]);

  // Move a whole "page" (as many cards as are visible) at a time.
  const page = useCallback((direction) => {
    const m = metrics();
    if (!m) return;

    m.track.scrollBy({ left: direction * m.visible * m.step, behavior: scrollBehavior() });
  }, [metrics]);

  // Mouse drag-to-scroll. Touch and pen already scroll natively.
  const onPointerDown = (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: trackRef.current.scrollLeft, id: e.pointerId, moved: false };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;

    const dx = e.clientX - d.x;

    if (!d.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      d.moved = true;
      setDragging(true);
      trackRef.current.setPointerCapture(d.id);
    }

    if (d.moved) {
      trackRef.current.scrollLeft = d.left - dx;
    }
  };

  const endDrag = () => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;

    setDragging(false);
    // A drag ends with a click on whatever card/link is under the cursor;
    // swallow that one click so dragging never opens a link.
    suppressClick.current = true;
    setTimeout(() => { suppressClick.current = false; }, 0);

    const m = metrics();
    if (m) {
      m.track.scrollTo({ left: Math.round(m.track.scrollLeft / m.step) * m.step, behavior: scrollBehavior() });
    }
  };

  const trackProps = {
    ref: trackRef,
    onPointerDown,
    onPointerMove,
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
    onClickCapture: (e) => {
      if (suppressClick.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    onDragStart: (e) => e.preventDefault(),
    onKeyDown: (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); page(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); page(-1); }
    },
  };

  return { ...state, dragging, goTo, page, trackProps, maxIndex: Math.max(0, itemCount - state.visible) };
}

function ArrowButton({ direction, disabled, onClick }) {
  const Icon = direction < 0 ? HiChevronLeft : HiChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction < 0 ? "Previous projects" : "Next projects"}
      className="
        w-11 h-11 rounded-full
        flex items-center justify-center
        bg-white/[0.04] border border-white/[0.1]
        text-slate-300 text-lg
        hover:bg-white/[0.1] hover:border-white/20 hover:text-white
        disabled:opacity-30 disabled:pointer-events-none
        transition-all duration-300
      "
    >
      <Icon />
    </button>
  );
}

function SectionShell({ children }) {
  return (
    <section id="projects" className="relative py-24 md:py-32 bg-slate-900 overflow-hidden">
      {/* ── Background decorations ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[140px]" />
        <div className="absolute bottom-40 -right-32 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-cyan-500/3 blur-[180px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Container className="relative z-10">
        {/* ── Section Header ── */}
        <div data-aos="fade-up" className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-sm text-indigo-300 font-medium tracking-wider uppercase">
              Featured Projects
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Some Things I've
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}Built
            </span>
          </h2>

          <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
            A collection of projects I've worked on — from full-stack web apps to
            creative experiments.
          </p>
        </div>

        {children}
      </Container>
    </section>
  );
}

// Shared track layout: bleeds to the screen edge so cards can slide off it,
// while scroll-padding keeps the snapped card aligned with the page content.
// Vertical padding leaves room for the card hover lift and shadow.
// Snap classes are added per-state below: they must be absent (not just
// overridden) while mouse-dragging, or the browser snaps on every move.
const TRACK_CLASS =
  "flex gap-6 overflow-x-auto -mx-6 px-6 scroll-px-6 lg:-mx-8 lg:px-8 lg:scroll-px-8 pt-3 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function Projects() {
  const { projects, loading, error } = useProjects();
  const carousel = useCarousel(projects.length);
  const { index, visible, canPrev, canNext, maxIndex, dragging, goTo, page, trackProps } = carousel;

  if (loading) {
    return (
      <SectionShell>
        <div className={TRACK_CLASS.replace("overflow-x-auto", "overflow-hidden")} aria-busy="true" aria-label="Loading projects">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${SLIDE_WIDTH} shrink-0 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden animate-pulse`}>
              <div className="h-52 md:h-56 bg-white/[0.05]" />
              <div className="p-6 md:p-7 space-y-4">
                <div className="h-6 w-2/3 bg-white/[0.05] rounded-lg" />
                <div className="h-4 w-full bg-white/[0.04] rounded-lg" />
                <div className="h-4 w-4/5 bg-white/[0.04] rounded-lg" />
                <div className="flex gap-2 pt-2">
                  <div className="h-7 w-16 bg-white/[0.04] rounded-lg" />
                  <div className="h-7 w-20 bg-white/[0.04] rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionShell>
    );
  }

  if (error) {
    return (
      <SectionShell>
        <div className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20">
            <span className="text-red-400"><HiOutlineExclamationTriangle /></span>
            <span className="text-red-300 text-sm font-medium">{error}</span>
          </div>
        </div>
      </SectionShell>
    );
  }

  if (projects.length === 0) {
    return (
      <SectionShell>
        <div className="text-center py-20">
          <div className="flex justify-center text-6xl text-slate-600 mb-6"><HiOutlineWrenchScrewdriver /></div>
          <h3 className="text-2xl font-bold text-white mb-3">No Projects Yet</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Projects are coming soon. Stay tuned for some awesome work!
          </p>
        </div>
      </SectionShell>
    );
  }

  const first = index + 1;
  const last = Math.min(index + visible, projects.length);
  const scrollable = maxIndex > 0;

  return (
    <SectionShell>
      {/* ── Counter + arrows ── */}
      <div data-aos="fade-up" className="flex items-center justify-between gap-4 mb-4">
        <p className="text-sm text-slate-400" aria-live="polite">
          Showing{" "}
          <span className="font-semibold text-white">
            {first === last ? first : `${first}–${last}`}
          </span>{" "}
          of <span className="font-semibold text-white">{projects.length}</span> projects
        </p>

        {scrollable && (
          <div className="flex items-center gap-2">
            <ArrowButton direction={-1} disabled={!canPrev} onClick={() => page(-1)} />
            <ArrowButton direction={1} disabled={!canNext} onClick={() => page(1)} />
          </div>
        )}
      </div>

      {/* ── Track ── */}
      <div data-aos="fade-up" className="relative">
        <div
          {...trackProps}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Projects — use the arrow keys or swipe to browse"
          className={`
            ${TRACK_CLASS}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 rounded-2xl
            ${dragging ? "cursor-grabbing select-none" : "snap-x snap-mandatory md:cursor-grab"}
          `}
        >
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`${SLIDE_WIDTH} shrink-0 snap-start`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${projects.length}: ${project.title}`}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Edge fades hint that there's more to either side */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 -left-6 lg:-left-8 w-6 lg:w-8 bg-gradient-to-r from-slate-900 to-transparent transition-opacity duration-300 ${canPrev ? "opacity-100" : "opacity-0"}`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 -right-6 lg:-right-8 w-6 lg:w-8 bg-gradient-to-l from-slate-900 to-transparent transition-opacity duration-300 ${canNext ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* ── Dots ── */}
      {scrollable && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(maxIndex + 1)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className={`
                h-2 rounded-full transition-all duration-300
                ${i === index ? "w-6 bg-gradient-to-r from-blue-400 to-cyan-400" : "w-2 bg-white/15 hover:bg-white/30"}
              `}
            />
          ))}
        </div>
      )}
    </SectionShell>
  );
}

export default Projects;
