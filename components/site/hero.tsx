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

const MOBILE_PLACE = [
  "max-md:col-start-1 max-md:row-start-1 max-md:z-10 max-md:min-w-0 max-md:justify-self-start max-md:!h-[clamp(60px,18vw,108px)]",
  "max-md:col-start-1 max-md:row-start-2 max-md:z-20 max-md:-mt-2 max-md:min-w-0 max-md:justify-self-start max-md:!h-[clamp(84px,26vw,148px)]",
  "max-md:col-start-2 max-md:row-start-2 max-md:z-30 max-md:-mt-2 max-md:min-w-0 max-md:justify-self-center max-md:!h-[clamp(84px,26vw,148px)]",
  "max-md:col-start-3 max-md:row-start-2 max-md:z-20 max-md:-mt-2 max-md:min-w-0 max-md:justify-self-end max-md:!h-[clamp(84px,26vw,148px)]",
  "max-md:col-start-3 max-md:row-start-1 max-md:z-10 max-md:min-w-0 max-md:justify-self-end max-md:!h-[clamp(60px,18vw,108px)]",
];

const MOBILE_TILT = [
  "max-md:-rotate-8",
  "max-md:rotate-[4deg]",
  "max-md:-rotate-[2deg]",
  "max-md:-rotate-[5deg]",
  "max-md:rotate-[7deg]",
];

function isPhone() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;
}

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
      <motion.div
        style={{ y: headY, scale: headScale, opacity: headOpacity }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center px-4 pb-[clamp(8rem,26vh,15rem)] text-center"
      >
        <h1 className="text-[clamp(2.4rem,15vw,4.75rem)] leading-[0.94] tracking-[-0.038em] text-paper [font-stretch:100%] [font-weight:750] md:text-[clamp(4.25rem,8.6vw,11rem)]">
          <span className="block">
            <HeroWord word="Production" index={0} />
            <br className="md:hidden" />
            <span className="max-md:hidden"> </span>
            <HeroWord word="planning," index={1} />
          </span>
          <HeroLine words={["simplified."]} start={2} />
        </h1>
        <p className="fade-up mt-[clamp(1.25rem,3vh,2rem)] max-w-[18rem] text-[clamp(1.05rem,1.35vw,1.3rem)] leading-snug text-balance text-paper/70 sm:max-w-[36rem] [animation-delay:560ms]">
          The workspace for modern video production
        </p>
      </motion.div>

      <div className="hero-cast absolute inset-x-0 bottom-0 [--s:clamp(165px,19vw,420px)] max-md:grid max-md:grid-cols-3 max-md:items-end max-md:px-4 max-md:pb-8 md:flex md:translate-y-[30%] md:justify-center md:gap-[clamp(8px,1vw,16px)]">
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

function HeroWord({ word, index }: { word: string; index: number }) {
  return (
    <span className="-mx-[0.06em] -mb-[0.14em] inline-block overflow-hidden px-[0.06em] pb-[0.14em] align-top">
      <span className="hero-word" style={{ animationDelay: `${160 + index * 80}ms` }}>
        {word}
      </span>
    </span>
  );
}

function HeroLine({ words, start }: { words: string[]; start: number }) {
  return (
    <span className="block">
      {words.map((word, i) => (
        <span key={word}>
          <HeroWord word={word} index={start + i} />
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
  const scrollY = useTransform(progress, (v) => v * (isPhone() ? -20 : p.y));
  const rotate = useTransform(progress, (v) => v * (isPhone() ? 0 : p.r));
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
      className={cx("shape-host md:shrink-0", MOBILE_PLACE[index])}
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
          <div className={cx("size-full", MOBILE_TILT[index])}>
            <Shape kind={kind} icon={icon} color={color} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}