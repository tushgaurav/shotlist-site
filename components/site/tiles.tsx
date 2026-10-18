"use client";

import { AnimatePresence, LayoutGroup, motion, useInView, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { cx } from "@/lib/site";
import { useSequence } from "@/lib/use-sequence";

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", duration: 0.55, bounce: 0.15 } as const;

const swap = {
  initial: { opacity: 0, filter: "blur(6px)", transform: "translateY(6px)" },
  animate: { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)" },
  exit: { opacity: 0, filter: "blur(6px)", transform: "translateY(-6px)" },
  transition: { duration: 0.28, ease: EASE },
};

function useLive<T extends Element>(amount = 0.35) {
  const ref = useRef<T>(null);
  const inView = useInView(ref, { amount });
  const reduce = useReducedMotion();
  return [ref, inView && !reduce] as const;
}

function Caret({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx("caret ml-px inline-block h-[1.05em] w-[2px] translate-y-[0.2em] bg-current", className)}
    />
  );
}

/* ---------------------------------------------------------------- Editor */

type Kind = "action" | "heading" | "character" | "dialogue";
type Line = { kind: Kind; text: string };

const LINE_STYLE: Record<Kind, string> = {
  action: "",
  heading: "font-bold uppercase",
  character: "pl-[38%] uppercase",
  dialogue: "pl-[18%] pr-[12%]",
};

const EARLIER: Line[] = [
  { kind: "heading", text: "ext. rooftop - night" },
  { kind: "action", text: "Rain hammers the gravel. MAYA (30s) counts the lit windows across the street. One goes dark." },
  { kind: "character", text: "Maya" },
  { kind: "dialogue", text: "Come on, Leo. Pick up." },
];

const FINAL_SCRIPT: Line[] = [
  { kind: "heading", text: "int. diner - night" },
  { kind: "action", text: "Leo pours two coffees. Waits." },
  { kind: "character", text: "Maya" },
  { kind: "dialogue", text: "You kept my cup." },
];

