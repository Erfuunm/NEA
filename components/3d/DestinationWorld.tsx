"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, type ReactElement } from "react";
import { DoubleSide, type Group, type Mesh, type MeshStandardMaterial } from "three";
import type { DestinationConfig } from "@/types/experience";

type Point = [number, number, number];
type AccentProps = { accent: string };

function Block({ position, size, color, rotation = [0, 0, 0], glow = 0 }: {
  position: Point;
  size: Point;
  color: string;
  rotation?: Point;
  glow?: number;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.65} emissive={color} emissiveIntensity={glow} />
    </mesh>
  );
}

function Round({ position, radius, height, color, top = radius }: {
  position: Point;
  radius: number;
  height: number;
  color: string;
  top?: number;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[top, radius, height, 16]} />
      <meshStandardMaterial color={color} roughness={0.6} />
    </mesh>
  );
}

function Leaf({ position, scale = [1, 1, 1], color }: { position: Point; scale?: Point; color: string }) {
  return (
    <mesh position={position} scale={scale} castShadow>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color={color} roughness={0.9} flatShading />
    </mesh>
  );
}

function Planter({ position, color = "#6ba879" }: { position: Point; color?: string }) {
  return (
    <group position={position}>
      <Round position={[0, 0.08, 0]} radius={0.075} top={0.1} height={0.16} color="#bb795e" />
      <Round position={[0, 0.16, 0]} radius={0.104} height={0.035} color="#e0a17e" />
      <Leaf position={[0, 0.27, 0]} scale={[0.13, 0.16, 0.12]} color={color} />
      <Leaf position={[0.05, 0.36, 0]} scale={[0.06, 0.06, 0.06]} color="#f2c48b" />
    </group>
  );
}

function Cup({ position, accent }: { position: Point; accent: string }) {
  return (
    <group position={position}>
      <Round position={[0, 0.015, 0]} radius={0.125} height={0.025} color="#f7ead5" />
      <Round position={[0, 0.09, 0]} radius={0.07} top={0.085} height={0.14} color={accent} />
      <Round position={[0, 0.162, 0]} radius={0.073} height={0.006} color="#553326" />
      <mesh position={[0.09, 0.1, 0]}>
        <torusGeometry args={[0.042, 0.013, 8, 16]} />
        <meshStandardMaterial color={accent} />
      </mesh>
    </group>
  );
}

