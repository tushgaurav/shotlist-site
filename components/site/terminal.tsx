"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useRef, useState } from "react";

import { Glyph } from "./shapes";

const EASE = [0.22, 1, 0.36, 1] as const;

const LINES = [
  { cmd: "git clone git@github.com:tushgaurav/shotlist.git && cd shotlist" },
  { cmd: "npm install" },
  { cmd: "cp .env.example .env.local", note: "# set DATABASE_URL and BETTER_AUTH_SECRET at minimum" },
  { cmd: "npm run db:migrate" },
  { cmd: "npm run dev" },
];

const CLIPBOARD = LINES.map((l) => (l.note ? `${l.cmd}   ${l.note}` : l.cmd)).join("\n");

export function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(CLIPBOARD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard blocked.
    }
  }

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[24px] bg-[#0c0c0c] shadow-[0_50px_120px_-40px_rgb(0_0_0/0.95)] ring-1 ring-white/[0.08]"
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5" aria-hidden>
            <Glyph kind="circle" className="h-[11px] text-violet" />
            <Glyph kind="square" className="h-[11px] text-green" />
            <Glyph kind="tag" className="h-[11px] text-orange" />
          </span>
          <span className="font-script text-[12.5px] text-paper/45">~/shotlist</span>
        </div>
        <button
          type="button"
          onClick={copy}
          className="relative flex h-8 items-center rounded-full bg-white/[0.07] px-3.5 text-[12px] font-medium text-paper/80 transition-[transform,background-color] duration-150 ease-out-strong hover:bg-white/[0.13] active:scale-[0.96]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={copied ? "copied" : "copy"}
              initial={{ opacity: 0, filter: "blur(4px)", transform: "scale(0.9)" }}
              animate={{ opacity: 1, filter: "blur(0px)", transform: "scale(1)" }}
              exit={{ opacity: 0, filter: "blur(4px)", transform: "scale(0.9)" }}
              transition={{ duration: 0.2, ease: EASE }}
              className={copied ? "text-lime" : undefined}
            >
              {copied ? "Copied ✓" : "Copy all"}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <div className="space-y-2.5 px-4 py-5 font-script text-[13px] leading-relaxed sm:px-6 sm:py-6 sm:text-[14.5px]">
        {LINES.map((line, i) => (
          <motion.div
            key={line.cmd}
            className="flex gap-3"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={inView ? { clipPath: "inset(0 0% 0 0)" } : undefined}
            transition={{ delay: 0.2 + i * 0.42, duration: 0.5, ease: "linear" }}
          >
            <span className="text-lime select-none">$</span>
            <span className="min-w-0 break-words text-paper/90">
              {line.cmd}
              {line.note && <span className="text-paper/35">{"   "}{line.note}</span>}
            </span>
          </motion.div>
        ))}
        <motion.div
          className="pt-3 text-paper/55"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ delay: 0.3 + LINES.length * 0.42, duration: 0.4 }}
        >
          <span className="text-lime">✓</span> Ready on <span className="text-paper underline decoration-paper/30 underline-offset-4">localhost:3000</span>
          <span className="caret ml-2 inline-block h-[1.05em] w-[0.55em] translate-y-[0.2em] bg-paper/70" />
        </motion.div>
      </div>
    </div>
  );
}
