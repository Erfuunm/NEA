"use client";

import { Html, Sparkles } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState, type RefObject, type ReactNode } from "react";
import { Euler, Vector3, type Group, type Points as PointsType } from "three";
import { useKeyboard } from "@/hooks/useKeyboard";
import { useSound } from "@/hooks/useSound";
import { useTouch } from "@/hooks/useTouch";
import { randomFloat, randomSigned } from "@/lib/random";
import { RobotMesh } from "@/components/3d/RobotMesh";

interface GroundWorldProps<T extends string> {
  positions: [number, number, number][];
  items: { id: T; label: string; model?: ReactNode }[];
  selected: T | null;
  onSelect: (id: T) => void;
}

const MOVE_SPEED = 3.5;
const TURN_SPEED = 4;
const INTERACT_RADIUS = 1.65;

function PlayerCharacter({ position, rotation, velocity }: {
  position: RefObject<Vector3>;
  rotation: RefObject<Euler>;
  velocity: RefObject<Vector3>;
}) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.copy(position.current);
    groupRef.current.rotation.copy(rotation.current);
    groupRef.current.rotation.y += Math.PI;
  });

  return (
    <group ref={groupRef}>
      <RobotMesh position={[0, 0.312, 0]} scale={0.65} velocity={velocity} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.015, 0]}>
        <circleGeometry args={[0.3, 32]} />
        <meshBasicMaterial color="#020715" transparent opacity={0.5} depthWrite={false} />
      </mesh>
    </group>
  );
}

function SelectionBeam({ color }: { color: string }) {
  const ref = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.scale.y = 1 + Math.sin(clock.elapsedTime * 3) * 0.05;
    ref.current.rotation.y = clock.elapsedTime * 0.5;
  });
  return (
    <group ref={ref} position={[0, 0.2, 0]}>
      <mesh>
        <cylinderGeometry args={[0.06, 0.18, 2.8, 16, 1, true]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} side={2} depthWrite={false} />
      </mesh>
    </group>
  );
}

function GroundIsland({
  position,
  label,
  selected,
  highlighted,
  onSelect,
  seed,
  model,
  isTouch,
  onRequestMove,
}: {
  position: [number, number, number];
  label: string;
  selected: boolean;
  highlighted: boolean;
  onSelect: () => void;
  seed: number;
  model?: ReactNode;
  isTouch: boolean;
  onRequestMove: (target: Vector3) => void;
}) {
  const groupRef = useRef<Group>(null);
  const sound = useSound();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() + seed * 10;
    groupRef.current.position.set(position[0], position[1], position[2]);
    groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.15;
    groupRef.current.position.y = position[1] + (selected ? 0.12 : 0) + Math.sin(t * 0.6) * 0.03;
  });

  const select = () => {
    sound.select();
    onSelect();
  };

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerDown={(event) => event.stopPropagation()}
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
        if (isTouch && !highlighted) {
          onRequestMove(new Vector3(position[0], 0.05, position[2]));
        }
        select();
      }}
    >
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.9, 1, 0.3, 7]} />
        <meshStandardMaterial
          color={selected ? "#7fe0c4" : highlighted || hovered ? "#5a9e8e" : "#3a8f7a"}
          roughness={0.8}
        />
      </mesh>

      {model ?? (
        <mesh position={[0, 0.6, 0]}>
          <octahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color={selected ? "#ffd27a" : "#8fd8ff"}
            emissive={selected ? "#ffd27a" : "#8fd8ff"}
            emissiveIntensity={selected ? 1.2 : highlighted || hovered ? 0.7 : 0.3}
          />
        </mesh>
      )}

      {selected && <SelectionBeam color="#ffd27a" />}

      <mesh visible={false}>
        <sphereGeometry args={[1.3, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      <Html position={[0, model ? 2.25 : 1.4, 0]} center distanceFactor={10} occlude={false} zIndexRange={[5, 0]} style={{ pointerEvents: "none" }}>
        <span
          className="pointer-events-none whitespace-nowrap rounded-full bg-black/50 px-3 py-1 text-xs font-semibold tracking-wide backdrop-blur-md sm:text-sm"
          style={{
            color: selected ? "#ffe9b0" : "#e8f4ff",
            textShadow: "0 0 6px #000814",
          }}
        >
          {label}
          {selected ? " · Selected" : highlighted ? (isTouch ? " · Tap to choose" : " · Press E / Space") : ""}
        </span>
      </Html>

      {(selected || highlighted || hovered) && (
        <Sparkles
          count={selected ? 24 : 12}
          scale={[1.2, 1.2, 1.2]}
          size={2}
          speed={0.4}
          color={selected ? "#ffd27a" : "#9fe8ff"}
        />
      )}

      <pointLight
        position={[0, 0.8, 0]}
        color={selected ? "#ffd27a" : "#8fd8ff"}
        intensity={selected ? 1.2 : highlighted || hovered ? 0.8 : 0.3}
        distance={2.5}
      />
    </group>
  );
}

