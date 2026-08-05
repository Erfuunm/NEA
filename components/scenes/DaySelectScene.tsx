"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { SceneHeading } from "@/components/ui/SceneHeading";
import { useSound } from "@/hooks/useSound";
import { WEEKDAYS } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function DaySelectScene() {
  const day = useExperienceStore((s) => s.day);
  const setDay = useExperienceStore((s) => s.setDay);
  const setStage = useExperienceStore((s) => s.setStage);
  const sound = useSound();

  return (
    <div className="pointer-events-auto flex min-h-screen flex-col items-center justify-between px-6 py-16">
      <SceneHeading
        eyebrow="Scene Two"
        title="Choose a day for our adventure"
      />

      <p className="max-w-sm text-center text-sm text-white/50">
        Pick the island that calls to you.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {WEEKDAYS.map((w) => (
          <motion.button
            key={w.id}
            type="button"
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => {
              sound.select();
              setDay(w.id);
            }}
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm font-semibold tracking-wide backdrop-blur-md transition-colors",
              day === w.id
                ? "border-amber-200/70 bg-amber-100/15 text-amber-100 shadow-[0_0_30px_rgba(255,200,140,0.35)]"
                : "border-white/15 bg-white/5 text-white/80 hover:border-white/35 hover:bg-white/10"
            )}
          >
            {w.short}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {day && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <GlowButton
              onClick={() => {
                sound.whoosh();
                setStage("time");
              }}
            >
              Continue →
            </GlowButton>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
