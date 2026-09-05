"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { OrbDialogue } from "@/components/orb/OrbDialogue";
import { GlowButton } from "@/components/ui/GlowButton";
import { useSound } from "@/hooks/useSound";
import { DESTINATIONS, ORB_DIALOGUE, TIMES_OF_DAY, WEEKDAYS } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";

const RobotPortrait = dynamic(() => import("@/components/3d/RobotMesh").then((mod) => mod.RobotPortrait), { ssr: false });

export function FinalScene() {
  const day = useExperienceStore((s) => s.day);
  const time = useExperienceStore((s) => s.time);
  const destination = useExperienceStore((s) => s.destination);
  const setStage = useExperienceStore((s) => s.setStage);
  const sound = useSound();

  const dayConfig = WEEKDAYS.find((w) => w.id === day);
  const timeConfig = TIMES_OF_DAY.find((t) => t.id === time);
  const destinationConfig = DESTINATIONS.find((d) => d.id === destination);

  return (
    <div className="pointer-events-auto flex min-h-svh flex-col items-center justify-center gap-6 px-4 pb-8 pt-10">
      <RobotPortrait className="max-h-[min(28svh,220px)]" />
      <div className="mt-2 w-full max-w-xl px-2">
        <OrbDialogue lines={ORB_DIALOGUE.final} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.7 }}
        className="flex flex-wrap items-center justify-center gap-4"
      >
        <SummaryChip label={dayConfig?.label ?? "—"} />
        <SummaryChip label={timeConfig ? `${timeConfig.emoji} ${timeConfig.label}` : "—"} />
        <SummaryChip label={destinationConfig ? `${destinationConfig.emoji} ${destinationConfig.label}` : "—"} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.6, type: "spring" }}
      >
        <GlowButton
          onClick={() => {
            sound.celebrate();
            setStage("ending");
          }}
          className="text-lg"
        >
          ❤️ Let&apos;s Make It Happen
        </GlowButton>
      </motion.div>
    </div>
  );
}

function SummaryChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-white/15 bg-white/[0.05] px-5 py-2 text-sm text-white/85 backdrop-blur-md">
      {label}
    </span>
  );
}
