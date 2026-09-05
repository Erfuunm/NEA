"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { OrbDialogue } from "@/components/orb/OrbDialogue";
import dynamic from "next/dynamic";
import { ChoiceCard } from "@/components/ui/ChoiceCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { useSound } from "@/hooks/useSound";
import { ORB_DIALOGUE } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";
import type { InviteAnswer } from "@/types/experience";

const RobotPortrait = dynamic(() => import("@/components/3d/RobotMesh").then((mod) => mod.RobotPortrait), { ssr: false });

const REACTION_LINES: Record<InviteAnswer, string[]> = {
  yes: ORB_DIALOGUE.inviteYes,
  maybe: ORB_DIALOGUE.inviteMaybe,
  no: ORB_DIALOGUE.inviteNo,
};

export function InviteScene() {
  const answer = useExperienceStore((s) => s.answer);
  const setAnswer = useExperienceStore((s) => s.setAnswer);
  const setStage = useExperienceStore((s) => s.setStage);
  const [reactionDone, setReactionDone] = useState(false);
  const sound = useSound();

  const handleChoose = (choice: InviteAnswer) => {
    setReactionDone(false);
    setAnswer(choice);
    if (choice === "yes") sound.celebrate();
    else sound.select();
  };

  return (
    <div className="pointer-events-auto flex min-h-svh flex-col items-center justify-center gap-6 px-4 pb-8 pt-10">
      <RobotPortrait className="max-h-[min(28svh,220px)]" />
      <div className="mt-2 w-full max-w-xl px-2">
        <OrbDialogue lines={answer ? REACTION_LINES[answer] : ORB_DIALOGUE.invite} />
      </div>

      <AnimatePresence mode="wait">
        {!answer ? (
          <motion.div
            key="choices"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="flex flex-wrap items-center justify-center gap-5"
          >
            <ChoiceCard emoji="❤️" label="Yes" onClick={() => handleChoose("yes")} />
            <ChoiceCard emoji="🤔" label="Maybe" onClick={() => handleChoose("maybe")} />
            <ChoiceCard emoji="😅" label="No" onClick={() => handleChoose("no")} />
          </motion.div>
        ) : (
          <motion.div
            key="continue"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {reactionDone && (
              <GlowButton
                onClick={() => {
                  sound.whoosh();
                  setStage("day");
                }}
              >
                Continue the Adventure →
              </GlowButton>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {answer && !reactionDone && (
        <ReactionWatcher lines={REACTION_LINES[answer]} onDone={() => setReactionDone(true)} />
      )}
    </div>
  );
}

function ReactionWatcher({
  lines,
  onDone,
}: {
  lines: string[];
  onDone: () => void;
}) {
  const totalMs = lines.reduce((sum, line) => sum + line.length * 30 + 900, 600);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useEffect(() => {
    const timer = setTimeout(() => onDoneRef.current(), totalMs);
    return () => clearTimeout(timer);
  }, [totalMs]);

  return null;
}
