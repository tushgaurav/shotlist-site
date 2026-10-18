import { Demo } from "./demo";
import { Reveal, SlateLabel, SplitHeading } from "./reveal";

export function Product() {
  return (
    <section id="product" className="relative px-3 pb-[clamp(3.5rem,7vw,6.5rem)] md:px-6">
      <div className="mx-auto max-w-[1320px]">
        <div className="px-2 pb-12 md:px-4 lg:pb-16">
          <SlateLabel scene="02">The fix</SlateLabel>
          <SplitHeading
            lines={["Shots that stay", "with their scene."]}
            className="type-display mt-7 text-[clamp(2.7rem,8.2vw,9.25rem)] leading-[0.88]"
          />
          <div className="mt-10 grid items-end gap-6 lg:mt-12 lg:grid-cols-12">
            <Reveal
              delay={0.15}
              className="max-w-[32rem] text-[clamp(1.05rem,1.25vw,1.2rem)] leading-relaxed text-paper/65 lg:col-span-5 lg:col-start-8"
            >
              Shotlist pins every shot to its scene with a{" "}
              <span className="text-paper">permanent ID</span>. Renumber, rename, cut and paste all
              you want. When a scene&rsquo;s text changes, its shots get a{" "}
              <span className="rounded-full bg-orange px-2 py-0.5 text-[0.85em] font-semibold whitespace-nowrap text-ink">
                scene changed
              </span>{" "}
              badge so you know to check them.
            </Reveal>
            <Reveal
              delay={0.25}
              className="font-script text-[15px] text-lime lg:col-span-6 lg:col-start-1 lg:row-start-1 lg:pb-1"
            >
              Go on, try to break it. ↓
            </Reveal>
          </div>
        </div>
        <Reveal blur={false}>
          <Demo />
        </Reveal>
      </div>
    </section>
  );
}
