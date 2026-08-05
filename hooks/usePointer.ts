import { useEffect, useRef } from "react";

export interface PointerState {
  x: number;
  y: number;
}

export function usePointer() {
  const pointer = useRef<PointerState>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      pointer.current.x = nx;
      pointer.current.y = ny;
    };

    const handleTouch = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      const nx = (touch.clientX / window.innerWidth) * 2 - 1;
      const ny = (touch.clientY / window.innerHeight) * 2 - 1;
      pointer.current.x = nx;
      pointer.current.y = ny;
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("touchmove", handleTouch);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("touchmove", handleTouch);
    };
  }, []);

  return pointer;
}
