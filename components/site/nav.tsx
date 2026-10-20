"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";

import { setScrollLocked } from "@/lib/scroll-lock";
import { GITHUB_URL, cx } from "@/lib/site";

import { GitHubIcon } from "./github-icon";
import { LogoTile, Wordmark } from "./logo";

const LINKS = [
  { href: "/#product", label: "Product" },
  { href: "/#features", label: "Features" },
  { href: "/articles", label: "Articles" },
  { href: "/#setup", label: "Setup" },
];

const EASE = [0.23, 1, 0.32, 1] as const;

export function Nav() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const pathname = usePathname();

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    setScrollLocked(true);

    const background = document.querySelectorAll("main, footer");
    background.forEach((node) => {
      (node as HTMLElement).inert = true;
    });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      setScrollLocked(false);
      background.forEach((node) => {
        (node as HTMLElement).inert = false;
      });
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="drop-in pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 [animation-delay:150ms]">
        <nav aria-label="Main" className="pointer-events-auto flex items-center">
          <div className="relative flex h-11 items-center rounded-l-[13px] bg-[#232323] pr-1 pl-1.5 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.7)]">
            {pathname === "/" ? (
              <a
                href="#top"
                aria-label="Shotlist, back to top"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg pr-2 transition-opacity duration-200 hover:opacity-80 sm:pr-3"
              >
                <LogoTile className="size-8" />
                <Wordmark className="hidden h-[15px] text-paper sm:block" title="" />
              </a>
            ) : (
              <Link
                href="/"
                aria-label="Shotlist, back to top"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-lg pr-2 transition-opacity duration-200 hover:opacity-80 sm:pr-3"
              >
                <LogoTile className="size-8" />
                <Wordmark className="hidden h-[15px] text-paper sm:block" title="" />
              </Link>
            )}
            <ul className="hidden items-center md:flex">
              {LINKS.map((link) => {
                const current = link.href === "/articles" && pathname.startsWith("/articles");
                const className = cx(
                  "block rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-200",
                  current ? "text-paper" : "text-paper/70 hover:text-paper",
                );
                return (
                  <li key={link.href}>
                    {link.href === "/articles" ? (
                      <Link href={link.href} className={className} aria-current={current ? "page" : undefined}>
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className={className}>
                        {link.label}
                      </a>
                    )}
                  </li>
                );
              })}
            </ul>
            <button
              type="button"
              className="grid size-11 place-items-center rounded-lg text-paper md:hidden"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <MenuIcon open={open} />
            </button>
            <svg
              aria-hidden
              viewBox="0 0 16 44"
              className="absolute top-0 left-full h-11 w-4"
              preserveAspectRatio="none"
            >
              <path
                d="M0 0H1.6C3.5 0 5.2 1.1 6.1 2.8L15.2 19.4C16.1 21 16.1 23 15.2 24.6L6.1 41.2C5.2 42.9 3.5 44 1.6 44H0Z"
                fill="#232323"
              />
            </svg>
          </div>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="ml-[1.6rem] flex h-11 shrink-0 items-center gap-2 rounded-full bg-lime px-4 text-[13px] font-semibold text-ink transition-transform duration-150 ease-out-strong hover:scale-[1.03] active:scale-[0.97] sm:px-5"
          >
            <GitHubIcon className="size-4" />
            Get the code
          </a>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pt-28 pb-10 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
          >
            <ul className="border-t border-paper/10">
              {LINKS.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.06 + index * 0.05, ease: EASE }}
                  className="border-b border-paper/10"
                >
                  {link.href === "/articles" ? (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={pathname.startsWith("/articles") ? "page" : undefined}
                      className="flex items-start gap-4 py-5"
                    >
                      <span className="w-7 pt-3 font-script text-[13px] text-paper/35">0{index + 1}</span>
                      <span className="type-display text-[clamp(3rem,13vw,4.75rem)] leading-[0.9]">
                        {link.label}
                      </span>
                    </Link>
                  ) : (
                    <a href={link.href} onClick={() => setOpen(false)} className="flex items-start gap-4 py-5">
                      <span className="w-7 pt-3 font-script text-[13px] text-paper/35">0{index + 1}</span>
                      <span className="type-display text-[clamp(3rem,13vw,4.75rem)] leading-[0.9]">
                        {link.label}
                      </span>
                    </a>
                  )}
                </motion.li>
              ))}
            </ul>
            <p className="mt-auto max-w-[18rem] text-[15px] leading-snug text-paper/45">
              A screenplay editor and a shot list that actually talk to each other.
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-3.5 w-[18px]" aria-hidden>
      <span
        className={cx(
          "absolute inset-x-0 top-0 h-[1.5px] rounded-full bg-current transition-transform duration-300 ease-out-strong",
          open && "translate-y-[6px] rotate-45",
        )}
      />
      <span
        className={cx(
          "absolute inset-x-0 top-[6px] h-[1.5px] rounded-full bg-current transition-opacity duration-200",
          open && "opacity-0",
        )}
      />
      <span
        className={cx(
          "absolute inset-x-0 top-3 h-[1.5px] rounded-full bg-current transition-transform duration-300 ease-out-strong",
          open && "-translate-y-[6px] -rotate-45",
        )}
      />
    </span>
  );
}
