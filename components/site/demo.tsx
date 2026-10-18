"use client";

import { AnimatePresence, LayoutGroup, motion, useInView } from "motion/react";
import { useEffect, useReducer, useRef, useState } from "react";

import { cx } from "@/lib/site";

const FIRST = 11;
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", duration: 0.65, bounce: 0.16 } as const;

type Shot = { id: string; label: string; size: string; desc: string };
type Scene = {
  id: string;
  heading: string;
  text: string;
  original: string;
  rewrite: string;
  shots: Shot[];
  changed: boolean;
};

function scene(id: string, heading: string, original: string, rewrite: string, shots: Array<[string, string]>): Scene {
  return {
    id,
    heading,
    text: original,
    original,
    rewrite,
    changed: false,
    shots: shots.map(([size, desc], i) => ({ id: `${id}-${i}`, label: "ABC"[i], size, desc })),
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
};

type Action =
  | { type: "select"; id: string }
  | { type: "move"; dir: -1 | 1 }
  | { type: "rewrite" }
  | { type: "tick" }
  | { type: "review"; id: string }
  | { type: "reset" };

const START_LOG = "Click a scene, then move it or rewrite it.";

const INITIAL: State = {
  scenes: INITIAL_SCENES,
  active: "sc_4b1e",
  log: { id: 0, text: START_LOG },
  typing: null,
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
      return withLog({ ...s, active: a.id }, `Scene ${FIRST + k}. Its shots light up on the right.`);
    }
    case "move": {
      const j = i + a.dir;
      if (s.typing || j < 0 || j >= s.scenes.length) return s;
      const scenes = [...s.scenes];
      [scenes[i], scenes[j]] = [scenes[j], scenes[i]];
      return withLog(
        { ...s, scenes },
        `${place(current.heading)} is now scene ${FIRST + j}. Its shots followed. The ID didn't change.`,
      );
    }
    case "rewrite": {
      if (s.typing) return s;
      const target = current.text === current.original ? current.rewrite : current.original;
      return withLog({ ...s, typing: { id: current.id, target, n: 0 } }, `Rewriting scene ${FIRST + i}…`);
    }
    case "tick": {
      const typing = s.typing;
      if (!typing) return s;
      const n = Math.min(typing.n + 2, typing.target.length);
      if (n < typing.target.length) return { ...s, typing: { ...typing, n } };
      const k = s.scenes.findIndex((x) => x.id === typing.id);
      const scenes = s.scenes.map((x) => (x.id === typing.id ? { ...x, text: typing.target, changed: true } : x));
      return withLog({ ...s, scenes, typing: null }, `Scene ${FIRST + k} changed, so its shots are flagged.`);
    }
    case "review": {
      const scenes = s.scenes.map((x) => (x.id === a.id ? { ...x, changed: false } : x));
      return withLog({ ...s, scenes }, "Checked. Flag cleared.");
    }
    case "reset":
      return { ...INITIAL, log: { id: s.log.id + 1, text: START_LOG } };
  }
}

type ToolKey = "up" | "down" | "rewrite";

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
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(() => !touched.current && fn(), ms));
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
  ];

  return (
    <div
      ref={rootRef}
      className="rounded-[30px] border border-white/[0.07] bg-ink-2 p-2 shadow-[0_60px_140px_-50px_rgb(0_0_0/0.9)] sm:p-3"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-2 pt-1 pb-3 sm:px-3">
        <span className="font-script text-[13px] text-paper/50">midnight-diner</span>
        <div className="flex flex-wrap items-center gap-1.5">
          {tools.map((tool) => (
            <button
              key={tool.key}
              type="button"
              disabled={tool.disabled}
              onClick={() => act(tool.action)}
              className={cx(
                "flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium transition-[transform,background-color,color,opacity] duration-150 ease-out-strong active:scale-[0.97] disabled:pointer-events-none disabled:opacity-30",
                pressed === tool.key ? "scale-[0.97] bg-lime text-ink" : "bg-white/[0.07] text-paper/90 hover:bg-white/[0.13]",
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
            className="grid size-9 place-items-center rounded-full text-paper/50 transition-[transform,color] duration-150 ease-out-strong hover:text-paper active:scale-[0.95]"
          >
            <ResetIcon />
          </button>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-3 lg:grid-cols-[1.12fr_1fr]">
        <Paper state={state} onSelect={(id) => act({ type: "select", id })} />
        <ShotPanel
          state={state}
          onSelect={(id) => act({ type: "select", id })}
          onReview={(id) => act({ type: "review", id })}
        />
      </div>

      <div
        aria-live="polite"
        className="flex min-h-12 items-center px-3 pt-3 pb-1.5 font-script text-[12.5px] text-paper/50 sm:px-4 sm:text-[13px]"
      >
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
    <div className="relative rounded-[22px] bg-paper px-2 py-5 text-[#1b1b1b] sm:px-5 md:py-8 lg:px-7">
      <LayoutGroup id="paper">
        {state.scenes.map((sc, k) => {
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
                    className="absolute inset-0 rounded-xl bg-black/[0.05]"
                  />
                  <motion.span
                    layoutId="paper-bar"
                    transition={SPRING}
                    className="absolute top-3.5 bottom-3.5 left-0 w-[3px] rounded-full bg-orange"
                  />
                </>
              )}
              <span className="relative grid grid-cols-[2.1rem_1fr] items-baseline sm:grid-cols-[2.75rem_1fr]">
                <span className="font-bold">
                  <Flip value={FIRST + k} />
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
  onSelect,
  onReview,
}: {
  state: State;
  onSelect: (id: string) => void;
  onReview: (id: string) => void;
}) {
  return (
    <div className="rounded-[22px] bg-[#1e1e1e] p-2 sm:p-3">
      <p className="px-2 pt-1 pb-3 text-[14px] font-semibold">Shot list</p>
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
                  active ? "border-paper/25 bg-white/[0.04]" : "border-white/[0.06] hover:border-white/[0.14]",
                )}
              >
                <header className="flex items-center gap-2 px-1.5 pt-1 pb-1.5">
                  <span className="grid h-6 min-w-8 place-items-center rounded-md bg-paper px-1.5 text-[12px] font-black text-ink tabular-nums">
                    <Flip value={n} />
                  </span>
                  <span className="min-w-0 truncate font-script text-[12px] text-paper/75 uppercase">{sc.heading}</span>
                  <span className="ml-auto flex shrink-0 items-center gap-2">
                    <AnimatePresence initial={false}>
                      {sc.changed && <ChangedBadge onReview={() => onReview(sc.id)} />}
                    </AnimatePresence>
                    <span
                      title="Permanent scene ID. It never changes."
                      className="hidden font-script text-[11px] text-paper/30 sm:inline"
                    >
                      {sc.id}
                    </span>
                  </span>
                </header>
                <ul>
                  {sc.shots.map((shot) => (
                    <li
                      key={shot.id}
                      className="grid grid-cols-[2.9rem_3.6rem_1fr] items-center gap-2 px-1.5 py-[5px] text-[13px]"
                    >
                      <span className="font-black tracking-tight tabular-nums">
                        <Flip value={`${n}${shot.label}`} />
                      </span>
                      <span className="font-script text-[11.5px] text-paper/40">{shot.size}</span>
                      <span className="truncate text-paper/70">{shot.desc}</span>
                    </li>
                  ))}
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
      <span className="size-1.5 rounded-full bg-ink" />
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
      <path
        d="M8 13V3M3.5 7.5 8 3l4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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

function ResetIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" aria-hidden>
      <path
        d="M3 8a5 5 0 1 0 1.6-3.7M3 2.5V5h2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
