function Badge({
  children,
}) {

  return (

    <span
      className="
        inline-block
        px-4
        py-2
        rounded-full
        bg-blue-100
        text-blue-700
        text-sm
        font-medium
      "
    >

      {children}

    </span>

  );

}

export default Badge;