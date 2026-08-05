"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { OrbDialogue } from "@/components/orb/OrbDialogue";
import { GlowButton } from "@/components/ui/GlowButton";
import { useSound } from "@/hooks/useSound";
import { ORB_DIALOGUE } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";

export function IntroScene() {
  const start = useExperienceStore((s) => s.start);
  const [dialogueDone, setDialogueDone] = useState(false);
  const sound = useSound();

  return (
    <div className="pointer-events-auto flex min-h-screen flex-col items-center justify-center gap-10 px-6">
      <motion.p
        initial={{ opacity: 0, letterSpacing: "0.5em" }}
        animate={{ opacity: 1, letterSpacing: "0.35em" }}
        transition={{ duration: 1.2 }}
        className="text-xs uppercase text-cyan-200/60"
      >
        a tiny magical world, just for you
      </motion.p>

      <OrbDialogue
        lines={ORB_DIALOGUE.intro}
        onAllDone={() => setDialogueDone(true)}
      />

      <AnimatePresence>
        {dialogueDone && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, type: "spring", stiffness: 120 }}
            className="flex flex-col items-center gap-3"
          >
            <GlowButton
              onClick={() => {
                sound.startAmbient();
                sound.confirm();
                start();
              }}
            >
              <Sparkles size={18} />
              Begin the Journey
            </GlowButton>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xs text-white/40"
            >
              turn up your volume for the full experience
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
