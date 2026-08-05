"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { AdditiveBlending, Color, type Points as PointsType } from "three";
import { randomAngle, randomSigned, randomUnit } from "@/lib/random";

const PARTICLE_COUNT = 900;

function heartPoint(t: number) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return { x: x / 16, y: y / 16 };
}

export function HeartBurst({ progress }: { progress: number }) {
  const ref = useRef<PointsType>(null);

  const { starts, targets, randoms } = useMemo(() => {
    const starts = new Float32Array(PARTICLE_COUNT * 3);
    const targets = new Float32Array(PARTICLE_COUNT * 3);
    const randoms = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = randomAngle();
      const radius = randomUnit() * 0.4;
      starts[i * 3] = Math.cos(angle) * radius;
      starts[i * 3 + 1] = Math.sin(angle) * radius + 0.9;
      starts[i * 3 + 2] = randomSigned(0.4);

      const t = (i / PARTICLE_COUNT) * Math.PI * 2;
      const { x, y } = heartPoint(t);
      const scale = 1.8 + randomUnit() * 0.15;
      targets[i * 3] = x * scale;
      targets[i * 3 + 1] = y * scale + 2.4;
      targets[i * 3 + 2] = randomSigned(0.6);

      randoms[i] = randomUnit();
    }
    return { starts, targets, randoms };
  }, []);

  const positions = useMemo(() => new Float32Array(PARTICLE_COUNT * 3), []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const geo = ref.current.geometry;
    const posAttr = geo.getAttribute("position");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const delay = randoms[i] * 0.4;
      const localProgress = Math.min(
        1,
        Math.max(0, (progress - delay) / (1 - delay))
      );
      const eased = 1 - Math.pow(1 - localProgress, 3);

      const spiral = (1 - eased) * 6 * randoms[i];
      const spiralAngle = t * 2 + randoms[i] * 20;

      const sx = starts[i * 3];
      const sy = starts[i * 3 + 1];
      const sz = starts[i * 3 + 2];

      const tx = targets[i * 3];
      const ty = targets[i * 3 + 1];
      const tz = targets[i * 3 + 2];

      const x = sx + (tx - sx) * eased + Math.cos(spiralAngle) * spiral * 0.05;
      const y = sy + (ty - sy) * eased + eased * 0.3 * Math.sin(t + i);
      const z = sz + (tz - sz) * eased + Math.sin(spiralAngle) * spiral * 0.05;

      posAttr.setXYZ(i, x, y, z);
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
        color={new Color("#ff8fb1")}
        transparent
        opacity={0.9}
        blending={AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
}
