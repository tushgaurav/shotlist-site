"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { Fragment, useRef } from "react";

import { cx } from "@/lib/site";

import { Glyph, type ShapeKind } from "./shapes";

const TAGLINE = ["Write the script", "Plan the shots", "Wrap on time"];
const GLYPHS: ShapeKind[] = ["circle", "square", "tag"];

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

function Track({
  baseVelocity,
  className,
  children,
}: {
  baseVelocity: number;
  className?: string;
  children: React.ReactNode;
}) {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);
  const reduce = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * f;
    base.set(base.get() + moveBy);
  });

  return (
    <div className={cx("flex overflow-hidden whitespace-nowrap", className)}>
      <motion.div style={{ x }} className="flex shrink-0 flex-nowrap">
        <div className="flex shrink-0 items-center">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center">
          {children}
        </div>
      </motion.div>
    </div>
  );
}

export function Bands() {
  return (
    <section
      aria-label="Write the script. Plan the shots. Wrap on time."
      className="relative z-10 overflow-x-clip py-[clamp(3rem,6vw,5.5rem)]"
    >
      <div className="mx-[-6vw] -rotate-[2deg] bg-lime text-ink">
        <Track baseVelocity={-2} className="type-display py-[0.14em] text-[clamp(2.2rem,5.6vw,6rem)] leading-[1.02]">
          {[0, 1].map((r) => (
            <Fragment key={r}>
              {TAGLINE.map((line, i) => (
                <span key={line} className="flex items-center">
                  {line}
                  <Glyph kind={GLYPHS[i]} className="mx-[0.5em] h-[0.55em]" />
                </span>
              ))}
            </Fragment>
          ))}
        </Track>
      </div>
    </section>
  );
}
