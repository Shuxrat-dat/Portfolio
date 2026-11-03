"use client";

import { useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*/<>_";
const KEEP = new Set([" ", "—", "·", "-", ",", "."]);
const FRAME_MS = 45;

type ScrambleTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
};

/** Terminal-style decode: random glyphs resolve left to right into the text. Best on mono fonts. */
export function ScrambleText({ text, className = "", delay = 0, duration = 0.9 }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });
  const reduced = useReducedMotion();
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!inView || reduced) return;
    let frame = 0;
    let last = 0;
    const start = performance.now() + delay * 1000;

    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / (duration * 1000)));
      if (now - last >= FRAME_MS || t === 1) {
        last = now;
        const revealed = Math.floor(t * text.length);
        setOutput(
          Array.from(text, (char, index) =>
            index < revealed || KEEP.has(char)
              ? char
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          ).join(""),
        );
      }
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reduced, text, delay, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{output}</span>
    </span>
  );
}
