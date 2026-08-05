"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTypewriter } from "@/hooks/useTypewriter";
import { cn } from "@/lib/utils";

interface OrbDialogueProps {
  lines: string[];
  className?: string;
  onAllDone?: () => void;
  lineSpeed?: number;
}

export function OrbDialogue({
  lines,
  className,
  onAllDone,
  lineSpeed = 30,
}: OrbDialogueProps) {
  const linesKey = lines.join("\u241E");
  const [trackedKey, setTrackedKey] = useState(linesKey);
  const [lineIndex, setLineIndex] = useState(0);
  const currentLine = lines[lineIndex] ?? "";

  if (linesKey !== trackedKey) {
    setTrackedKey(linesKey);
    setLineIndex(0);
  }

  const { displayed, isDone } = useTypewriter(currentLine, {
    speed: lineSpeed,
    startDelay: lineIndex === 0 ? 200 : 0,
    onDone: () => {
      if (lineIndex < lines.length - 1) {
        const timeout = setTimeout(() => {
          setLineIndex((i) => i + 1);
        }, 900);
        return () => clearTimeout(timeout);
      }
      onAllDone?.();
    },
  });

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.04] px-8 py-6 text-center backdrop-blur-xl shadow-[0_0_60px_rgba(120,180,255,0.12)]",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.p
          key={lineIndex}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4 }}
          className="font-serif text-xl leading-relaxed text-white/95 sm:text-2xl"
        >
          {displayed}
          {!isDone && (
            <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-white/70 align-middle" style={{ height: "1em" }} />
          )}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
