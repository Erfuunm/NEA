import type {
  DestinationConfig,
  Stage,
  TimeConfig,
  WeekdayConfig,
} from "@/types/experience";

export const STAGE_ORDER: Stage[] = [
  "intro",
  "invite",
  "day",
  "time",
  "destination",
  "final",
  "ending",
];

export const WEEKDAYS: WeekdayConfig[] = [
  { id: "monday", label: "Monday", short: "MON" },
  { id: "tuesday", label: "Tuesday", short: "TUE" },
  { id: "wednesday", label: "Wednesday", short: "WED" },
  { id: "thursday", label: "Thursday", short: "THU" },
  { id: "friday", label: "Friday", short: "FRI" },
  { id: "saturday", label: "Saturday", short: "SAT" },
  { id: "sunday", label: "Sunday", short: "SUN" },
];

export const TIMES_OF_DAY: TimeConfig[] = [
  {
    id: "morning",
    label: "Morning",
    emoji: "🌅",
    skyTop: "#ffd9a0",
    skyBottom: "#ff8f6b",
    glow: "#ffb347",
  },
  {
    id: "afternoon",
    label: "Afternoon",
    emoji: "☀️",
    skyTop: "#8ec9ff",
    skyBottom: "#3a7bd5",
    glow: "#ffe9a8",
  },
  {
    id: "evening",
    label: "Evening",
    emoji: "🌇",
    skyTop: "#ff9a76",
    skyBottom: "#5b2a86",
    glow: "#ff6f91",
  },
  {
    id: "night",
    label: "Night",
    emoji: "🌙",
    skyTop: "#0b1030",
    skyBottom: "#1b1440",
    glow: "#8f9dff",
  },
];

export const DESTINATIONS: DestinationConfig[] = [
  {
    id: "coffee",
    label: "Coffee Shop",
    emoji: "☕",
    description: "Warm cups, soft jazz, and slow conversation.",
    accent: "#d9a066",
  },
  {
    id: "restaurant",
    label: "Restaurant",
    emoji: "🍕",
    description: "Candlelight, good food, better company.",
    accent: "#ff6b6b",
  },
  {
    id: "park",
    label: "Park",
    emoji: "🌳",
    description: "Fresh air, birdsong, a walk under the trees.",
    accent: "#6fcf97",
  },
  {
    id: "cinema",
    label: "Cinema",
    emoji: "🎬",
    description: "Neon lights, big screen, shared popcorn.",
    accent: "#a06bff",
  },
  {
    id: "surprise",
    label: "Surprise Me",
    emoji: "🎡",
    description: "A mysterious portal to somewhere unknown.",
    accent: "#5be7ff",
  },
];

export const ORB_DIALOGUE = {
  intro: [
    "Hello Nastaran ✨",
    "I've been waiting for you.",
    "I have something special to ask...",
  ],
  invite: ["Would you like to go out with me?"],
  inviteYes: [
    "You just made my whole universe brighter. 🌟",
    "Let's plan something wonderful together...",
  ],
  inviteMaybe: [
    "Haha, fair enough. 😄",
    "Take your time... but let's keep planning anyway.",
  ],
  inviteNo: [
    "That's okay...",
    "Maybe another time 😊",
    "Let's keep exploring, just for fun.",
  ],
  day: ["When should our little adventure happen?", "Pick a floating island."],
  time: ["Perfect. Now... what time feels right?"],
  destination: ["Last thing — where should we go?"],
  final: ["So...", "Our adventure begins..."],
  ending: ["Can't wait to see you, Nastaran ❤️"],
};
