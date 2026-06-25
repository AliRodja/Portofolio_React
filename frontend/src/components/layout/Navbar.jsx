function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        <a
            href="#hero"
            className="text-3xl font-extrabold tracking-tight text-slate-900"
        >
            Ali<span className="text-blue-600">.</span>
        </a>
        <nav>
          <ul className="flex gap-8 text-slate-700 font-medium">

            <li>
              <a href="#hero" className="hover:text-blue-600">
                Home
              </a>
            </li>

            <li>
              <a href="#about" className="hover:text-blue-600">
                About
              </a>
            </li>

            <li>
              <a href="#skills" className="hover:text-blue-600">
                Skills
              </a>
            </li>

            <li>
              <a href="#projects" className="hover:text-blue-600">
                Projects
              </a>
            </li>

            <li>
              <a href="#experience" className="hover:text-blue-600">
                Experience
              </a>
            </li>

            <li>
              <a href="#contact" className="hover:text-blue-600">
                Contact
              </a>
            </li>

          </ul>
        </nav>

      </div>
    </header>
  );
}

export default Navbar;