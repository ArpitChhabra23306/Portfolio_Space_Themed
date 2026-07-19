"use client";

import { useRef, useEffect, useCallback } from "react";
import Matter from "matter-js";

const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events, Render } = Matter;

/**
 * SkillPlayground — Zero-gravity Matter.js box.
 * Skill balls float, collide with walls & each other.
 * User can drag and throw them hard.
 *
 * @param {{ skills: string[] }} props
 */
export default function SkillPlayground({ skills = [] }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const runnerRef = useRef(null);
  const renderRef = useRef(null);
  const bodiesMapRef = useRef(new Map());
  const rafRef = useRef(null);
  const labelsRef = useRef(null);

  const cleanup = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (runnerRef.current) Runner.stop(runnerRef.current);
    if (renderRef.current) {
      Render.stop(renderRef.current);
      renderRef.current.textures = {};
    }
    if (engineRef.current) Engine.clear(engineRef.current);
    bodiesMapRef.current.clear();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || skills.length === 0) return;

    cleanup();

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    // ── Engine: ZERO GRAVITY (space!) ──
    const engine = Engine.create({
      gravity: { x: 0, y: 0 },
    });
    engineRef.current = engine;

    // ── Renderer ──
    const canvas = canvasRef.current;
    canvas.width = W * (window.devicePixelRatio || 1);
    canvas.height = H * (window.devicePixelRatio || 1);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const render = Render.create({
      element: container,
      canvas,
      engine,
      options: {
        width: W,
        height: H,
        wireframes: false,
        background: "transparent",
        pixelRatio: window.devicePixelRatio || 1,
      },
    });
    renderRef.current = render;

    // ── Walls (invisible, bouncy) ──
    const wallThickness = 50;
    const wallOpts = {
      isStatic: true,
      restitution: 1,
      friction: 0,
      render: { visible: false },
    };
    const walls = [
      Bodies.rectangle(W / 2, -wallThickness / 2, W + 100, wallThickness, wallOpts),       // ceiling
      Bodies.rectangle(W / 2, H + wallThickness / 2, W + 100, wallThickness, wallOpts),     // floor
      Bodies.rectangle(-wallThickness / 2, H / 2, wallThickness, H + 100, wallOpts),        // left
      Bodies.rectangle(W + wallThickness / 2, H / 2, wallThickness, H + 100, wallOpts),     // right
    ];
    Composite.add(engine.world, walls);

    // ── Skill balls ──
    const map = new Map();
    const ballRadius = Math.min(28, Math.max(18, (W * 0.08)));

    skills.forEach((skill, i) => {
      // Spread them out initially
      const cols = Math.ceil(Math.sqrt(skills.length));
      const row = Math.floor(i / cols);
      const col = i % cols;
      const spacingX = (W - ballRadius * 4) / Math.max(cols, 1);
      const spacingY = (H - ballRadius * 4) / Math.max(Math.ceil(skills.length / cols), 1);
      const x = ballRadius * 2 + col * spacingX + (Math.random() - 0.5) * 20;
      const y = ballRadius * 2 + row * spacingY + (Math.random() - 0.5) * 20;

      const body = Bodies.circle(x, y, ballRadius, {
        restitution: 0.95,   // very bouncy
        friction: 0,          // no surface friction
        frictionAir: 0.001,   // almost no air drag (space!)
        density: 0.004,
        render: {
          fillStyle: "rgba(232, 116, 60, 0.06)",
          strokeStyle: "rgba(232, 116, 60, 0.2)",
          lineWidth: 1,
        },
      });

      // Give each ball a random initial velocity so they start drifting
      const speed = 1.2 + Math.random() * 1.5;
      const angle = Math.random() * Math.PI * 2;
      Body.setVelocity(body, {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      });

      map.set(skill, body);
      Composite.add(engine.world, body);
    });
    bodiesMapRef.current = map;

    // ── Mouse interaction: drag & throw ──
    const mouse = Mouse.create(canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.8,   // tight grip
        damping: 0.05,    // low damping = can throw hard
        render: { visible: false },
      },
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // ── Keep balls moving: re-boost if they slow down too much ──
    Events.on(engine, "afterUpdate", () => {
      for (const [, body] of bodiesMapRef.current) {
        const vx = body.velocity.x;
        const vy = body.velocity.y;
        const speed = Math.sqrt(vx * vx + vy * vy);

        // If nearly stopped, give a gentle nudge
        if (speed < 0.3) {
          const nudgeAngle = Math.random() * Math.PI * 2;
          Body.setVelocity(body, {
            x: vx + Math.cos(nudgeAngle) * 0.4,
            y: vy + Math.sin(nudgeAngle) * 0.4,
          });
        }

        // Cap max speed so things don't go crazy
        if (speed > 8) {
          const scale = 8 / speed;
          Body.setVelocity(body, { x: vx * scale, y: vy * scale });
        }
      }
    });

    // ── Run ──
    Render.run(render);
    const runner = Runner.create();
    Runner.run(runner, engine);
    runnerRef.current = runner;

    // ── Position HTML labels over bodies each frame ──
    function updateLabels() {
      if (!labelsRef.current) {
        rafRef.current = requestAnimationFrame(updateLabels);
        return;
      }
      const labels = labelsRef.current.children;
      let idx = 0;
      for (const [, body] of bodiesMapRef.current) {
        const el = labels[idx];
        if (el) {
          el.style.transform = `translate(-50%, -50%) translate(${body.position.x}px, ${body.position.y}px)`;
        }
        idx++;
      }
      rafRef.current = requestAnimationFrame(updateLabels);
    }
    rafRef.current = requestAnimationFrame(updateLabels);

    // ── Resize ──
    const handleResize = () => {
      const newRect = container.getBoundingClientRect();
      const nW = newRect.width;
      const nH = newRect.height;
      render.options.width = nW;
      render.options.height = nH;
      canvas.width = nW * (window.devicePixelRatio || 1);
      canvas.height = nH * (window.devicePixelRatio || 1);
      canvas.style.width = `${nW}px`;
      canvas.style.height = `${nH}px`;
      // Reposition walls
      Body.setPosition(walls[0], { x: nW / 2, y: -wallThickness / 2 });
      Body.setPosition(walls[1], { x: nW / 2, y: nH + wallThickness / 2 });
      Body.setPosition(walls[2], { x: -wallThickness / 2, y: nH / 2 });
      Body.setPosition(walls[3], { x: nW + wallThickness / 2, y: nH / 2 });
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    return () => {
      ro.disconnect();
      cleanup();
    };
  }, [skills, cleanup]);

  if (skills.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[300px] rounded-2xl overflow-hidden border border-white/[0.06]"
      style={{ background: "rgba(8, 8, 10, 0.8)" }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      />

      {/* Corner decorations */}
      <div className="absolute top-3 left-3 w-2 h-2 border-t border-l border-accent-ember/20 pointer-events-none" />
      <div className="absolute top-3 right-3 w-2 h-2 border-t border-r border-accent-ember/20 pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-2 h-2 border-b border-l border-accent-ember/20 pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-2 h-2 border-b border-r border-accent-ember/20 pointer-events-none" />

      {/* Matter.js canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ cursor: "grab" }}
      />

      {/* HTML labels positioned over physics bodies */}
      <div ref={labelsRef} className="absolute inset-0 pointer-events-none">
        {skills.map((skill) => (
          <div
            key={skill}
            className="absolute top-0 left-0 pointer-events-none select-none"
            style={{ willChange: "transform" }}
          >
            <span className="flex items-center justify-center w-auto px-1 text-[10px] font-mono text-white/60 whitespace-nowrap">
              {skill}
            </span>
          </div>
        ))}
      </div>

      {/* Label */}
      <div className="absolute bottom-2.5 left-4 pointer-events-none">
        <p className="text-[9px] font-mono tracking-widest uppercase text-white/15">
          Zero-G • Drag to play
        </p>
      </div>
    </div>
  );
}
