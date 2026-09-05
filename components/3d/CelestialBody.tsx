"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Shape, type Group } from "three";
import type { TimeConfig } from "@/types/experience";

export function CelestialBody({ config }: { config: TimeConfig }) {
  const model = useRef<Group>(null);
  const moon = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(0.24, 0.5);
    shape.bezierCurveTo(-0.62, 0.6, -0.62, -0.6, 0.24, -0.5);
    shape.bezierCurveTo(-0.18, -0.3, -0.18, 0.3, 0.24, 0.5);
    return shape;
  }, []);
  const isNight = config.id === "night";
  const isAfternoon = config.id === "afternoon";
  const isMorning = config.id === "morning";

  useFrame(({ clock }, delta) => {
    if (!model.current) return;
    model.current.rotation.y += delta * 0.18;
    model.current.position.y = 1.05 + Math.sin(clock.getElapsedTime() * 1.2) * 0.045;
  });

  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.58, 0.7, 0.22, 48]} />
        <meshStandardMaterial color={config.skyBottom} metalness={0.3} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.57, 0.025, 10, 48]} />
        <meshStandardMaterial color={config.glow} emissive={config.glow} emissiveIntensity={1.5} />
      </mesh>
      <group ref={model} position={[0, 1.05, 0]}>
        {isNight ? (
          <group>
            <mesh position={[0.08, 0, -0.08]}>
              <extrudeGeometry args={[moon, { depth: 0.16, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.025, bevelThickness: 0.025, curveSegments: 32 }]} />
              <meshStandardMaterial color="#dae5ff" emissive={config.glow} emissiveIntensity={0.7} metalness={0.2} roughness={0.25} />
            </mesh>
            {[[-0.6, 0.5, 0], [0.55, 0.25, 0.1], [0.4, -0.4, -0.1]].map((p, i) => (
              <mesh key={i} position={p as [number, number, number]} scale={[0.7, 1, 0.5]}>
                <octahedronGeometry args={[0.11]} />
                <meshStandardMaterial color="#fff3c4" emissive="#fff3c4" emissiveIntensity={1.5} />
              </mesh>
            ))}
          </group>
        ) : (
          <group>
            <mesh position={[0, isAfternoon ? 0.05 : 0, 0]}>
              <sphereGeometry args={[isAfternoon ? 0.38 : 0.34, 32, 24]} />
              <meshStandardMaterial color={config.glow} emissive={config.glow} emissiveIntensity={0.9} roughness={0.3} />
            </mesh>
            {Array.from({ length: 10 }, (_, i) => {
              const angle = i * Math.PI / 5;
              return (
                <mesh key={i} position={[Math.sin(angle) * 0.54, Math.cos(angle) * 0.54, 0]} rotation={[0, 0, -angle]}>
                  <capsuleGeometry args={[0.025, 0.12, 4, 8]} />
                  <meshStandardMaterial color={config.glow} emissive={config.glow} emissiveIntensity={0.8} />
                </mesh>
              );
            })}
            {!isAfternoon && (
              <group position={[0, -0.22, 0.24]}>
                {[-1, 0, 1].map((side) => (
                  <mesh key={side} position={[side * 0.23, side === 0 ? 0.02 : -0.08, 0]} scale={[1.3, 0.7, 0.75]}>
                    <sphereGeometry args={[0.25, 24, 16]} />
                    <meshStandardMaterial color={isMorning ? "#ffeddb" : "#c593d9"} roughness={0.7} />
                  </mesh>
                ))}
              </group>
            )}
            {!isAfternoon && !isMorning && (
              <mesh position={[0, -0.47, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.58, 0.035, 8, 48]} />
                <meshStandardMaterial color="#ff87af" emissive="#ff87af" emissiveIntensity={0.6} />
              </mesh>
            )}
          </group>
        )}
      </group>
      <pointLight position={[0, 1.2, 0]} color={config.glow} intensity={1.4} distance={4} />
    </group>
  );
}
