"use client";

import { motion, useScroll, useMotionValueEvent, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { profile } from "@/data/content";
import { heroProgress } from "@/lib/heroProgress";
import { Magnetic } from "./ui/Magnetic";

const links = [
  { href: "#about", id: "about", label: "О себе" },
  { href: "#competencies", id: "competencies", label: "Компетенции" },
  { href: "#skills", id: "skills", label: "Навыки" },
  { href: "#portfolio", id: "portfolio", label: "Проекты" },
  { href: "#contact", id: "contact", label: "Контакты" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("top");
  const { scrollY } = useScroll();
  const logoOpacity = useTransform(heroProgress, [0.85, 1], [0, 1]);

  // Keep the glass pill off until the hero name has landed, so it doesn't blur the flight.
  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 20 && heroProgress.get() >= 0.98);
  });
  useMotionValueEvent(heroProgress, "change", (progress) => {
    setScrolled(scrollY.get() > 20 && progress >= 0.98);
  });

  useEffect(() => {
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { rootMargin: "-35% 0px -50% 0px", threshold: [0.15, 0.35, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      className="fixed inset-x-0 top-0 z-50"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`mx-auto mt-3 w-[min(1180px,calc(100%-1.4rem))] rounded-full border transition-all duration-500 ${
          scrolled
            ? "border-white/10 bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="flex h-[3.9rem] items-center justify-between px-4 md:px-5">
          <Magnetic strength={0.2}>
            <motion.a
              href="#top"
              aria-label={profile.shortName}
              className="inline-flex text-[1.05rem] leading-none font-bold tracking-[-0.06em] uppercase"
              data-cursor="pointer"
              style={{ opacity: logoOpacity }}
            >
              <span id="header-logo" className="chrome-text">
                {profile.shortName}
              </span>
              <span className="text-accent">.</span>
            </motion.a>
          </Magnetic>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => {
              const isActive = active === link.id;
              return (
                <Magnetic key={link.href} strength={0.18}>
                  <a
                    href={link.href}
                    data-cursor="pointer"
                    className={`relative rounded-full px-3.5 py-2 text-sm transition-colors ${
                      isActive ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/[0.06]"
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </a>
                </Magnetic>
              );
            })}
            <Magnetic strength={0.22}>
              <a
                href="#contact"
                data-cursor="pointer"
                className="magnetic-btn magnetic-btn--primary ml-2 !min-h-0 rounded-full px-4 py-2 text-sm"
              >
                Связаться
              </a>
            </Magnetic>
          </nav>

          <button
            type="button"
            aria-label="Меню"
            data-cursor="pointer"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 md:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="font-mono text-xs">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 w-[min(1180px,calc(100%-1.4rem))] rounded-3xl border border-white/10 bg-black/85 p-4 backdrop-blur-xl md:hidden"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-2xl px-3 py-3 text-base text-ink/90 hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