function CoffeeWorld({ accent }: AccentProps) {
  const steam = useRef<Group>(null);
  useFrame(({ clock }) => {
    steam.current?.children.forEach((puff, i) => {
      const phase = (clock.elapsedTime * 0.22 + i / 3) % 1;
      puff.position.set(Math.sin(phase * 5 + i) * 0.035, phase * 0.25, 0);
      puff.scale.setScalar(0.6 + phase * 0.5);
    });
  });
  return (
    <group>
      <Block position={[0, 0.68, -0.24]} size={[1.12, 0.96, 0.66]} color="#e8cbb0" />
      <Block position={[0, 1.18, -0.24]} size={[1.24, 0.09, 0.76]} color="#573f3c" />
      <Block position={[0, 1.25, -0.24]} size={[1.09, 0.055, 0.62]} color="#876451" />
      <Block position={[0.25, 0.61, 0.101]} size={[0.28, 0.73, 0.025]} color="#57443e" />
      <Block position={[0.25, 0.71, 0.12]} size={[0.21, 0.42, 0.02]} color="#f7dca2" glow={0.3} />
      <Round position={[0.34, 0.55, 0.145]} radius={0.02} height={0.035} color="#d7b46c" />
      <Block position={[-0.23, 0.7, 0.11]} size={[0.43, 0.44, 0.025]} color="#57443e" />
      <Block position={[-0.23, 0.7, 0.129]} size={[0.36, 0.36, 0.012]} color="#ffd69b" glow={0.35} />
      <Block position={[-0.23, 0.7, 0.141]} size={[0.024, 0.38, 0.018]} color="#80634e" />
      <Block position={[-0.23, 0.7, 0.143]} size={[0.38, 0.024, 0.018]} color="#80634e" />
      <Block position={[-0.23, 0.46, 0.15]} size={[0.5, 0.065, 0.13]} color="#80634e" />
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i}>
          <Block position={[-0.525 + i * 0.15, 1.035, 0.21]} size={[0.148, 0.045, 0.4]} rotation={[0.19, 0, 0]} color={i % 2 ? "#fff1d3" : accent} />
          <Block position={[-0.525 + i * 0.15, 0.954, 0.407]} size={[0.148, 0.12, 0.035]} color={i % 2 ? "#fff1d3" : accent} />
        </group>
      ))}
      <Cup position={[0, 1.28, -0.24]} accent={accent} />
      <group ref={steam} position={[0, 1.47, -0.24]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i}>
            <sphereGeometry args={[0.022, 8, 6]} />
            <meshStandardMaterial color="#fff2de" transparent opacity={0.35} depthWrite={false} />
          </mesh>
        ))}
      </group>
      <Round position={[-0.33, 0.405, 0.56]} radius={0.038} height={0.41} color="#5e4840" />
      <Round position={[-0.33, 0.63, 0.56]} radius={0.23} height={0.045} color="#b9865a" />
      <Cup position={[-0.36, 0.66, 0.54]} accent="#f9e7c6" />
      <Planter position={[0.59, 0.2, 0.2]} />
      <Block position={[0.32, 0.24, 0.29]} size={[0.37, 0.08, 0.23]} color="#b39a83" />
      <Block position={[0.35, 0.43, 0.58]} size={[0.24, 0.37, 0.04]} rotation={[-0.13, 0, 0]} color="#9b7052" />
      <Block position={[0.35, 0.45, 0.606]} size={[0.19, 0.26, 0.012]} rotation={[-0.13, 0, 0]} color="#304c46" />
      {[0, 1, 2].map((i) => <Block key={i} position={[0.35, 0.5 - i * 0.06, 0.625]} size={[0.12 - i * 0.02, 0.012, 0.008]} color="#f0e2c1" />)}
    </group>
  );
}

function Chair({ position, rotation, accent }: { position: Point; rotation: number; accent: string }) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {[-0.105, 0.105].flatMap((x) => [-0.1, 0.1].map((z) => (
        <Block key={`${x}-${z}`} position={[x, 0.16, z]} size={[0.035, 0.32, 0.035]} color="#654b49" />
      )))}
      <Block position={[0, 0.33, 0]} size={[0.29, 0.065, 0.28]} color={accent} />
      <Block position={[0, 0.51, -0.12]} size={[0.29, 0.33, 0.055]} color={accent} />
      <Block position={[0, 0.52, -0.152]} size={[0.22, 0.025, 0.015]} color="#d0a779" />
    </group>
  );
}

