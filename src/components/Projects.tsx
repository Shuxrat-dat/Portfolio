"use client";

import Image from "next/image";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { projects } from "@/data/content";
import { MagneticButton } from "./ui/MagneticButton";
import { ScrambleText } from "./ui/ScrambleText";
import { ScrollText } from "./ui/ScrollText";

type Project = (typeof projects)[number];

function ProjectScreenshot({
  project,
  mouseX,
  mouseY,
}: {
  project: Project;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduce = useReducedMotion();

  const parallaxX = useTransform(mouseX, [0, 1], reduce ? [0, 0] : [-12, 12]);
  const parallaxY = useTransform(mouseY, [0, 1], reduce ? [0, 0] : [-10, 10]);

  // The wrapper observes the viewport: a fully clipped element never registers as in view.
  return (
    <motion.div
      className="relative"
      initial={reduce ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
    >
      <div
        className="pointer-events-none absolute -inset-6 rounded-[2rem] opacity-60 blur-3xl"
        style={{
          background: `radial-gradient(circle at 40% 30%, ${project.accent}33, transparent 55%)`,
        }}
      />

      <motion.div
        className="relative overflow-hidden rounded-[1.6rem] border border-white/[0.12] bg-[#09090b] shadow-[0_40px_100px_rgba(0,0,0,0.55)]"
        variants={{
          hidden: { clipPath: "inset(0 100% 0 0 round 1.6rem)" },
          visible: {
            clipPath: "inset(0 0% 0 0 round 1.6rem)",
            transition: { duration: 1.1, ease: [0.65, 0, 0.35, 1] },
          },
        }}
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-xl">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/90" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/90" />
          <span className="ml-3 truncate font-mono text-[11px] tracking-[0.14em] text-white/30">
            {project.slug}.app
          </span>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden bg-[#070709] sm:aspect-[16/9]">
          {!failed ? (
            <motion.div
              className="absolute inset-[-4%]"
              style={{ x: parallaxX, y: parallaxY }}
              variants={{
                hidden: { scale: 1.15 },
                visible: { scale: 1, transition: { duration: 1.4, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <Image
                src={project.image}
                alt={`Скриншот проекта ${project.title}`}
                fill
                sizes="(max-width: 900px) 100vw, 62vw"
                className={`object-cover object-top transition-[transform,opacity,filter] duration-700 ease-out will-change-transform group-hover:scale-[1.045] ${
                  loaded ? "opacity-100 blur-0" : "opacity-0 blur-sm"
                }`}
                onLoad={() => setLoaded(true)}
                onError={() => setFailed(true)}
                priority={
                  project.slug === "companyos" ||
                  project.slug === "payforge" ||
                  project.slug === "ai-agent"
                }
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-white/35">
              Screenshot unavailable
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/[0.04]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

          {/* Soft reflection */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.07] to-transparent opacity-70" />
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({
  project,
  index,
  compact = false,
}: {
  project: Project;
  index: number;
  /** Denser layout that fits one viewport, used by the horizontal track. */
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const rotateXSource = useTransform(mouseY, [0, 1], [5, -5]);
  const rotateYSource = useTransform(mouseX, [0, 1], [-5, 5]);
  const glowXSource = useTransform(mouseX, [0, 1], [0, 100]);
  const glowYSource = useTransform(mouseY, [0, 1], [0, 100]);
  const rotateX = useSpring(rotateXSource, { stiffness: 180, damping: 22 });
  const rotateY = useSpring(rotateYSource, { stiffness: 180, damping: 22 });
  const glowX = useSpring(glowXSource, { stiffness: 120, damping: 20 });
  const glowY = useSpring(glowYSource, { stiffness: 120, damping: 20 });

  const cursorGlow = useMotionTemplate`radial-gradient(520px circle at ${glowX}% ${glowY}%, ${project.accent}22, transparent 42%)`;
  const borderGlow = useMotionTemplate`radial-gradient(420px circle at ${glowX}% ${glowY}%, ${project.accent}aa, rgba(255,255,255,0.12) 35%, transparent 60%)`;

  const reversed = !compact && index % 2 === 1;

  const onMove = (event: MouseEvent<HTMLElement>) => {
    if (reduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((event.clientX - rect.left) / rect.width);
    mouseY.set((event.clientY - rect.top) / rect.height);
  };

  const onLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.article
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      initial={reduce ? false : { opacity: 0, y: 48, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: 0.95,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformPerspective: 1200,
      }}
      className="group relative"
      data-cursor="pointer"
    >
      {/* Animated gradient border */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[2.1rem] opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: borderGlow }}
      />

      <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.045),rgba(255,255,255,0.015))] shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl transition-[box-shadow,transform] duration-500 group-hover:shadow-[0_50px_120px_rgba(0,0,0,0.6)]">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: cursorGlow }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        <div
          className={`relative grid items-center ${
            compact
              ? "gap-10 p-8 lg:grid-cols-[1.1fr_1fr] xl:p-10"
              : `gap-10 p-6 sm:p-8 lg:gap-14 lg:p-12 xl:p-14 ${
                  reversed ? "lg:grid-cols-[0.92fr_1.18fr]" : "lg:grid-cols-[1.18fr_0.92fr]"
                }`
          }`}
        >
          <div className={reversed ? "lg:order-2" : "lg:order-1"}>
            <ProjectScreenshot
              project={project}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          </div>

          <div className={`flex flex-col ${reversed ? "lg:order-1" : "lg:order-2"}`}>
            <div className="mb-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/35">
              <span style={{ color: project.accent }}>{project.id}</span>
              <span className="h-px w-8 bg-white/15" />
              <span>Case Study</span>
            </div>

            <motion.h3
              className={`${
                compact ? "text-[clamp(2rem,3vw,2.75rem)]" : "text-[clamp(2.2rem,4vw,3.4rem)]"
              } font-semibold tracking-[-0.04em] text-white`}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              {project.title}
            </motion.h3>

            <p
              className="mt-3 text-base font-medium tracking-tight sm:text-lg"
              style={{ color: project.accent }}
            >
              {project.subtitle}
            </p>

            <p
              className={`max-w-xl text-white/72 ${
                compact ? "mt-4 text-[0.98rem] leading-[1.65]" : "mt-5 text-[1.05rem] leading-[1.75]"
              }`}
            >
              {project.summary}
            </p>
            {!compact && (
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/45">
                {project.description}
              </p>
            )}

            <div className={compact ? "mt-6" : "mt-8"}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">
                Key Features
              </p>
              <ul className={compact ? "grid grid-cols-2 gap-x-5 gap-y-2" : "space-y-2.5"}>
                {project.features.map((feature, featureIndex) => (
                  <motion.li
                    key={feature}
                    initial={reduce ? false : { opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.15 + featureIndex * 0.04,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-start gap-3 text-sm leading-relaxed text-white/70"
                  >
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        background: project.accent,
                        boxShadow: `0 0 12px ${project.accent}88`,
                      }}
                    />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className={compact ? "mt-6" : "mt-8"}>
              <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-white/30">
                Technology Stack
              </p>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech, techIndex) => (
                  <motion.span
                    key={tech}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -3, scale: 1.04 }}
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 22,
                      delay: reduce ? 0 : techIndex * 0.03,
                    }}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 font-mono text-[11px] text-white/65 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>

            <div className={`${compact ? "mt-7" : "mt-10"} flex flex-wrap items-center gap-3`}>
              <MagneticButton href={project.href} external>
                Open Case Study
              </MagneticButton>
              <MagneticButton href={project.href} variant="ghost" external>
                View on GitHub
              </MagneticButton>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

const HORIZONTAL_QUERY =
  "(min-width: 1024px) and (min-height: 720px) and (prefers-reduced-motion: no-preference)";

/** Horizontal track only where a compact card fits the viewport and motion is welcome. */
function useHorizontalLayout() {
  const [horizontal, setHorizontal] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(HORIZONTAL_QUERY);
    const update = () => setHorizontal(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return horizontal;
}

/** Pins the section and turns vertical scroll into a sideways slide through the cards. */
function HorizontalTrack() {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [shift, setShift] = useState(0);
  const [active, setActive] = useState(0);
  const shiftValue = useMotionValue(0);
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const x = useTransform(() => -scrollYProgress.get() * shiftValue.get());

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const next = Math.max(0, track.scrollWidth - window.innerWidth);
      setShift(next);
      shiftValue.set(next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [shiftValue]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive(Math.min(projects.length - 1, Math.round(progress * (projects.length - 1))));
  });

  return (
    <div ref={pinRef} className="relative" style={{ height: `calc(100vh + ${shift}px)` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex w-max gap-8 px-[max(1.25rem,calc((100vw-1200px)/2))]"
        >
          {projects.map((project, index) => (
            <div key={project.slug} className="w-[min(1200px,calc(100vw-2.5rem))] shrink-0">
              <ProjectCard project={project} index={index} compact />
            </div>
          ))}
        </motion.div>

        <div className="mx-auto mt-8 flex w-[min(1200px,calc(100%-2.5rem))] items-center gap-5 font-mono text-[11px] tracking-[0.18em] text-dim uppercase">
          <span className="text-ink">{String(active + 1).padStart(2, "0")}</span>
          <span className="relative h-px flex-1 overflow-hidden bg-white/10">
            <motion.span
              className="absolute inset-0 origin-left bg-gradient-to-r from-white/40 to-white"
              style={{ scaleX: scrollYProgress }}
            />
          </span>
          <span>{String(projects.length).padStart(2, "0")}</span>
          <span className="hidden xl:inline">· {projects[active].title}</span>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const reduce = useReducedMotion();
  const horizontal = useHorizontalLayout();

  return (
    <section id="portfolio" className="relative overflow-clip py-[clamp(6rem,12vw,10rem)]">
      {/* Premium depth background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(900px_circle_at_20%_10%,rgba(255,255,255,0.12),transparent_45%),radial-gradient(700px_circle_at_80%_40%,rgba(212,212,216,0.08),transparent_40%),linear-gradient(180deg,#050505_0%,#08080c_45%,#050505_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[length:72px_72px] opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
        <motion.div
          aria-hidden
          className="absolute top-[15%] left-[-10%] h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl"
          animate={reduce ? undefined : { x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          aria-hidden
          className="absolute right-[-8%] bottom-[10%] h-[380px] w-[380px] rounded-full bg-accent-2/10 blur-3xl"
          animate={reduce ? undefined : { x: [0, -30, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 mx-auto w-[min(1200px,calc(100%-1.5rem))] sm:w-[min(1200px,calc(100%-2.5rem))]">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 max-w-3xl md:mb-24"
        >
          <p className="eyebrow">
            <ScrambleText text="04 — Портфолио" />
          </p>
          <h2 className="section-title mt-4">
            Проекты,
            <br />
            <span className="gradient-text">которые показывают подход</span>
          </h2>
          <ScrollText
            className="section-lead mt-4 max-w-2xl"
            text="Кейсы с фокусом на архитектуру, API, интерфейс и production-готовность."
          />
        </motion.div>

        {!horizontal && (
          <div className="flex flex-col gap-16 md:gap-24 lg:gap-28">
            {projects.map((project, index) => (
              <ProjectCard key={project.slug} project={project} index={index} />
            ))}
          </div>
        )}
      </div>

      {horizontal && <HorizontalTrack />}
    </section>
  );
}
