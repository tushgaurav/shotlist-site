"use client";

import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { cx } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  className,
  style,
  delay = 0,
  blur = true,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  blur?: boolean;
  as?: "div" | "section" | "article" | "li" | "p";
}) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      style={style}
      initial={{ opacity: 0, transform: "translateY(28px)", ...(blur && { filter: "blur(8px)" }) }}
      whileInView={{
        opacity: 1,
        transform: "translateY(0px)",
        ...(blur && { filter: "blur(0px)" }),
        transitionEnd: { transform: "none", ...(blur && { filter: "none" }) },
      }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}

/** Masked word-by-word rise, used for section headlines. */
export function SplitHeading({
  lines,
  className,
  as = "h2",
}: {
  lines: string[];
  className?: string;
  as?: "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const Tag = as;
  let index = 0;

  return (
    <Tag ref={ref} className={className}>
      {lines.map((line) => (
        <span key={line} className="block">
          {line.split(" ").map((word, i) => {
            const delay = index++ * 0.055;
            return (
              <span key={`${word}-${i}`}>
                <span className="-mx-[0.06em] -mb-[0.12em] inline-block overflow-hidden px-[0.06em] pb-[0.12em] align-top">
                  <motion.span
                    className="inline-block origin-bottom-left"
                    initial={{ transform: "translateY(110%) rotate(6deg)" }}
                    animate={
                      inView ? { transform: "translateY(0%) rotate(0deg)", transitionEnd: { transform: "none" } } : undefined
                    }
                    transition={{ duration: 1, ease: EASE, delay }}
                  >
                    {word}
                  </motion.span>
                </span>
                {i < line.split(" ").length - 1 ? " " : null}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}

export function SlateLabel({
  scene,
  children,
  className,
}: {
  scene: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal
      className={cx(
        "inline-flex items-center gap-3 rounded-full border border-paper/15 py-1 pr-4 pl-1 font-script text-[12px] tracking-[0.14em] text-paper/70 uppercase",
        className,
      )}
    >
      <span className="rounded-full bg-paper px-2.5 py-1 leading-none font-bold text-ink">
        Sc. {scene}
      </span>
      {children}
    </Reveal>
  );
}
