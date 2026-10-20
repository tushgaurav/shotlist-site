"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { MotionConfig } from "motion/react";
import { useEffect } from "react";

import { onScrollLock } from "@/lib/scroll-lock";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -24 } });
    const unlock = onScrollLock((locked) => {
      if (locked) lenis.stop();
      else lenis.start();
    });
    return () => {
      unlock();
      lenis.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