export function EditorIllustration() {
  const [ref, live] = useLive<HTMLDivElement>();
  const [lines, setLines] = useState<Line[]>(FINAL_SCRIPT);
  const [key, setKey] = useState<"Enter" | "Tab" | null>(null);
  const [badge, setBadge] = useState<string | null>("Dialogue");
  const [popup, setPopup] = useState(false);

  useSequence(live, async (sleep) => {
    const edit = (fn: (l: Line) => Line) =>
      setLines((ls) => [...ls.slice(0, -1), fn(ls[ls.length - 1])]);
    const push = (kind: Kind) => setLines((ls) => [...ls, { kind, text: "" }]);
    const type = async (text: string, speed = 55) => {
      for (const ch of text) {
        edit((l) => ({ ...l, text: l.text + ch }));
        await sleep(speed + Math.random() * 45);
      }
    };
    const press = async (k: "Enter" | "Tab") => {
      setKey(k);
      await sleep(170);
      setKey(null);
    };

    setLines([{ kind: "action", text: "" }]);
    setBadge(null);
    setPopup(false);
    await sleep(700);
    await type("int.", 95);
    edit((l) => ({ ...l, kind: "heading" }));
    setBadge("Scene heading");
    await type(" diner - night");
    await sleep(450);
    await press("Enter");
    push("action");
    setBadge("Action");
    await type("Leo pours two coffees. Waits.", 36);
    await sleep(500);
    await press("Enter");
    push("action");
    await sleep(250);
    await press("Tab");
    edit((l) => ({ ...l, kind: "character" }));
    setBadge("Character");
    await sleep(350);
    await type("ma", 150);
    setPopup(true);
    await sleep(1000);
    await press("Enter");
    setPopup(false);
    edit((l) => ({ ...l, text: "Maya" }));
    await sleep(350);
    await press("Enter");
    push("dialogue");
    setBadge("Dialogue");
    await type("You kept my cup.", 60);
    await sleep(3400);
  });

  return (
    <div
      ref={ref}
      className="relative flex h-full min-h-[250px] flex-col rounded-2xl bg-[#fffdf8] p-5 lg:min-h-[320px] shadow-[0_1px_0_rgb(0_0_0/0.04),0_30px_60px_-30px_rgb(0_0_0/0.35)] sm:p-8"
    >
      <div className="flex items-center justify-between gap-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={badge ?? "none"}
            {...swap}
            className={cx(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold",
              badge ? "bg-ink text-paper" : "text-transparent",
            )}
          >
            {badge ?? "Action"}
          </motion.span>
        </AnimatePresence>
        <div className="flex gap-1.5">
          {(["Enter", "Tab"] as const).map((k) => (
            <kbd
              key={k}
              className={cx(
                "rounded-md border px-2 py-1 font-script text-[11.5px] transition-[transform,background-color,color,border-color] duration-150 ease-out-strong",
                key === k
                  ? "scale-[0.92] border-ink bg-ink text-paper"
                  : "border-black/15 bg-black/[0.03] text-black/55",
              )}
            >
              {k === "Enter" ? "↵ Enter" : "⇥ Tab"}
            </kbd>
          ))}
        </div>
      </div>
      <div className="mt-7 font-script text-[13.5px] leading-[1.65] text-[#1b1b1b] sm:text-[15.5px]">
        <div aria-hidden className="mb-[1.15em] hidden text-[#1b1b1b]/35 lg:block">
          {EARLIER.map((line, i) => (
            <div
              key={i}
              className={cx(LINE_STYLE[line.kind], i > 0 && line.kind !== "dialogue" && "mt-[1.15em]")}
            >
              {line.text}
            </div>
          ))}
        </div>
        {lines.map((line, i) => {
          const last = i === lines.length - 1;
          return (
            <div
              key={i}
              className={cx(
                "relative min-h-[1.65em]",
                LINE_STYLE[line.kind],
                i > 0 && line.kind !== "dialogue" && "mt-[1.15em]",
              )}
            >
              {line.text}
              {last && <Caret />}
              <AnimatePresence>
                {last && popup && (
                  <motion.div
                    initial={{ opacity: 0, transform: "translateY(-4px) scale(0.97)" }}
                    animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="absolute top-full left-[38%] z-10 mt-1 w-36 origin-top-left rounded-lg bg-ink p-1 text-[12px] text-paper normal-case shadow-xl"
                  >
                    <div className="rounded-md bg-white/15 px-2 py-1">MAYA</div>
                    <div className="px-2 py-1 text-paper/55">MARCUS</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Slate letters */

const ALPHA = "ABCDEFGHIJKLMNOP".split("");

export function SlateLetters() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="grid grid-cols-8 gap-1.5 sm:gap-2">
      {ALPHA.map((ch, i) => {
        const skip = ch === "I" || ch === "O";
        return (
          <motion.div
            key={ch}
            initial={{ opacity: 0, transform: "translateY(30%) scale(0.9)" }}
            animate={inView ? { opacity: 1, transform: "translateY(0%) scale(1)" } : undefined}
            transition={{ delay: i * 0.04, duration: 0.55, ease: EASE }}
            className={cx(
              "relative grid aspect-[4/5] place-items-center rounded-lg text-[clamp(1.15rem,2.1vw,2rem)] font-black",
              skip ? "outline-2 -outline-offset-2 outline-ink/25 outline-dashed" : "bg-ink text-yellow",
            )}
          >
            <span className="absolute top-1 left-1.5 font-script text-[9px] font-bold opacity-60">12</span>
            <span className={skip ? "opacity-30" : undefined}>{ch}</span>
            {skip && (
              <motion.span
                aria-hidden
                className="absolute top-1/2 left-[15%] h-[3px] w-[70%] origin-left -rotate-[38deg] rounded-full bg-ink"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : undefined}
                transition={{ delay: 0.85 + i * 0.03, duration: 0.45, ease: EASE }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------------------------------------------------------------- Autosave */

const SAVE_STATES = [
  { dot: "bg-lime", label: "Saved", note: "just now" },
  { dot: "bg-yellow", label: "Offline", note: "kept on this device" },
  { dot: "bg-orange", label: "Older tab", note: "stale save refused" },
  { dot: "bg-lime", label: "Back online", note: "synced" },
];

export function AutosaveIllustration() {
  const [ref, live] = useLive<HTMLDivElement>();
  const [i, setI] = useState(0);
  const s = SAVE_STATES[i];

  useSequence(live, async (sleep) => {
    await sleep(1900);
    setI((v) => (v + 1) % SAVE_STATES.length);
  });

  return (
    <div ref={ref} className="relative grid h-full min-h-[200px] place-items-center">
      <div className="relative -mt-6 h-[136px] w-[108px]">
        {[-10, -2, 7].map((r, k) => (
          <div
            key={r}
            className="absolute inset-0 rounded-md bg-paper p-3 shadow-[0_14px_30px_-14px_rgb(0_0_0/0.5)]"
            style={{ rotate: `${r}deg`, translate: `${(k - 1) * 16}px ${k === 1 ? -6 : 0}px` }}
          >
            <span className="block h-1.5 w-3/4 rounded-full bg-black/25" />
            <span className="mt-2 block h-1 w-full rounded-full bg-black/12" />
            <span className="mt-1.5 block h-1 w-5/6 rounded-full bg-black/12" />
            <span className="mx-auto mt-3 block h-1 w-1/3 rounded-full bg-black/20" />
            <span className="mt-1.5 ml-[18%] block h-1 w-3/5 rounded-full bg-black/12" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={i}
            {...swap}
            className="flex items-center gap-2 rounded-full bg-ink py-2 pr-4 pl-3 text-[13px] font-semibold whitespace-nowrap text-paper shadow-lg"
          >
            <span className={cx("size-2 rounded-full", s.dot)} />
            {s.label}
            <span className="font-normal text-paper/50">· {s.note}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <span className="absolute top-0 right-0 rounded-full bg-ink/10 px-2.5 py-1 font-script text-[11px] font-bold">
        .fountain ↓
      </span>
    </div>
  );
}

/* ---------------------------------------------------------------- AI */

type Phase = "typing" | "thinking" | "suggest" | "accept" | "done";
const PROMPT = "Make Leo colder. Fewer words.";
const OLD_LINE = "Same as always, Maya? Black, two sugars, and whatever pie is left?";
const NEW_LINE = "You're late.";

export function AiIllustration() {
  const [ref, live] = useLive<HTMLDivElement>();
  const [prompt, setPrompt] = useState(PROMPT);
  const [phase, setPhase] = useState<Phase>("suggest");
  const applied = phase === "done";

  useSequence(live, async (sleep) => {
    setPrompt("");
    setPhase("typing");
    await sleep(800);
    for (const ch of PROMPT) {
      setPrompt((p) => p + ch);
      await sleep(42 + Math.random() * 40);
    }
    await sleep(450);
    setPhase("thinking");
    await sleep(1300);
    setPhase("suggest");
    await sleep(2400);
    setPhase("accept");
    await sleep(260);
    setPhase("done");
    await sleep(2900);
  });

  return (
    <div ref={ref} className="relative flex h-full flex-col justify-center">
      <div className="mx-3 rounded-2xl bg-paper p-5 pb-14 font-script text-[13px] leading-[1.6] text-[#1b1b1b] shadow-[0_20px_50px_-25px_rgb(0_0_0/0.5)] sm:p-7 sm:pb-16 sm:text-[14.5px]">
        <p className="flex justify-between font-bold">
          <span>12&nbsp;&nbsp;INT. DINER - NIGHT</span>
          <span>12</span>
        </p>
        <p className="mt-3">Neon flickers. LEO (60s) already has two cups poured. Maya slides onto a stool.</p>
        <p className="mt-4 pl-[38%]">LEO</p>
        <div className="pr-[10%] pl-[18%]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={applied ? "new" : "old"}
              {...swap}
              className={applied ? "bg-[linear-gradient(transparent_58%,var(--color-lime)_58%)]" : undefined}
            >
              {applied ? NEW_LINE : OLD_LINE}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative -mt-9 rounded-2xl bg-ink p-3 text-paper shadow-[0_30px_70px_-20px_rgb(0_0_0/0.75)] ring-1 ring-white/10">
        <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.06] px-3 py-2.5">
          <kbd className="rounded-md bg-white/10 px-1.5 py-0.5 font-script text-[11px] text-paper/70">⌘K</kbd>
          <span className="min-w-0 flex-1 truncate text-[14px]">
            {prompt || <span className="text-paper/35">Ask for an edit…</span>}
            {phase === "typing" && <Caret />}
          </span>
        </div>
        <div className="mt-3 min-h-[124px] px-1">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "typing" && (
              <motion.div key="ctx" {...swap} className="pt-1">
                <p className="font-script text-[11px] tracking-[0.14em] text-paper/45 uppercase">Context</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {["Logline", "Synopsis", "Tone", "Scene 12", "Whole script"].map((c) => (
                    <span key={c} className="rounded-full bg-white/[0.07] px-2.5 py-1 text-[12px] text-paper/75">
                      {c}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
            {phase === "thinking" && (
              <motion.div key="think" {...swap} className="space-y-2.5 pt-2">
                {[92, 70, 40].map((w) => (
                  <div
                    key={w}
                    className="shimmer h-3 rounded-full bg-white/[0.08]"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </motion.div>
            )}
            {(phase === "suggest" || phase === "accept") && (
              <motion.div key="diff" {...swap}>
                <p className="font-script text-[11px] tracking-[0.14em] text-paper/45 uppercase">
                  Suggested edit · Scene 12
                </p>
                <p className="mt-2 text-[13px] leading-snug text-paper/40 line-through decoration-orange/80">
                  {OLD_LINE}
                </p>
                <p className="mt-1.5 rounded-md bg-lime/12 px-2 py-1 text-[13px] text-lime">{NEW_LINE}</p>
                <div className="mt-3 flex gap-2">
                  <span
                    className={cx(
                      "rounded-full px-3 py-1.5 text-[12px] font-semibold transition-[transform,background-color] duration-150 ease-out-strong",
                      phase === "accept" ? "scale-[0.94] bg-paper text-ink" : "bg-lime text-ink",
                    )}
                  >
                    Accept ↵
                  </span>
                  <span className="rounded-full bg-white/[0.08] px-3 py-1.5 text-[12px] text-paper/65">
                    Discard esc
                  </span>
                </div>
              </motion.div>
            )}
            {phase === "done" && (
              <motion.div key="done" {...swap} className="flex items-start gap-2.5 pt-2 text-[13.5px] leading-snug text-paper/80">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-lime text-[11px] font-black text-ink">
                  ✓
                </span>
                Applied to scene 12. Nothing changed until you said so.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Shots beside the script */

const BESIDE = [
  {
    n: 12,
    h: "INT. DINER - NIGHT",
    lines: [88, 62],
    shots: [
      ["12A", "WS", "Diner, neon"],
      ["12B", "MS", "Leo and Maya"],
      ["12C", "Insert", "Coffee pours"],
    ],
  },
  {
    n: 13,
    h: "INT. STAIRWELL - CONT.",
    lines: [74],
    shots: [
      ["13A", "MS", "Maya descends"],
      ["13B", "Insert", "Door slams"],
    ],
  },
  {
    n: 14,
    h: "EXT. ALLEY - LATER",
    lines: [80, 46],
    shots: [
      ["14A", "CU", "Phone screen"],
      ["14B", "WS", "Maya runs"],
      ["14C", "POV", "Streetlight"],
      ["14D", "MCU", "Breathless"],
    ],
  },
];

export function BesideIllustration() {
  const [ref, live] = useLive<HTMLDivElement>();
  const [i, setI] = useState(0);
  const s = BESIDE[i];

  useSequence(live, async (sleep) => {
    await sleep(2400);
    setI((v) => (v + 1) % BESIDE.length);
  });

  return (
    <div ref={ref} className="grid h-full min-h-[236px] grid-cols-[1.2fr_1fr] gap-2.5 sm:gap-3">
      <div className="rounded-2xl bg-paper p-2.5 text-[#1b1b1b] sm:p-3.5">
        <LayoutGroup id="beside">
          {BESIDE.map((b, k) => (
            <button
              type="button"
              key={b.n}
              onClick={() => setI(k)}
              className="relative block w-full rounded-lg px-2.5 py-2 text-left"
            >
              {k === i && (
                <motion.span
                  layoutId="beside-active"
                  transition={SPRING}
                  className="absolute inset-0 rounded-lg bg-black/[0.07]"
                />
              )}
              <span className="relative flex items-center gap-2 font-script text-[11px] font-bold sm:text-[12px]">
                <span>{b.n}</span>
                <span className="truncate">{b.h}</span>
                {k === i && <Caret className="ml-auto h-[1.1em] translate-y-0 bg-orange" />}
              </span>
              <span className="relative mt-1.5 block space-y-1">
                {b.lines.map((w, li) => (
                  <span key={li} className="block h-1.5 rounded-full bg-black/15" style={{ width: `${w}%` }} />
                ))}
              </span>
            </button>
          ))}
        </LayoutGroup>
      </div>
      <div className="flex flex-col rounded-2xl bg-ink p-2.5 text-paper sm:p-3">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={s.n} {...swap} className="flex-1">
            <p className="text-[12px] font-semibold">
              Scene {s.n} <span className="font-normal text-paper/45">· {s.shots.length} shots</span>
            </p>
            <ul className="mt-2.5 space-y-1">
              {s.shots.map(([label, size, desc]) => (
                <li key={label} className="flex items-center gap-2 rounded-md bg-white/[0.06] px-2 py-1.5 text-[11.5px]">
                  <b className="w-7 shrink-0 font-black">{label}</b>
                  <span className="hidden w-10 shrink-0 font-script text-paper/55 sm:inline">{size}</span>
                  <span className="truncate text-paper/70">{desc}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
        <span className="mt-2.5 rounded-lg border border-dashed border-white/20 py-1.5 text-center text-[11.5px] text-paper/55">
          + Add shot
        </span>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Reference frames */

const formatBytes = (b: number) =>
  b >= 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1e3))} KB`;

type Shrunk = { url: string; before: number; after: number; w: number; h: number };

export function FramesIllustration() {
  const [result, setResult] = useState<Shrunk | null>(null);
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hovering, setHovering] = useState(false);
  const urlRef = useRef<string | null>(null);

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  async function shrink(file: File) {
    if (!file.type.startsWith("image/")) return;
    setBusy(true);
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
      const w = Math.round(bitmap.width * scale);
      const h = Math.round(bitmap.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")?.drawImage(bitmap, 0, 0, w, h);
      bitmap.close();
      const encode = (type: string, quality: number) =>
        new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
      let blob = await encode("image/webp", 0.82);
      if (!blob || blob.type !== "image/webp") blob = await encode("image/jpeg", 0.85);
      if (!blob) return;
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = URL.createObjectURL(blob);
      setResult({ url: urlRef.current, before: file.size, after: blob.size, w, h });
    } catch {
      // Not a decodable image.
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (!hovering) return;
    const onPaste = (e: ClipboardEvent) => {
      const file = Array.from(e.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"));
      if (file) shrink(file);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [hovering]);

  return (
    <div className="flex h-full flex-col gap-3">
      <label
        onPointerEnter={() => setHovering(true)}
        onPointerLeave={() => setHovering(false)}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          const file = e.dataTransfer.files[0];
          if (file) shrink(file);
        }}
        className={cx(
          "relative block aspect-[16/10] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed transition-[border-color,transform] duration-200 ease-out-strong has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink",
          drag ? "scale-[0.98] border-ink" : "border-ink/30 hover:border-ink/70",
        )}
      >
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) shrink(file);
            e.target.value = "";
          }}
        />
        {result ? (
          <Image
            src={result.url}
            alt="Your reference frame, shrunk in the browser"
            fill
            unoptimized
            className="object-cover"
          />
        ) : (
          <StoryboardFrame />
        )}
        <span className="absolute bottom-2 left-2 rounded-full bg-ink px-2.5 py-1 font-script text-[11px] text-paper">
          {busy ? "Shrinking…" : result ? `${formatBytes(result.before)} → ${formatBytes(result.after)}` : "Drop, paste or click"}
        </span>
      </label>
      <p className="font-script text-[11.5px] leading-snug text-ink/70">
        {result
          ? `${result.w}×${result.h}, ready for s3://your-bucket. Nothing left this page.`
          : "4.8 MB → 310 KB, then straight to s3://your-bucket"}
      </p>
    </div>
  );
}

function StoryboardFrame() {
  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
      <rect width="160" height="100" fill="#141a33" />
      <circle cx="124" cy="24" r="10" fill="#f3eee4" />
      <g fill="#222a4a">
        <rect x="0" y="46" width="22" height="54" />
        <rect x="20" y="34" width="18" height="66" />
        <rect x="40" y="52" width="26" height="48" />
        <rect x="90" y="42" width="22" height="58" />
        <rect x="112" y="56" width="26" height="44" />
        <rect x="138" y="38" width="22" height="62" />
      </g>
      <g fill="#ffc62b">
        <rect x="5" y="52" width="3" height="4" />
        <rect x="13" y="60" width="3" height="4" />
        <rect x="25" y="40" width="3" height="4" />
        <rect x="31" y="48" width="3" height="4" />
        <rect x="25" y="62" width="3" height="4" />
        <rect x="46" y="58" width="3" height="4" />
        <rect x="56" y="66" width="3" height="4" />
        <rect x="96" y="48" width="3" height="4" />
        <rect x="104" y="62" width="3" height="4" />
        <rect x="118" y="62" width="3" height="4" />
        <rect x="143" y="44" width="3" height="4" />
        <rect x="151" y="56" width="3" height="4" />
      </g>
      <rect x="128" y="62" width="3" height="4" fill="#222a4a" stroke="#4f8dff" strokeWidth="0.6" />
      <g stroke="#9db8ff" strokeOpacity="0.35" strokeWidth="0.7" strokeLinecap="round">
        {[8, 30, 52, 74, 96, 118, 140].map((x, i) => (
          <line key={x} x1={x + (i % 2) * 6} y1={6 + (i % 3) * 9} x2={x - 4 + (i % 2) * 6} y2={18 + (i % 3) * 9} />
        ))}
      </g>
      <rect x="0" y="80" width="160" height="20" fill="#0a0d1a" />
      <g fill="#0a0d1a">
        <circle cx="74" cy="64" r="4.2" />
        <path d="M68.5 70.5C70 68.6 78 68.6 79.5 70.5L81.5 81H66.5Z" />
      </g>
      <rect x="6" y="6" width="30" height="10" rx="2" fill="#0a0d1a" fillOpacity="0.75" />
      <text x="21" y="13.2" textAnchor="middle" fontSize="5.5" fill="#f3eee4" fontFamily="var(--font-courier)">
        11B · MCU
      </text>
    </svg>
  );
}

/* ---------------------------------------------------------------- CSV */

const CSV_ROWS = [
  ["12A", "WS", "Diner, neon through rain"],
  ["12B", "MS", "Leo and Maya at the counter"],
  ["12C", "Insert", "Coffee pours"],
  ["13A", "MS", "Maya descends, handheld"],
];

export function CsvIllustration() {
  const [done, setDone] = useState(false);

  function download() {
    const csv = [
      "Shot,Scene,Size,Description",
      ...CSV_ROWS.map(([shot, size, desc]) => `${shot},${shot.slice(0, 2)},${size},"${desc}"`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "midnight-diner-shots.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  }

  const cols = "grid grid-cols-[1.5rem_2.4rem_3rem_1fr]";

  return (
    <div className="flex h-full flex-col">
      <div className="overflow-hidden rounded-xl border border-ink/20 bg-white/55 font-script text-[11px]">
        <div className={cx(cols, "border-b border-ink/15 bg-ink/[0.07] text-center text-ink/50")}>
          <span />
          <span>A</span>
          <span>B</span>
          <span>C</span>
        </div>
        {[["Shot", "Size", "Description"], ...CSV_ROWS].map((row, r) => (
          <div key={row[0]} className={cx(cols, "border-b border-ink/10 last:border-0")}>
            <span className="border-r border-ink/10 bg-ink/[0.04] py-1 text-center text-ink/45">{r + 1}</span>
            {row.map((cell, c) => (
              <span
                key={c}
                className={cx("truncate border-r border-ink/10 px-1.5 py-1 last:border-0", r === 0 && "font-bold")}
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={download}
        className="mt-4 flex h-10 items-center gap-2 self-start rounded-full bg-ink px-4 text-[13px] font-semibold text-lime transition-transform duration-150 ease-out-strong active:scale-[0.97]"
      >
        <span className="relative grid">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={done ? "done" : "idle"} {...swap}>
              {done ? "Downloaded ✓" : "Download a sample ↓"}
            </motion.span>
          </AnimatePresence>
        </span>
      </button>
    </div>
  );
}
