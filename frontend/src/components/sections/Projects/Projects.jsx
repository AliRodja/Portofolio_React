import { useCallback, useEffect, useRef, useState } from "react";
import { TriangleAlert, ChevronLeft, ChevronRight } from "lucide-react";
import Container from "../../ui/Container";
import SectionHeading from "../../ui/SectionHeading";
import ProjectCard from "./ProjectCard";
import useProjects from "../../../hooks/useProjects";
import Reveal from "../../ui/Reveal";

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
  const Icon = direction < 0 ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction < 0 ? "Previous projects" : "Next projects"}
      className="
        w-11 h-11 rounded-xl
        flex items-center justify-center
        border border-zinc-300 bg-white
        text-ink text-lg
        hover:bg-zinc-100 hover:border-ink active:bg-zinc-200
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700
        disabled:opacity-40
        transition-colors duration-200
      "
    >
      <Icon aria-hidden="true" className="size-4.5" />
    </button>
  );
}

function SectionShell({ children }) {
  return (
    <section id="projects" className="bg-zinc-50 border-y border-zinc-200 py-24 md:py-28 overflow-hidden">
      <Container>
        <SectionHeading
          className="mb-12"
          before="Projects I've"
          highlight="built"
          intro="Most recently updated first."
        />
        <Reveal delay={100}>{children}</Reveal>
      </Container>
    </section>
  );
}

// Shared track layout: bleeds to the screen edge so cards can slide off it,
// while scroll-padding keeps the snapped card aligned with the page content.
// Snap classes are added per-state below: they must be absent (not just
// overridden) while mouse-dragging, or the browser snaps on every move.
const TRACK_CLASS =
  "flex gap-6 overflow-x-auto -mx-6 px-6 scroll-px-6 sm:-mx-10 sm:px-10 sm:scroll-px-10 lg:-mx-20 lg:px-20 lg:scroll-px-20 xl:-mx-24 xl:px-24 xl:scroll-px-24 2xl:-mx-32 2xl:px-32 2xl:scroll-px-32 pt-1 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

function Projects() {
  const { projects, loading, error } = useProjects();
  const carousel = useCarousel(projects.length);
  const { index, visible, canPrev, canNext, maxIndex, dragging, goTo, page, trackProps } = carousel;

  if (loading) {
    return (
      <SectionShell>
        <div className={TRACK_CLASS.replace("overflow-x-auto", "overflow-hidden")} aria-busy="true" aria-label="Loading projects">
          {[...Array(3)].map((_, i) => (
            <div key={i} className={`${SLIDE_WIDTH} shrink-0 rounded-xl bg-white border border-zinc-200 overflow-hidden animate-pulse`}>
              <div className="h-48 bg-zinc-200" />
              <div className="p-6 space-y-4">
                <div className="h-6 w-2/3 bg-zinc-200 rounded-lg" />
                <div className="h-4 w-full bg-zinc-100 rounded-lg" />
                <div className="h-4 w-4/5 bg-zinc-100 rounded-lg" />
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
        <p className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          <TriangleAlert aria-hidden="true" className="size-4 shrink-0" />
          {error}
        </p>
      </SectionShell>
    );
  }

  if (projects.length === 0) {
    return (
      <SectionShell>
        <p className="text-zinc-600">No projects listed yet.</p>
      </SectionShell>
    );
  }

  const first = index + 1;
  const last = Math.min(index + visible, projects.length);
  const scrollable = maxIndex > 0;

  return (
    <SectionShell>
      {/* Counter + arrows */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-sm text-zinc-600" aria-live="polite">
          Showing{" "}
          <span className="font-semibold text-ink">
            {first === last ? first : `${first}–${last}`}
          </span>{" "}
          of <span className="font-semibold text-ink">{projects.length}</span> projects
        </p>

        {scrollable && (
          <div className="flex items-center gap-2">
            <ArrowButton direction={-1} disabled={!canPrev} onClick={() => page(-1)} />
            <ArrowButton direction={1} disabled={!canNext} onClick={() => page(1)} />
          </div>
        )}
      </div>

      {/* Track */}
      <div className="relative">
        <div
          {...trackProps}
          tabIndex={0}
          role="region"
          aria-roledescription="carousel"
          aria-label="Projects. Use the arrow keys or swipe to browse"
          className={`
            ${TRACK_CLASS}
            focus-visible:outline-2 focus-visible:outline-blue-700 rounded-xl
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
          className={`pointer-events-none absolute inset-y-0 -left-6 sm:-left-10 lg:-left-20 xl:-left-24 2xl:-left-32 w-6 sm:w-10 lg:w-20 xl:w-24 2xl:w-32 bg-gradient-to-r from-zinc-50 to-transparent transition-opacity duration-300 ${canPrev ? "opacity-100" : "opacity-0"}`}
        />
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-y-0 -right-6 sm:-right-10 lg:-right-20 xl:-right-24 2xl:-right-32 w-6 sm:w-10 lg:w-20 xl:w-24 2xl:w-32 bg-gradient-to-l from-zinc-50 to-transparent transition-opacity duration-300 ${canNext ? "opacity-100" : "opacity-0"}`}
        />
      </div>

      {/* Dots. Each button is a 44px tap target around a small visible dot.
          Hidden on phones: up to 9 dots x 44px would overflow a 375px screen,
          and the 44px arrow buttons, the counter and swiping already cover it. */}
      {scrollable && (
        <div className="hidden md:flex justify-center mt-2">
          {[...Array(maxIndex + 1)].map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              className="group/dot h-11 min-w-11 px-1 flex items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-blue-700"
            >
              <span
                className={`
                  block h-2 rounded-full transition-[width,background-color] duration-200
                  ${i === index ? "w-6 bg-blue-700" : "w-2 bg-zinc-300 group-hover/dot:bg-zinc-500"}
                `}
              />
            </button>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

export default Projects;
