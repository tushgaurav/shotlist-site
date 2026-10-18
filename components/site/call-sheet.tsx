import { SPEC_URL } from "@/lib/site";

import { Wordmark } from "./logo";
import { Reveal, SlateLabel, SplitHeading } from "./reveal";
import { Shape } from "./shapes";

const SCHEDULE = [
  {
    sc: "21",
    set: "INT. VERSION HISTORY",
    desc: "Script versions and diffs. Save named drafts, compare any two, restore safely.",
    dn: "D",
    pgs: "2 4/8",
  },
  {
    sc: "22",
    set: "INT. PRODUCTION OFFICE",
    desc: "Shoot days and setups. Group shots into setups, order them, see time estimates.",
    dn: "D",
    pgs: "3/8",
  },
  {
    sc: "23",
    set: "INT. PRINT SHOP",
    desc: "PDF export, ready to hand out with the call.",
    dn: "N",
    pgs: "1/8",
  },
  {
    sc: "24",
    set: "EXT. ON SET",
    desc: "A phone-friendly on-set view for the floor.",
    dn: "D",
    pgs: "5/8",
  },
];

export function CallSheet() {
  return (
    <section id="roadmap" className="relative px-4 py-[clamp(4.5rem,9vw,8rem)] md:px-8">
      <div className="mx-auto grid max-w-[1320px] items-center gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
        <div>
          <SlateLabel scene="04">On the call sheet</SlateLabel>
          <SplitHeading
            lines={["What we're", "shooting next."]}
            className="type-display mt-7 text-[clamp(2.8rem,6vw,6.75rem)] leading-[0.88]"
          />
          <Reveal delay={0.1} className="mt-8 max-w-[26rem] text-[clamp(1.05rem,1.25vw,1.2rem)] leading-relaxed text-paper/65">
            Script versions and diffs, shoot days and setups, PDF export and a phone-friendly on-set view.
            The whole plan lives in{" "}
            <a
              href={SPEC_URL}
              target="_blank"
              rel="noreferrer"
              className="font-script text-paper underline decoration-paper/30 underline-offset-4 transition-colors hover:decoration-lime"
            >
              docs/spec.md
            </a>
            .
          </Reveal>
        </div>

        <Reveal blur={false} className="group relative mx-auto w-full max-w-[720px]">
          <div className="absolute -top-14 -right-6 hidden h-40 rotate-[14deg] sm:block" style={{ aspectRatio: 1 }}>
            <Shape kind="square" icon="reel" color="var(--color-yellow)" />
          </div>
          <div className="absolute -bottom-16 -left-10 hidden h-36 -rotate-[10deg] sm:block" style={{ aspectRatio: 1 }}>
            <Shape kind="circle" icon="megaphone" color="var(--color-blue)" />
          </div>

          <article className="relative -rotate-[2.2deg] rounded-[6px] bg-paper p-5 font-script text-[#1b1b1b] shadow-[0_60px_120px_-40px_rgb(0_0_0/0.95),0_0_0_1px_rgb(0_0_0/0.05)] transition-transform duration-700 ease-pop group-hover:-rotate-[0.6deg] sm:p-10">
            <header className="grid grid-cols-2 items-start gap-x-3 gap-y-3 border-b-2 border-[#1b1b1b] pb-5 text-[11px] leading-snug sm:grid-cols-[1fr_auto_1fr] sm:text-[12.5px]">
              <div>
                <Wordmark className="h-3.5 text-[#1b1b1b] sm:h-4" title="" />
                <p className="mt-3 whitespace-nowrap">
                  Prod. Shotlist v1
                  <br />
                  Office: GitHub
                </p>
              </div>
              <div className="text-right sm:text-center">
                <p className="text-[clamp(1.05rem,2.4vw,1.7rem)] font-bold tracking-[0.12em] whitespace-nowrap">CALL SHEET</p>
                <p className="mt-1">Day 02 of ∞</p>
              </div>
              <div className="col-span-2 flex flex-wrap gap-x-4 border-t border-dashed border-[#1b1b1b]/25 pt-3 sm:col-span-1 sm:block sm:border-0 sm:pt-0 sm:text-right">
                <p>
                  Crew call: <b>Soon</b>
                </p>
                <p>
                  Shoot call: <b>TBA</b>
                </p>
                <p>
                  Weather: <b>Clear</b>
                </p>
              </div>
            </header>

            <table className="mt-4 w-full text-left text-[11.5px] sm:text-[13px]">
              <thead>
                <tr className="border-b border-[#1b1b1b]/70 text-[10px] tracking-[0.14em] uppercase sm:text-[11px]">
                  <th className="py-2 pr-3 font-bold">Sc.</th>
                  <th className="py-2 font-bold">Set / Description</th>
                  <th className="px-2 py-2 text-center font-bold">D/N</th>
                  <th className="py-2 text-right font-bold">Pgs</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map((row, i) => (
                  <tr key={row.sc} className="border-b border-dashed border-[#1b1b1b]/25 align-top last:border-0">
                    <td className="py-3.5 pr-3 font-bold">{row.sc}</td>
                    <td className="py-3.5">
                      <p className="font-bold">
                        <span className={i === 0 ? "bg-[linear-gradient(transparent_55%,var(--color-lime)_55%)]" : undefined}>
                          {row.set}
                        </span>
                      </p>
                      <p className="mt-1 leading-snug text-[#1b1b1b]/70">{row.desc}</p>
                    </td>
                    <td className="px-2 py-3.5 text-center">{row.dn}</td>
                    <td className="py-3.5 text-right whitespace-nowrap">{row.pgs}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <footer className="mt-5 flex flex-wrap justify-between gap-2 border-t-2 border-[#1b1b1b] pt-4 text-[10.5px] sm:text-[12px]">
              <span>Notes: full plan in docs/spec.md</span>
              <span>1st AD: tushgaurav</span>
            </footer>

            <span
              aria-hidden
              className="absolute right-5 bottom-14 -rotate-[9deg] rounded-md border-[3px] border-orange px-2.5 py-0.5 font-sans text-[clamp(1rem,2vw,1.35rem)] font-black tracking-tight text-orange uppercase opacity-90 mix-blend-multiply sm:top-24 sm:right-8 sm:bottom-auto sm:rotate-[13deg]"
            >
              Up next
            </span>
            <svg aria-hidden viewBox="0 0 100 100" className="absolute right-[18%] bottom-4 size-24 opacity-[0.13] sm:size-28">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#5b3a1e" strokeWidth="5" />
              <circle cx="52" cy="48" r="37" fill="none" stroke="#5b3a1e" strokeWidth="2" strokeDasharray="60 18 30 12" />
            </svg>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
