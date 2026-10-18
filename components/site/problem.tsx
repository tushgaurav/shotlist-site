"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { SlateLabel } from "./reveal";
import { SHAPE_RATIO, Shape, type IconKind, type ShapeKind } from "./shapes";

type Token =
  | { t: "word"; w: string }
  | { t: "shape"; kind: ShapeKind; icon: IconKind; color: string }
  | { t: "pill"; w: string };

const words = (s: string): Token[] => s.split(" ").map((w) => ({ t: "word", w }));

const TOKENS: Token[] = [
  ...words("Your script"),
  { t: "shape", kind: "circle", icon: "script", color: "var(--color-violet)" },
  ...words("lives in one app, your shot list"),
  { t: "shape", kind: "square", icon: "reel", color: "var(--color-yellow)" },
  ...words("lives in a spreadsheet, and the second someone rewrites"),
  { t: "pill", w: "scene 12" },
  ...words("they stop agreeing."),
];

export function Problem() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.82", "end 0.45"] });
  const n = TOKENS.length;

  return (
    <section id="problem" className="mx-auto max-w-[1400px] px-5 pt-[clamp(4.5rem,9vw,8rem)] pb-[clamp(4rem,8vw,7rem)] md:px-10">
      <SlateLabel scene="01">The problem</SlateLabel>
      <p
        ref={ref}
        className="mt-10 text-[clamp(2.1rem,5vw,5.4rem)] leading-[1.03] font-extrabold tracking-[-0.04em] [font-stretch:106%]"
      >
        {TOKENS.map((token, i) => (
          <Tok key={i} token={token} range={[i / n, (i + 1) / n]} progress={scrollYProgress} />
        ))}
      </p>
    </section>
  );
}

function Tok({
  token,
  range,
  progress,
}: {
  token: Token;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.13, 1]);
  const scale = useTransform(progress, range, [0.4, 1]);
  const rotate = useTransform(progress, range, [-40, 0]);

  if (token.t === "shape") {
    return (
      <>
        <motion.span
          style={{ opacity, scale, rotate, aspectRatio: SHAPE_RATIO[token.kind] }}
          className="mx-[0.06em] inline-block h-[0.86em] align-[-0.1em]"
        >
          <Shape kind={token.kind} icon={token.icon} color={token.color} />
        </motion.span>{" "}
      </>
    );
  }

  if (token.t === "pill") {
    return (
      <>
        <motion.span
          style={{ opacity }}
          className="inline-flex -translate-y-[0.08em] items-center rounded-full bg-orange px-[0.4em] py-[0.06em] align-middle font-script text-[0.62em] font-bold tracking-normal text-ink"
        >
          {token.w}
        </motion.span>{" "}
      </>
    );
  }

  return (
    <>
      <motion.span style={{ opacity }}>{token.w}</motion.span>{" "}
    </>
  );
}
