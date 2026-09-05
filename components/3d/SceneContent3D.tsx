"use client";

import { useEffect, useMemo, useState } from "react";
import { CinematicSpace } from "@/components/3d/CinematicSpace";
import { CelestialBody } from "@/components/3d/CelestialBody";
import { DestinationWorld } from "@/components/3d/DestinationWorld";
import { GroundWorld } from "@/components/3d/GroundWorld";
import { HeartBurst } from "@/components/3d/HeartBurst";
import { RobotMesh } from "@/components/3d/RobotMesh";
import { DESTINATIONS, TIMES_OF_DAY, WEEKDAYS } from "@/lib/constants";
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
  const time = useExperienceStore((s) => s.time);
  const setTime = useExperienceStore((s) => s.setTime);
  const destination = useExperienceStore((s) => s.destination);
  const setDestination = useExperienceStore((s) => s.setDestination);
  const dayPositions = useMemo(() => fullCircleLayout(WEEKDAYS.length, 4.2, 0), []);
  const timePositions = useMemo(() => fullCircleLayout(TIMES_OF_DAY.length, 3.8, 0), []);
  const destinationPositions = useMemo(() => fullCircleLayout(DESTINATIONS.length, 4.2, 0), []);
  const timeItems = useMemo(() => TIMES_OF_DAY.map((config) => ({
    id: config.id,
    label: config.label,
    model: <CelestialBody config={config} />,
  })), []);
  const destinationItems = useMemo(() => DESTINATIONS.map((config) => ({
    id: config.id,
    label: config.label,
    model: <DestinationWorld config={config} />,
  })), []);

  return (
    <>
      {stage === "cinematic" && <CinematicSpace />}
      {stage === "day" && (
        <GroundWorld positions={dayPositions} items={WEEKDAYS} selected={day} onSelect={setDay} />
      )}
      {stage === "time" && (
        <GroundWorld positions={timePositions} items={timeItems} selected={time} onSelect={setTime} />
      )}
      {stage === "destination" && (
        <GroundWorld positions={destinationPositions} items={destinationItems} selected={destination} onSelect={setDestination} />
      )}
      {stage === "ending" && <EndingSequence3D />}
    </>
  );
}

function EndingSequence3D() {
  const progress = useEndingProgress();
  return (
    <>
      {progress < 0.22 && <RobotMesh position={[0, 1.2, 0]} scale={Math.max(0.01, 0.8 * (1 - progress / 0.22))} />}
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
      setProgress(Math.min(1, elapsed / 6));
      if (elapsed < 6) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return progress;
}
