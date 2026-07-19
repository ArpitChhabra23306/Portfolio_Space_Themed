"use client";

import { useRef, useState, useMemo, Fragment } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";

/* ─────────────────────────────────────────────
   Skill subtitle map (purely cosmetic)
   ───────────────────────────────────────────── */
const SUBTITLES = {
  React: "UI Library", "Next.js": "Meta-Framework", "Tailwind CSS": "Utility CSS",
  "Framer Motion": "Animation", "HTML/CSS": "Web Core",
  "Node.js": "Runtime", "Express.js": "Web Server", "Socket.io": "Real-time",
  "REST APIs": "API Design", GraphQL: "Query Layer",
  Docker: "Containers", "GitHub Actions": "CI/CD", Vercel: "Platform", Nginx: "Proxy",
  MongoDB: "Document DB", PostgreSQL: "Relational DB", Redis: "In-Memory Cache", Firebase: "BaaS",
  JavaScript: "Language", TypeScript: "Typed JS", Python: "Language", "C++": "Systems", Java: "Enterprise",
  Git: "Version Control", "VS Code": "Editor", Vim: "Terminal Editor", Figma: "Design Tool", Postman: "API Testing",
};

/* ─────────────────────────────────────────────
   Deterministic pseudo-random (no Math.random)
   ───────────────────────────────────────────── */
