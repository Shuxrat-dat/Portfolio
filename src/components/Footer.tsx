"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { profile } from "@/data/content";
import { Magnetic } from "./ui/Magnetic";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  // Chrome rises inside the outlined name as the visitor reaches the very bottom.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  // Ends before 1: on phones the measured progress tops out a little short of the bottom.
  const fill = useTransform(scrollYProgress, [0.1, 0.75], [100, 0]);
  const clipPath = useTransform(fill, (value) => `inset(${reduced ? 0 : value}% 0 0 0)`);
  const lift = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [60, 0]);

  return (
    <footer ref={ref} className="relative z-1 overflow-hidden border-t border-white/8 pt-20">
      <motion.div style={{ y: lift }} className="container" aria-hidden>
        <div className="relative select-none text-center text-[clamp(4.6rem,20.5vw,16rem)] leading-[0.82] font-bold tracking-[-0.06em] uppercase">
          <span className="block text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.22)]">
            {profile.shortName}
          </span>
          <motion.span className="absolute inset-0 block" style={{ clipPath }}>
            <span className="chrome-text chrome-shine block">{profile.shortName}</span>
          </motion.span>
        </div>
      </motion.div>

      <div className="container mt-12 flex flex-col gap-4 border-t border-white/8 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Magnetic strength={0.2}>
            <a
              href={profile.contacts.githubHref}
              target="_blank"
              rel="noreferrer"
              data-cursor="pointer"
              className="transition hover:text-ink"
            >
              GitHub
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a
              href={profile.contacts.telegramHref}
              target="_blank"
              rel="noreferrer"
              data-cursor="pointer"
              className="transition hover:text-ink"
            >
              Telegram
            </a>
          </Magnetic>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-dim">
            Backend · Middle
          </span>
        </div>
      </div>
    </footer>
  );
}
