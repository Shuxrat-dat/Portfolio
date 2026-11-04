"use client";

import { motion, useReducedMotion } from "framer-motion";
import { education, workExperience } from "@/data/content";
import { Reveal } from "./ui/Reveal";
import { ScrambleText } from "./ui/ScrambleText";
import { ScrollText } from "./ui/ScrollText";

function TimelineColumn({
  title,
  items,
  icon,
}: {
  title: string;
  items: { title: string; meta: string; text: string }[];
  icon: "edu" | "work";
}) {
  const reduce = useReducedMotion();

  return (
    <div className="relative">
      <div className="mb-8 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-accent">
          {icon === "edu" ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 3L2 8l10 5 10-5-10-5Zm0 7.5L4.5 8 12 4.5 19.5 8 12 10.5ZM5 11.2v4.3c0 1.7 3.1 3.5 7 3.5s7-1.8 7-3.5v-4.3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 9h16v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9Zm4-4h8l1 4H7l1-4Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </span>
        <h3 className="text-2xl tracking-tight text-white">{title}</h3>
      </div>

      <div className="relative pl-6">
        <div className="absolute top-2 bottom-2 left-[11px] w-px bg-gradient-to-b from-accent/70 via-white/15 to-transparent" />

        <div className="space-y-6">
          {items.map((item, index) => (
            <motion.article
              key={`${item.title}-${item.meta}`}
              initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.7,
                delay: index * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative"
            >
              <span className="absolute top-5 -left-[18px] h-3 w-3 rounded-full border-2 border-[#050505] bg-accent shadow-[0_0_16px_rgba(255,255,255,0.7)]" />

              <div className="glass group rounded-[1.4rem] p-5 transition duration-500 hover:border-white/18 hover:bg-white/[0.04] md:p-6">
                <h4 className="text-lg font-medium tracking-tight text-white md:text-xl">
                  {item.title}
                </h4>
                <p className="mt-1 text-sm text-accent">{item.meta}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Competencies() {
  return (
    <section id="competencies" className="relative overflow-hidden py-[clamp(5rem,10vw,8rem)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_circle_at_20%_0%,rgba(255,255,255,0.1),transparent_45%),radial-gradient(600px_circle_at_90%_40%,rgba(212,212,216,0.08),transparent_40%)]" />

      <div className="relative z-10 container">
        <Reveal>
          <div className="mb-14 text-center md:mb-16">
            <p className="eyebrow mx-auto justify-center">
            <ScrambleText text="02 — Компетенции" />
          </p>
            <h2 className="section-title mt-4">
              <span className="gradient-text">Образование</span> и опыт
            </h2>
            <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-accent to-transparent" />
            <ScrollText
            className="section-lead mx-auto mt-5"
            text="Самостоятельная инженерная подготовка и личная проектная практика."
          />
          </div>
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
          <TimelineColumn title="Образование" items={education} icon="edu" />
          <TimelineColumn title="Проектная практика" items={workExperience} icon="work" />
        </div>
      </div>
    </section>
  );
}
