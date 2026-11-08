// Full-width sections with a gutter that grows with the screen (owner's
// choice, DESIGN.md): 24px on phones up to 128px on wide screens. The navbar
// and the Projects carousel's negative margins mirror these values; change
// all three together.
function Container({ children, className = "" }) {
  return (
    <div
      className={`w-full px-6 sm:px-10 lg:px-20 xl:px-24 2xl:px-32 ${className}`}
    >
      {children}
    </div>
  );
}

export default Container;