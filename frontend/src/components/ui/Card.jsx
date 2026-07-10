function Card({
  children,
  className = "",
}) {

  return (

    <div
      className={`
        bg-white
        rounded-3xl
        shadow-sm
        border
        border-slate-200
        p-8
        transition
        duration-300
        hover:shadow-xl
        hover:-translate-y-1
        ${className}
      `}
    >

      {children}

    </div>

  );

}

export default Card;