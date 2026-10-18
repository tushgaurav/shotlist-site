import { Reveal, SlateLabel, SplitHeading } from "./reveal";
import { Terminal } from "./terminal";

const STACK = [
  "Next.js 16",
  "React 19",
  "TipTap",
  "Drizzle + Postgres",
  "Better Auth",
  "Tailwind 4 + shadcn/ui",
  "AI SDK + OpenRouter",
];

const linkClass = "text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:decoration-lime";

export function Rolling() {
  return (
    <section id="setup" className="px-5 py-[clamp(5rem,10vw,9rem)] md:px-10">
      <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SlateLabel scene="04">Rolling</SlateLabel>
          <SplitHeading
            lines={["Roll your", "own."]}
            className="type-display mt-7 text-[clamp(2.7rem,6.4vw,7rem)] leading-[0.95]"
          />
          <Reveal delay={0.1} className="mt-8 max-w-[26rem] text-[clamp(1.05rem,1.25vw,1.2rem)] leading-relaxed text-paper/60">
            Open source and self-hosted. You need Node 22+ and Postgres. S3 and an{" "}
            <a href="https://openrouter.ai/keys" target="_blank" rel="noreferrer" className={linkClass}>
              OpenRouter key
            </a>{" "}
            are optional.
          </Reveal>
        </div>

        <div>
          <Reveal blur={false}>
            <Terminal />
          </Reveal>
          <Reveal delay={0.1} className="mt-5 text-[14px] leading-relaxed text-paper/45">
            Once your account exists, set{" "}
            <code className="rounded bg-white/[0.07] px-1.5 py-0.5 font-script text-[0.92em] text-paper/80">
              DISABLE_SIGNUP=true
            </code>{" "}
            so nobody else can sign up.
          </Reveal>
        </div>
      </div>

      <Reveal className="mx-auto mt-[clamp(4rem,8vw,7rem)] flex max-w-[1320px] flex-wrap items-baseline gap-x-6 gap-y-2 border-t border-paper/10 pt-6 text-[13px] text-paper/40">
        <span className="font-script text-[12px] tracking-[0.14em] uppercase">Built with</span>
        {STACK.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </Reveal>
    </section>
  );
}
