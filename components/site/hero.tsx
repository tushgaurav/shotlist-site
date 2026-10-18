"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";

import { cx } from "@/lib/site";

import { CAST, SHAPE_RATIO, Shape, type IconKind, type ShapeKind } from "./shapes";

/** Per-shape scroll travel (px), scroll tilt (deg), cursor depth (px) and entry tilt (deg). */
const PARALLAX = [
  { y: -150, r: -10, depth: 22, r0: -16 },
  { y: -270, r: 8, depth: 34, r0: 12 },
  { y: -200, r: -5, depth: 16, r0: -8 },
  { y: -310, r: 12, depth: 30, r0: 14 },
  { y: -170, r: -9, depth: 24, r0: -12 },
];
const ENTRY_ORDER = [2, 1, 0, 1, 2];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const headY = useTransform(scrollYProgress, [0, 1], [0, -170]);
  const headScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const headOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const sx = useSpring(pointerX, { stiffness: 45, damping: 15, mass: 0.9 });
  const sy = useSpring(pointerY, { stiffness: 45, damping: 15, mass: 0.9 });

  return (
    <section
      ref={ref}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        pointerX.set(e.clientX / window.innerWidth - 0.5);
        pointerY.set(e.clientY / window.innerHeight - 0.5);
      }}
      className="relative isolate h-[92svh] min-h-[600px] overflow-hidden md:h-[100svh] md:min-h-[640px]"
    >
      <Viewfinder />

      <motion.div
        style={{ y: headY, scale: headScale, opacity: headOpacity }}
        className="relative z-10 flex flex-col items-center px-4 pt-[clamp(7.5rem,24svh,12rem)] text-center md:pt-[clamp(7.5rem,18.5vh,12rem)]"
      >
        <h1 className="type-display text-[clamp(4rem,11.4vw,13.5rem)] leading-[0.86] text-paper">
          <HeroLine words={["Every", "shot"]} start={0} />
          <HeroLine words={["knows", "its", "scene"]} start={2} />
        </h1>
        <p className="fade-up mt-[clamp(1.4rem,3.4vh,2.25rem)] max-w-[24rem] text-[clamp(1rem,1.2vw,1.15rem)] leading-snug text-balance text-paper/70 [animation-delay:720ms]">
          A screenplay editor and a shot list that actually talk to each other.
        </p>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 flex translate-y-[30%] justify-center gap-[clamp(8px,1vw,16px)] [--s:clamp(165px,19vw,420px)]">
        {CAST.map((c, i) => (
          <HeroShape
            key={c.icon}
            index={i}
            kind={c.kind}
            icon={c.icon}
            color={c.color}
            progress={scrollYProgress}
            sx={sx}
            sy={sy}
          />
        ))}
      </div>
    </section>
  );
}

function HeroLine({ words, start }: { words: string[]; start: number }) {
  return (
    <span className="block">
      {words.map((word, i) => (
        <span key={word}>
          <span className="-mx-[0.06em] -mb-[0.14em] inline-block overflow-hidden px-[0.06em] pb-[0.14em] align-top">
            <span className="hero-word" style={{ animationDelay: `${160 + (start + i) * 80}ms` }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

function HeroShape({
  index,
  kind,
  icon,
  color,
  progress,
  sx,
  sy,
}: {
  index: number;
  kind: ShapeKind;
  icon: IconKind;
  color: string;
  progress: MotionValue<number>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  const p = PARALLAX[index];
  const scrollY = useTransform(progress, [0, 1], [0, p.y]);
  const rotate = useTransform(progress, [0, 1], [0, p.r]);
  const x = useTransform(sx, (v) => v * p.depth);
  const y = useTransform([scrollY, sy], ([a, b]: number[]) => a + b * p.depth * 0.6);
  const [clap, setClap] = useState(false);

  useEffect(() => {
    if (icon !== "clapper") return;
    const on = setTimeout(() => setClap(true), 1750);
    const off = setTimeout(() => setClap(false), 2600);
    return () => {
      clearTimeout(on);
      clearTimeout(off);
    };
  }, [icon]);

  return (
    <motion.div
      data-clap={clap || undefined}
      style={{ x, y, rotate, height: "var(--s)", aspectRatio: SHAPE_RATIO[kind] }}
      className="shape-host shrink-0"
    >
      <div
        className="shape-rise size-full"
        style={
          {
            animationDelay: `${480 + ENTRY_ORDER[index] * 95}ms`,
            "--r0": `${p.r0}deg`,
          } as CSSProperties
        }
      >
        <div className="bob size-full" style={{ animationDelay: `${index * -1.45}s` }}>
          <Shape kind={kind} icon={icon} color={color} />
        </div>
      </div>
    </motion.div>
  );
}

function Viewfinder() {
  return (
    <div
      aria-hidden
      className="fade-up pointer-events-none absolute inset-0 z-20 hidden md:block [animation-delay:1000ms]"
    >
      <Corner className="top-5 left-5 border-t border-l" />
      <Corner className="top-5 right-5 border-t border-r" />
    </div>
  );
}

function Corner({ className }: { className: string }) {
  return <span className={cx("absolute size-6 border-paper/25", className)} />;
}