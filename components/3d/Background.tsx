"use client";

import { Sparkles, Stars, Trail } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  Color,
  type Mesh,
  type Points as PointsType,
} from "three";
import { randomAngle, randomSigned, randomUnit } from "@/lib/random";
import { useExperienceStore } from "@/lib/store";

const FIREFLY_COUNT = 60;

function Fireflies() {
  const ref = useRef<PointsType>(null);
  const time = useExperienceStore((s) => s.time);

  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(FIREFLY_COUNT * 3);
    const phases = new Float32Array(FIREFLY_COUNT);
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      positions[i * 3] = randomSigned(20);
      positions[i * 3 + 1] = randomUnit() * 6 - 1;
      positions[i * 3 + 2] = randomSigned(20);
      phases[i] = randomAngle();
    }
    return { positions, phases };
  }, []);

  const visible = time === "night" || time === "evening" || time === null;
  const color = useMemo(() => new Color(time === "night" ? "#a9c8ff" : "#ffe9a8"), [time]);

  useFrame((state) => {
    if (!ref.current) return;
    const geo = ref.current.geometry;
    const posAttr = geo.getAttribute("position");
    const t = state.clock.getElapsedTime();
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const phase = phases[i];
      const baseY = positions[i * 3 + 1];
      posAttr.setY(i, baseY + Math.sin(t * 0.6 + phase) * 0.5);
      posAttr.setX(i, positions[i * 3] + Math.sin(t * 0.2 + phase) * 0.4);
    }
    posAttr.needsUpdate = true;
    ref.current.rotation.y = t * 0.01;
  });

  if (!visible) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        color={color}
        transparent
        opacity={0.85}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}

interface Meteor {
  id: number;
  start: [number, number, number];
  velocity: [number, number, number];
  bornAt: number;
  life: number;
}

function spawnMeteor(id: number, t: number): Meteor {
  const startX = randomSigned(18) - 6;
  const startY = 10 + randomUnit() * 6;
  const startZ = randomSigned(14) - 6;
  return {
    id,
    start: [startX, startY, startZ],
    velocity: [-6 - randomUnit() * 3, -4 - randomUnit() * 2, -1 + randomUnit() * 2],
    bornAt: t,
    life: 1.1 + randomUnit() * 0.4,
  };
}

function ShootingStars() {
  const meteorIdRef = useRef(0);
  const [initialSpawnDelay] = useState(() => 4 + Math.random() * 5);
  const nextSpawnRef = useRef(initialSpawnDelay);
  const [meteors, setMeteors] = useState<Meteor[]>([]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (t >= nextSpawnRef.current) {
      meteorIdRef.current += 1;
      nextSpawnRef.current = t + 5 + Math.random() * 7;
      setMeteors((prev) => [...prev, spawnMeteor(meteorIdRef.current, t)]);
    }
    setMeteors((prev) => prev.filter((m) => t - m.bornAt < m.life));
  });

  return (
    <>
      {meteors.map((m) => (
        <MeteorStreak key={m.id} meteor={m} />
      ))}
    </>
  );
}

function MeteorStreak({ meteor }: { meteor: Meteor }) {
  const ref = useRef<Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const elapsed = state.clock.getElapsedTime() - meteor.bornAt;
    ref.current.position.set(
      meteor.start[0] + meteor.velocity[0] * elapsed,
      meteor.start[1] + meteor.velocity[1] * elapsed,
      meteor.start[2] + meteor.velocity[2] * elapsed
    );
    const fadeIn = Math.min(1, elapsed / 0.15);
    const fadeOut = Math.min(1, (meteor.life - elapsed) / 0.3);
    const mat = ref.current.material as unknown as { opacity: number };
    mat.opacity = Math.max(0, Math.min(fadeIn, fadeOut));
  });

  return (
    <Trail width={1.2} length={6} color="#ffffff" attenuation={(w) => w * w}>
      <mesh ref={ref} position={meteor.start}>
        <sphereGeometry args={[0.045, 8, 8]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0} />
      </mesh>
    </Trail>
  );
}

export function Background() {
  const answer = useExperienceStore((s) => s.answer);
  const sparkleColor = answer === "yes" ? "#ffd27a" : "#9fd8ff";

  return (
    <>
      <color attach="background" args={["#03040a"]} />
      <fog attach="fog" args={["#03040a", 8, 30]} />
      <Stars
        radius={60}
        depth={40}
        count={3000}
        factor={2.2}
        saturation={0}
        fade
        speed={0.4}
      />
      <ShootingStars />
      <Fireflies />
      <Sparkles
        count={answer === "yes" ? 140 : 60}
        scale={[16, 8, 16]}
        size={answer === "yes" ? 3.5 : 2}
        speed={0.3}
        color={sparkleColor}
        opacity={0.6}
      />
    </>
  );
}
