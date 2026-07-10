import Container from "../../ui/Container";
import profileImage from "../../../assets/images/profile.png";

function Story({ profile }) {
  return (
    <div className="relative bg-slate-900 py-32 overflow-hidden">

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px]" />
        <div className="absolute bottom-10 right-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/5 blur-[150px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Container className="relative z-10">

        {/* Section label */}
        <div className="text-center mb-20">

          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-sm text-blue-300 font-medium tracking-wider uppercase">
              About Me
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none tracking-tight text-white">
            Behind
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}The Code
            </span>
          </h2>

          <p className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            More than writing code — I'm building solutions and growing as a leader.
          </p>

        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-5 gap-16 items-center">

          {/* Left — Image with decorative frame */}
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative">

              {/* Glow ring */}
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 blur-2xl" />

              {/* Outer border */}
              <div className="relative rounded-3xl p-[2px] bg-gradient-to-br from-blue-500/50 to-cyan-500/30">

                {/* Image container */}
                <div className="rounded-3xl overflow-hidden bg-slate-800">
                  <img
                    src={profileImage}
                    alt={profile.full_name}
                    className="w-80 h-80 object-cover object-top"
                  />
                </div>

              </div>

              {/* Floating accent dot */}
              <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg shadow-blue-500/30" />
              <div className="absolute -bottom-3 -left-3 w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-teal-400 shadow-lg shadow-cyan-500/30" />

            </div>
          </div>

          {/* Right — Story text */}
          <div className="lg:col-span-3">

            <div className="space-y-6">

              <p className="text-lg md:text-xl leading-9 text-slate-300">
                {profile.about}
              </p>

              {/* Info cards row */}
              <div className="grid grid-cols-2 gap-4 mt-10">

                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5 hover:bg-white/[0.08] transition-all duration-300">
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {profile.location || "Gorontalo"}
                  </p>
                  <p className="text-sm text-slate-500 mt-1.5 font-medium">
                    Based In
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm p-5 hover:bg-white/[0.08] transition-all duration-300">
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    {profile.headline || "Full Stack Dev"}
                  </p>
                  <p className="text-sm text-slate-500 mt-1.5 font-medium">
                    Focus Area
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </Container>

    </div>
  );
}

export default Story;