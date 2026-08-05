"use client";

import { useEffect } from "react";
import { audioEngine } from "@/lib/audio";
import { useExperienceStore } from "@/lib/store";

export function AmbientAudio() {
  const hasStarted = useExperienceStore((s) => s.hasStarted);

  useEffect(() => {
    // Browsers suspend AudioContext until a user gesture. We attempt to start
    // immediately (no-op while suspended) and then retry on the first interaction.
    audioEngine.startAmbient();

    const unlock = () => {
      audioEngine.stopAmbient();
      audioEngine.startAmbient();
    };

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    if (hasStarted) {
      audioEngine.startAmbient();
    }
  }, [hasStarted]);

  return null;
}
