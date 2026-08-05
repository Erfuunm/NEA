"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Background } from "@/components/3d/Background";
import { CameraRig } from "@/components/3d/CameraRig";
import { PostFX } from "@/components/3d/PostFX";
import { SceneContent3D } from "@/components/3d/SceneContent3D";

export function Experience3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.8]}
        camera={{ fov: 45, position: [0, 1.2, 7] }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 6, 4]} intensity={0.6} color="#cfe6ff" />
          <Background />
          <SceneContent3D />
          <CameraRig />
          <PostFX />
        </Suspense>
      </Canvas>
    </div>
  );
}