function RestaurantWorld({ accent }: AccentProps) {
  const flame = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (flame.current) flame.current.scale.set(1, 1 + Math.sin(clock.elapsedTime * 7) * 0.12, 1);
  });
  return (
    <group>
      <Block position={[0, 0.215, 0]} size={[1.34, 0.03, 1.22]} color="#76524d" />
      <Block position={[0, 0.234, 0]} size={[1.15, 0.008, 1.05]} color="#bd7771" />
      {[-0.64, 0.64].map((x) => (
        <group key={x}>
          <Block position={[x, 0.9, -0.46]} size={[0.07, 1.4, 0.07]} color="#664844" />
          <Planter position={[x, 0.23, -0.23]} color="#77946b" />
        </group>
      ))}
      <Block position={[0, 1.57, -0.46]} size={[1.36, 0.09, 0.12]} color="#664844" />
      {[-0.49, -0.245, 0, 0.245, 0.49].map((x, i) => (
        <group key={x}>
          <Block position={[x, 1.43 - (2 - Math.abs(i - 2)) * 0.035, -0.46]} size={[0.012, 0.17, 0.012]} color="#d3aa72" />
          <Leaf position={[x, 1.33 - (2 - Math.abs(i - 2)) * 0.035, -0.46]} scale={[0.042, 0.05, 0.042]} color="#ffe7ad" />
        </group>
      ))}
      <Round position={[0, 0.46, 0.04]} radius={0.065} height={0.46} color="#d5ab72" />
      <Round position={[0, 0.26, 0.04]} radius={0.21} height={0.045} color="#765547" />
      <Round position={[0, 0.715, 0.04]} radius={0.4} height={0.06} color="#f5dfc5" />
      <Block position={[0, 0.751, 0.04]} size={[0.18, 0.016, 0.71]} color={accent} />
      <Chair position={[-0.56, 0.235, 0.04]} rotation={Math.PI / 2} accent={accent} />
      <Chair position={[0.56, 0.235, 0.04]} rotation={-Math.PI / 2} accent={accent} />
      {[-0.24, 0.24].map((x) => (
        <group key={x}>
          <Round position={[x, 0.755, 0.04]} radius={0.115} height={0.018} color="#fff6df" />
          <Round position={[x, 0.766, 0.04]} radius={0.079} height={0.008} color="#e4bba0" />
          <Block position={[x, 0.759, 0.21]} size={[0.065, 0.015, 0.1]} color={accent} rotation={[0, 0.2, 0]} />
          <Round position={[x, 0.82, -0.14]} radius={0.011} height={0.13} color="#e8d2b0" />
          <Round position={[x, 0.88, -0.14]} radius={0.037} top={0.049} height={0.08} color="#ddb6aa" />
        </group>
      ))}
      <Round position={[0, 0.78, 0.04]} radius={0.075} height={0.04} color="#bd9457" />
      <Round position={[0, 0.89, 0.04]} radius={0.032} height={0.2} color="#fff0c9" />
      <mesh ref={flame} position={[0, 1.035, 0.04]}>
        <sphereGeometry args={[0.027, 8, 8]} />
        <meshStandardMaterial color="#fff0bc" emissive="#ffba67" emissiveIntensity={2.5} />
      </mesh>
    </group>
  );
}

function Tree({ position, scale = 1, color }: { position: Point; scale?: number; color: string }) {
  const crown = useRef<Group>(null);
  useFrame(({ clock }) => {
    if (crown.current) crown.current.rotation.z = Math.sin(clock.elapsedTime * 1.1 + position[0] * 3) * 0.025;
  });
  return (
    <group position={position} scale={scale}>
      <Round position={[0, 0.4, 0]} radius={0.07} top={0.045} height={0.8} color="#805b45" />
      <group ref={crown} position={[0, 0.7, 0]}>
        <Leaf position={[0, 0.19, 0]} scale={[0.29, 0.42, 0.28]} color={color} />
        <Leaf position={[-0.14, 0.08, 0.055]} scale={[0.21, 0.25, 0.21]} color="#86ac72" />
        <Leaf position={[0.15, 0.25, -0.025]} scale={[0.19, 0.28, 0.21]} color="#b6c68a" />
      </group>
    </group>
  );
}

function ParkWorld({ accent }: AccentProps) {
  return (
    <group>
      <Round position={[0, 0.22, 0]} radius={0.82} height={0.04} color="#739872" />
      {[-0.58, -0.3, -0.02, 0.26, 0.54].map((z, i) => (
        <Block key={z} position={[0.16 + Math.sin(i * 0.9) * 0.13, 0.252, z]} size={[0.32, 0.024, 0.23]} rotation={[0, Math.sin(i) * 0.1, 0]} color={i % 2 ? "#dbc9a7" : "#e9d9b9"} />
      ))}
      <Tree position={[-0.42, 0.24, -0.3]} color="#609477" />
      <Tree position={[0.46, 0.24, -0.36]} scale={0.8} color="#7fa58a" />
      <group position={[-0.36, 0.24, 0.32]} rotation={[0, 0.12, 0]}>
        {[-0.2, 0.2].map((x) => (
          <group key={x}>
            <Block position={[x, 0.15, 0]} size={[0.04, 0.3, 0.2]} color="#445953" />
            <Block position={[x, 0.37, -0.12]} size={[0.035, 0.4, 0.035]} color="#445953" />
          </group>
        ))}
        {[-0.07, 0.01, 0.09].map((z) => <Block key={z} position={[0, 0.3, z]} size={[0.57, 0.035, 0.065]} color="#c29765" />)}
        {[0.43, 0.52].map((y) => <Block key={y} position={[0, y, -0.12]} size={[0.57, 0.065, 0.035]} color="#d4aa77" />)}
      </group>
      {[[-0.64, 0.01], [0.54, 0.27], [-0.17, -0.61], [0.03, 0.64]].map(([x, z], i) => (
        <group key={i}>
          <Leaf position={[x, 0.31, z]} scale={[0.105, 0.09, 0.1]} color="#527b5e" />
          {[0, 1, 2].map((j) => <Leaf key={j} position={[x + (j - 1) * 0.046, 0.4 + (j % 2) * 0.045, z]} scale={[0.035, 0.035, 0.035]} color={i % 2 ? "#f8d698" : accent} />)}
        </group>
      ))}
      <Round position={[0.58, 0.68, 0.03]} radius={0.022} height={0.88} color="#48655c" />
      <Block position={[0.58, 1.14, 0.03]} size={[0.11, 0.14, 0.11]} color="#ffe6a2" glow={0.7} />
      <Block position={[0.58, 1.225, 0.03]} size={[0.16, 0.035, 0.16]} color="#48655c" />
    </group>
  );
}

