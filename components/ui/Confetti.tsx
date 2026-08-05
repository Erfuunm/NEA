"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { randomUnit } from "@/lib/random";

const COLORS = ["#ffd27a", "#ff8fb1", "#a06bff", "#7cf0ff", "#ffe9a8"];

export function Confetti({ count = 60 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: randomUnit() * 100,
        delay: randomUnit() * 1.2,
        duration: 2.6 + randomUnit() * 1.8,
        color: COLORS[i % COLORS.length],
        rotate: randomUnit() * 360,
        size: 6 + randomUnit() * 6,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          initial={{ y: "-10vh", x: `${p.x}vw`, opacity: 0, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [0, 1, 1, 0],
            rotate: p.rotate,
          }}
          transition={{
            delay: p.delay,
            duration: p.duration,
            ease: "easeIn",
          }}
          className="absolute block rounded-sm"
          style={{
            width: p.size,
            height: p.size * 0.4,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
}
