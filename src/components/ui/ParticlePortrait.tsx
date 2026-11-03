"use client";

import { useEffect, useRef } from "react";

type ParticlePortraitProps = {
  src: string;
  className?: string;
  /** Delay before particles start assembling, in seconds. */
  delay?: number;
};

type Particle = {
  x: number;
  y: number;
  tx: number;
  ty: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
};

const THRESHOLD = 34;
const REPEL_RADIUS = 90;

export function ParticlePortrait({ src, className = "", delay = 0 }: ParticlePortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const image = new Image();
    image.src = src;

    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let startAt = performance.now() + delay * 1000;
    const pointer = { x: -9999, y: -9999 };

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !image.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fit the image inside the canvas (contain), anchored to the bottom.
      const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
      const drawW = image.naturalWidth * scale;
      const drawH = image.naturalHeight * scale;
      const offsetX = (width - drawW) / 2;
      const offsetY = height - drawH;

      const gap = width < 420 ? 2.5 : 3;
      const cols = Math.floor(drawW / gap);
      const rows = Math.floor(drawH / gap);
      const sample = document.createElement("canvas");
      sample.width = cols;
      sample.height = rows;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;
      sctx.drawImage(image, 0, 0, cols, rows);
      const { data } = sctx.getImageData(0, 0, cols, rows);

      const previous = particles;
      particles = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const i = (row * cols + col) * 4;
          const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          if (lum < THRESHOLD) continue;
          const t = Math.pow(lum / 255, 0.75);
          const tx = offsetX + col * gap + (Math.random() - 0.5) * gap * 0.6;
          const ty = offsetY + row * gap + (Math.random() - 0.5) * gap * 0.6;
          const old = previous[particles.length];
          particles.push({
            x: old ? old.x : reduced ? tx : Math.random() * width,
            y: old ? old.y : reduced ? ty : Math.random() * height,
            tx,
            ty,
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
      for (const p of particles) {
        if (!reduced) {
          if (started) {
            p.vx += (p.tx - p.x) * 0.018;
            p.vy += (p.ty - p.y) * 0.018;
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
        ctx.globalAlpha = p.alpha * twinkle * (started || reduced ? 1 : 0.35);
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

    image.onload = () => {
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

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersection.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      image.onload = null;
    };
  }, [src, delay]);

  return <canvas ref={canvasRef} aria-hidden className={`block h-full w-full ${className}`} />;
}
