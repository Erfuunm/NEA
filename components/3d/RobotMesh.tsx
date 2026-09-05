"use client";

import { RoundedBox } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import { MathUtils, type Group, type MeshStandardMaterial, type Vector3 } from "three";
import { cn } from "@/lib/utils";
import { usePointer } from "@/hooks/usePointer";

interface RobotMeshProps {
  position?: [number, number, number];
  scale?: number;
  velocity?: RefObject<Vector3>;
}

export function RobotPortrait({ className }: { className?: string }) {
  return (
    <div className={cn("h-[clamp(160px,30svh,260px)] w-full max-w-sm shrink-0", className)} role="img" aria-label="Your friendly robot companion">
      <Canvas camera={{ position: [0, 0.27, 3.4], fov: 35 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 5]} intensity={3} color="#e6f4ff" />
        <directionalLight position={[-3, 2, -2]} intensity={2} color="#ffb3cf" />
        <RobotMesh position={[0, 0, 0]} scale={1} />
      </Canvas>
    </div>
  );
}

function PearlArmor() {
  return (
    <meshPhysicalMaterial
      color="#edf5ff"
      metalness={0.22}
      roughness={0.26}
      clearcoat={0.85}
      clearcoatRoughness={0.18}
    />
  );
}

export function RobotMesh({ position = [0, 2.6, 1.4], scale = 1.2, velocity }: RobotMeshProps) {
  const groupRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const eyesRef = useRef<Group>(null);
  const wavingArmRef = useRef<Group>(null);
  const wavingHandRef = useRef<Group>(null);
  const restingArmRef = useRef<Group>(null);
  const coreRef = useRef<MeshStandardMaterial>(null);
  const leftLeg = useRef<Group>(null);
  const rightLeg = useRef<Group>(null);
  const pointer = usePointer();

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const walking = Math.min(1, (velocity?.current.length() ?? 0) / 2);
    const stride = Math.sin(t * 10) * walking;
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + (velocity ? Math.abs(stride) * 0.025 : Math.sin(t * 1.3) * 0.045);
      groupRef.current.rotation.y = MathUtils.damp(groupRef.current.rotation.y, velocity ? 0 : pointer.current.x * 0.25, 4, delta);
      groupRef.current.rotation.x = MathUtils.damp(groupRef.current.rotation.x, velocity ? walking * 0.06 : -pointer.current.y * 0.08, 4, delta);
      groupRef.current.rotation.z = Math.sin(t * 0.9) * (velocity ? 0.008 : 0.025);
    }
    if (leftLeg.current) leftLeg.current.rotation.x = stride * 0.45;
    if (rightLeg.current) rightLeg.current.rotation.x = -stride * 0.45;
    if (headRef.current) {
      headRef.current.rotation.y = MathUtils.damp(headRef.current.rotation.y, pointer.current.x * 0.18 + Math.sin(t * 0.7) * 0.06, 5, delta);
      headRef.current.rotation.z = Math.sin(t * 0.8) * 0.055;
      headRef.current.rotation.x = MathUtils.damp(headRef.current.rotation.x, -pointer.current.y * 0.1, 5, delta);
    }
    if (eyesRef.current) {
      const blinkPhase = t % 4.8;
      const blink = Math.max(0, 1 - Math.abs(blinkPhase - 4.35) / 0.12);
      eyesRef.current.scale.y = 1 - blink * 0.92;
      eyesRef.current.position.x = pointer.current.x * 0.018;
    }
    if (wavingArmRef.current) {
      wavingArmRef.current.rotation.z = 0.18 + Math.sin(t * 1.5) * 0.055;
      wavingArmRef.current.rotation.x = velocity ? stride * 0.4 : 0;
    }
    if (wavingHandRef.current) {
      wavingHandRef.current.rotation.z = velocity ? 0.12 : 2.35 + Math.sin(t * 3.2) * 0.2;
    }
    if (restingArmRef.current) {
      restingArmRef.current.rotation.z = -0.18 + Math.sin(t * 1.3) * 0.07;
      restingArmRef.current.rotation.x = velocity ? -stride * 0.4 : 0;
    }
    if (coreRef.current) {
      coreRef.current.emissiveIntensity = 1.6 + Math.sin(t * 2.1) * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <RoundedBox args={[0.48, 0.48, 0.34]} radius={0.12} smoothness={4} position={[0, 0.13, 0]}>
        <PearlArmor />
      </RoundedBox>
      <RoundedBox args={[0.3, 0.29, 0.055]} radius={0.075} smoothness={4} position={[0, 0.15, 0.173]}>
        <meshStandardMaterial color="#243b56" metalness={0.65} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0.18, 0.213]}>
        <torusGeometry args={[0.081, 0.016, 12, 40]} />
        <meshStandardMaterial color="#9db6cf" metalness={0.8} roughness={0.22} />
      </mesh>
      <mesh position={[0, 0.18, 0.219]}>
        <torusGeometry args={[0.06, 0.009, 10, 40]} />
        <meshStandardMaterial color="#a5f7ff" emissive="#53dcff" emissiveIntensity={2} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.18, 0.218]} scale={[1, 1, 0.35]}>
        <sphereGeometry args={[0.047, 24, 16]} />
        <meshStandardMaterial ref={coreRef} color="#cbfaff" emissive="#66e4ff" emissiveIntensity={1.6} roughness={0.18} toneMapped={false} />
      </mesh>
      {[-1, 0, 1].map((index) => (
        <RoundedBox key={index} args={[0.035, 0.012, 0.01]} radius={0.005} smoothness={2} position={[index * 0.05, 0.065, 0.206]}>
          <meshStandardMaterial color={index === 1 ? "#ffbca2" : "#75deee"} emissive={index === 1 ? "#ff9675" : "#54cfe5"} emissiveIntensity={0.7} />
        </RoundedBox>
      ))}
      <mesh position={[0, 0.395, 0]}>
        <cylinderGeometry args={[0.09, 0.1, 0.09, 24]} />
        <meshStandardMaterial color="#344a64" metalness={0.75} roughness={0.3} />
      </mesh>

      <group ref={headRef} position={[0, 0.63, 0]}>
        <RoundedBox args={[0.65, 0.45, 0.43]} radius={0.15} smoothness={5}>
          <PearlArmor />
        </RoundedBox>
        <RoundedBox args={[0.565, 0.315, 0.105]} radius={0.12} smoothness={5} position={[0, -0.012, 0.192]}>
          <meshStandardMaterial color="#6a869e" metalness={0.75} roughness={0.24} />
        </RoundedBox>
        <RoundedBox args={[0.535, 0.287, 0.09]} radius={0.105} smoothness={5} position={[0, -0.01, 0.217]}>
          <meshPhysicalMaterial color="#07172b" metalness={0.25} roughness={0.2} clearcoat={1} clearcoatRoughness={0.12} />
        </RoundedBox>
        <group ref={eyesRef} position={[0, 0.025, 0.269]}>
          {[-1, 1].map((side) => (
            <group key={side} position={[side * 0.115, 0, 0]} rotation={[0, 0, -side * 0.07]}>
              <mesh scale={[1, 1, 0.26]}>
                <capsuleGeometry args={[0.031, 0.041, 6, 16]} />
                <meshStandardMaterial color="#b4faff" emissive="#5ee8ff" emissiveIntensity={2.2} toneMapped={false} />
              </mesh>
              <mesh position={[-0.009, 0.025, 0.012]}>
                <sphereGeometry args={[0.012, 12, 8]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>
            </group>
          ))}
        </group>
        <mesh position={[0, -0.04, 0.269]} rotation={[0, 0, Math.PI * 1.15]}>
          <torusGeometry args={[0.049, 0.006, 8, 24, Math.PI * 0.7]} />
          <meshStandardMaterial color="#8feeff" emissive="#63d7f0" emissiveIntensity={1.2} toneMapped={false} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 0.197, -0.058, 0.266]} scale={[1, 0.45, 0.22]}>
              <sphereGeometry args={[0.031, 16, 12]} />
              <meshStandardMaterial color="#ffb5ad" emissive="#ff8e9f" emissiveIntensity={0.6} />
            </mesh>
            <mesh position={[side * 0.326, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.091, 0.091, 0.06, 24]} />
              <meshStandardMaterial color="#344a64" metalness={0.6} roughness={0.28} />
            </mesh>
            <mesh position={[side * 0.363, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.062, 0.011, 8, 24]} />
              <meshStandardMaterial color="#9befff" emissive="#55d9f4" emissiveIntensity={1.2} />
            </mesh>
          </group>
        ))}
        <mesh position={[0, 0.268, -0.035]} rotation={[0, 0, -0.12]}>
          <capsuleGeometry args={[0.014, 0.09, 4, 12]} />
          <meshStandardMaterial color="#93a9c0" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0.008, 0.335, -0.035]}>
          <sphereGeometry args={[0.033, 20, 16]} />
          <meshStandardMaterial color="#ffccb3" emissive="#ff9b83" emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      </group>

      {[-1, 1].map((side) => (
        <group key={side}>
          <group ref={side === 1 ? wavingArmRef : restingArmRef} position={[side * 0.295, 0.28, 0]} rotation={[0, 0, side * 0.18]}>
            <mesh>
              <sphereGeometry args={[0.077, 20, 16]} />
              <meshStandardMaterial color="#344a64" metalness={0.7} roughness={0.28} />
            </mesh>
            <mesh position={[0, -0.092, 0]}>
              <capsuleGeometry args={[0.065, 0.09, 6, 16]} />
              <PearlArmor />
            </mesh>
            <group ref={side === 1 ? wavingHandRef : undefined} position={[0, -0.185, 0]} rotation={[0, 0, side === 1 ? 2.35 : -0.12]}>
              <mesh>
                <sphereGeometry args={[0.048, 16, 12]} />
                <meshStandardMaterial color="#344a64" metalness={0.7} roughness={0.3} />
              </mesh>
              <mesh position={[0, -0.081, 0]}>
                <capsuleGeometry args={[0.058, 0.085, 6, 16]} />
                <PearlArmor />
              </mesh>
              <mesh position={[0, -0.145, 0]}>
                <cylinderGeometry args={[0.054, 0.054, 0.025, 20]} />
                <meshStandardMaterial color="#8de9f8" emissive="#55cfe8" emissiveIntensity={0.7} metalness={0.35} roughness={0.25} />
              </mesh>
              <RoundedBox args={[0.112, 0.105, 0.095]} radius={0.039} smoothness={3} position={[0, -0.2, 0]}>
                <PearlArmor />
              </RoundedBox>
              <mesh position={[-side * 0.06, -0.185, 0.018]} rotation={[0, 0, -side * 0.45]}>
                <capsuleGeometry args={[0.024, 0.035, 4, 12]} />
                <PearlArmor />
              </mesh>
            </group>
          </group>
          <group ref={side === -1 ? leftLeg : rightLeg}>
          <mesh position={[side * 0.13, -0.17, 0]}>
            <sphereGeometry args={[0.068, 16, 12]} />
            <meshStandardMaterial color="#344a64" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[side * 0.13, -0.265, 0]}>
            <capsuleGeometry args={[0.071, 0.105, 6, 16]} />
            <PearlArmor />
          </mesh>
          <RoundedBox args={[0.185, 0.13, 0.265]} radius={0.05} smoothness={4} position={[side * 0.13, -0.4, 0.043]}>
            <PearlArmor />
          </RoundedBox>
          <RoundedBox args={[0.19, 0.04, 0.267]} radius={0.017} smoothness={3} position={[side * 0.13, -0.46, 0.043]}>
            <meshStandardMaterial color="#344a64" metalness={0.45} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.086, 0.018, 0.012]} radius={0.007} smoothness={2} position={[side * 0.13, -0.397, 0.177]}>
            <meshStandardMaterial color="#9befff" emissive="#55d9f4" emissiveIntensity={0.8} />
          </RoundedBox>
          </group>
        </group>
      ))}
      <pointLight position={[0, 0.25, 0.45]} color="#83e8ff" intensity={0.45} distance={1.8} decay={2} />
    </group>
  );
}
