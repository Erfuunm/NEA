"use client";

import { Html, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Vector3, type Group } from "three";
import { useSound } from "@/hooks/useSound";

interface FloatingIslandProps {
  position: [number, number, number];
  label: string;
  selected: boolean;
  onSelect: () => void;
  seed?: number;
}

export function FloatingIsland({
  position,
  label,
  selected,
  onSelect,
  seed = 0,
}: FloatingIslandProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const sound = useSound();
  const scaleTarget = useMemo(() => new Vector3(1, 1, 1), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() + seed * 10;
    const baseY = position[1] + Math.sin(t * 0.6) * 0.18;
    const lift = selected ? 1.1 : hovered ? 0.35 : 0;
    groupRef.current.position.y = baseY + lift;
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.15;

    const targetScale = selected ? 1.18 : hovered ? 1.08 : 1;
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
      <mesh position={[0, -0.4, 0]} castShadow>
        <coneGeometry args={[0.9, 1.1, 6]} />
        <meshStandardMaterial
          color={selected ? "#4c3a6b" : "#2c2440"}
          roughness={0.8}
        />
      </mesh>

      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.95, 1, 0.25, 24]} />
        <meshStandardMaterial
          color={selected ? "#7fe0c4" : "#3a8f7a"}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[0, 0.55, 0]}>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={selected ? "#ffd27a" : "#8fd8ff"}
          emissive={selected ? "#ffd27a" : "#8fd8ff"}
          emissiveIntensity={selected ? 0.8 : hovered ? 0.5 : 0.25}
        />
      </mesh>

      <mesh visible={false}>
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Html position={[0, 1.05, 0]} center distanceFactor={8} occlude={false}>
        <span
          className="pointer-events-none whitespace-nowrap rounded-full bg-black/40 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-md"
          style={{
            color: selected ? "#ffe9b0" : "#e8f4ff",
            textShadow: "0 0 6px #000814",
          }}
        >
          {label}
        </span>
      </Html>

      {(hovered || selected) && (
        <Sparkles
          count={selected ? 22 : 10}
          scale={[1.1, 1.1, 1.1]}
          size={2}
          speed={0.4}
          color={selected ? "#ffd27a" : "#9fe8ff"}
        />
      )}

      <pointLight
        position={[0, 0.6, 0]}
        color={selected ? "#ffd27a" : "#8fd8ff"}
        intensity={selected ? 1.2 : hovered ? 0.7 : 0.2}
        distance={2.2}
      />
    </group>
  );
}
