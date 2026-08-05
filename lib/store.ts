import { create } from "zustand";
import { STAGE_ORDER } from "@/lib/constants";
import type { ExperienceState, Stage } from "@/types/experience";

export const useExperienceStore = create<ExperienceState>((set, get) => ({
  stage: "intro",
  answer: null,
  day: null,
  time: null,
  destination: null,
  muted: false,
  hasStarted: false,

  setStage: (stage: Stage) => set({ stage }),

  setAnswer: (answer) => set({ answer }),
  setDay: (day) => set({ day }),
  setTime: (time) => set({ time }),
  setDestination: (destination) => set({ destination }),

  toggleMuted: () => set((s) => ({ muted: !s.muted })),

  start: () => set({ hasStarted: true, stage: "invite" }),

  goBack: () => {
    const { stage } = get();
    const idx = STAGE_ORDER.indexOf(stage);
    if (idx > 1) {
      set({ stage: STAGE_ORDER[idx - 1] });
    } else if (idx === 1) {
      set({ stage: "intro" });
    }
  },

  reset: () =>
    set({
      stage: "intro",
      answer: null,
      day: null,
      time: null,
      destination: null,
      hasStarted: false,
    }),
}));
