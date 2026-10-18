"use client";

import { useEffect, useEffectEvent } from "react";

export type Sleep = (ms: number) => Promise<void>;

/**
 * Loops an async script while `active` is true. Leaving `active` aborts the
 * pending sleep, so the script stops mid-step and restarts from the top next time.
 */
export function useSequence(active: boolean, run: (sleep: Sleep) => Promise<void>) {
  const onRun = useEffectEvent(run);

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    const { signal } = controller;

    const sleep: Sleep = (ms) =>
      new Promise((resolve, reject) => {
        if (signal.aborted) return reject(signal.reason);
        const timer = setTimeout(resolve, ms);
        signal.addEventListener(
          "abort",
          () => {
            clearTimeout(timer);
            reject(signal.reason);
          },
          { once: true },
        );
      });

    (async () => {
      try {
        while (!signal.aborted) await onRun(sleep);
      } catch {
        // Aborted.
      }
    })();

    return () => controller.abort();
  }, [active]);
}
