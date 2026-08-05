"use client";

import { MeshDistortMaterial, Trail } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type Group, type Mesh } from "three";
import { usePointer } from "@/hooks/usePointer";
import { useExperienceStore } from "@/lib/store";

const MOOD_COLORS: Record<string, string> = {
  neutral: "#6ee7ff",
  yes: "#ffc36b",
  maybe: "#c9a6ff",
  no: "#7c9bff",
};

interface OrbMeshProps {
  position?: [number, number, number];
  scale?: number;
}

export function OrbMesh({ position = [0, 0.9, 0], scale = 1 }: OrbMeshProps) {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const pointer = usePointer();
  const answer = useExperienceStore((s) => s.answer);

  const mood = answer ?? "neutral";
  const targetColor = useMemo(() => new Color(MOOD_COLORS[mood]), [mood]);
  const currentColor = useRef(new Color(MOOD_COLORS.neutral));

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(t * 1.1) * 0.12;
      groupRef.current.rotation.y = pointer.current.x * 0.4;
      groupRef.current.rotation.x = -pointer.current.y * 0.2;

      const wobble =
        mood === "maybe" ? Math.sin(t * 8) * 0.15 : 0;
      groupRef.current.rotation.z = wobble;
    }

    currentColor.current.lerp(targetColor, delta * 2);
    if (coreRef.current) {
      const mat = coreRef.current.material as unknown as {
        color: Color;
        emissive?: Color;
        distort?: number;
      };
      mat.color?.copy(currentColor.current);
      if (mat.emissive) mat.emissive.copy(currentColor.current);
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Trail
        width={0.9}
        length={2.5}
        color={new Color(MOOD_COLORS[mood])}
        attenuation={(w) => w * w}
      >
        <mesh ref={coreRef}>
          <sphereGeometry args={[0.55, 64, 64]} />
          <MeshDistortMaterial
            color={MOOD_COLORS[mood]}
            emissive={MOOD_COLORS[mood]}
            emissiveIntensity={0.45}
            distort={mood === "maybe" ? 0.5 : 0.25}
            speed={mood === "maybe" ? 4 : 1.5}
            roughness={0.15}
            metalness={0.3}
          />
        </mesh>
      </Trail>

    </group>
  );
}
