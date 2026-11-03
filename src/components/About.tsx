"use client";

import { domains, focusAreas, profile } from "@/data/content";
import { Reveal, Stagger, StaggerItem } from "./ui/Reveal";
import { TiltCard } from "./ui/TiltCard";
import { ScrambleText } from "./ui/ScrambleText";
import { ScrollText } from "./ui/ScrollText";

export function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <Reveal>
          <p className="eyebrow">
            <ScrambleText text="01 — О себе" />
          </p>
          <h2 className="section-title">
            <span className="gradient-text">Создаю продукты,</span>
            <br />
            готовые к production
          </h2>
          <ScrollText
            className="section-lead"
            text="Для работодателей важна не витрина, а то, как я проектирую систему, закрываю риски и сопровождаю продукт после релиза."
          />
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal>
            <div className="glass group relative overflow-hidden rounded-[1.8rem] p-7 md:p-9">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(255,255,255,0.16),transparent_45%)]" />
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              {profile.about.map((paragraph) => (
                <ScrollText key={paragraph.slice(0, 32)} className="relative mb-5 text-[1.05rem] leading-[1.85] text-ink/88 last:mb-0" text={paragraph} />
              ))}
            </div>
          </Reveal>

          <Stagger className="grid gap-4">
            {focusAreas.map((item) => (
              <StaggerItem key={item.title}>
                <TiltCard className="group h-full rounded-[1.4rem]" intensity={6}>
                  <div className="glass h-full rounded-[1.4rem] p-5 transition duration-500 group-hover:border-white/18 group-hover:bg-surface-hover">
                    <h3 className="text-lg tracking-tight">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
                  </div>
                </TiltCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        <Reveal className="mt-8" delay={0.1}>
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
            <ScrambleText text="Отрасли и типы продуктов" />
          </p>
          <div className="flex flex-wrap gap-2.5">
            {domains.map((domain) => (
              <span
                key={domain}
                data-cursor="pointer"
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-ink/85 transition duration-300 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-accent-soft hover:text-white"
              >
                {domain}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
