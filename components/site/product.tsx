import { Demo } from "./demo";
import { Reveal, SplitHeading } from "./reveal";

export function Product() {
  return (
    <section id="product" className="px-3 py-[clamp(5rem,10vw,9rem)] md:px-6">
      <div className="mx-auto max-w-[1320px]">
        <div className="px-2 md:px-4">
          <SplitHeading
            lines={["Shots that stay", "with their scene."]}
            className="type-display text-[clamp(2.7rem,8.2vw,9.25rem)] leading-[0.95]"
          />
          <Reveal
            delay={0.15}
            className="mt-10 max-w-[30rem] text-[clamp(1.05rem,1.25vw,1.2rem)] leading-relaxed text-paper/60 lg:mt-12 lg:ml-auto"
          >
            Every shot is pinned to its scene by a permanent ID. Reorder and rewrite all you want. When a scene changes,
            its shots are flagged so you know to check them.
          </Reveal>
        </div>
        <Reveal blur={false} className="mt-14 lg:mt-20">
          <Demo />
        </Reveal>
      </div>
    </section>
  );
}
