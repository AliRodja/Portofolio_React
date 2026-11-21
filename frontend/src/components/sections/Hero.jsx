import profileImage from "../../assets/images/profile.webp";

import { MessageCircleMore } from "lucide-react";

import Container from "../ui/Container";
import Button from "../ui/Button";
import Reveal from "../ui/Reveal";
import { buildSocialItems } from "../../constants/socialPlatforms";
import { useTheme } from "../../context/ThemeContext";

// "Junior Full-Stack Web Developer | UI/UX Design" -> "Junior Full-Stack Web Developer"
// "Cimahi, West java, Indonesia" -> "Cimahi"
const firstPart = (text, separator) => (text || "").split(separator)[0].trim();

// Shown while /api/profile is loading. Same rough shape as the real text so
// the layout doesn't jump when it arrives.
function HeroTextSkeleton() {
  return (
    <div aria-busy="true" className="animate-pulse">
      <span className="sr-only">Loading profile</span>
      <div className="h-12 md:h-14 lg:h-16 w-11/12 rounded-xl bg-zinc-200" />
      <div className="h-12 md:h-14 lg:h-16 w-3/4 rounded-xl bg-zinc-200 mt-3" />
      <div className="h-12 md:h-14 lg:h-16 w-1/2 rounded-xl bg-zinc-200 mt-3" />
      <div className="space-y-3 mt-8 max-w-xl">
        <div className="h-4 w-full rounded-lg bg-zinc-200" />
        <div className="h-4 w-4/5 rounded-lg bg-zinc-200" />
      </div>
      <div className="flex gap-4 mt-10">
        <div className="h-12 w-36 rounded-xl bg-zinc-200" />
        <div className="h-12 w-36 rounded-xl bg-zinc-100" />
      </div>
    </div>
  );
}

function HeroError({ onRetry }) {
  return (
    <div>
      <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight text-ink dark:text-white">
        Hello! I&apos;m <strong className="font-bold">Ali Imran Rodja</strong>
      </h1>
      <p className="mt-6 text-zinc-600 dark:text-zinc-400 max-w-xl">
        The profile couldn&apos;t be loaded right now. Check your connection and try again.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="
          mt-8 min-h-12 px-6 rounded-xl
          font-medium text-white dark:text-ink
          bg-ink hover:bg-zinc-800 active:bg-black dark:bg-white dark:hover:bg-zinc-200 dark:active:bg-zinc-300
          focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700
          transition-colors duration-200
        "
      >
        Try again
      </button>
    </div>
  );
}

function SocialLink({ href, label, brandColor, brandBg, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ "--brand-color": brandColor, "--brand-bg": brandBg }}
      className="
        w-11 h-11 rounded-xl
        border border-zinc-300 dark:border-zinc-700
        flex items-center justify-center
        text-lg text-zinc-700 dark:text-zinc-300
        hover:text-(--brand-color) hover:border-(--brand-color) hover:bg-(--brand-bg)
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:focus-visible:outline-blue-400
        transition-colors duration-200
      "
    >
      {children}
    </a>
  );
}

// Photo framed like a selected frame in a design tool: dashed guides and
// corner marks (DESIGN.md motif), plus an offset accent ring. The frame-*
// classes (index.css) draw the guides in once the photo column is shown.
function FramedPhoto({ profile }) {
  return (
    <div className="relative w-[220px] h-[220px] sm:w-[300px] sm:h-[300px] lg:w-[360px] lg:h-[360px]">

      {/* Guides and marks: decoration only */}
      <div aria-hidden="true">
        <span className="frame-line-v absolute -left-4 sm:-left-6 top-8 sm:top-10 -bottom-4 sm:-bottom-6 border-l-2 border-dashed border-zinc-400 dark:border-zinc-600" />
        <span className="frame-line-h absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 right-8 sm:right-12 border-b-2 border-dashed border-zinc-400 dark:border-zinc-600" />
        <span className="frame-mark absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-8 h-8 sm:w-10 sm:h-10 border-t-2 border-r-2 border-ink dark:border-white" />
        <span className="frame-mark absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 w-8 h-8 sm:w-10 sm:h-10 border-b-2 border-l-2 border-ink dark:border-white" />
        {/* Sparkle kept by the owner's choice (DESIGN.md, exceptions). */}
        <span className="frame-sparkle absolute -top-2 right-4 sm:-top-3 sm:right-6 text-xl sm:text-2xl leading-none text-blue-700 dark:text-blue-400">✦</span>
        <span className="frame-mark absolute bottom-6 sm:bottom-8 -left-1.5 w-3 h-3 rounded-full bg-blue-700 dark:bg-blue-400" />
      </div>

      {/* Offset accent ring */}
      <span aria-hidden="true" className="frame-ring absolute inset-0 rounded-full border-2 border-blue-700 dark:border-blue-400 translate-x-2 translate-y-1.5 sm:translate-x-3 sm:translate-y-2" />

      {/* Photo: the largest image on the first screen, so it is fetched first
          and has intrinsic dimensions to reserve its space. */}
      <div className="frame-photo relative w-full h-full rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
        {profile ? (
          <img
            src={profile.profile_image || profileImage}
            alt={profile.full_name}
            width={360}
            height={360}
            fetchPriority="high"
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div aria-hidden="true" className="w-full h-full animate-pulse" />
        )}
      </div>
    </div>
  );
}

