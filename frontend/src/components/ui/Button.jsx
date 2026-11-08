// Link styled as a button. Solid ink for the main action, ink outline for the
// secondary one (DESIGN.md). 48px tall, so it clears the 44px tap target.
const VARIANTS = {
  primary: "bg-ink text-white hover:bg-zinc-800 active:bg-black",
  outline: "border border-ink text-ink hover:bg-zinc-100 active:bg-zinc-200",
};

function Button({ children, href, variant = "primary", target, rel, onClick }) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center gap-2
        min-h-12 px-6 rounded-xl
        font-medium
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700
        transition-colors duration-200
        ${VARIANTS[variant]}
      `}
    >
      {children}
    </a>
  );
}

export default Button;
