import { useEffect, useRef } from "react";

type RisingParticlesProps = {
  seed?: number;
  className?: string;
};

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  phase: number;
  depth: number;
  color: string;
};

const PARTICLE_COLORS = ["#eadfc9", "#d8c39c", "#ad9362"];

function createRandom(seed: number) {
  let value = seed || 1;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export default function RisingParticles({ seed = 1, className = "" }: RisingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const random = createRandom(seed * 9973);
    const particles: Particle[] = Array.from({ length: 24 }, () => ({
      x: random(),
      y: random(),
      size: 1.2 + random() * 3.8,
      speed: 0.045 + random() * 0.085,
      sway: 5 + random() * 14,
      phase: random() * Math.PI * 2,
      depth: 0.35 + random() * 0.65,
      color: PARTICLE_COLORS[Math.floor(random() * PARTICLE_COLORS.length)],
    }));

    let width = 1;
    let height = 1;
    let frame = 0;
    let previousTime = performance.now();
    let isVisible = true;
    let pointerX = -1000;
    let pointerY = -1000;

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (time: number) => {
      const delta = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        if (!reduceMotion.matches) {
          particle.y -= particle.speed * delta;
          if (particle.y < -0.08) {
            particle.y = 1.08;
            particle.x = random();
          }
        }

        const drift = Math.sin(time * 0.00055 + particle.phase) * particle.sway;
        let x = particle.x * width + drift;
        let y = particle.y * height;
        const distanceX = x - pointerX;
        const distanceY = y - pointerY;
        const distance = Math.hypot(distanceX, distanceY);

        if (distance < 75 && distance > 0) {
          const push = (1 - distance / 75) * 18;
          x += (distanceX / distance) * push;
          y += (distanceY / distance) * push;
        }

        const edgeFade = Math.min(particle.y / 0.18, (1 - particle.y) / 0.18, 1);
        const alpha = Math.max(0, edgeFade) * (0.28 + particle.depth * 0.5);
        const radius = particle.size * particle.depth;
        const glow = context.createRadialGradient(x, y, 0, x, y, radius * 4.5);
        glow.addColorStop(0, `${particle.color}e6`);
        glow.addColorStop(0.22, `${particle.color}8f`);
        glow.addColorStop(1, `${particle.color}00`);
        context.globalAlpha = alpha;
        context.fillStyle = glow;
        context.beginPath();
        context.arc(x, y, radius * 4.5, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      if (isVisible) frame = requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointerX = event.clientX - bounds.left;
      pointerY = event.clientY - bounds.top;
    };
    const handlePointerLeave = () => {
      pointerX = -1000;
      pointerY = -1000;
    };

    const resizeObserver = new ResizeObserver(resize);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      const nextVisible = entry.isIntersecting;
      if (nextVisible && !isVisible) {
        isVisible = true;
        previousTime = performance.now();
        frame = requestAnimationFrame(draw);
      } else if (!nextVisible && isVisible) {
        isVisible = false;
        cancelAnimationFrame(frame);
      }
    });

    resizeObserver.observe(canvas);
    visibilityObserver.observe(canvas);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    resize();
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [seed]);

  return <canvas ref={canvasRef} className={`rising-particles ${className}`} aria-hidden="true" />;
}
