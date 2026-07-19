"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

/**
 * The Earth sphere — dark surface with faint city lights.
 * Starts small, slowly revolves. On scroll: rotates faster + scales up.
 */
function Earth({ scrollProgress, pointer }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const texture = useLoader(THREE.TextureLoader, "/textures/earth-dark.jpg");

  // Base orientation the parallax tilt is applied relative to.
  const baseRotX = 0.2;
  const baseRotZ = 0.08;

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
  }, [texture]);

  useFrame((_, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    const t = scrollProgress.current;

    // Rotation: slightly faster idle (0.06) → much faster on scroll (up to ~0.4)
    const rotSpeed = 0.06 + t * 0.34;
    meshRef.current.rotation.y += delta * rotSpeed;

    // Idle mouse parallax — ease the globe's tilt toward the cursor.
    const targetTiltX = baseRotX + pointer.current.y * 0.18;
    const targetTiltZ = baseRotZ + pointer.current.x * 0.14;
    meshRef.current.rotation.x += (targetTiltX - meshRef.current.rotation.x) * delta * 3;
    meshRef.current.rotation.z += (targetTiltZ - meshRef.current.rotation.z) * delta * 3;

    // Scale: starts at 0.85 → grows to 1.15 on scroll
    const targetScale = 0.85 + t * 0.3;
    const s = groupRef.current.scale.x;
    const newScale = s + (targetScale - s) * delta * 2.5;
    groupRef.current.scale.set(newScale, newScale, newScale);
  });

  return (
    <group ref={groupRef} scale={[0.85, 0.85, 0.85]}>
      <mesh ref={meshRef} rotation={[baseRotX, 0, baseRotZ]}>
        <sphereGeometry args={[2, 96, 96]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive={new THREE.Color("#ccccdd")}
          emissiveIntensity={0.4}
          roughness={1}
          metalness={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/**
 * Scene — globe positioned to the LEFT side of the viewport, but clear of the nav.
 */
function Scene({ scrollProgress, pointer }) {
  return (
    <>
      <ambientLight intensity={0.03} />

      {/* Key light from upper-right — catches the globe surface */}
      <directionalLight
        position={[6, 4, 5]}
        intensity={0.25}
        color="#e8e4dc"
      />

      {/* Subtle fill from lower-left */}
      <pointLight
        position={[-3, -2, 3]}
        intensity={0.06}
        color="#8899bb"
        distance={12}
      />

      {/* ★ Backlight — positioned BEHIND the globe to illuminate its edges/rim */}
      <pointLight
        position={[-1.3, 0, -5]}
        intensity={1.2}
        color="#334466"
        distance={12}
      />

      {/* Secondary rim from upper-left behind */}
      <pointLight
        position={[-4, 3, -3]}
        intensity={0.5}
        color="#223344"
        distance={10}
      />

      <Stars
        radius={120}
        depth={80}
        count={3500}
        factor={3}
        saturation={0}
        fade
        speed={0.2}
      />

      {/* Globe positioned to the left */}
      <group position={[-1.3, 0.15, 0]}>
        <Earth scrollProgress={scrollProgress} pointer={pointer} />
      </group>
    </>
  );
}

/**
 * GlobeScene — full-screen Three.js canvas, dynamically imported with ssr: false.
 */
export default function GlobeScene({ scrollProgress }) {
  // Normalized cursor position (-1..1). The canvas is pointer-events:none,
  // so we listen on the window and let the globe ease toward the cursor.
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(e) {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      // invert Y so moving the cursor up tilts the globe up
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    }
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42, near: 0.1, far: 1000 }}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 2]}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    >
      <Scene scrollProgress={scrollProgress} pointer={pointer} />
    </Canvas>
  );
}
