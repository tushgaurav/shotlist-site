"use client";

import { AnimatePresence, LayoutGroup, motion, useInView } from "motion/react";
import { useEffect, useReducer, useRef, useState } from "react";

import { cx } from "@/lib/site";

import { Glyph } from "./shapes";

const FIRST = 11;
const LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const MAX_SHOTS = 9;
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", duration: 0.65, bounce: 0.16 } as const;

type Size = "WS" | "MS" | "MCU" | "CU" | "Insert" | "POV";
type Shot = { id: string; suffix: string; size: Size; desc: string };
type Scene = {
  id: string;
  heading: string;
  text: string;
  original: string;
  rewrite: string;
  shots: Shot[];
  changed: boolean;
};

const SIZE_DOT: Record<Size, string> = {
  WS: "bg-blue",
  MS: "bg-green",
  MCU: "bg-violet",
  CU: "bg-yellow",
  Insert: "bg-orange",
  POV: "bg-lime",
};

const NEW_SHOTS: Array<[Size, string]> = [
  ["CU", "Reaction"],
  ["Insert", "Hands, close"],
  ["MCU", "Over the shoulder"],
  ["WS", "Wide safety"],
  ["POV", "Through the glass"],
  ["MS", "Pickup"],
];

function scene(
  id: string,
  heading: string,
  original: string,
  rewrite: string,
  shots: Array<[Size, string]>,
): Scene {
  return {
    id,
    heading,
    text: original,
    original,
    rewrite,
    changed: false,
    shots: shots.map(([size, desc], i) => ({ id: `${id}-${i}`, suffix: LETTERS[i], size, desc })),
  };
}

const INITIAL_SCENES: Scene[] = [
  scene(
    "sc_4b1e",
    "EXT. ROOFTOP - NIGHT",
    "Rain hammers the gravel. MAYA (30s) counts the lit windows across the street. One goes dark.",
    "Not a drop of rain. MAYA (30s) counts the lit windows across the street. All of them go dark.",
    [
      ["WS", "Skyline in the rain"],
      ["MCU", "Maya counting windows"],
      ["POV", "The window goes dark"],
    ],
  ),
  scene(
    "sc_9c2d",
    "INT. STAIRWELL - CONTINUOUS",
    "Maya takes the stairs two at a time. Somewhere below, a door slams.",
    "The lights are dead. Maya takes the stairs by feel. Below her, a door slams.",
    [
      ["MS", "Maya descends, handheld"],
      ["Insert", "Door slams shut"],
    ],
  ),
  scene(
    "sc_7f3a",
    "INT. DINER - NIGHT",
    "Neon hums. LEO (60s) wipes the same spot on the counter. He doesn't look up when the bell rings.",
    "Neon flickers. LEO (60s) already has two cups poured. He knew she was coming.",
    [
      ["WS", "Diner, neon through rain"],
      ["MS", "Leo and Maya at the counter"],
      ["Insert", "Coffee pours"],
    ],
  ),
  scene(
    "sc_2e8b",
    "EXT. ALLEY - LATER",
    "Steam rises from a grate. Maya's phone buzzes. One word: RUN.",
    "Steam rises from a grate. Maya's phone buzzes. A photo of her, taken from behind.",
    [
      ["CU", "Phone screen"],
      ["WS", "Maya runs through the steam"],
    ],
  ),
];

type State = {
  scenes: Scene[];
  active: string;
  log: { id: number; text: string };
  typing: { id: string; target: string; n: number } | null;
  added: number;
};

type Action =
  | { type: "select"; id: string }
  | { type: "move"; dir: -1 | 1 }
  | { type: "rewrite" }
  | { type: "tick" }
  | { type: "add" }
  | { type: "review"; id: string }
  | { type: "reset" };

const START_LOG = "Click a scene in the script, then move it, rewrite it, or add a shot.";