function Hero({ profile, socialLinks = [], error, onRetry }) {
  const { theme } = useTheme();
  const firstName = firstPart(profile?.full_name, " ");
  const role = firstPart(profile?.headline, "|");
  const city = firstPart(profile?.location, ",");
  const profileState = profile ? "loaded" : error ? "error" : "loading";
  const socials = buildSocialItems(profile || {}, socialLinks);

  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-white dark:bg-ink pt-28 pb-16 md:pt-36 md:pb-28"
    >

      {/* Pastel background blobs: kept by the owner's choice (DESIGN.md,
          exceptions). Static, pale tints of the blue accent, Hero only. */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none dark:opacity-15">
        <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-blue-200/60 blur-[110px]" />
        <div className="absolute bottom-0 left-1/3 w-[360px] h-[360px] rounded-full bg-sky-100 blur-[100px]" />
        <div className="absolute top-10 right-0 w-[380px] h-[380px] rounded-full bg-blue-100 blur-[110px]" />
      </div>

      <Container className="relative">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-10 sm:gap-14 lg:gap-12 items-center">

          {/* Text: heading, bio, buttons and links enter one after another.
              Keyed on the profile state so the entrance plays for the real
              content, not just for the loading skeleton. */}
          <Reveal key={`text-${profileState}`} variant="group" stagger={110}>
            {profile ? (
              <>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight text-ink dark:text-white">
                  Hello! I&apos;m <strong className="font-bold">{firstName || profile.full_name}</strong>
                  {role && <>, a <strong className="font-bold">{role}</strong></>}
                  {city && <> based in <strong className="font-bold">{city}</strong></>}
                </h1>

                {profile.short_bio && (
                  <p className="mt-5 sm:mt-6 text-base sm:text-lg leading-7 sm:leading-8 text-zinc-600 dark:text-zinc-400 max-w-xl">
                    {profile.short_bio}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8 sm:mt-10">
                  <Button href="#contact">
                    Let&apos;s Talk
                    <MessageCircleMore className="size-5" aria-hidden="true" />
                  </Button>

                  {profile.resume_url && (
                    <Button href={profile.resume_url} target="_blank" rel="noopener noreferrer" variant="outline">
                      Download CV
                    </Button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-4 mt-8">
                  <p className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                    <span aria-hidden="true" className="w-2 h-2 rounded-full bg-emerald-600" />
                    Available for work
                  </p>

                  {socials.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {socials.map(({ key, href, label, brandColor, brandBg, darkBrandColor, darkBrandBg, icon: Icon }) => (
                        <SocialLink
                          key={key}
                          href={href}
                          label={label}
                          brandColor={theme === "dark" ? darkBrandColor : brandColor}
                          brandBg={theme === "dark" ? darkBrandBg : brandBg}
                        >
                          <Icon aria-hidden="true" />
                        </SocialLink>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : error ? (
              <HeroError onRetry={onRetry} />
            ) : (
              <HeroTextSkeleton />
            )}
          </Reveal>

          {/* Photo */}
          <Reveal key={`photo-${profileState}`} variant="fade" delay={150} className="flex justify-center lg:justify-end lg:pr-8 py-4 sm:py-8">
            <FramedPhoto profile={profile} />
          </Reveal>

        </div>
      </Container>

    </section>
  );
}

export default Hero;
