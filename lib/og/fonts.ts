import { readFile } from "node:fs/promises";
import { join } from "node:path";

const dir = join(process.cwd(), "assets/fonts");

export const ogFonts = [
  {
    name: "Mona Sans",
    data: await readFile(join(dir, "MonaSans-ExtraBold.ttf")),
    weight: 800 as const,
    style: "normal" as const,
  },
  {
    name: "Mona Sans",
    data: await readFile(join(dir, "MonaSans-Medium.ttf")),
    weight: 500 as const,
    style: "normal" as const,
  },
  {
    name: "Courier Prime",
    data: await readFile(join(dir, "CourierPrime-Regular.ttf")),
    weight: 400 as const,
    style: "normal" as const,
  },
  {
    name: "Courier Prime",
    data: await readFile(join(dir, "CourierPrime-Bold.ttf")),
    weight: 700 as const,
    style: "normal" as const,
  },
];
