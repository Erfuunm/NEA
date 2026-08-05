"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SceneHeadingProps {
  eyebrow?: string;
  title: string;
  className?: string;
}

export function SceneHeading({ eyebrow, title, className }: SceneHeadingProps) {
  return (
    <div className={cn("text-center", className)}>
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-cyan-200/70"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="font-serif text-3xl font-medium text-white sm:text-4xl"
      >
        {title}
      </motion.h1>
    </div>
  );
}
