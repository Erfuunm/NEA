"use client";

import { useEffect, useState } from "react";

export function useTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const detect = () => {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsTouch(coarse || touch);
    };
    detect();
    const listener = () => detect();
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, []);

  return isTouch;
}
