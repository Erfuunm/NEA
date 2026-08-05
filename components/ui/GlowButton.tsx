"use client";

import { motion } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  className?: string;
  disabled?: boolean;
}

export function GlowButton({
  children,
  onClick,
  variant = "primary",
  className,
  disabled,
}: GlowButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const sound = useSound();

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
    setOffset({ x, y });
  };

  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setOffset({ x: 0, y: 0 })}
      onMouseEnter={() => sound.hover()}
      onClick={() => {
        sound.click();
        onClick?.();
      }}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 200, damping: 15, mass: 0.4 }}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03 }}
      className={cn(
        "group relative overflow-hidden rounded-full px-10 py-5 text-base font-semibold tracking-wide transition-all duration-300",
        variant === "primary"
          ? "bg-gradient-to-br from-amber-100 via-rose-200 to-fuchsia-300 text-slate-900 shadow-[0_0_50px_rgba(255,190,150,0.45)] hover:shadow-[0_0_70px_rgba(255,190,150,0.65)]"
          : "border border-white/20 bg-white/5 text-white/90 backdrop-blur-md hover:border-white/40 hover:bg-white/[0.08]",
        disabled && "pointer-events-none opacity-40",
        className
      )}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {variant === "primary" && (
        <>
          <motion.span
            className="pointer-events-none absolute inset-0 bg-white/30 blur-2xl"
            animate={{ opacity: [0.2, 0.45, 0.2] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </>
      )}
    </motion.button>
  );
}
