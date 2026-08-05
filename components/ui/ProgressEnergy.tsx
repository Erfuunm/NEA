"use client";

import { motion } from "framer-motion";
import { STAGE_ORDER } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";

export function ProgressEnergy() {
  const stage = useExperienceStore((s) => s.stage);
  const hasStarted = useExperienceStore((s) => s.hasStarted);
  const index = STAGE_ORDER.indexOf(stage);
  const total = STAGE_ORDER.length - 1;
  const percent = Math.min(100, (index / total) * 100);

  if (!hasStarted || stage === "ending") return null;

  return (
    <div className="pointer-events-none fixed left-1/2 top-6 z-40 w-[min(420px,80vw)] -translate-x-1/2">
      <div className="relative h-1.5 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-300"
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
        <motion.div
          className="absolute top-0 h-full w-8 bg-white/60 blur-sm"
          animate={{ left: `${percent}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        />
      </div>
    </div>
  );
}