function CinemaWorld({ accent }: AccentProps) {
  const marquee = useRef<Group>(null);
  useFrame(({ clock }) => {
    marquee.current?.children.forEach((bulb, i) => {
      const material = (bulb as Mesh).material as MeshStandardMaterial;
      material.emissiveIntensity = 0.8 + Math.sin(clock.elapsedTime * 2.3 + i * 0.65) * 0.35;
    });
  });
  return (
    <group>
      <Block position={[0, 0.83, -0.3]} size={[1.21, 1.26, 0.55]} color="#494159" />
      <Block position={[0, 1.47, -0.3]} size={[1.32, 0.07, 0.66]} color="#bfa16f" />
      <Block position={[0, 1.03, -0.008]} size={[0.94, 0.53, 0.045]} color="#201e33" />
      <Block position={[0, 1.03, 0.02]} size={[0.81, 0.41, 0.016]} color="#abbad9" glow={0.3} />
      <mesh position={[0, 1.03, 0.037]}>
        <circleGeometry args={[0.1, 3]} />
        <meshStandardMaterial color="#fff1cd" emissive="#fff1cd" emissiveIntensity={0.5} side={DoubleSide} />
      </mesh>
      <Block position={[0, 1.38, 0.09]} size={[1.31, 0.19, 0.28]} color={accent} />
      <Block position={[0, 1.38, 0.237]} size={[1.16, 0.115, 0.02]} color="#fff0c5" glow={0.3} />
      {[-0.39, -0.195, 0, 0.195, 0.39].map((x) => <Block key={x} position={[x, 1.38, 0.255]} size={[0.09, 0.068, 0.012]} color="#75546c" />)}
      <group ref={marquee}>
        {Array.from({ length: 12 }, (_, i) => (
          <mesh key={i} position={[-0.57 + (i % 6) * 0.228, i < 6 ? 1.49 : 1.265, 0.24]}>
            <sphereGeometry args={[0.024, 8, 6]} />
            <meshStandardMaterial color="#ffe2a2" emissive="#ffd184" emissiveIntensity={1} />
          </mesh>
        ))}
      </group>
      {[-0.16, 0.16].map((x) => (
        <group key={x}>
          <Block position={[x, 0.48, -0.006]} size={[0.28, 0.47, 0.04]} color="#b79b79" />
          <Block position={[x, 0.5, 0.019]} size={[0.225, 0.38, 0.014]} color="#302e47" />
          <Block position={[x + (x < 0 ? 0.07 : -0.07), 0.47, 0.04]} size={[0.018, 0.11, 0.025]} color="#edcd85" />
        </group>
      ))}
      <Block position={[0, 0.215, 0.37]} size={[0.47, 0.03, 0.74]} color="#bb5468" />
      {[-0.31, 0.31].flatMap((x) => [0.23, 0.63].map((z) => (
        <group key={`${x}-${z}`}>
          <Round position={[x, 0.23, z]} radius={0.066} height={0.035} color="#c3a16e" />
          <Round position={[x, 0.41, z]} radius={0.014} height={0.34} color="#c3a16e" />
          <Leaf position={[x, 0.59, z]} scale={[0.03, 0.03, 0.03]} color="#e7c891" />
        </group>
      )))}
      <group position={[0.58, 0.2, 0.35]}>
        <Round position={[0, 0.15, 0]} radius={0.1} top={0.15} height={0.3} color="#fff0d7" />
        {[-0.07, 0, 0.07].map((x) => <Block key={x} position={[x, 0.16, 0.112]} size={[0.035, 0.26, 0.024]} color={accent} />)}
        {Array.from({ length: 9 }, (_, i) => <Leaf key={i} position={[Math.cos(i * 2.4) * (i % 3 ? 0.095 : 0.035), 0.32 + (i % 3) * 0.032, Math.sin(i * 2.4) * 0.09]} scale={[0.057, 0.054, 0.053]} color={i % 2 ? "#ffe2a0" : "#fff2ce"} />)}
      </group>
    </group>
  );
}

