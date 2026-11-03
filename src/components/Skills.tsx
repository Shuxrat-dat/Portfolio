"use client";

import { motion, useReducedMotion } from "framer-motion";
import { skillMeters, techStackCards } from "@/data/content";
import { Reveal } from "./ui/Reveal";
import { TiltCard } from "./ui/TiltCard";
import { ScrambleText } from "./ui/ScrambleText";
import { ScrollText } from "./ui/ScrollText";

function SkillMeter({ name, value, index }: { name: string; value: number; index: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-white/8 bg-white/[0.02] p-4"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-accent/30 bg-accent/10 text-[11px] text-accent">
            ◆
          </span>
          <span className="text-sm text-white/80">{name}</span>
        </div>
        <span className="font-mono text-xs text-white/45">{value}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-zinc-600 via-zinc-300 to-white"
          initial={reduce ? { width: `${value}%` } : { width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.1 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </motion.div>
  );
}

export function Skills() {
  const reduce = useReducedMotion();

  return (
    <section id="skills" className="relative overflow-hidden py-[clamp(5rem,10vw,8rem)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_circle_at_70%_0%,rgba(255,255,255,0.08),transparent_45%)]" />

      <div className="relative z-10 container">
        <Reveal>
          <div className="mb-12 md:mb-16">
            <p className="eyebrow">
            <ScrambleText text="03 — Навыки" />
          </p>
            <h2 className="section-title mt-4">
              Стек
              <br />
              <span className="gradient-text">технологий</span>
            </h2>
            <div className="mt-4 h-px w-16 bg-gradient-to-r from-accent to-transparent" />
            <ScrollText
            className="section-lead mt-5"
            text="Основной стек: Node.js, TypeScript, React, Next.js, PostgreSQL, Prisma, Docker и современные инструменты разработки."
          />
          </div>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {techStackCards.map((card, index) => (
            <motion.div
              key={card.name}
              initial={reduce ? false : { opacity: 0, y: 24, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.65,
                delay: index * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <TiltCard className="group h-full rounded-[1.45rem]" intensity={7}>
                <div className="relative h-full overflow-hidden rounded-[1.45rem] border border-white/10 bg-[#09090b]/90 p-5 transition duration-500 group-hover:border-accent/35 md:p-6">
                  <div className="pointer-events-none absolute -top-10 -right-8 h-28 w-28 rounded-full bg-accent/15 blur-2xl opacity-0 transition duration-500 group-hover:opacity-100" />
                  <div className="relative mb-4 flex items-center justify-between">
                    <h3 className="text-xl tracking-tight text-white">{card.name}</h3>
                    <span className="font-mono text-[11px] text-accent/80">
                      0{index + 1}
                    </span>
                  </div>
                  <p className="relative text-sm leading-relaxed text-white/55">
                    {card.text}
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {skillMeters.map((meter, index) => (
            <SkillMeter
              key={meter.name}
              name={meter.name}
              value={meter.value}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
