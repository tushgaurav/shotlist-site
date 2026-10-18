import { Reveal, SplitHeading } from "./reveal";

const CREDITS = [
  ["Directed by", "tushgaurav"],
  ["Framework", "Next.js 16"],
  ["Starring", "React 19"],
  ["Screenplay editor", "TipTap"],
  ["Continuity", "Drizzle + Postgres"],
  ["Security", "Better Auth"],
  ["Wardrobe", "Tailwind 4 + shadcn/ui"],
  ["Props department", "S3"],
  ["Script doctor", "AI SDK + OpenRouter"],
];

export function Credits() {
  return (
    <section aria-label="Built with" className="px-4 py-[clamp(4.5rem,9vw,8rem)]">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal className="font-script text-[12px] tracking-[0.3em] text-paper/45 uppercase">Built with</Reveal>
        <SplitHeading
          lines={["Roll credits."]}
          className="type-display mt-5 text-[clamp(2.6rem,6vw,6rem)] leading-[0.9]"
        />
        <dl className="mt-16 flex flex-col gap-5 sm:gap-6">
          {CREDITS.map(([role, name], i) => (
            <Reveal
              key={role}
              delay={(i % 3) * 0.05}
              className="grid grid-cols-2 items-baseline gap-x-5 sm:gap-x-8"
            >
              <dt className="flex items-center justify-end gap-5 text-right font-script text-[11px] tracking-[0.2em] text-paper/45 uppercase sm:gap-8 sm:text-[13px]">
                {role}
                <span aria-hidden className="size-1 shrink-0 rounded-full bg-paper/25" />
              </dt>
              <dd className="text-left text-[clamp(1.15rem,2.4vw,2rem)] leading-tight font-extrabold tracking-[-0.03em] [font-stretch:108%]">
                {name}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
