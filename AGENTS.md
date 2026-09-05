# Project guidance

- Stack: Next.js App Router, React Three Fiber, drei, Three.js, Framer Motion, Zustand.
- Verification: `npm run lint`, `npm run build`, and `git diff --check`. No automated test script is configured in package.json.
- Day, time, and destination selection share `components/3d/GroundWorld.tsx`; the ground world owns the camera during those stages. Keep CameraRig from also moving that camera.
- Keep gameplay HUD containers pointer-events-none and enable pointer events only on controls so the ground receives clicks and taps.
- RobotMesh is shared by the playable character and RobotPortrait. Portrait framing must remain within its allocated DOM area above the dialogue.
- The ending formation lasts six seconds. Keep SceneContent3D progress and EndingScene message timing aligned.
- Reuse an existing development server for this directory instead of starting another or terminating the user's server. Direct localhost access avoids preview-origin HMR warnings.
