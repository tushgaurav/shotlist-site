"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MotionConfig } from "motion/react";
import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -24 } });
    return () => lenis.destroy();
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
