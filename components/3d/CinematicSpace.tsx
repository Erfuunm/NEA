"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, type Group, type Points as PointsType } from "three";
import { randomAngle, randomSigned, randomUnit } from "@/lib/random";
import { useExperienceStore } from "@/lib/store";

const ASTEROID_COUNT = 40;
const WARP_COUNT = 1200;

interface AsteroidState {
  start: [number, number, number];
  end: [number, number, number];
  axis: [number, number, number];
  speed: number;
  scale: number;
  delay: number;
}

function spawnAsteroid(): AsteroidState {
  const angle = randomAngle();
  const radius = 10 + randomUnit() * 25;
  const start: [number, number, number] = [
    Math.cos(angle) * radius,
    randomSigned(8),
    Math.sin(angle) * radius,
  ];
  const end: [number, number, number] = [
    start[0] * -2.5,
    start[1] * -1.5,
    start[2] * -2.5,
  ];
  return {
    start,
    end,
    axis: [randomSigned(1), randomSigned(1), randomSigned(1)],
    speed: 0.5 + randomUnit() * 1.2,
    scale: 0.15 + randomUnit() * 0.35,
    delay: randomUnit() * 0.25,
  };
}

function Asteroids() {
  const groupRef = useRef<Group>(null);
  const states = useMemo(() => Array.from({ length: ASTEROID_COUNT }, () => spawnAsteroid()), []);

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = useExperienceStore.getState().cinematicProgress;
    const localProgress = Math.max(0, progress - 0.15);
    const eased = 1 - Math.pow(1 - Math.min(1, localProgress), 2);
    groupRef.current.children.forEach((child, i) => {
      const s = states[i];
      const t = Math.max(0, eased - s.delay);
      child.position.set(
        s.start[0] + (s.end[0] - s.start[0]) * t,
        s.start[1] + (s.end[1] - s.start[1]) * t,
        s.start[2] + (s.end[2] - s.start[2]) * t
      );
      child.rotation.x += s.axis[0] * 0.02 * s.speed;
      child.rotation.y += s.axis[1] * 0.02 * s.speed;
      child.rotation.z += s.axis[2] * 0.02 * s.speed;
    });
  });

  return (
    <group ref={groupRef}>
      {states.map((s, i) => (
        <mesh key={i} position={s.start} scale={s.scale}>
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#5a6a7a"
            roughness={0.9}
            metalness={0.1}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

function WarpTunnel() {
  const ref = useRef<PointsType>(null);
  const starts = useMemo(() => {
    const arr = new Float32Array(WARP_COUNT * 3);
    for (let i = 0; i < WARP_COUNT; i++) {
      const angle = randomAngle();
      const radius = 0.2 + randomUnit() * 14;
      arr[i * 3] = Math.cos(angle) * radius;
      arr[i * 3 + 1] = Math.sin(angle) * radius;
      arr[i * 3 + 2] = 20 + randomUnit() * 80;
    }
    return arr;
  }, []);

  const positions = useMemo(() => new Float32Array(WARP_COUNT * 3), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const progress = useExperienceStore.getState().cinematicProgress;
    const warp = Math.max(0, progress - 0.35) / 0.65;
    const speed = warp * 32;
    const posAttr = ref.current.geometry.getAttribute("position");
    for (let i = 0; i < WARP_COUNT; i++) {
      const z = starts[i * 3 + 2];
      const drawZ = ((z - t * speed + 140) % 140) - 40;
      posAttr.setXYZ(i, starts[i * 3], starts[i * 3 + 1], drawZ);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#c4d8ff"
        transparent
        opacity={0.7}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

export function CinematicSpace() {
  return (
    <group>
      <Asteroids />
      <WarpTunnel />
    </group>
  );
}
