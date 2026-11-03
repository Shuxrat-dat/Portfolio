import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { IntroOverlay, introBootScript } from "@/components/IntroOverlay";
import { ScrollProgress } from "@/components/ScrollProgress";
import { PageTransition } from "@/components/providers/PageTransition";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { profile } from "@/data/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: `${profile.name} — Full Stack Developer`,
  description:
    "Middle Full Stack разработчик с опытом 4,7 года. Node.js, TypeScript, React, Next.js, PostgreSQL, Prisma, Docker.",
  openGraph: {
    title: `${profile.name} — Full Stack Developer`,
    description: profile.tagline,
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${GeistSans.variable} ${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
      </head>
      <body className="font-sans antialiased">
        <IntroOverlay />
        <SmoothScroll>
          <AmbientBackground />
          <ScrollProgress />
          <CustomCursor />
          <Header />
          <main className="relative z-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
