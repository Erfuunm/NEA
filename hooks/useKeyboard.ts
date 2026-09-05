"use client";

import { useEffect, useRef } from "react";

export interface KeyboardState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  interact: boolean;
}

const INITIAL_STATE: KeyboardState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  interact: false,
};

const KEY_ACTIONS: Record<string, keyof KeyboardState> = {
  w: "forward", arrowup: "forward",
  s: "backward", arrowdown: "backward",
  a: "left", arrowleft: "left",
  d: "right", arrowright: "right",
  " ": "interact", enter: "interact", e: "interact",
};

export function useKeyboard() {
  const keys = useRef<KeyboardState>({ ...INITIAL_STATE });

  useEffect(() => {
    const pressed = new Set<string>();
    const update = () => {
      keys.current = { ...INITIAL_STATE };
      pressed.forEach((key) => { keys.current[KEY_ACTIONS[key]] = true; });
    };
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (!KEY_ACTIONS[key] || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof HTMLElement && event.target.closest("button, input, textarea, select, a, [contenteditable=true]")) return;
      event.preventDefault();
      pressed.add(key);
      update();
    };
    const up = (event: KeyboardEvent) => {
      pressed.delete(event.key.toLowerCase());
      update();
    };
    const clear = () => {
      pressed.clear();
      update();
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
      clear();
    };
  }, []);

  return keys;
}
