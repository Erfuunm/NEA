"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { SceneHeading } from "@/components/ui/SceneHeading";
import { useSound } from "@/hooks/useSound";
import { TIMES_OF_DAY } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function TimeSelectScene() {
  const time = useExperienceStore((s) => s.time);
  const setTime = useExperienceStore((s) => s.setTime);
  const setStage = useExperienceStore((s) => s.setStage);
  const sound = useSound();

  return (
    <div className="pointer-events-auto flex min-h-screen flex-col items-center justify-between px-6 py-16">
      <SceneHeading eyebrow="Scene Three" title="What time feels right?" />

      <p className="max-w-sm text-center text-sm text-white/50">
        Choose a celestial moment — morning light, afternoon sun, evening glow, or the quiet of night.
      </p>

      <div className="grid w-full max-w-sm grid-cols-2 gap-3 sm:max-w-md">
        {TIMES_OF_DAY.map((cfg) => (
          <motion.button
            key={cfg.id}
            type="button"
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.04 }}
            onClick={() => {
              sound.select();
              setTime(cfg.id);
            }}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border px-4 py-5 backdrop-blur-md transition-colors",
              time === cfg.id
                ? "border-amber-200/70 bg-amber-100/15 shadow-[0_0_30px_rgba(255,200,140,0.35)]"
                : "border-white/15 bg-white/5 hover:border-white/35 hover:bg-white/10"
            )}
            style={{
              boxShadow:
                time === cfg.id ? undefined : `0 0 24px -8px ${cfg.glow}`,
            }}
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${cfg.glow}, transparent 70%)`,
                boxShadow: `0 0 20px ${cfg.glow}`,
              }}
            >
              {cfg.emoji}
            </span>
            <span
              className={cn(
                "text-sm font-semibold tracking-wide",
                time === cfg.id ? "text-amber-100" : "text-white/85"
              )}
            >
              {cfg.label}
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {time && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <GlowButton
              onClick={() => {
                sound.whoosh();
                setStage("destination");
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
