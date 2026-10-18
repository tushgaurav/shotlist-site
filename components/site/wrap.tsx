"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

import { AUTHOR_URL, GITHUB_URL, SPEC_URL } from "@/lib/site";

import { Wordmark } from "./logo";
import { Reveal, SplitHeading } from "./reveal";
import { CAST, SHAPE_RATIO, Shape, type IconKind, type ShapeKind } from "./shapes";

const CURTAIN = [
  { from: 260, rotate: -14 },
  { from: 360, rotate: 9 },
  { from: 200, rotate: -4 },
  { from: 420, rotate: 12 },
  { from: 300, rotate: -10 },
];

export function Wrap() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  return (
    <footer ref={ref} className="relative isolate flex flex-col overflow-hidden pt-[clamp(5rem,12vh,9rem)] md:min-h-[100svh]">
      <div className="px-4 text-center">
        <SplitHeading
          lines={["That's", "a wrap."]}
          className="type-display text-[clamp(4.5rem,17.5vw,20rem)] leading-[0.8] tracking-[-0.035em]!"
        />
        <Reveal delay={0.25} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-14 items-center gap-2.5 rounded-full bg-lime px-7 text-[15px] font-semibold text-ink transition-transform duration-150 ease-out-strong hover:scale-[1.03] active:scale-[0.97]"
          >
            <GitHubIcon />
            Get the code
          </a>
          <a
            href={SPEC_URL}
            target="_blank"
            rel="noreferrer"
            className="flex h-14 items-center rounded-full px-7 text-[15px] font-semibold text-paper ring-1 ring-paper/20 transition-[transform,box-shadow] duration-150 ease-out-strong hover:ring-paper/50 active:scale-[0.97]"
          >
            Read the spec
          </a>
        </Reveal>
      </div>

      <div className="relative z-10 mx-auto mt-auto flex w-full max-w-[1320px] flex-wrap items-center justify-between gap-4 px-5 pt-20 pb-6 text-[13px] text-paper/50 md:px-8">
        <div className="flex items-center gap-3">
          <Wordmark className="h-3.5 text-paper/80" />
          <span>© 2026</span>
        </div>
        <div className="flex items-center gap-5">
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
            GitHub
          </a>
          <a href={SPEC_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
            Spec
          </a>
          <a href={AUTHOR_URL} target="_blank" rel="noreferrer" className="transition-colors hover:text-paper">
            Made by tushgaurav
          </a>
        </div>
      </div>

      <div className="relative flex h-[calc(var(--s)*0.62)] justify-center gap-[clamp(8px,1vw,16px)] [--s:clamp(140px,17vw,360px)]">
        {[...CAST].reverse().map((c, i) => (
          <CurtainShape key={c.icon} index={i} kind={c.kind} icon={c.icon} color={c.color} progress={scrollYProgress} />
        ))}
      </div>
    </footer>
  );
}

function CurtainShape({
  index,
  kind,
  icon,
  color,
  progress,
}: {
  index: number;
  kind: ShapeKind;
  icon: IconKind;
  color: string;
  progress: MotionValue<number>;
}) {
  const c = CURTAIN[index];
  const y = useTransform(progress, [0.35, 1], [c.from, 0]);
  const rotate = useTransform(progress, [0.35, 1], [c.rotate * 2, c.rotate]);

  return (
    <motion.div
      style={{ y, rotate, height: "var(--s)", aspectRatio: SHAPE_RATIO[kind] }}
      className="shape-host shrink-0"
    >
      <Shape kind={kind} icon={icon} color={color} />
    </motion.div>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-[18px]" aria-hidden>
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  );
}
