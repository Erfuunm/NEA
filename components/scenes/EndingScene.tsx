"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Confetti } from "@/components/ui/Confetti";
import { useSound } from "@/hooks/useSound";
import { ORB_DIALOGUE } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";
import { useTypewriter } from "@/hooks/useTypewriter";

export function EndingScene() {
  const [phase, setPhase] = useState<"transform" | "message" | "fade">(
    "transform"
  );
  const reset = useExperienceStore((s) => s.reset);
  const sound = useSound();

  useEffect(() => {
    sound.whoosh();
    const t1 = setTimeout(() => setPhase("message"), 3200);
    const t2 = setTimeout(() => setPhase("fade"), 9500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { displayed } = useTypewriter(ORB_DIALOGUE.ending[0], {
    speed: 45,
    startDelay: 200,
  });

  return (
    <div className="pointer-events-auto relative flex min-h-screen flex-col items-center justify-end pb-24 px-6">
      {phase !== "transform" && <Confetti count={70} />}

      <AnimatePresence>
        {phase === "message" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <h1 className="font-serif text-3xl font-medium text-white sm:text-5xl">
              {displayed}
            </h1>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ delay: 4, duration: 1 }}
              whileHover={{ opacity: 0.8 }}
              onClick={reset}
              className="mt-10 text-xs uppercase tracking-[0.3em] text-white/40"
            >
              replay the journey
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="pointer-events-none fixed inset-0 z-40 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === "fade" ? 0.55 : 0 }}
        transition={{ duration: 2.5 }}
      />
    </div>
  );
}
