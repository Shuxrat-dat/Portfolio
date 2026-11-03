"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/data/content";

const STORAGE_KEY = "intro-seen";
const SKIP_CLASS = "intro-skip";

/** Seconds the hero should wait so its entrance starts as the intro leaves. */
export const INTRO_DURATION = 2.7;

/**
 * Runs before paint (inlined in <head>) so returning visitors and
 * reduced-motion users never see the overlay flash.
 */
export const introBootScript = `try{if(sessionStorage.getItem("${STORAGE_KEY}")||matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.classList.add("${SKIP_CLASS}")}catch(e){document.documentElement.classList.add("${SKIP_CLASS}")}`;

export function getIntroDelay() {
  if (typeof document === "undefined") return 0;
  return document.documentElement.classList.contains(SKIP_CLASS) ? 0 : INTRO_DURATION;
}

type Phase = "write" | "morph" | "done";

const ease = [0.22, 1, 0.36, 1] as const;

export function IntroOverlay() {
  const [phase, setPhase] = useState<Phase>("write");
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.classList.contains(SKIP_CLASS)) {
      setSkipped(true);
      return;
    }
    root.style.overflow = "hidden";
    const toMorph = window.setTimeout(() => setPhase("morph"), 1350);
    const toDone = window.setTimeout(() => setPhase("done"), INTRO_DURATION * 1000 - 300);
    return () => {
      window.clearTimeout(toMorph);
      window.clearTimeout(toDone);
      root.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (phase !== "done") return;
    document.documentElement.style.overflow = "";
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  }, [phase]);

  if (skipped) return null;

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          className="intro-overlay fixed inset-0 z-[100] flex cursor-pointer items-center justify-center overflow-hidden bg-black"
          onClick={() => setPhase("done")}
          exit={{ opacity: 0, filter: "blur(12px)", transition: { duration: 0.6, ease } }}
          aria-hidden
        >
          <div className="noise" />
          <AnimatePresence mode="wait">
            {phase === "write" ? (
              <motion.div
                key="name"
                className="relative"
                exit={{ opacity: 0, scale: 1.08, filter: "blur(14px)", transition: { duration: 0.35 } }}
              >
                <motion.span
                  className="chrome-text block text-[clamp(3rem,13vw,9rem)] font-bold uppercase leading-none tracking-[-0.04em]"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  animate={{ clipPath: "inset(0 0% 0 0)" }}
                  transition={{ duration: 1.05, delay: 0.15, ease: [0.65, 0, 0.35, 1] }}
                >
                  {profile.shortName}
                </motion.span>
                <motion.span
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_6px_rgba(255,255,255,0.75),0_0_80px_24px_rgba(255,255,255,0.25)]"
                  initial={{ left: "0%", opacity: 0, scale: 0.4 }}
                  animate={{ left: "100%", opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 0.4] }}
                  transition={{ duration: 1.05, delay: 0.15, ease: [0.65, 0, 0.35, 1] }}
                />
              </motion.div>
            ) : (
              <motion.span
                key="portfolio"
                className="chrome-text chrome-shine block text-[clamp(3rem,14vw,10rem)] font-bold uppercase leading-none tracking-[-0.045em]"
                initial={{ opacity: 0, scale: 0.92, filter: "blur(14px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.6, ease }}
              >
                Portfolio
              </motion.span>
            )}
          </AnimatePresence>
          <span className="absolute bottom-8 font-mono text-[10px] uppercase tracking-[0.3em] text-dim">
            Нажмите, чтобы пропустить
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
