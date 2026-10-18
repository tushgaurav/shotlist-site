import { GITHUB_URL } from "@/lib/site";

import { LogoTile, Wordmark } from "./logo";

const LINKS = [
  { href: "#product", label: "Product" },
  { href: "#features", label: "Features" },
  { href: "#roadmap", label: "Roadmap" },
  { href: "#setup", label: "Setup" },
];

export function Nav() {
  return (
    <header className="drop-in pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 [animation-delay:150ms]">
      <nav aria-label="Main" className="pointer-events-auto flex items-center">
        <div className="relative flex h-11 items-center rounded-l-[13px] bg-[#232323] pr-1 pl-1.5 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.7)]">
          <a
            href="#top"
            aria-label="Shotlist, back to top"
            className="flex items-center gap-2.5 rounded-lg pr-3 transition-opacity duration-200 hover:opacity-80"
          >
            <LogoTile className="size-8" />
            <Wordmark className="hidden h-[15px] text-paper sm:block" title="" />
          </a>
          <ul className="hidden items-center md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-md px-3 py-2 text-[13px] font-medium text-paper/70 transition-colors duration-200 hover:text-paper"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
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
          className="ml-[1.6rem] flex h-11 items-center rounded-full bg-lime px-5 text-[13px] font-semibold text-ink transition-transform duration-150 ease-out-strong hover:scale-[1.03] active:scale-[0.97]"
        >
          Get the code
        </a>
      </nav>
    </header>
  );
}
