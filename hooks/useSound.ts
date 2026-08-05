import { useEffect } from "react";
import { audioEngine } from "@/lib/audio";
import { useExperienceStore } from "@/lib/store";

export function useSound() {
  const muted = useExperienceStore((s) => s.muted);

  useEffect(() => {
    audioEngine.setMuted(muted);
  }, [muted]);

  return {
    click: () => audioEngine.click(),
    hover: () => audioEngine.hover(),
    select: () => audioEngine.select(),
    whoosh: () => audioEngine.whoosh(),
    confirm: () => audioEngine.confirm(),
    celebrate: () => audioEngine.celebrate(),
    startAmbient: () => audioEngine.startAmbient(),
    stopAmbient: () => audioEngine.stopAmbient(),
  };
}