const INITIAL: State = {
  scenes: INITIAL_SCENES,
  active: "sc_4b1e",
  log: { id: 0, text: START_LOG },
  typing: null,
  added: 0,
};

const place = (heading: string) => heading.split(" - ")[0];

function withLog(s: State, text: string): State {
  return { ...s, log: { id: s.log.id + 1, text } };
}

function reducer(s: State, a: Action): State {
  const i = s.scenes.findIndex((x) => x.id === s.active);
  const current = s.scenes[i];

  switch (a.type) {
    case "select": {
      if (a.id === s.active || s.typing) return s;
      const k = s.scenes.findIndex((x) => x.id === a.id);
      return withLog(
        { ...s, active: a.id },
        `Cursor in scene ${FIRST + k}. Its ${s.scenes[k].shots.length} shots light up on the right.`,
      );
    }
    case "move": {
      const j = i + a.dir;
      if (s.typing || j < 0 || j >= s.scenes.length) return s;
      const scenes = [...s.scenes];
      [scenes[i], scenes[j]] = [scenes[j], scenes[i]];
      const labels = current.shots.map((sh) => `${FIRST + j}${sh.suffix}`).join(", ");
      return withLog(
        { ...s, scenes },
        `${place(current.heading)} moved from ${FIRST + i} to ${FIRST + j}. Its shots came along as ${labels}. ID still ${current.id}.`,
      );
    }
    case "rewrite": {
      if (s.typing) return s;
      const target = current.text === current.original ? current.rewrite : current.original;
      return withLog(
        { ...s, typing: { id: current.id, target, n: 0 } },
        `Rewriting scene ${FIRST + i}…`,
      );
    }
    case "tick": {
      const typing = s.typing;
      if (!typing) return s;
      const n = Math.min(typing.n + 2, typing.target.length);
      if (n < typing.target.length) return { ...s, typing: { ...typing, n } };
      const k = s.scenes.findIndex((x) => x.id === typing.id);
      const scenes = s.scenes.map((x) =>
        x.id === typing.id ? { ...x, text: typing.target, changed: true } : x,
      );
      return withLog(
        { ...s, scenes, typing: null },
        `Scene ${FIRST + k} changed, so its ${scenes[k].shots.length} shots are flagged for a second look.`,
      );
    }
    case "add": {
      if (s.typing || current.shots.length >= MAX_SHOTS) return s;
      const next = Math.max(-1, ...current.shots.map((sh) => LETTERS.indexOf(sh.suffix))) + 1;
      const suffix = LETTERS[next];
      const skipped = suffix === "J" ? "I" : suffix === "P" ? "O" : null;
      const [size, desc] = NEW_SHOTS[s.added % NEW_SHOTS.length];
      const shot: Shot = { id: `${current.id}-n${s.added}`, suffix, size, desc };
      const scenes = s.scenes.map((x) =>
        x.id === current.id ? { ...x, shots: [...x.shots, shot] } : x,
      );
      const label = `${FIRST + i}${suffix}`;
      return withLog(
        { ...s, scenes, added: s.added + 1 },
        skipped
          ? `Added ${label}. There's no ${FIRST + i}${skipped}: on a slate, I and O read as 1 and 0.`
          : `Added ${label} to scene ${FIRST + i}.`,
      );
    }
    case "review": {
      const k = s.scenes.findIndex((x) => x.id === a.id);
      const scenes = s.scenes.map((x) => (x.id === a.id ? { ...x, changed: false } : x));
      return withLog({ ...s, scenes }, `Scene ${FIRST + k} checked. Badge cleared.`);
    }
    case "reset":
      return { ...INITIAL, log: { id: s.log.id + 1, text: START_LOG } };
  }
}

type ToolKey = "up" | "down" | "rewrite" | "add";

