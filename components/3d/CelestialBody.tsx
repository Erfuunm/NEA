"use client";

import { Html, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Vector3, type Group } from "three";
import { useSound } from "@/hooks/useSound";
import type { TimeConfig } from "@/types/experience";

interface CelestialBodyProps {
  config: TimeConfig;
  position: [number, number, number];
  selected: boolean;
  onSelect: () => void;
}

export function CelestialBody({
  config,
  position,
  selected,
  onSelect,
}: CelestialBodyProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const sound = useSound();
  const scaleTarget = useMemo(() => new Vector3(1, 1, 1), []);
  const isNight = config.id === "night";

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y = position[1] + Math.sin(t * 0.5 + position[0]) * 0.2;
    groupRef.current.rotation.y = t * 0.15;

    const targetScale = selected ? 1.25 : hovered ? 1.1 : 1;
    scaleTarget.set(targetScale, targetScale, targetScale);
    groupRef.current.scale.lerp(scaleTarget, 0.1);
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        sound.hover();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        sound.select();
        onSelect();
      }}
    >
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          color={config.glow}
          emissive={config.glow}
          emissiveIntensity={selected ? 1.8 : 1.1}
          roughness={0.3}
        />
      </mesh>

      {isNight && (
        <mesh rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[0.75, 0.02, 8, 64]} />
          <meshBasicMaterial color="#9fb4ff" transparent opacity={0.5} />
        </mesh>
      )}

      <Sparkles
        count={selected ? 45 : 22}
        scale={[1.8, 1.8, 1.8]}
        size={2.5}
        speed={0.35}
        color={config.glow}
      />

      <Html position={[0, -0.85, 0]} center distanceFactor={8} occlude={false}>
        <span
          className="whitespace-nowrap rounded-full bg-black/40 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-md"
          style={{
            color: selected ? "#ffe9b0" : "#e8f4ff",
            textShadow: "0 0 6px #000814",
          }}
        >
          {config.emoji} {config.label}
        </span>
      </Html>

      <pointLight
        color={config.glow}
        intensity={selected ? 4 : hovered ? 2.2 : 1.2}
        distance={4}
      />
    </group>
  );
}
