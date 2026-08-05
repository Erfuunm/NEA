"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useExperienceStore } from "@/lib/store";

export function BackButton() {
  const stage = useExperienceStore((s) => s.stage);
  const goBack = useExperienceStore((s) => s.goBack);
  const sound = useSound();

  const visible = stage !== "intro" && stage !== "ending";

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          onClick={() => {
            sound.click();
            goBack();
          }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          className="fixed left-6 top-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white"
          aria-label="Go back"
        >
          <ArrowLeft size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
