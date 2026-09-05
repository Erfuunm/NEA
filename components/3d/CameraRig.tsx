"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import { usePointer } from "@/hooks/usePointer";
import { useExperienceStore } from "@/lib/store";
import type { Stage } from "@/types/experience";

const CAMERA_PRESETS: Record<
  Exclude<Stage, "day" | "time" | "destination">,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  cinematic: { position: [0, 0.2, 12], target: [0, 0, 0] },
  intro: { position: [0, 1.2, 7], target: [0, 0.6, 0] },
  invite: { position: [0, 1.6, 6.2], target: [0, 1.6, 0] },
  final: { position: [0, 1.4, 6.5], target: [0, 0.8, 0] },
  ending: { position: [0, 1.8, 7.5], target: [0, 1.4, 0] },
};

export function CameraRig() {
  const { camera, size } = useThree();
  const pointer = usePointer();
  const stage = useExperienceStore((s) => s.stage);
  const currentTarget = useRef(new Vector3(0, 0.6, 0));
  const currentPos = useRef(new Vector3(0, 1.2, 7));

  useFrame((state, delta) => {
    if (stage === "day" || stage === "time" || stage === "destination") {
      currentPos.current.copy(camera.position);
      camera.getWorldDirection(currentTarget.current).multiplyScalar(5).add(camera.position);
      return;
    }

    const preset = CAMERA_PRESETS[stage];
    const t = state.clock.getElapsedTime();
    const parallax = stage === "ending" ? 0.12 : 0.6;
    const targetPos = new Vector3(
      preset.position[0] + pointer.current.x * parallax,
      preset.position[1] - pointer.current.y * parallax * 0.5 + Math.sin(t * 0.3) * 0.05,
      stage === "ending" ? Math.max(7.5, 4.7 / (size.width / size.height)) : preset.position[2]
    );
    const targetLook = new Vector3(...preset.target);

    currentPos.current.lerp(targetPos, 1 - Math.exp(-3 * delta));
    currentTarget.current.lerp(targetLook, 1 - Math.exp(-4 * delta));
    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}
