export type Stage =
  | "intro"
  | "invite"
  | "day"
  | "time"
  | "destination"
  | "final"
  | "ending";

export type InviteAnswer = "yes" | "maybe" | "no";

export type Weekday =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export type Destination =
  | "coffee"
  | "restaurant"
  | "park"
  | "cinema"
  | "surprise";

export interface WeekdayConfig {
  id: Weekday;
  label: string;
  short: string;
}

export interface TimeConfig {
  id: TimeOfDay;
  label: string;
  emoji: string;
  skyTop: string;
  skyBottom: string;
  glow: string;
}

export interface DestinationConfig {
  id: Destination;
  label: string;
  emoji: string;
  description: string;
  accent: string;
}

export interface ExperienceState {
  stage: Stage;
  answer: InviteAnswer | null;
  day: Weekday | null;
  time: TimeOfDay | null;
  destination: Destination | null;
  muted: boolean;
  hasStarted: boolean;
  setStage: (stage: Stage) => void;
  setAnswer: (answer: InviteAnswer) => void;
  setDay: (day: Weekday) => void;
  setTime: (time: TimeOfDay) => void;
  setDestination: (destination: Destination) => void;
  toggleMuted: () => void;
  start: () => void;
  goBack: () => void;
  reset: () => void;
}