function hashStr(s) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function srand(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

/* ─────────────────────────────────────────────
   Orbit config generator — each skill gets a
   unique elliptical orbit with tilt & bobbing
   ───────────────────────────────────────────── */
function makeOrbit(skill, idx, total) {
  const seed = hashStr(skill.name);
  const base = 2.6;
  const gap = 1.4;
  const r = base + idx * gap;

  return {
    rx: r * (0.92 + srand(seed + 1) * 0.16),          // semi-major
    rz: r * (0.52 + srand(seed + 2) * 0.16),          // semi-minor (ellipse)
    speed: (0.22 + srand(seed + 3) * 0.12) / (1 + idx * 0.22),
    incl: ((idx % 2 === 0 ? 1 : -1) * (2 + srand(seed + 4) * 14)) * (Math.PI / 180),
    phase: srand(seed + 5) * Math.PI * 2,
    size: 0.28 + srand(seed + 6) * 0.16,
    bobAmp: 0.04 + srand(seed + 7) * 0.08,
    bobSpd: 0.25 + srand(seed + 8) * 0.35,
    dir: idx % 2 === 0 ? 1 : -1,
  };
}

/* ═══════════════════════════════════════════════
   SUN — clean dark sphere, orange equator glow,
   breathing animation, label. No fake plasma.
   ═══════════════════════════════════════════════ */
function Sun({ label }) {
  const ref = useRef();

  useFrame((st) => {
    if (ref.current) {
      const s = 1 + Math.sin(st.clock.elapsedTime * 0.5) * 0.012;
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={ref}>
      {/* Dark core sphere */}
      <mesh>
        <sphereGeometry args={[1.25, 64, 64]} />
        <meshStandardMaterial
          color="#111111"
          roughness={0.8}
          metalness={0.15}
          emissive="#FF7A2F"
          emissiveIntensity={0.06}
        />
      </mesh>

      {/* Sharp equator ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.48, 0.022, 16, 128]} />
        <meshBasicMaterial color="#FF7A2F" transparent opacity={0.7} />
      </mesh>
      {/* Diffuse glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.48, 0.14, 16, 128]} />
        <meshBasicMaterial color="#FF7A2F" transparent opacity={0.07} />
      </mesh>

      {/* Lights */}
      <pointLight color="#FF7A2F" intensity={4} distance={30} decay={2} />
      <pointLight color="#ffffff" intensity={0.6} distance={35} decay={2} />

      {/* Label */}
      <Html center position={[0, -0.05, 0]} className="pointer-events-none select-none" distanceFactor={8}>
        <div className="text-center whitespace-nowrap">
          <p className="text-white text-xl font-bold tracking-tight">{label}</p>
          <p className="text-white/30 text-[10px] tracking-[0.2em] uppercase mt-1">Core Strength</p>
        </div>
      </Html>
    </group>
  );
}

/* ═══════════════════════════════════════════════
   DUST TRAIL — thin fading line behind a planet.
   Stores recent positions and renders as a line
   with per-vertex opacity fading to nothing.
   ═══════════════════════════════════════════════ */
const TRAIL_LENGTH = 28;

function DustTrail({ trailRef }) {
  const lineRef = useRef();

  const { geom, opacities } = useMemo(() => {
    // Pre-allocate position buffer and opacity attribute
    const positions = new Float32Array(TRAIL_LENGTH * 3);
    const opacityArr = new Float32Array(TRAIL_LENGTH);

    // Fade: newest point (index 0) = most visible, oldest = invisible
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      opacityArr[i] = Math.pow(1 - i / TRAIL_LENGTH, 1.8); // gentle falloff
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    return { geom: g, opacities: opacityArr };
  }, []);

  useFrame(() => {
    if (!lineRef.current || !trailRef.current) return;

    const trail = trailRef.current;
    const posAttr = geom.attributes.position;

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      if (i < trail.length) {
        posAttr.setXYZ(i, trail[i].x, trail[i].y, trail[i].z);
      } else {
        // Fill remaining with the last known point (or origin)
        const last = trail.length > 0 ? trail[trail.length - 1] : { x: 0, y: 0, z: 0 };
        posAttr.setXYZ(i, last.x, last.y, last.z);
      }
    }
    posAttr.needsUpdate = true;
    geom.setDrawRange(0, Math.min(trail.length, TRAIL_LENGTH));
  });

  return (
    <line ref={lineRef} geometry={geom}>
      <lineBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.1}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </line>
  );
}

/* ═══════════════════════════════════════════════
   PLANET — dark metallic sphere, just slightly
   lighter than background. Leaves a dust trail.
   ═══════════════════════════════════════════════ */
function Planet({ skill, cfg, isHovered, isAnyHovered, onHover, onUnhover }) {
  const meshRef = useRef();
  const lblRef = useRef();
  const angleRef = useRef(cfg.phase);
  const scaleRef = useRef(cfg.size);
  const emissRef = useRef(0);
  const trailRef = useRef([]); // array of {x,y,z}
  const frameCount = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;

    // Speed: normal → slow when system paused, near-zero when self hovered
    const speedMul = isAnyHovered ? (isHovered ? 0.04 : 0.12) : 1;
    angleRef.current += cfg.speed * cfg.dir * delta * speedMul;

    const a = angleRef.current;
    const x = cfg.rx * Math.cos(a);
    const zFlat = cfg.rz * Math.sin(a);
    const y = zFlat * Math.sin(cfg.incl) + cfg.bobAmp * Math.sin(t * cfg.bobSpd);
    const z = zFlat * Math.cos(cfg.incl);

    meshRef.current.position.set(x, y, z);
    meshRef.current.rotation.y += delta * 0.25;

    // Depth-based scale: near camera → 1.08x, far → 0.82x
    const depthNorm = (z + cfg.rz * 1.2) / (cfg.rz * 2.4);
    const baseScale = cfg.size * (0.82 + depthNorm * 0.26);
    const target = isHovered ? baseScale * 1.3 : baseScale;
    scaleRef.current += (target - scaleRef.current) * Math.min(delta * 6, 1);
    meshRef.current.scale.setScalar(scaleRef.current);

    // Smooth emissive transition
    const emTarget = isHovered ? 0.3 : 0;
    emissRef.current += (emTarget - emissRef.current) * Math.min(delta * 6, 1);
    meshRef.current.material.emissiveIntensity = emissRef.current;

    // Label follows
    if (lblRef.current) lblRef.current.position.set(x, y + scaleRef.current + 0.35, z);

    // Record trail position every 2nd frame for performance
    frameCount.current++;
    if (frameCount.current % 2 === 0) {
      trailRef.current.unshift({ x, y, z });
      if (trailRef.current.length > TRAIL_LENGTH) {
        trailRef.current.length = TRAIL_LENGTH;
      }
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => { e.stopPropagation(); onHover(); }}
        onPointerOut={onUnhover}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={isHovered ? "#2a2a2e" : "#202024"}
          roughness={isHovered ? 0.2 : 0.3}
          metalness={0.9}
          emissive="#FF7A2F"
          emissiveIntensity={0.03}
        />
      </mesh>

      {/* Dust trail */}
      <DustTrail trailRef={trailRef} />

      <group ref={lblRef}>
        <Html center className="pointer-events-none select-none" distanceFactor={10}>
          <div
            className="text-center whitespace-nowrap transition-all duration-300"
            style={{
              opacity: isHovered ? 1 : 0.65,
              transform: isHovered ? "scale(1.2)" : "scale(1)",
            }}
          >
            <p className="text-white text-sm font-medium leading-tight">{skill.name}</p>
            <p className="text-white/30 text-[9px] tracking-wider mt-0.5">
              {SUBTITLES[skill.name] || skill.category}
            </p>
          </div>
        </Html>
      </group>
    </>
  );
}

