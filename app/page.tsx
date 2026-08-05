"use client";

import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { AmbientAudio } from "@/components/AmbientAudio";
import { DaySelectScene } from "@/components/scenes/DaySelectScene";
import { DestinationScene } from "@/components/scenes/DestinationScene";
import { EndingScene } from "@/components/scenes/EndingScene";
import { FinalScene } from "@/components/scenes/FinalScene";
import { IntroScene } from "@/components/scenes/IntroScene";
import { InviteScene } from "@/components/scenes/InviteScene";
import { TimeSelectScene } from "@/components/scenes/TimeSelectScene";
import { BackButton } from "@/components/ui/BackButton";
import { MuteButton } from "@/components/ui/MuteButton";
import { ProgressEnergy } from "@/components/ui/ProgressEnergy";
import { useExperienceStore } from "@/lib/store";

const Experience3D = dynamic(
  () => import("@/components/3d/Experience3D").then((mod) => mod.Experience3D),
  { ssr: false }
);

export default function Home() {
  const stage = useExperienceStore((s) => s.stage);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AmbientAudio />
      <Experience3D />

      <ProgressEnergy />
      <BackButton />
      <MuteButton />

      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none relative z-10"
        >
          {stage === "intro" && <IntroScene />}
          {stage === "invite" && <InviteScene />}
          {stage === "day" && <DaySelectScene />}
          {stage === "time" && <TimeSelectScene />}
          {stage === "destination" && <DestinationScene />}
          {stage === "final" && <FinalScene />}
          {stage === "ending" && <EndingScene />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
