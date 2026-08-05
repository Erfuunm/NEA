"use client";

import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Vector2 } from "three";

export function PostFX() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.22}
        luminanceThreshold={0.5}
        luminanceSmoothing={0.65}
        mipmapBlur
      />
      <ChromaticAberration
        offset={new Vector2(0.0006, 0.0006)}
        blendFunction={BlendFunction.NORMAL}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.25} darkness={0.9} />
    </EffectComposer>
  );
}
