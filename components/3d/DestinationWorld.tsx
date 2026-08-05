"use client";

import { Html, Sparkles } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, type ReactElement } from "react";
import { Vector3, type Group, type Mesh } from "three";
import { useSound } from "@/hooks/useSound";
import type { DestinationConfig } from "@/types/experience";

interface DestinationWorldProps {
  config: DestinationConfig;
  position: [number, number, number];
  selected: boolean;
  onSelect: () => void;
}

function CoffeeWorld({ accent }: { accent: string }) {
  const steamRef = useRef<Group>(null);
  useFrame((state) => {
    if (!steamRef.current) return;
    const t = state.clock.getElapsedTime();
    steamRef.current.children.forEach((child, i) => {
      child.position.y = 0.4 + ((t * 0.4 + i * 0.3) % 1) * 0.8;
      child.scale.setScalar(1 - ((t * 0.4 + i * 0.3) % 1) * 0.6);
    });
  });
  return (
    <group>
      <mesh position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.32, 0.26, 0.4, 24]} />
        <meshStandardMaterial color={accent} roughness={0.4} />
      </mesh>
      <mesh position={[0.35, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.12, 0.03, 12, 24]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <group ref={steamRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[i * 0.08 - 0.08, 0.4, 0]}>
            <planeGeometry args={[0.06, 0.2]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.35} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function RestaurantWorld({ accent }: { accent: string }) {
  const flameRef = useRef<Mesh>(null);
  useFrame((state) => {
    if (!flameRef.current) return;
    const t = state.clock.getElapsedTime();
    flameRef.current.scale.setScalar(1 + Math.sin(t * 8) * 0.15);
  });
  return (
    <group>
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.4, 12]} />
        <meshStandardMaterial color="#fff7e0" />
      </mesh>
      <mesh ref={flameRef} position={[0, 0.1, 0]}>
        <coneGeometry args={[0.06, 0.16, 12]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.6}
        />
      </mesh>
      <pointLight color={accent} intensity={2} distance={2.5} />
    </group>
  );
}

function ParkWorld({ accent }: { accent: string }) {
  const treeRef = useRef<Group>(null);
  const birdRef = useRef<Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (treeRef.current) treeRef.current.rotation.z = Math.sin(t * 1.2) * 0.06;
    if (birdRef.current) {
      birdRef.current.position.x = Math.cos(t * 1.5) * 0.5;
      birdRef.current.position.y = 0.5 + Math.sin(t * 3) * 0.08;
      birdRef.current.position.z = Math.sin(t * 1.5) * 0.5;
    }
  });
  return (
    <group>
      <mesh position={[0, -0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.07, 0.35, 8]} />
        <meshStandardMaterial color="#6b4a2f" />
      </mesh>
      <group ref={treeRef} position={[0, 0.1, 0]}>
        <mesh>
          <coneGeometry args={[0.28, 0.5, 8]} />
          <meshStandardMaterial color={accent} />
        </mesh>
      </group>
      <mesh ref={birdRef} position={[0.3, 0.5, 0]}>
        <coneGeometry args={[0.03, 0.08, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  );
}

function CinemaWorld({ accent }: { accent: string }) {
  const glowRef = useRef<Mesh>(null);
  useFrame((state) => {
    if (!glowRef.current) return;
    const t = state.clock.getElapsedTime();
    const mat = glowRef.current.material as unknown as { emissiveIntensity: number };
    mat.emissiveIntensity = 1.2 + Math.sin(t * 4) * 0.4;
  });
  return (
    <group>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[0.6, 0.4]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh ref={glowRef} position={[0, 0, 0]}>
        <torusGeometry args={[0.32, 0.02, 8, 32]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.4}
        />
      </mesh>
      <pointLight color={accent} intensity={2.5} distance={2.5} />
    </group>
  );
}

function SurpriseWorld({ accent }: { accent: string }) {
  const ringRef = useRef<Mesh>(null);
  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.getElapsedTime();
    ringRef.current.rotation.z = t * 1.4;
    ringRef.current.rotation.x = t * 0.6;
  });
  return (
    <group>
      <mesh ref={ringRef}>
        <torusKnotGeometry args={[0.28, 0.06, 100, 16]} />
        <meshStandardMaterial
          color={accent}
          emissive={accent}
          emissiveIntensity={1.2}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

const WORLD_COMPONENTS: Record<string, (props: { accent: string }) => ReactElement> = {
  coffee: CoffeeWorld,
  restaurant: RestaurantWorld,
  park: ParkWorld,
  cinema: CinemaWorld,
  surprise: SurpriseWorld,
};

export function DestinationWorld({
  config,
  position,
  selected,
  onSelect,
}: DestinationWorldProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const sound = useSound();
  const scaleTarget = useMemo(() => new Vector3(1, 1, 1), []);
  const WorldComponent = WORLD_COMPONENTS[config.id];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.y =
      position[1] + Math.sin(t * 0.6 + position[0]) * 0.15;

    const targetScale = selected ? 1.3 : hovered ? 1.12 : 1;
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
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.55, 0.6, 0.15, 24]} />
        <meshStandardMaterial
          color={selected ? config.accent : "#2c2440"}
          roughness={0.7}
        />
      </mesh>

      <WorldComponent accent={config.accent} />

      {(hovered || selected) && (
        <Sparkles
          count={selected ? 30 : 14}
          scale={[1.2, 1.2, 1.2]}
          size={2}
          speed={0.4}
          color={config.accent}
        />
      )}

      <Html position={[0, -0.85, 0]} center distanceFactor={8} occlude={false}>
        <span
          className="pointer-events-none whitespace-nowrap rounded-full bg-black/40 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-md"
          style={{
            color: selected ? "#ffe9b0" : "#e8f4ff",
            textShadow: "0 0 6px #000814",
          }}
        >
          {config.emoji} {config.label}
        </span>
      </Html>

      <Html position={[0, -1.25, 0]} center distanceFactor={8} occlude={false}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            sound.select();
            onSelect();
          }}
          className="pointer-events-auto whitespace-nowrap rounded-full border px-3 py-1 text-[11px] font-semibold tracking-wide backdrop-blur-md transition-colors"
          style={{
            borderColor: selected ? "rgba(255,226,160,0.7)" : "rgba(255,255,255,0.25)",
            background: selected ? "rgba(255,210,140,0.18)" : "rgba(0,0,0,0.45)",
            color: selected ? "#ffe9b0" : "#e8f4ff",
          }}
        >
          {selected ? "Selected" : "Choose"}
        </button>
      </Html>
    </group>
  );
}
