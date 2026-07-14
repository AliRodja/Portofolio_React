function Quote() {
  return (
    <div className="relative py-24 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 overflow-hidden">

      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white/10 blur-[80px]" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-white/10 blur-[60px]" />
      </div>

      {/* Quote marks - decorative */}
      <div className="absolute top-8 left-8 md:left-16 text-[120px] md:text-[180px] font-serif text-white/10 leading-none select-none">
        "
      </div>
      <div className="absolute bottom-0 right-8 md:right-16 text-[120px] md:text-[180px] font-serif text-white/10 leading-none select-none rotate-180">
        "
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        <h2
          data-aos="zoom-in"
          className="text-3xl md:text-5xl lg:text-6xl font-light leading-tight text-white italic"
        >
          Building digital solutions
          <br />
          while growing as a leader.
        </h2>

        <div data-aos="fade-up" data-aos-delay="150" className="flex items-center justify-center gap-4 mt-10">
          <span className="w-10 h-[2px] bg-white/40 rounded-full" />
          <p className="text-white/80 tracking-[0.25em] uppercase text-sm font-medium">
            Ali Imran Rodja
          </p>
          <span className="w-10 h-[2px] bg-white/40 rounded-full" />
        </div>

      </div>

    </div>
  );
}

export default Quote;