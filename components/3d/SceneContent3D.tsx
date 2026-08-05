"use client";

import { useEffect, useMemo, useState } from "react";
import { FloatingIsland } from "@/components/3d/FloatingIsland";
import { HeartBurst } from "@/components/3d/HeartBurst";
import { OrbMesh } from "@/components/3d/OrbMesh";
import { useViewportWidth } from "@/hooks/useViewportWidth";
import { WEEKDAYS } from "@/lib/constants";
import { useExperienceStore } from "@/lib/store";

function fullCircleLayout(count: number, radius: number, y: number) {
  // Evenly spaced around a complete circle, viewed from an elevated angle.
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    return [x, y, z] as [number, number, number];
  });
}

export function SceneContent3D() {
  const stage = useExperienceStore((s) => s.stage);
  const day = useExperienceStore((s) => s.day);
  const setDay = useExperienceStore((s) => s.setDay);
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth < 640;

  const dayPositions = useMemo(
    () => fullCircleLayout(WEEKDAYS.length, isMobile ? 3.1 : 4.2, 0),
    [isMobile]
  );

  const orbPosition: [number, number, number] = [0, 1.2, 1.4];
  const orbScale = 0.9;

  return (
    <>
      {stage !== "ending" && stage !== "day" && (
        <OrbMesh position={orbPosition} scale={orbScale} />
      )}

      {stage === "day" &&
        WEEKDAYS.map((w, i) => (
          <FloatingIsland
            key={w.id}
            position={dayPositions[i]}
            label={w.short}
            selected={day === w.id}
            onSelect={() => setDay(w.id)}
            seed={i}
          />
        ))}

      {stage === "ending" && <EndingSequence3D />}
    </>
  );
}

function EndingSequence3D() {
  const progress = useEndingProgress();
  return (
    <>
      <OrbMesh position={[0, 1.2, 1.4]} scale={Math.max(0.02, 1 - progress * 1.2)} />
      <HeartBurst progress={progress} />
    </>
  );
}

function useEndingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      setProgress(Math.min(1, elapsed / 3.5));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return progress;
}