export function Demo() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [pressed, setPressed] = useState<ToolKey | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { once: true, amount: 0.45 });
  const touched = useRef(false);

  useEffect(() => {
    if (!state.typing) return;
    const t = setTimeout(() => dispatch({ type: "tick" }), 24);
    return () => clearTimeout(t);
  }, [state.typing]);

  useEffect(() => {
    if (!inView) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) =>
      timers.push(window.setTimeout(() => !touched.current && fn(), ms));
    const press = (key: ToolKey, action: Action) => {
      setPressed(key);
      dispatch(action);
      timers.push(window.setTimeout(() => setPressed(null), 280));
    };
    at(700, () => dispatch({ type: "select", id: "sc_7f3a" }));
    at(2300, () => press("up", { type: "move", dir: -1 }));
    at(4900, () => press("rewrite", { type: "rewrite" }));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const act = (action: Action) => {
    touched.current = true;
    setPressed(null);
    dispatch(action);
  };

  const index = state.scenes.findIndex((x) => x.id === state.active);
  const busy = state.typing !== null;
  const total = state.scenes.reduce((sum, x) => sum + x.shots.length, 0);

  const tools: Array<{ key: ToolKey; label: string; icon: React.ReactNode; action: Action; disabled: boolean }> = [
    { key: "up", label: "Move up", icon: <ArrowIcon />, action: { type: "move", dir: -1 }, disabled: busy || index === 0 },
    {
      key: "down",
      label: "Move down",
      icon: <ArrowIcon down />,
      action: { type: "move", dir: 1 },
      disabled: busy || index === state.scenes.length - 1,
    },
    { key: "rewrite", label: "Rewrite", icon: <PenIcon />, action: { type: "rewrite" }, disabled: busy },
    {
      key: "add",
      label: "Add shot",
      icon: <PlusIcon />,
      action: { type: "add" },
      disabled: busy || state.scenes[index].shots.length >= MAX_SHOTS,
    },
  ];

  return (
    <div
      ref={rootRef}
      className="rounded-[30px] border border-white/[0.08] bg-ink-2 p-2 shadow-[0_60px_140px_-50px_rgb(0_0_0/0.9)] sm:p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-1 pb-3 sm:px-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex items-center gap-1.5" aria-hidden>
            <Glyph kind="circle" className="h-[11px] text-violet" />
            <Glyph kind="square" className="h-[11px] text-green" />
            <Glyph kind="tag" className="h-[11px] text-orange" />
          </span>
          <span className="truncate font-script text-[13px] text-paper/75">midnight-diner</span>
          <span className="hidden items-center gap-1.5 rounded-full bg-white/[0.06] px-2 py-0.5 text-[11px] text-paper/50 sm:flex">
            <span className="size-1.5 rounded-full bg-lime" /> Saved
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {tools.map((tool) => (
            <button
              key={tool.key}
              type="button"
              disabled={tool.disabled}
              onClick={() => act(tool.action)}
              className={cx(
                "flex h-9 items-center gap-2 rounded-full px-3 text-[13px] font-medium transition-[transform,background-color,color,opacity] duration-150 ease-out-strong active:scale-[0.97] disabled:pointer-events-none disabled:opacity-30 sm:px-3.5",
                pressed === tool.key
                  ? "scale-[0.97] bg-lime text-ink"
                  : "bg-white/[0.07] text-paper/90 hover:bg-white/[0.13]",
              )}
            >
              {tool.icon}
              {tool.label}
            </button>
          ))}
          <button
            type="button"
            aria-label="Reset the demo"
            onClick={() => act({ type: "reset" })}
            className="grid size-9 place-items-center rounded-full bg-white/[0.07] text-paper/70 transition-[transform,background-color] duration-150 ease-out-strong hover:bg-white/[0.13] active:scale-[0.95]"
          >
            <ResetIcon />
          </button>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-3 lg:grid-cols-[1.12fr_1fr]">
        <Paper state={state} onSelect={(id) => act({ type: "select", id })} />
        <ShotPanel
          state={state}
          total={total}
          onSelect={(id) => act({ type: "select", id })}
          onReview={(id) => act({ type: "review", id })}
        />
      </div>

      <div
        aria-live="polite"
        className="flex min-h-12 items-center gap-3 px-3 pt-3 pb-1.5 font-script text-[12.5px] text-paper/60 sm:px-4 sm:text-[13px]"
      >
        <span className="size-1.5 shrink-0 animate-pulse rounded-full bg-lime" />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={state.log.id}
            initial={{ opacity: 0, transform: "translateY(5px)", filter: "blur(4px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)", filter: "blur(0px)" }}
            exit={{ opacity: 0, transform: "translateY(-5px)", filter: "blur(4px)" }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {state.log.text}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Paper({ state, onSelect }: { state: State; onSelect: (id: string) => void }) {
  return (
    <div className="relative rounded-[22px] bg-paper px-2 py-6 text-[#1b1b1b] sm:px-5 md:py-9 lg:px-7">
      <div className="mb-4 flex justify-between px-3 font-script text-[11px] tracking-[0.16em] text-black/40 uppercase">
        <span>Midnight Diner</span>
        <span>Draft 3 · p. 7</span>
      </div>
      <LayoutGroup id="paper">
        {state.scenes.map((sc, k) => {
          const n = FIRST + k;
          const active = sc.id === state.active;
          const typing = state.typing?.id === sc.id ? state.typing : null;
          const text = typing ? typing.target.slice(0, typing.n) : sc.text;
          return (
            <motion.button
              key={sc.id}
              layout="position"
              transition={SPRING}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(sc.id)}
              className="relative block w-full rounded-xl px-2 py-3.5 text-left font-script text-[12.5px] leading-[1.6] transition-colors duration-200 hover:bg-black/[0.03] sm:px-3 sm:text-[14px]"
            >
              {active && (
                <>
                  <motion.span
                    layoutId="paper-active"
                    transition={SPRING}
                    className="absolute inset-0 rounded-xl bg-black/[0.055]"
                  />
                  <motion.span
                    layoutId="paper-bar"
                    transition={SPRING}
                    className="absolute top-3.5 bottom-3.5 left-0 w-[3px] rounded-full bg-orange"
                  />
                </>
              )}
              <span className="relative grid grid-cols-[2.1rem_1fr_2.1rem] items-baseline sm:grid-cols-[2.75rem_1fr_2.75rem]">
                <span className="font-bold">
                  <Flip value={n} />
                </span>
                <span className="flex items-center gap-2 font-bold uppercase">
                  {sc.heading}
                  <AnimatePresence>
                    {sc.changed && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="size-2 rounded-full bg-orange"
                      />
                    )}
                  </AnimatePresence>
                </span>
                <span className="text-right font-bold">
                  <Flip value={n} />
                </span>
                <span className="col-start-2 mt-1.5 block min-h-[3.2em] text-pretty">
                  {text}
                  {active && (
                    <span className="caret ml-px inline-block h-[1.05em] w-[2px] translate-y-[0.2em] bg-[#1b1b1b]" />
                  )}
                </span>
              </span>
            </motion.button>
          );
        })}
      </LayoutGroup>
    </div>
  );
}

function ShotPanel({
  state,
  total,
  onSelect,
  onReview,
}: {
  state: State;
  total: number;
  onSelect: (id: string) => void;
  onReview: (id: string) => void;
}) {
  return (
    <div className="rounded-[22px] bg-[#1f1f1f] p-2 sm:p-3">
      <div className="flex items-center justify-between px-2 pt-1 pb-3">
        <div className="flex items-center gap-2 text-[14px] font-semibold">
          Shot list
          <span className="rounded-full bg-white/[0.07] px-2 py-0.5 text-[11px] font-medium text-paper/55 tabular-nums">
            {total} shots
          </span>
        </div>
        <div aria-hidden className="flex rounded-full bg-white/[0.06] p-0.5 text-[11px] font-medium">
          <span className="rounded-full bg-paper px-2.5 py-1 text-ink">Table</span>
          <span className="px-2.5 py-1 text-paper/45">Cards</span>
        </div>
      </div>
      <LayoutGroup id="panel">
        <div className="flex flex-col gap-2">
          {state.scenes.map((sc, k) => {
            const n = FIRST + k;
            const active = sc.id === state.active;
            return (
              <motion.section
                key={sc.id}
                layout="position"
                transition={SPRING}
                onClick={() => onSelect(sc.id)}
                className={cx(
                  "relative cursor-pointer rounded-2xl border p-1.5 transition-colors duration-200",
                  active
                    ? "border-paper/25 bg-white/[0.05]"
                    : "border-white/[0.06] hover:border-white/[0.14]",
                )}
              >
                <header className="flex items-center gap-2 px-1.5 pt-1 pb-1.5">
                  <span className="grid h-6 min-w-8 place-items-center rounded-md bg-paper px-1.5 text-[12px] font-black text-ink tabular-nums">
                    <Flip value={n} />
                  </span>
                  <span className="min-w-0 truncate font-script text-[12px] text-paper/80 uppercase">
                    {sc.heading}
                  </span>
                  <span className="ml-auto flex shrink-0 items-center gap-2">
                    <AnimatePresence initial={false}>
                      {sc.changed && <ChangedBadge onReview={() => onReview(sc.id)} />}
                    </AnimatePresence>
                    <span
                      title="Permanent scene ID. It never changes."
                      className="hidden font-script text-[11px] text-paper/35 sm:inline"
                    >
                      {sc.id}
                    </span>
                  </span>
                </header>
                <ul>
                  <AnimatePresence initial={false}>
                    {sc.shots.map((shot) => (
                      <motion.li
                        key={shot.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-[2.9rem_4rem_1fr] items-center gap-2 rounded-lg px-1.5 py-[5px] text-[13px]">
                          <span className="font-black tracking-tight tabular-nums">
                            <Flip value={`${n}${shot.suffix}`} />
                          </span>
                          <span className="flex items-center gap-1.5 font-script text-[11.5px] text-paper/70">
                            <span className={cx("size-2 rounded-[3px]", SIZE_DOT[shot.size])} />
                            {shot.size}
                          </span>
                          <span className="truncate text-paper/70">{shot.desc}</span>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </motion.section>
            );
          })}
        </div>
      </LayoutGroup>
    </div>
  );
}

function ChangedBadge({ onReview }: { onReview: () => void }) {
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, scale: 0.85, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
      transition={{ duration: 0.3, ease: EASE }}
      onClick={(e) => {
        e.stopPropagation();
        onReview();
      }}
      className="group/badge flex h-6 items-center gap-1.5 rounded-full bg-orange pr-2.5 pl-2 text-[11px] font-semibold whitespace-nowrap text-ink"
    >
      <span className="relative flex size-1.5">
        <span className="absolute inset-0 animate-ping rounded-full bg-ink/60" />
        <span className="relative size-1.5 rounded-full bg-ink" />
      </span>
      <span className="group-hover/badge:hidden">Scene changed</span>
      <span className="hidden group-hover/badge:inline">Mark checked</span>
    </motion.button>
  );
}

function Flip({ value }: { value: string | number }) {
  return (
    <span className="relative inline-flex overflow-hidden align-bottom">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="inline-block"
          initial={{ transform: "translateY(95%)", opacity: 0 }}
          animate={{ transform: "translateY(0%)", opacity: 1 }}
          exit={{ transform: "translateY(-95%)", opacity: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function ArrowIcon({ down }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className={cx("size-4", down && "rotate-180")} aria-hidden>
      <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
      <path d="M10.5 2.5 13.5 5.5 6 13H3v-3l7.5-7.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
      <path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
      <path d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5V5h2.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
