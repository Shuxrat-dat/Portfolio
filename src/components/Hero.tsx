"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { profile } from "@/data/content";
import { heroProgress } from "@/lib/heroProgress";
import { getIntroDelay } from "./IntroOverlay";
import { MagneticButton } from "./ui/MagneticButton";
import { ParticleField } from "./ui/ParticleField";
import { ScrambleText } from "./ui/ScrambleText";

type NameGeometry = { dx: number; dy: number; scale: number; distance: number };

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [base] = useState(getIntroDelay);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const portraitY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const portraitOpacity = useTransform(scrollYProgress, [0.3, 0.75], [1, 0]);
  // Portrait breaks into dust as the visitor scrolls on; About rebuilds it into "4,7".
  const portraitScatter = useTransform(scrollYProgress, [0.04, 0.6], [0, 1]);

  // Scroll-linked flight of the big name into the header logo.
  const nameRef = useRef<HTMLSpanElement>(null);
  const geometry = useRef<NameGeometry | null>(null);
  const nameX = useMotionValue(0);
  const nameY = useMotionValue(0);
  const nameScale = useMotionValue(1);
  const nameOpacity = useMotionValue(1);
  const { scrollY } = useScroll();

  const applyFlight = useCallback(
    (sy: number) => {
      const el = nameRef.current;
      const logo = document.getElementById("header-logo");
      if (!el || !logo) return;
      if (sy <= 0) {
        nameX.set(0);
        nameY.set(0);
        nameScale.set(1);
        nameOpacity.set(1);
        heroProgress.set(0);
        return;
      }
      if (!geometry.current) {
        const previous = el.style.transform;
        el.style.transform = "none";
        const from = el.getBoundingClientRect();
        el.style.transform = previous;
        const to = logo.getBoundingClientRect();
        geometry.current = {
          dx: to.left - from.left,
          dy: to.top - (from.top + sy),
          scale: to.width / from.width,
          distance: window.innerHeight * 0.6,
        };
      }
      const g = geometry.current;
      const p = Math.min(1, sy / g.distance);
      const e = easeInOutCubic(p);
      nameX.set(g.dx * e);
      nameY.set(sy + g.dy * e);
      nameScale.set(1 + (g.scale - 1) * e);
      nameOpacity.set(p < 0.82 ? 1 : 1 - (p - 0.82) / 0.18);
      heroProgress.set(p);
    },
    [nameX, nameY, nameScale, nameOpacity],
  );

  useEffect(() => {
    if (reduced) {
      heroProgress.set(1);
      return;
    }
    const onResize = () => {
      geometry.current = null;
      applyFlight(window.scrollY);
    };
    window.addEventListener("resize", onResize);
    applyFlight(window.scrollY);
    return () => window.removeEventListener("resize", onResize);
  }, [reduced, applyFlight]);

  useMotionValueEvent(scrollY, "change", (value) => {
    if (!reduced) applyFlight(value);
  });

  const [first, last] = profile.name.split(" ");
  const fade = (delay: number, y = 18) => ({
    initial: reduced ? false : { opacity: 0, y, filter: "blur(8px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay: base + delay, ease },
  });

  return (
    <section id="top" ref={ref} className="relative z-1 overflow-hidden">
      <div className="relative flex min-h-[100svh] flex-col justify-end pt-28 pb-10 md:pb-14">
        <motion.div
          aria-hidden
          style={{ y: portraitY, opacity: portraitOpacity }}
          className="portrait-mask absolute inset-x-0 top-[7svh] bottom-[9svh] mx-auto w-[min(96vw,760px)]"
        >
          <div className="absolute inset-x-[15%] top-[18%] bottom-[20%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.09),transparent_68%)] blur-3xl" />
          <ParticleField
            source={{ image: "/portrait.webp" }}
            delay={base + 0.2}
            scatter={portraitScatter}
          />
        </motion.div>

        <div className="container relative z-10">
          <h1
            aria-label={profile.name}
            className="flex justify-center text-[clamp(4.6rem,20.5vw,16rem)] leading-[0.82] font-bold tracking-[-0.06em] uppercase"
          >
            <motion.span
              ref={nameRef}
              className="inline-flex will-change-transform"
              style={{
                x: nameX,
                y: nameY,
                scale: nameScale,
                opacity: nameOpacity,
                transformOrigin: "0 0",
              }}
            >
              {first.split("").map((letter, index) => (
                <span key={index} aria-hidden className="inline-block overflow-hidden pb-[0.06em]">
                  <motion.span
                    className="chrome-text chrome-shine inline-block"
                    initial={reduced ? false : { y: "105%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 1, delay: base + 0.45 + index * 0.05, ease }}
                  >
                    {letter}
                  </motion.span>
                </span>
              ))}
            </motion.span>
          </h1>

          <div className="mt-5 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-5 text-center md:flex-row md:text-left">
            <motion.p {...fade(0.85)} className="text-base text-muted md:text-lg">
              <span className="font-semibold text-ink">{last}</span>
              <span className="mx-2 text-dim">/</span>
              {profile.role}
            </motion.p>
            <motion.div
              {...fade(0.95)}
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 backdrop-blur-xl"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
              </span>
              <ScrambleText
                text={`Open to work · ${profile.level}`}
                delay={base + 0.95}
                className="font-mono text-[11px] tracking-[0.18em] text-muted uppercase"
              />
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container relative z-10 pt-10 pb-24 md:pt-16 md:pb-32">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <motion.p
            {...fade(1.05)}
            className="max-w-2xl text-xl leading-relaxed text-muted md:text-[1.55rem]"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            {...fade(1.15)}
            className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 font-mono text-sm text-muted backdrop-blur-xl"
          >
            <div>
              <span className="text-ink">Опыт</span> · {profile.experience}
            </div>
            <div>
              <span className="text-ink">Локация</span> · {profile.location}
            </div>
            <div>
              <span className="text-ink">Фокус</span> · API · UI · Production
            </div>
          </motion.div>
        </div>

        <motion.div {...fade(1.25)} className="mt-11 flex flex-wrap gap-3">
          <MagneticButton href="#portfolio">Смотреть проекты</MagneticButton>
          <MagneticButton href="#competencies" variant="ghost">
            Компетенции
          </MagneticButton>
          <MagneticButton href="#contact" variant="ghost">
            Написать мне
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
