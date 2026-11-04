"use client";

import type { MotionValue } from "framer-motion";
import { useEffect, useRef } from "react";

type Source = { image: string } | { text: string };

type ParticleFieldProps = {
  source: Source;
  className?: string;
  /** Delay before particles start assembling, in seconds. */
  delay?: number;
  /** 0 = assembled, 1 = fully scattered. Drives a scroll-linked break-up or build-up. */
  scatter?: MotionValue<number>;
  /** Which way particles fly when scattered. */
  scatterDirection?: "down" | "up";
  /** Where particles appear on load: random over the canvas, or at their scattered position. */
  start?: "random" | "scatter";
  /** Empty margin (px) kept around a text source so flying particles stay visible. */
  pad?: { x: number; y: number };
};

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
};

const THRESHOLD = 34;
const REPEL_RADIUS = 90;
const CHROME_STOPS: [number, string][] = [
  [0, "#ffffff"],
  [0.26, "#f4f4f5"],
  [0.5, "#a1a1aa"],
  [0.56, "#52525b"],
  [0.78, "#d4d4d8"],
  [1, "#ffffff"],
];

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

export function ParticleField({
  source,
  className = "",
  delay = 0,
  scatter,
  scatterDirection = "down",
  start = "random",
  pad = { x: 0, y: 0 },
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageSrc = "image" in source ? source.image : null;
  const text = "text" in source ? source.text : null;
  const padX = pad.x;
  const padY = pad.y;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const image = imageSrc ? new Image() : null;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let disposed = false;
    let startAt = performance.now() + delay * 1000;
    const pointer = { x: -9999, y: -9999 };

    // Paints the source into a small grid; each lit cell becomes a particle.
    const sampleSource = (gap: number) => {
      const sample = document.createElement("canvas");
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      if (!sctx) return null;

      if (image) {
        const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
        const drawW = image.naturalWidth * scale;
        const drawH = image.naturalHeight * scale;
        sample.width = Math.floor(drawW / gap);
        sample.height = Math.floor(drawH / gap);
        sctx.drawImage(image, 0, 0, sample.width, sample.height);
        // Fit inside the canvas (contain), anchored to the bottom.
        return { sctx, cols: sample.width, rows: sample.height, offsetX: (width - drawW) / 2, offsetY: height - drawH };
      }

      const innerW = Math.max(1, width - padX * 2);
      const innerH = Math.max(1, height - padY * 2);
      sample.width = Math.floor(innerW / gap);
      sample.height = Math.floor(innerH / gap);
      const family = getComputedStyle(canvas).fontFamily;
      let size = sample.height * 1.05;
      sctx.font = `700 ${size}px ${family}`;
      const measured = sctx.measureText(text ?? "").width;
      if (measured > sample.width * 0.96) size *= (sample.width * 0.96) / measured;
      sctx.font = `700 ${size}px ${family}`;
      sctx.textAlign = "center";
      sctx.textBaseline = "middle";
      const gradient = sctx.createLinearGradient(0, sample.height / 2 - size / 2, 0, sample.height / 2 + size / 2);
      for (const [stop, color] of CHROME_STOPS) gradient.addColorStop(stop, color);
      sctx.fillStyle = gradient;
      sctx.fillText(text ?? "", sample.width / 2, sample.height / 2 + size * 0.04);
      return { sctx, cols: sample.width, rows: sample.height, offsetX: padX, offsetY: padY };
    };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || (image && !image.naturalWidth)) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const gap = width < 420 ? 2.5 : 3;
      const sampled = sampleSource(gap);
      if (!sampled) return;
      const { sctx, cols, rows, offsetX, offsetY } = sampled;
      const { data } = sctx.getImageData(0, 0, cols, rows);
      const s0 = scatter ? scatter.get() : 0;

      const previous = particles;
      particles = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = (row * cols + col) * 4;
          if (data[i + 3] < 128) continue;
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          if (lum < THRESHOLD) continue;
          const t = Math.pow(lum / 255, 0.75);
          const tx = offsetX + col * gap + (Math.random() - 0.5) * gap * 0.6;
          const ty = offsetY + row * gap + (Math.random() - 0.5) * gap * 0.6;
          const sx = (Math.random() - 0.5) * width * 1.5;
          const sy =
            scatterDirection === "down"
              ? Math.random() * height * 1.1 + height * 0.2
              : -(Math.random() * height * 1.4 + height * 0.3);
          const old = previous[particles.length];
          let x = tx + sx * s0;
          let y = ty + sy * s0;
          if (old) {
            x = old.x;
            y = old.y;
          } else if (!reduced && start === "random") {
            x = Math.random() * width;
            y = Math.random() * height;
          }
          particles.push({
            x,
            y,
            tx,
            ty,
            sx,
            sy,
            vx: 0,
            vy: 0,
            size: 0.7 + t * (gap * 0.5),
            alpha: Math.min(1, 0.22 + t),
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      const started = now >= startAt;
      const s = reduced || !scatter ? 0 : easeInOut(Math.min(1, Math.max(0, scatter.get())));
      for (const p of particles) {
        if (!reduced) {
          if (started) {
            p.vx += (p.tx + p.sx * s - p.x) * 0.018;
            p.vy += (p.ty + p.sy * s - p.y) * 0.018;
          }
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist = dx * dx + dy * dy;
          if (dist < REPEL_RADIUS * REPEL_RADIUS) {
            const force = (1 - Math.sqrt(dist) / REPEL_RADIUS) * 2.4;
            const angle = Math.atan2(dy, dx);
            p.vx += Math.cos(angle) * force;
            p.vy += Math.sin(angle) * force;
          }
          p.vx *= 0.86;
          p.vy *= 0.86;
          p.x += p.vx;
          p.y += p.vy;
        }
        const twinkle = reduced ? 1 : 0.82 + Math.sin(now * 0.0016 + p.phase) * 0.18;
        ctx.globalAlpha = p.alpha * twinkle * (1 - s * 0.55) * (started || reduced ? 1 : 0.35);
        ctx.fillStyle = "#f4f4f5";
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    };

    const loop = (now: number) => {
      if (visible) draw(now);
      frame = requestAnimationFrame(loop);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    const resizeObserver = new ResizeObserver(() => {
      build();
      if (reduced) draw(performance.now());
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });

    const begin = () => {
      if (disposed) return;
      startAt = Math.max(startAt, performance.now() + 150);
      build();
      resizeObserver.observe(canvas);
      intersection.observe(canvas);
      if (reduced) {
        draw(performance.now());
        return;
      }
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
      frame = requestAnimationFrame(loop);
    };

    if (image && imageSrc) {
      image.onload = begin;
      image.src = imageSrc;
    } else {
      // Sample text only once the web font is ready, or it would use the fallback face.
      document.fonts.ready.then(begin);
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      if (image) image.onload = null;
    };
  }, [imageSrc, text, delay, scatter, scatterDirection, start, padX, padY]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none block h-full w-full ${className}`}
    />
  );
}
