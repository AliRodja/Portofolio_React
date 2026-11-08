import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Marks a block [data-shown] the first time it scrolls into view; the CSS in
 * index.css ("Scroll reveal") does the animating. MOTION 2 in DESIGN.md: each
 * block enters once, nothing loops.
 *
 * variant
 *   "up"     rises into place (and comes into focus on wider screens)
 *   "fade"   fades in only, for wrappers whose children animate themselves
 *   "group"  stays put; its direct children enter one after another
 *   "draw-y" a line that grows downward
 * delay    ms before this block starts
 * stagger  ms between children of a "group"
 *
 * Users who ask for reduced motion start with every block shown, so content
 * never waits behind an animation that doesn't run.
 */
function Reveal({
  as: Tag = "div",
  variant = "up",
  delay = 0,
  stagger,
  className = "",
  style,
  children,
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(prefersReducedMotion);

  useEffect(() => {
    if (shown) return undefined;

    const el = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShown(true);
          observer.disconnect();
        }
      },
      // Start a little before the block is fully on screen.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [shown]);

  const vars = {
    ...(delay ? { "--reveal-delay": `${delay}ms` } : {}),
    ...(stagger ? { "--stagger": `${stagger}ms` } : {}),
  };

  return (
    <Tag
      ref={ref}
      data-shown={shown || undefined}
      style={{ ...vars, ...style }}
      className={`reveal reveal--${variant} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
