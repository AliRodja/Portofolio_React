function Button({
  children,
  href,
  variant = "primary",
  target,
  rel,
  onClick,
}) {

  const styles = {
    primary:
      "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-400/30 hover:from-blue-400 hover:to-cyan-400",

    secondary:
      "bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:text-white backdrop-blur-sm",

    outline:
      "border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-300",
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        min-w-[180px]
        px-8
        py-4
        rounded-xl
        font-semibold
        transition-all
        duration-300
        hover:-translate-y-1
        ${styles[variant]}
      `}
    >
      {children}
    </a>
  );
}

export default Button;