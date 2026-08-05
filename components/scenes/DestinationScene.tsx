"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { SceneHeading } from "@/components/ui/SceneHeading";
import { useSound } from "@/hooks/useSound";
import { DESTINATIONS } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const RADIUS = 128;

export function DestinationScene() {
  const destination = useExperienceStore((s) => s.destination);
  const setDestination = useExperienceStore((s) => s.setDestination);
  const setStage = useExperienceStore((s) => s.setStage);
  const sound = useSound();

  return (
    <div className="pointer-events-auto flex min-h-screen flex-col items-center justify-between px-6 py-12">
      <SceneHeading eyebrow="Scene Four" title="Where should we go?" />

      <p className="max-w-sm text-center text-sm text-white/50">
        Five tiny worlds are waiting. Pick the one that feels right — or leave it to fate.
      </p>

      <div
        className="relative"
        style={{ width: RADIUS * 2 + 96, height: RADIUS * 2 + 96 }}
      >
        {DESTINATIONS.map((cfg, i) => {
          const angle = (i / DESTINATIONS.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * RADIUS;
          const y = Math.sin(angle) * RADIUS;
          const active = destination === cfg.id;
          return (
            <div
              key={cfg.id}
              className="absolute"
              style={{
                left: "50%",
                top: "50%",
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
            >
              <motion.button
                type="button"
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.06 }}
                onClick={() => {
                  sound.select();
                  setDestination(cfg.id);
                }}
                className={cn(
                  "flex w-24 flex-col items-center gap-2 rounded-2xl border px-3 py-4 backdrop-blur-md transition-colors",
                  active
                    ? "border-amber-200/70 bg-amber-100/15 shadow-[0_0_30px_rgba(255,200,140,0.35)]"
                    : "border-white/15 bg-white/5 hover:border-white/35 hover:bg-white/10"
                )}
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-full text-2xl"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${cfg.accent}, transparent 70%)`,
                    boxShadow: `0 0 20px ${cfg.accent}`,
                  }}
                >
                  {cfg.emoji}
                </span>
                <span
                  className={cn(
                    "text-center text-xs font-semibold leading-tight tracking-wide",
                    active ? "text-amber-100" : "text-white/85"
                  )}
                >
                  {cfg.label}
                </span>
              </motion.button>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {destination && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
          >
            <GlowButton
              onClick={() => {
                sound.whoosh();
                setStage("final");
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
