"use client";

import { profile } from "@/data/content";
import { MagneticButton } from "./ui/MagneticButton";
import { Reveal, Stagger, StaggerItem } from "./ui/Reveal";
import { TiltCard } from "./ui/TiltCard";
import { ScrambleText } from "./ui/ScrambleText";
import { ScrollText } from "./ui/ScrollText";

const channels = [
  {
    label: "Email",
    value: profile.contacts.email,
    href: `mailto:${profile.contacts.email}`,
  },
  {
    label: "Telegram",
    value: `@${profile.contacts.telegram}`,
    href: profile.contacts.telegramHref,
  },
  {
    label: "Телефон",
    value: profile.contacts.phone,
    href: profile.contacts.phoneHref,
  },
  {
    label: "GitHub",
    value: profile.contacts.github,
    href: profile.contacts.githubHref,
  },
];

export function Contact() {
  return (
    <section id="contact" className="section pb-28">
      <div className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#08080a] px-6 py-10 md:px-10 md:py-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(255,255,255,0.2),transparent_40%),radial-gradient(circle_at_85%_100%,rgba(212,212,216,0.14),transparent_35%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:48px_48px] opacity-25" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative">
              <p className="eyebrow">
            <ScrambleText text="05 — Контакты" />
          </p>
              <h2 className="section-title">
                Готов обсудить
                <br />
                <span className="gradient-text">вакансию или задачу</span>
              </h2>
              <ScrollText
            className="section-lead"
            text="Middle Full Stack разработчик. Могу усилить backend, закрыть full cycle разработку или подключиться к продуктовой команде."
          />

              <Stagger className="mt-10 grid gap-4 sm:grid-cols-2">
                {channels.map((channel) => (
                  <StaggerItem key={channel.label}>
                    <TiltCard className="group rounded-[1.35rem]" intensity={6}>
                      <a
                        href={channel.href}
                        target={channel.href.startsWith("http") ? "_blank" : undefined}
                        rel={channel.href.startsWith("http") ? "noreferrer" : undefined}
                        data-cursor="pointer"
                        className="glass block rounded-[1.35rem] p-5 transition duration-500 group-hover:border-accent/40 group-hover:bg-surface-hover"
                      >
                        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                          {channel.label}
                        </div>
                        <div className="mt-2 text-xl tracking-tight transition group-hover:translate-x-0.5">
                          {channel.value}
                        </div>
                      </a>
                    </TiltCard>
                  </StaggerItem>
                ))}
              </Stagger>

              <div className="mt-8 flex flex-wrap gap-3">
                <MagneticButton href={`mailto:${profile.contacts.email}`}>
                  Написать на email
                </MagneticButton>
                <MagneticButton href={profile.contacts.telegramHref} variant="ghost" external>
                  Открыть Telegram
                </MagneticButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
