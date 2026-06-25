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
      "bg-blue-600 text-white hover:bg-blue-700",

    secondary:
      "bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-600",

    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white",
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
            shadow-sm
            ${styles[variant]}
        `}
        >
        {children}
        </a>
  );
}

export default Button;