function SurpriseWorld({ accent }: AccentProps) {
  const orbit = useRef<Group>(null);
  const portal = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    if (orbit.current) orbit.current.rotation.z = clock.elapsedTime * 0.12;
    if (portal.current) {
      const material = portal.current.material as MeshStandardMaterial;
      material.emissiveIntensity = 0.6 + Math.sin(clock.elapsedTime * 1.4) * 0.18;
    }
  });
  return (
    <group>
      <Block position={[0, 0.24, -0.04]} size={[0.97, 0.08, 0.49]} color="#69607d" />
      <Block position={[0, 0.225, 0.37]} size={[0.66, 0.05, 0.25]} color="#8f80a0" />
      <Block position={[0, 0.215, 0.62]} size={[0.47, 0.03, 0.19]} color="#b3a0b7" />
      <mesh position={[0, 0.95, -0.04]} scale={[0.83, 1, 1]} castShadow>
        <torusGeometry args={[0.64, 0.073, 10, 48]} />
        <meshStandardMaterial color="#aa91b5" metalness={0.45} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.95, 0.004]} scale={[0.83, 1, 1]}>
        <torusGeometry args={[0.63, 0.024, 8, 48]} />
        <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={2} />
      </mesh>
      <mesh ref={portal} position={[0, 0.95, -0.045]} scale={[0.83, 1, 1]}>
        <circleGeometry args={[0.59, 48]} />
        <meshStandardMaterial color="#514d90" emissive={accent} emissiveIntensity={0.6} transparent opacity={0.48} side={DoubleSide} depthWrite={false} />
      </mesh>
      <group ref={orbit} position={[0, 0.95, 0.04]}>
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <mesh key={i} position={[Math.cos(i * Math.PI / 4) * 0.4, Math.sin(i * Math.PI / 4) * 0.4, 0]} rotation={[0, 0, Math.PI / 4]}>
            <octahedronGeometry args={[i % 2 ? 0.025 : 0.04]} />
            <meshStandardMaterial color="#fff0ce" emissive="#ffe4ad" emissiveIntensity={1.4} />
          </mesh>
        ))}
      </group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.62, 0.2, 0.07]}>
          <Round position={[0, 0.045, 0]} radius={0.15} height={0.09} color="#706181" />
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[(i - 1) * 0.08, 0.18 + (i % 2) * 0.1, (i % 2) * 0.03]} scale={[0.065, 0.16 + (i % 2) * 0.08, 0.065]} rotation={[0, 0, (1 - i) * 0.2]} castShadow>
              <octahedronGeometry args={[1]} />
              <meshStandardMaterial color={i % 2 ? "#f4d5af" : accent} emissive={accent} emissiveIntensity={0.4} metalness={0.25} roughness={0.25} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

const WORLD_COMPONENTS: Record<DestinationConfig["id"], (props: AccentProps) => ReactElement> = {
  coffee: CoffeeWorld,
  restaurant: RestaurantWorld,
  park: ParkWorld,
  cinema: CinemaWorld,
  surprise: SurpriseWorld,
};

export function DestinationWorld({ config }: { config: DestinationConfig }) {
  const WorldComponent = WORLD_COMPONENTS[config.id];
  return <WorldComponent accent={config.accent} />;
}
