"use client";

import { motion } from "framer-motion";
import { Magnetic } from "./Magnetic";
import type { ReactNode } from "react";

type MagneticButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
  external?: boolean;
  download?: boolean;
};

export function MagneticButton({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
  download = false,
}: MagneticButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Magnetic strength={0.28}>
      <motion.a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        download={download || undefined}
        data-cursor="pointer"
        className={`magnetic-btn relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold tracking-tight ${
          isPrimary ? "magnetic-btn--primary" : "magnetic-btn--ghost"
        } ${className}`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 22 }}
      >
        {children}
      </motion.a>
    </Magnetic>
  );
}
