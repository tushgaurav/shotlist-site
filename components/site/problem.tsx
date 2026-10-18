"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { SlateLabel } from "./reveal";

const SENTENCES = [
  "Your script lives in one app.",
  "Your shot list lives in a spreadsheet.",
  "Rewrite one scene and they stop agreeing.",
].map((s) => s.split(" "));
const TOTAL = SENTENCES.flat().length;

export function Problem() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  let index = 0;

  return (
    <section id="problem" className="mx-auto max-w-[1320px] px-5 py-[clamp(5rem,10vw,9rem)] md:px-10">
      <SlateLabel scene="01">The problem</SlateLabel>
      <p
        ref={ref}
        className="mt-10 text-[clamp(2.1rem,4.2vw,4.75rem)] leading-[1.08] font-extrabold tracking-[-0.04em] [font-stretch:106%]"
      >
        {SENTENCES.map((words, s) => (
          <span key={s} className="block text-balance">
            {words.map((word) => {
              const i = index++;
              return <Word key={i} word={word} range={[i / TOTAL, (i + 1) / TOTAL]} progress={scrollYProgress} />;
            })}
          </span>
        ))}
      </p>
    </section>
  );
}

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <>
      <motion.span style={{ opacity }}>{word}</motion.span>{" "}
    </>
  );
}
