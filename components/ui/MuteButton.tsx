"use client";

import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { useExperienceStore } from "@/lib/store";

export function MuteButton() {
  const muted = useExperienceStore((s) => s.muted);
  const toggleMuted = useExperienceStore((s) => s.toggleMuted);

  return (
    <motion.button
      onClick={toggleMuted}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur-md transition-colors hover:border-white/30 hover:text-white"
      aria-label={muted ? "Unmute" : "Mute"}
    >
      {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
    </motion.button>
  );
}
