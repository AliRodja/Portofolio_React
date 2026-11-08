import Reveal from "./Reveal";

// Section title with one highlighted keyword: the site's signature motif
// (DESIGN.md). Blue-700 box with white text on light sections, blue-400 box
// with ink text on dark ones; both well above 4.5:1. The box wipes in from
// the left when the heading scrolls into view.
function SectionHeading({ before, highlight, after, intro, dark = false, className = "" }) {
  return (
    <Reveal className={className}>
      <h2
        className={`
          font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight
          ${dark ? "text-white" : "text-ink"}
        `}
      >
        {before && <>{before} </>}
        {/* .hl (index.css) wipes the highlight in once the heading is shown. */}
        <span
          className="hl px-2 rounded-md font-bold box-decoration-clone"
          style={dark
            ? { "--hl-bg": "#60a5fa", "--hl-fg": "#111113" }
            : { "--hl-bg": "#1d4ed8", "--hl-fg": "#ffffff" }}
        >
          {highlight}
        </span>
        {after && <> {after}</>}
      </h2>

      {intro && (
        <p className={`mt-4 text-lg max-w-2xl ${dark ? "text-zinc-400" : "text-zinc-600"}`}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}

export default SectionHeading;
