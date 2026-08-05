"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

interface ChoiceCardProps {
  emoji: string;
  label: string;
  onClick: () => void;
  active?: boolean;
}

export function ChoiceCard({ emoji, label, onClick, active }: ChoiceCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const sound = useSound();

  return (
    <motion.button
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: py * -14, y: px * 14 });
      }}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      onMouseEnter={() => sound.hover()}
      onClick={() => {
        sound.click();
        onClick();
      }}
      style={{ transformStyle: "preserve-3d" }}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={cn(
        "flex w-36 flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-8 backdrop-blur-xl transition-colors hover:border-white/30 hover:bg-white/[0.08]",
        active && "border-amber-200/60 bg-amber-100/10 shadow-[0_0_40px_rgba(255,200,140,0.3)]"
      )}
    >
      <span className="text-4xl">{emoji}</span>
      <span className="text-sm font-medium tracking-wide text-white/85">{label}</span>
    </motion.button>
  );
}
