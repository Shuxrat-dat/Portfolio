"use client";

import { profile } from "@/data/content";
import { Reveal, Stagger, StaggerItem } from "./ui/Reveal";
import { TiltCard } from "./ui/TiltCard";
import { ScrambleText } from "./ui/ScrambleText";

const milestones = [
  {
    label: "Опыт",
    value: profile.experience,
    text: "Full Stack разработка от архитектуры до production-поддержки.",
  },
  {
    label: "Уровень",
    value: profile.level,
    text: "Самостоятельно веду фичи, проектирую API и интерфейсы под рост продукта.",
  },
  {
    label: "Фокус",
    value: "Systems",
    text: "Безопасность, производительность, чистая архитектура и сопровождение.",
  },
  {
    label: "Стек",
    value: "Modern",
    text: "Node.js, TypeScript, React, Next.js, PostgreSQL, Prisma, Docker.",
  },
];

export function Experience() {
  return (
    <section id="experience" className="section pt-0 pb-0">
      <div className="container">
        <Reveal>
          <p className="eyebrow">
            <ScrambleText text="Highlights" />
          </p>
          <h2 className="section-title">
            Коротко о
            <br />
            <span className="gradient-text">сильных сторонах</span>
          </h2>
        </Reveal>

        <Stagger className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {milestones.map((item) => (
            <StaggerItem key={item.label}>
              <TiltCard className="group h-full rounded-[1.5rem]" intensity={7}>
                <div className="glass relative h-full overflow-hidden rounded-[1.5rem] p-6 transition duration-500 group-hover:border-white/16">
                  <div className="pointer-events-none absolute -top-10 right-0 h-28 w-28 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/20" />
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-dim">
                    <ScrambleText text={item.label} />
                  </p>
                  <h3 className="mt-4 text-3xl tracking-tight text-ink">{item.value}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{item.text}</p>
                </div>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
