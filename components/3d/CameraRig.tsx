"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import { usePointer } from "@/hooks/usePointer";
import { useExperienceStore } from "@/lib/store";
import type { Stage } from "@/types/experience";

const CAMERA_PRESETS: Record<Stage, { position: [number, number, number]; target: [number, number, number] }> = {
  intro: { position: [0, 1.2, 7], target: [0, 0.6, 0] },
  invite: { position: [0, 1.4, 6], target: [0, 0.8, 0] },
  day: { position: [0, 7.5, 7.5], target: [0, 0, 0] },
  time: { position: [0, 1.3, 7], target: [0, 0.6, 0.8] },
  destination: { position: [0, 1.2, 6.8], target: [0, 0.1, 0.6] },
  final: { position: [0, 1.4, 6.5], target: [0, 0.8, 0] },
  ending: { position: [0, 0.8, 5.5], target: [0, 1.4, 0] },
};

export function CameraRig() {
  const { camera } = useThree();
  const pointer = usePointer();
  const stage = useExperienceStore((s) => s.stage);
  const currentTarget = useRef(new Vector3(0, 0.6, 0));
  const currentPos = useRef(new Vector3(0, 1.2, 7));

  useFrame((state) => {
    const preset = CAMERA_PRESETS[stage];
    const t = state.clock.getElapsedTime();

    const parallaxX = pointer.current.x * 0.6;
    const parallaxY = -pointer.current.y * 0.35;
    const breathe = Math.sin(t * 0.3) * 0.05;

    const targetPos = new Vector3(
      preset.position[0] + parallaxX,
      preset.position[1] + parallaxY + breathe,
      preset.position[2]
    );
    const targetLook = new Vector3(...preset.target);

    currentPos.current.lerp(targetPos, 0.035);
    currentTarget.current.lerp(targetLook, 0.05);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