/* ═══════════════════════════════════════════════
   AMBIENT PARTICLES — subtle premium floaters
   ═══════════════════════════════════════════════ */
function Particles() {
  const positions = useMemo(() => {
    const n = 180;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      arr[i * 3]     = (srand(i * 7 + 1) - 0.5) * 50;
      arr[i * 3 + 1] = (srand(i * 7 + 2) - 0.5) * 25;
      arr[i * 3 + 2] = (srand(i * 7 + 3) - 0.5) * 50;
    }
    return arr;
  }, []);

  const ref = useRef();

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.006;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={180} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#ffffff" transparent opacity={0.25} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ═══════════════════════════════════════════════
   SOLAR SYSTEM — sun + planets (no orbit lines).
   Remounts on category switch via key.
   ═══════════════════════════════════════════════ */
function SolarSystem({ category, skills }) {
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const isAnyHovered = hoveredSkill !== null;

  const configs = useMemo(
    () => skills.map((s, i) => makeOrbit(s, i, skills.length)),
    [skills],
  );

  return (
    <group>
      <Sun label={category} />

      {skills.map((skill, i) => (
        <Planet
          key={skill.name}
          skill={skill}
          cfg={configs[i]}
          isHovered={hoveredSkill === skill.name}
          isAnyHovered={isAnyHovered}
          onHover={() => setHoveredSkill(skill.name)}
          onUnhover={() => setHoveredSkill(null)}
        />
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════
   CANVAS WRAPPER — exported, dynamically imported
   with ssr: false from the parent component
   ═══════════════════════════════════════════════ */
export default function SolarSystemCanvas({ activeCategory, skills }) {
  return (
    <Canvas
      camera={{ position: [0, 8, 15], fov: 40, near: 0.1, far: 500 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      style={{ position: "absolute", inset: 0 }}
    >
      {/* Persistent lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[10, 8, 5]} intensity={0.2} color="#e8e4dc" />
      <directionalLight position={[-6, -3, -4]} intensity={0.08} color="#4DA3FF" />

      {/* Backlight — subtle cool light from behind, creates crescent highlights on planet edges */}
      <directionalLight position={[-4, 3, -12]} intensity={0.35} color="#8090b0" />
      <directionalLight position={[5, -2, -10]} intensity={0.15} color="#606878" />

      {/* Starfield & particles */}
      <Stars radius={200} depth={100} count={1200} factor={2.5} saturation={0} fade speed={0.08} />
      <Particles />

      {/* Solar system — keyed to remount on category change */}
      <SolarSystem key={activeCategory} category={activeCategory} skills={skills} />

      {/* Post-processing — subtle bloom for the sun glow & vignette */}
      <EffectComposer>
        <Bloom
          intensity={0.3}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette offset={0.3} darkness={0.5} />
      </EffectComposer>

      {/* Limited drag controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        maxPolarAngle={Math.PI / 2.3}
        minPolarAngle={Math.PI / 5}
        maxAzimuthAngle={Math.PI / 3}
        minAzimuthAngle={-Math.PI / 3}
        rotateSpeed={0.3}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}
