"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import {
  AdditiveBlending,
  Color,
  type Mesh,
  type Points as PointsType,
  type ShaderMaterial,
} from "three";
import { randomAngle, randomSigned, randomUnit } from "@/lib/random";

const PARTICLE_COUNT = 1600;

function heartPoint(t: number) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y =
    13 * Math.cos(t) -
    5 * Math.cos(2 * t) -
    2 * Math.cos(3 * t) -
    Math.cos(4 * t);
  return { x: x / 16, y: (y / 16 + 0.15625) / 0.90625 };
}

function smooth(value: number) {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

export function HeartBurst({ progress }: { progress: number }) {
  const ref = useRef<PointsType>(null);
  const material = useRef<ShaderMaterial>(null);
  const ring = useRef<Mesh>(null);
  const ringMaterial = useRef<ShaderMaterial>(null);
  const elapsed = useRef(0);

  const { starts, bursts, targets, randoms, positions, colors, sizes, accents } = useMemo(() => {
    const starts = new Float32Array(PARTICLE_COUNT * 3);
    const bursts = new Float32Array(PARTICLE_COUNT * 3);
    const targets = new Float32Array(PARTICLE_COUNT * 3);
    const randoms = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const accents = new Float32Array(PARTICLE_COUNT);
    const palette = [new Color("#ff729f"), new Color("#ffd39b"), new Color("#95edee")];
    const layers = [1, 0.98, 0.87, 0.74, 0.59, 0.43];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const index = i * 3;
      const angle = randomAngle();
      const radius = 0.7 + randomUnit() * 0.95;
      starts[index] = randomSigned(0.13);
      starts[index + 1] = 1.2 + randomSigned(0.13);
      starts[index + 2] = randomSigned(0.12);
      bursts[index] = Math.cos(angle) * radius;
      bursts[index + 1] = 1.2 + Math.sin(angle) * radius * 0.78;
      bursts[index + 2] = randomSigned(0.38);

      const { x, y } = heartPoint(randomAngle());
      const layer = layers[i % layers.length] + randomSigned(0.008);
      targets[index] = x * 1.38 * layer;
      targets[index + 1] = 1.8 + y * 1.32 * layer;
      targets[index + 2] = randomSigned(0.24) * layer;
      randoms[i] = randomUnit();
      const color = palette[i % 10 < 6 ? 0 : i % 10 < 9 ? 1 : 2];
      color.toArray(colors, index);
      accents[i] = i % 19 === 0 ? 1 : 0;
      sizes[i] = accents[i] ? 0.22 : 0.065 + randomUnit() * 0.055;
    }
    return { starts, bursts, targets, randoms, positions: starts.slice(), colors, sizes, accents };
  }, []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uOpacity: { value: 0 },
    uViewport: { value: 600 },
  }), []);
  const ringUniforms = useMemo(() => ({ uOpacity: { value: 0 } }), []);

  useFrame((state, delta) => {
    elapsed.current += delta;
    if (!ref.current) return;
    const time = elapsed.current;
    const p = Math.max(0, Math.min(1, progress));
    const formed = smooth((p - 0.86) / 0.14);
    const pulse = 1 + formed * 0.018 * Math.sin(Math.max(0, time - 5.16) * 2.1);
    const posAttr = ref.current.geometry.getAttribute("position");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const index = i * 3;
      const delay = randoms[i] * 0.05;
      const local = Math.max(0, (p - delay) / (1 - delay));
      const eruption = 1 - Math.pow(1 - Math.min(1, local / 0.27), 3);
      const gather = smooth((local - 0.23) / 0.72);
      const rotation = gather * Math.PI * 2 * (0.7 + randoms[i] * 0.3);
      const bx = bursts[index] * eruption;
      const by = (bursts[index + 1] - 1.2) * eruption;
      const sx = starts[index] * (1 - eruption) + bx * Math.cos(rotation) - by * Math.sin(rotation);
      const sy = 1.2 + (starts[index + 1] - 1.2) * (1 - eruption) + bx * Math.sin(rotation) + by * Math.cos(rotation);
      const sz = starts[index + 2] + (bursts[index + 2] - starts[index + 2]) * eruption;
      const flutter = Math.sin(gather * Math.PI) * 0.12;
      const tx = targets[index] * pulse;
      const ty = 1.8 + (targets[index + 1] - 1.8) * pulse;

      posAttr.setXYZ(
        i,
        sx * (1 - gather) + tx * gather,
        sy * (1 - gather) + ty * gather,
        sz * (1 - gather) + targets[index + 2] * gather + Math.sin(rotation + randoms[i] * 6.28) * flutter
      );
    }
    posAttr.needsUpdate = true;
    if (material.current) {
      material.current.uniforms.uTime.value = time;
      material.current.uniforms.uOpacity.value = smooth(p / 0.09) * 0.82;
      material.current.uniforms.uViewport.value = state.size.height * state.viewport.dpr * state.camera.projectionMatrix.elements[5] * 0.5;
    }
    if (ring.current && ringMaterial.current) {
      const expansion = smooth(p / 0.55);
      ring.current.scale.setScalar(0.12 + expansion * 1.75);
      ringMaterial.current.uniforms.uOpacity.value = Math.sin(expansion * Math.PI) * 0.16;
    }
  });

  return (
    <>
      <points ref={ref} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aAccent" args={[accents, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[randoms, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={material}
          uniforms={uniforms}
          vertexShader={`
            attribute vec3 color;
            attribute float aSize;
            attribute float aAccent;
            attribute float aSeed;
            uniform float uTime;
            uniform float uViewport;
            varying vec3 vColor;
            varying float vAccent;
            varying float vTwinkle;
            void main() {
              vColor = color;
              vAccent = aAccent;
              vTwinkle = 0.7 + 0.3 * sin(uTime * (1.8 + aSeed * 2.0) + aSeed * 40.0);
              vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
              gl_Position = projectionMatrix * viewPosition;
              gl_PointSize = clamp(aSize * uViewport / max(0.1, -viewPosition.z), 1.0, 64.0);
            }
          `}
          fragmentShader={`
            uniform float uOpacity;
            varying vec3 vColor;
            varying float vAccent;
            varying float vTwinkle;
            void main() {
              vec2 p = gl_PointCoord - 0.5;
              float r = length(p);
              float glow = exp(-r * r * 24.0) * 0.48;
              float core = exp(-r * r * 160.0) * 0.6;
              float star = (exp(-abs(p.x) * 100.0) + exp(-abs(p.y) * 100.0)) * exp(-r * 9.0);
              float alpha = (glow + core + star * vAccent * vTwinkle) * (1.0 - smoothstep(0.3, 0.5, r));
              gl_FragColor = vec4(vColor, alpha * uOpacity * mix(0.85, vTwinkle, vAccent));
            }
          `}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </points>
      <mesh ref={ring} position={[0, 1.2, -0.15]} frustumCulled={false}>
        <ringGeometry args={[0.85, 1.15, 128]} />
        <shaderMaterial
          ref={ringMaterial}
          uniforms={ringUniforms}
          vertexShader={`
            varying vec2 vPosition;
            void main() {
              vPosition = position.xy;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform float uOpacity;
            varying vec2 vPosition;
            void main() {
              float distanceToRing = (length(vPosition) - 1.0) / 0.055;
              float alpha = exp(-distanceToRing * distanceToRing) * uOpacity;
              gl_FragColor = vec4(1.0, 0.63, 0.73, alpha);
            }
          `}
          transparent
          blending={AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </>
  );
}
