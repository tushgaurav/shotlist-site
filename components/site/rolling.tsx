import { cx } from "@/lib/site";

import { Reveal, SlateLabel, SplitHeading } from "./reveal";
import { Glyph, type ShapeKind } from "./shapes";
import { Terminal } from "./terminal";

const NEEDS: Array<{ name: string; note: React.ReactNode; required: boolean; glyph: ShapeKind; color: string }> = [
  { name: "Node 22+", note: "Runs the app.", required: true, glyph: "circle", color: "text-violet" },
  { name: "Postgres", note: "Holds your projects.", required: true, glyph: "square", color: "text-green" },
  {
    name: "S3 bucket",
    note: "Only needed for shot images.",
    required: false,
    glyph: "tag",
    color: "text-orange",
  },
  {
    name: "OPENROUTER_API_KEY",
    note: (
      <>
        Turns on AI writing. Get one at{" "}
        <a
          href="https://openrouter.ai/keys"
          target="_blank"
          rel="noreferrer"
          className="text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:decoration-lime"
        >
          openrouter.ai/keys
        </a>
        .
      </>
    ),
    required: false,
    glyph: "square",
    color: "text-yellow",
  },
];

export function Rolling() {
  return (
    <section id="setup" className="px-4 py-[clamp(3.5rem,7vw,6.5rem)] md:px-8">
      <div className="mx-auto grid max-w-[1320px] gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <SlateLabel scene="05">Rolling</SlateLabel>
          <SplitHeading
            lines={["Roll your", "own."]}
            className="type-display mt-7 text-[clamp(2.8rem,6.8vw,7.5rem)] leading-[0.88]"
          />
          <Reveal delay={0.1} className="mt-8 max-w-[28rem] text-[clamp(1.05rem,1.25vw,1.2rem)] leading-relaxed text-paper/65">
            Shotlist is open source and runs wherever you run Node. Five commands and you&rsquo;re writing.
          </Reveal>
          <ul className="mt-10 border-t border-paper/10">
            {NEEDS.map((need, i) => (
              <Reveal as="li" key={need.name} delay={0.05 * i} className="flex items-start gap-4 border-b border-paper/10 py-4">
                <Glyph kind={need.glyph} className={cx("mt-1 h-3.5", need.color)} />
                <div className="min-w-0 flex-1">
                  <p className="font-script text-[14px] break-all text-paper">{need.name}</p>
                  <p className="mt-0.5 text-[14px] text-paper/55">{need.note}</p>
                </div>
                <span
                  className={cx(
                    "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                    need.required ? "bg-paper text-ink" : "bg-white/[0.07] text-paper/60",
                  )}
                >
                  {need.required ? "Required" : "Optional"}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center lg:pt-24">
          <Reveal blur={false}>
            <Terminal />
          </Reveal>
          <Reveal delay={0.1} className="mt-6 grid gap-4 text-[14.5px] leading-relaxed text-paper/60 sm:grid-cols-2">
            <p>
              Open localhost:3000 and create your account. Then set{" "}
              <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-script text-[0.92em] text-paper">
                DISABLE_SIGNUP=true
              </code>{" "}
              so nobody else can.
            </p>
            <p>
              <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-script text-[0.92em] text-paper">npm test</code>{" "}
              runs the Vitest suite and{" "}
              <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-script text-[0.92em] text-paper">
                npm run typecheck
              </code>{" "}
              runs the type checker.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