function FloatingPollen() {
  const ref = useRef<PointsType>(null);
  const count = 80;
  const { positions, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = randomSigned(10);
      positions[i * 3 + 1] = randomFloat(0.2, 3);
      positions[i * 3 + 2] = randomSigned(10);
      phases[i] = randomFloat(0, Math.PI * 2);
    }
    return { positions, phases };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    const posAttr = ref.current.geometry.getAttribute("position");
    for (let i = 0; i < count; i++) {
      posAttr.setXYZ(
        i,
        positions[i * 3] + Math.sin(t * 0.3 + phases[i]) * 0.4,
        positions[i * 3 + 1] + Math.sin(t * 0.5 + phases[i] * 2) * 0.15,
        positions[i * 3 + 2] + Math.cos(t * 0.25 + phases[i]) * 0.4
      );
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.035} color="#d4eeff" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export function GroundWorld<T extends string>({
  positions,
  items,
  selected,
  onSelect,
}: GroundWorldProps<T>) {
  const { camera } = useThree();
  const keys = useKeyboard();
  const isTouch = useTouch();
  const sound = useSound();
  const playerPos = useRef(new Vector3(0, 0.05, 5));
  const playerRot = useRef(new Euler(0, 0, 0));
  const velocity = useRef(new Vector3());
  const walkTarget = useRef<Vector3 | null>(null);
  const interactLock = useRef(false);
  const [nearestId, setNearestId] = useState<string | null>(null);
  const lastNearestRef = useRef<string | null>(null);

  const islandCenters = useMemo(
    () => positions.map((p) => new Vector3(p[0], 0, p[2])),
    [positions]
  );

  useFrame((state, frameDelta) => {
    const delta = Math.min(frameDelta, 0.05);
    const turn = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0);
    playerRot.current.y -= turn * TURN_SPEED * delta;

    let forward = (keys.current.forward ? 1 : 0) - (keys.current.backward ? 1 : 0);
    if (forward || turn) walkTarget.current = null;
    if (walkTarget.current) {
      const distance = playerPos.current.distanceTo(walkTarget.current);
      if (distance < 0.15) walkTarget.current = null;
      else {
        playerRot.current.y = Math.atan2(playerPos.current.x - walkTarget.current.x, playerPos.current.z - walkTarget.current.z);
        forward = Math.min(1, distance);
      }
    }
    const speed = forward * MOVE_SPEED;
    const dir = new Vector3(0, 0, -1).applyEuler(playerRot.current);
    velocity.current.lerp(dir.multiplyScalar(speed), 1 - Math.exp(-10 * delta));
    const nextPos = playerPos.current.clone().add(velocity.current.clone().multiplyScalar(delta));

    const radius = Math.hypot(nextPos.x, nextPos.z);
    if (radius > 11.5) {
      nextPos.x *= 11.5 / radius;
      nextPos.z *= 11.5 / radius;
    }
    for (const center of islandCenters) {
      const dx = nextPos.x - center.x;
      const dz = nextPos.z - center.z;
      const distance = Math.hypot(dx, dz);
      if (distance < 1.15) {
        const angle = distance > 0.001 ? Math.atan2(dz, dx) : playerRot.current.y;
        nextPos.x = center.x + Math.cos(angle) * 1.15;
        nextPos.z = center.z + Math.sin(angle) * 1.15;
        walkTarget.current = null;
      }
    }
    playerPos.current.copy(nextPos);

    let closest: { id: T; dist: number } | null = null;
    for (let i = 0; i < islandCenters.length; i++) {
      const dist = playerPos.current.distanceTo(islandCenters[i]);
      if (dist < INTERACT_RADIUS && (!closest || dist < closest.dist)) {
        closest = { id: items[i].id, dist };
      }
    }
    const nextNearest = closest?.id ?? null;
    if (nextNearest !== lastNearestRef.current) {
      lastNearestRef.current = nextNearest;
      setNearestId(nextNearest);
    }

    if (keys.current.interact && !interactLock.current && closest) {
      interactLock.current = true;
      sound.select();
      onSelect(closest.id);
    } else if (!keys.current.interact) {
      interactLock.current = false;
    }

    const camOffset = new Vector3(0, 3.2, 5.5).applyEuler(playerRot.current);
    const targetCam = playerPos.current.clone().add(camOffset);
    camera.position.lerp(targetCam, 0.06);
    const lookTarget = playerPos.current.clone().add(new Vector3(0, 0.6, 0));
    camera.lookAt(lookTarget);
  });

  return (
    <group>
      <hemisphereLight args={["#b8e5ff", "#393051", 1.4]} />
      <directionalLight position={[-3, 7, 5]} intensity={2.2} color="#ffe4c9" castShadow />
      <FloatingPollen />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        receiveShadow
        onPointerDown={(event) => {
          event.stopPropagation();
          const target = event.point.clone();
          const radius = Math.hypot(target.x, target.z);
          if (radius > 11.5) {
            target.x *= 11.5 / radius;
            target.z *= 11.5 / radius;
          }
          target.y = playerPos.current.y;
          walkTarget.current = target;
        }}
      >
        <circleGeometry args={[14, 128]} />
        <meshStandardMaterial
          color="#0e1326"
          roughness={0.95}
          metalness={0.1}
        />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <ringGeometry args={[11.8, 12, 128]} />
        <meshStandardMaterial color="#1a2442" roughness={0.9} />
      </mesh>

      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[11.9, 64]} />
        <meshBasicMaterial color="#6ee7ff" transparent opacity={0.08} />
      </mesh>

      <PlayerCharacter position={playerPos} rotation={playerRot} velocity={velocity} />

      {items.map((item, i) => (
        <GroundIsland
          key={item.id}
          position={positions[i]}
          label={item.label}
          selected={selected === item.id}
          highlighted={nearestId === item.id}
          model={item.model}
          isTouch={isTouch}
          onRequestMove={(target) => {
            walkTarget.current = target;
          }}
          onSelect={() => {
            sound.select();
            onSelect(item.id);
          }}
          seed={i}
        />
      ))}
    </group>
  );
}
