"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useExperienceStore } from "@/lib/store";
import { useTypewriter } from "@/hooks/useTypewriter";

const CINEMATIC_DURATION = 9500;

function WolfLogo() {
  return (
    <motion.svg
      width="160"
      height="160"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ scale: 0.6, opacity: 0, filter: "blur(20px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      className="drop-shadow-[0_0_24px_rgba(160,200,255,0.6)]"
    >
      <defs>
        <linearGradient id="wolfGrad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#d4e6ff" />
          <stop offset="100%" stopColor="#6b8fff" />
        </linearGradient>
      </defs>
      <path
        d="M50 10L25 38L20 25L10 45L18 65L30 60L50 85L70 60L82 65L90 45L80 25L75 38L50 10Z"
        fill="url(#wolfGrad)"
      />
      <circle cx="38" cy="48" r="5" fill="#0b1030" />
      <circle cx="62" cy="48" r="5" fill="#0b1030" />
      <path d="M50 58L46 66H54L50 58Z" fill="#0b1030" />
      <path
        d="M30 65Q50 78 70 65"
        stroke="#0b1030"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </motion.svg>
  );
}

export function CinematicScene() {
  const setStage = useExperienceStore((s) => s.setStage);
  const setProgress = useExperienceStore((s) => s.setCinematicProgress);
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const { displayed, isDone } = useTypewriter("Created by Erfan for you", {
    speed: 55,
    startDelay: 200,
  });

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    const logoTimer = setTimeout(() => setShowLogo(true), 3200);
    const textTimer = setTimeout(() => setShowText(true), 4800);
    const endTimer = setTimeout(() => {
      if (!skipped) {
        setStage("intro");
      }
    }, CINEMATIC_DURATION);
    timeouts.push(logoTimer, textTimer, endTimer);

    return () => timeouts.forEach(clearTimeout);
  }, [setStage, skipped]);

  useEffect(() => {
    const tick = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(1, elapsed / CINEMATIC_DURATION);
      setProgress(progress);
      if (progress < 1 && !skipped) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [setProgress, skipped]);

  const handleSkip = () => {
    setSkipped(true);
    setProgress(1);
    setStage("intro");
  };

  return (
    <div
      className="pointer-events-auto fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      onClick={handleSkip}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#03040a] via-[#080a14] to-[#03040a] opacity-90" />

      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center gap-6"
          >
            <WolfLogo />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10 mt-6"
          >
            <p className="text-center font-serif text-lg tracking-[0.25em] text-cyan-100/90 sm:text-2xl">
              {displayed}
              {!isDone && (
                <span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-cyan-200/70 align-middle" />
              )}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={(e) => {
          e.stopPropagation();
          handleSkip();
        }}
        className="pointer-events-auto absolute bottom-8 z-10 text-xs uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-white/80"
      >
        click anywhere to skip
      </motion.button>
    </div>
  );
}
