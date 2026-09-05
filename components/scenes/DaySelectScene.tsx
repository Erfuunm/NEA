"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { SceneHeading } from "@/components/ui/SceneHeading";
import { useSound } from "@/hooks/useSound";
import { useTouch } from "@/hooks/useTouch";
import { WEEKDAYS } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";

export function DaySelectScene() {
  const day = useExperienceStore((s) => s.day);
  const setStage = useExperienceStore((s) => s.setStage);
  const sound = useSound();
  const isTouch = useTouch();

  const dayLabel = WEEKDAYS.find((w) => w.id === day)?.label ?? "None";

  return (
    <div className="pointer-events-none flex min-h-svh flex-col items-center justify-between gap-4 px-4 pb-8 pt-20">
      <SceneHeading
        eyebrow="Scene Two"
        title="Choose a day for our adventure"
      />

      <div className="mt-auto flex max-w-md flex-col items-center gap-4 text-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-md">
          <p className="text-sm text-cyan-100/80">
            {isTouch ? "Tap the ground to walk." : (
              <>Walk around with <span className="font-semibold text-white">W A S D</span> or <span className="font-semibold text-white">Arrow Keys</span></>
            )}
          </p>
          <p className="mt-1 text-xs text-white/60">
            {isTouch
              ? "Tap any island to choose it."
              : "Approach an island and press Space / Enter to choose, or tap it."}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {day && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-sm font-medium tracking-wide text-amber-100">
              Selected: {dayLabel}
            </p>
            <GlowButton
              className="pointer-events-auto"
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
