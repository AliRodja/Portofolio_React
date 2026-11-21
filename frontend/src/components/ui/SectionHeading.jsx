import Reveal from "./Reveal";
import { useTheme } from "../../context/ThemeContext";

// Section title with one highlighted keyword: the site's signature motif
// (DESIGN.md). Blue-700 box with white text on light surfaces, blue-400 box
// with ink text on dark ones; both well above 4.5:1.
function SectionHeading({ before, highlight, after, intro, dark = false, className = "" }) {
  const { theme } = useTheme();
  const isDarkSurface = dark ? theme === "light" : theme === "dark";

  return (
    <Reveal className={className}>
      <h2
        className={`
          font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-tight
          ${dark ? "text-white dark:text-ink" : "text-ink dark:text-white"}
        `}
      >
        {before && <>{before} </>}
        {/* .hl (index.css) wipes the highlight in once the heading is shown. */}
        <span
          className="hl px-2 rounded-md font-bold box-decoration-clone"
          style={isDarkSurface
            ? { "--hl-bg": "#60a5fa", "--hl-fg": "#111113" }
            : { "--hl-bg": "#1d4ed8", "--hl-fg": "#ffffff" }}
        >
          {highlight}
        </span>
        {after && <> {after}</>}
      </h2>

      {intro && (
        <p className={`mt-3 sm:mt-4 text-base sm:text-lg max-w-2xl ${dark ? "text-zinc-400 dark:text-zinc-600" : "text-zinc-600 dark:text-zinc-400"}`}>
          {intro}
        </p>
      )}
    </Reveal>
  );
}

export default SectionHeading;
