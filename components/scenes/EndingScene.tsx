"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSound } from "@/hooks/useSound";
import { ORB_DIALOGUE } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";
import { useTypewriter } from "@/hooks/useTypewriter";

const CINEMATIC_REPLAY_DELAY = 22000;

export function EndingScene() {
  const [phase, setPhase] = useState<"transform" | "message" | "fade" | "cinematic">(
    "transform"
  );
  const reset = useExperienceStore((s) => s.reset);
  const setStage = useExperienceStore((s) => s.setStage);
  const setProgress = useExperienceStore((s) => s.setCinematicProgress);
  const sound = useSound();

  useEffect(() => {
    sound.whoosh();
    const t1 = setTimeout(() => setPhase("message"), 6000);
    const t2 = setTimeout(() => setPhase("fade"), 12500);
    const t3 = setTimeout(() => setPhase("cinematic"), CINEMATIC_REPLAY_DELAY);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase !== "cinematic") return;
    setProgress(0);
    setStage("cinematic");
  }, [phase, setProgress, setStage]);

  const { displayed } = useTypewriter(ORB_DIALOGUE.ending[0], {
    speed: 45,
    startDelay: 6200,
  });

  return (
    <div className="pointer-events-none fixed inset-0 flex flex-col items-center justify-end px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-10">
      <AnimatePresence>
        {phase !== "transform" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="relative z-50 w-full max-w-2xl text-center"
          >
            <div className="pointer-events-none absolute -inset-x-5 -bottom-10 -top-10 -z-10 bg-gradient-to-t from-black/75 via-black/40 to-transparent blur-xl" />
            <h1
              aria-label={ORB_DIALOGUE.ending[0]}
              className="relative font-serif text-[clamp(1.5rem,5.2vw,2.75rem)] font-medium leading-snug text-rose-50 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
            >
              <span aria-hidden="true" className="invisible block">
                {ORB_DIALOGUE.ending[0]}
              </span>
              <span aria-hidden="true" className="absolute inset-0">
                {displayed}
              </span>
            </h1>
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2, duration: 1 }}
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.12)" }}
              whileTap={{ scale: 0.98 }}
              onClick={reset}
              className="pointer-events-auto mt-5 min-h-11 rounded-full border border-rose-100/25 bg-black/25 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.22em] text-rose-50/90 backdrop-blur-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rose-200 sm:mt-7 sm:text-xs"
            >
              replay the journey
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="pointer-events-none fixed inset-0 z-40 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "fade" ? 0.18 : 0 }}
        transition={{ duration: 2.5 }}
      />
    </div>
  );
}
