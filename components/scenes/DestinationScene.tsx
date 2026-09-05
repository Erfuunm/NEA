"use client";

import { AnimatePresence, motion } from "framer-motion";
import { GlowButton } from "@/components/ui/GlowButton";
import { SceneHeading } from "@/components/ui/SceneHeading";
import { useSound } from "@/hooks/useSound";
import { useTouch } from "@/hooks/useTouch";
import { DESTINATIONS } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";

export function DestinationScene() {
  const destination = useExperienceStore((s) => s.destination);
  const setStage = useExperienceStore((s) => s.setStage);
  const sound = useSound();
  const isTouch = useTouch();
  const selected = DESTINATIONS.find((config) => config.id === destination);

  return (
    <div className="pointer-events-none flex min-h-svh flex-col items-center justify-between gap-6 px-4 pb-8 pt-20">
      <SceneHeading eyebrow="Scene Four" title="Where should we go?" />
      <div className="mt-auto flex max-w-md flex-col items-center gap-4 text-center">
        <div className={selected ? "hidden" : "rounded-2xl border border-white/10 bg-slate-950/75 px-5 py-3 backdrop-blur-md"}>
          <p className="text-sm text-cyan-100/90">Five little worlds. One adventure together.</p>
          <p className="mt-1 text-xs leading-relaxed text-white/70">
            {isTouch
              ? "Tap the ground to walk, then tap any destination to choose it."
              : "W / S to walk, A / D to turn. Press E, Space, or Enter when near, or tap a destination."}
          </p>
        </div>
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="flex flex-col items-center gap-3"
            >
              <div role="status">
                <p className="text-sm font-medium text-amber-100">Selected: {selected.label}</p>
                <p className="mt-1 text-xs text-white/70">{selected.description}</p>
              </div>
              <GlowButton className="pointer-events-auto" onClick={() => {
                sound.whoosh();
                setStage("final");
              }}>
                Continue →
              </GlowButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
