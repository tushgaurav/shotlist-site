export const CATEGORIES = ["Screenplay", "Shot Lists", "On Set", "Workflow", "Product"] as const;

export type Category = (typeof CATEGORIES)[number];

export type AvatarColor = "orange" | "green" | "violet" | "blue" | "yellow" | "lime";

type CoverBase = {
  ground: "ink" | "paper";
  accent: string;
  note: string;
};

export type Cover =
  | (CoverBase & { kind: "slate"; mark: string; shape: "circle" | "square" })
  | (CoverBase & { kind: "clapper"; mark: string })
  | (CoverBase & { kind: "finder"; mark: string })
  | (CoverBase & {
      kind: "script";
      slugline: string;
      action: string;
      character: string;
      dialogue: string;
    });

export type ArticlePreview = {
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  author: { name: string; role: string; avatar: AvatarColor };
  published: string;
  cover: Cover;
};

export type Article = ArticlePreview & {
  minutes: number;
  paragraphs: string[];
};

const TUSH = { name: "tushgaurav", role: "Shotlist", avatar: "orange" } as const;
const LENA = { name: "Lena Voss", role: "1st AD", avatar: "green" } as const;
const ARUN = { name: "Arun Mehta", role: "Writer", avatar: "violet" } as const;
const NOOR = { name: "Noor Alami", role: "DP", avatar: "blue" } as const;

export const ARTICLES: Article[] = [
  {
    slug: "scene-number",
    title: "A scene number that survives the rewrite",
    excerpt:
      "The number in the margin moves. The scene should not. Pin every shot to an ID that stays put when the draft changes.",
    category: "Shot Lists",
    author: TUSH,
    published: "2026-03-18",
    minutes: 4,
    cover: {
      kind: "slate",
      ground: "paper",
      accent: "var(--color-orange)",
      note: "Scene id",
      mark: "12A",
      shape: "circle",
    },
    paragraphs: [
      "The useful thing about a scene is not the number printed in the margin. That number moves. What has to stay put is the identity of the scene, so every shot made for it can still find it after the draft changes.",
      "Shotlist pins each shot to a scene with an ID that is not reused and not renumbered. Drag scenes, split them, or fold two into one. The shots stay attached to the scene they were written for.",
      "When a scene’s text changes, its shots are flagged. Nothing is deleted and nothing is quietly rewritten. The flag is a note that the plan and the page have drifted, and that someone should look.",
      "That is the whole trick. The shot list stops being a copy of the script and starts being a record of decisions made about a scene.",
    ],
  },
  {
    slug: "slate-skips-i-and-o",
    title: "Why the slate skips I and O",
    excerpt:
      "12A, 12B, 12C. The letters a camera department already expects, minus the two that get misread on a slate.",
    category: "On Set",
    author: LENA,
    published: "2026-03-12",
    minutes: 3,
    cover: {
      kind: "clapper",
      ground: "ink",
      accent: "var(--color-green)",
      note: "Slate",
      mark: "12B",
    },
    paragraphs: [
      "Camera departments already have a way to name inserts and coverage that share a setup. 12A, 12B, 12C. The letters run in order, and two of them are left out.",
      "I and O get misread. On a slate, in a hurry, in a log written at 2 a.m., I becomes a 1 and O becomes a 0. So they are skipped. The next letter is the next letter a loader expects.",
      "A shot list that numbers like a spreadsheet makes the AD translate on set. The translation is where a shot gets called by the wrong name.",
      "Label them the way the slate will. The board, the script supervisor’s notes, and the files off the card then share one name for the same shot.",
    ],
  },
  {
    slug: "sluglines",
    title: "INT. and EXT. should type themselves",
    excerpt:
      "Enter and Tab move between elements. A line that starts INT. or EXT. is a slugline, in Courier, the way a script is read.",
    category: "Screenplay",
    author: ARUN,
    published: "2026-03-04",
    minutes: 3,
    cover: {
      kind: "script",
      ground: "paper",
      accent: "var(--color-violet)",
      note: "Courier",
      slugline: "INT. KITCHEN - NIGHT",
      action: "Maya sets the pages on the table.",
      character: "MAYA",
      dialogue: "It still matches.",
    },
    paragraphs: [
      "A screenplay is a form, not a document with styles painted on. Slugline, action, character, parenthetical, dialogue, transition. The keys that move you between those elements matter more than a toolbar.",
      "Enter and Tab do that move. A line that starts INT. or EXT. is picked up as a slugline while you type it. The page stays in Courier Prime, which is the face a script is actually read in.",
      "Formatting applied by hand drifts. Someone bolds a line, someone pastes from a doc, and the scene boundaries the shot list depends on get fuzzy. If the editor knows what a scene is, the plan can know it too.",
      "You should be thinking about the room, the time of day, and who is in it. Not about which style is selected.",
    ],
  },
  {
    slug: "beside-the-page",
    title: "The shot list that lives beside the page",
    excerpt:
      "Put the cursor in a scene and its shots are already there. No second window, and no question about which version the row is about.",
    category: "Workflow",
    author: TUSH,
    published: "2026-02-26",
    minutes: 3,
    cover: {
      kind: "finder",
      ground: "ink",
      accent: "var(--color-blue)",
      note: "Same scene",
      mark: "1:1",
    },
    paragraphs: [
      "The usual setup is two apps and a memory. The script is in one window. The breakdown is in another. You scroll one, then the other, and hope you are still in the same scene.",
      "Put the cursor in a scene and the shots for that scene are the ones on screen. Leave the scene and the list changes with you. There is no second document to keep in sync, because there is no second document.",
      "It is a small change in where your eyes go, and it removes the question that wastes the most time in prep: which version is this row about?",
      "The scene you are writing is the scene you are planning. That should be obvious on the page.",
    ],
  },
  {
    slug: "reference-frames",
    title: "Reference frames, stored with the shot",
    excerpt:
      "Drop, paste, or click. The frame is resized in the browser and written to your own bucket, next to the shot it describes.",
    category: "Shot Lists",
    author: NOOR,
    published: "2026-02-19",
    minutes: 4,
    cover: {
      kind: "slate",
      ground: "ink",
      accent: "var(--color-orange)",
      note: "Frame",
      mark: "14B",
      shape: "square",
    },
    paragraphs: [
      "A shot list without a frame is a sentence. Medium, over the shoulder, she looks left. Everyone on the call nods. Everyone is picturing a different frame.",
      "Drop an image, paste one, or click to add it. It is scaled down in the browser before it is stored, so a still from a 6K camera does not have to travel just to become a thumbnail. It lives in your own S3 bucket, next to the shot it is for.",
      "The frame is not a mood board floating in a chat. It is attached to 14B. When the scene is flagged because the dialogue changed, the frame is still there to check against the new line.",
      "Reference is part of the plan. It should travel with the plan, and it should stay in an account you control.",
    ],
  },
  {
    slug: "nothing-lands",
    title: "Nothing lands until you accept it",
    excerpt:
      "⌘K writes at the cursor, or drafts from a logline. The suggestion stays a suggestion until you keep it.",
    category: "Screenplay",
    author: ARUN,
    published: "2026-02-11",
    minutes: 3,
    cover: {
      kind: "finder",
      ground: "paper",
      accent: "var(--color-yellow)",
      note: "Accept",
      mark: "CMD",
    },
    paragraphs: [
      "⌘K writes at the cursor, or drafts from a logline. Both are useful. Both are easy to trust too quickly.",
      "The suggestion stays a suggestion. It does not replace the line, and it does not append itself to the scene, until you accept it. Decline it and the page is the page you had.",
      "That matters more on a rewrite than on a blank page. A model will happily smooth a line you meant to be awkward, or invent a prop that is not in the location. Acceptance is the moment a person decides the draft is still theirs.",
      "Use it to get a scene out of a standing start. Read what comes back. Keep the sentences you would have written anyway.",
    ],
  },
  {
    slug: "spreadsheets",
    title: "Spreadsheets do not survive a rewrite",
    excerpt:
      "Scene 12. Page 42. Those pointers are true on the day you typed them. A rewrite turns them into a rumor.",
    category: "Workflow",
    author: LENA,
    published: "2026-02-03",
    minutes: 4,
    cover: {
      kind: "clapper",
      ground: "paper",
      accent: "var(--color-lime)",
      note: "Stale",
      mark: "P.42",
    },
    paragraphs: [
      "A spreadsheet shot list is a list of pointers. Scene 12. Page 42. The kitchen argument. Those pointers are true on the day you typed them.",
      "Then the kitchen argument moves to the hallway, scene 12 becomes scene 9, and page 42 is a different scene entirely. The rows are still there. They now describe a script that no longer exists. Nobody deleted them, because they still look finished.",
      "The failure is quiet. You find it in the production meeting, when two people are talking about different scenes and both of them are reading from the same file.",
      "Attach the shot to the scene, not to the number the scene had on Tuesday. When the scene moves, the shot moves. When the scene changes, the shot asks to be checked.",
    ],
  },
  {
    slug: "what-the-ad-exports",
    title: "What the AD actually exports",
    excerpt:
      "Fountain for the script. CSV for the board. Both from the same plan, so the call sheet and the page still agree.",
    category: "On Set",
    author: NOOR,
    published: "2026-01-22",
    minutes: 3,
    cover: {
      kind: "slate",
      ground: "ink",
      accent: "var(--color-blue)",
      note: "Handoff",
      mark: "CSV",
      shape: "circle",
    },
    paragraphs: [
      "Prep produces two documents people trust. The script, in a form other tools can read. The board, in a form a spreadsheet or a call sheet can take.",
      "Fountain for the script. CSV for the shots. Both exported from the same plan, so the scene the AD is looking at and the shots under it were true at the same moment.",
      "Export is not a backup of your private notes. It is the handoff. If the handoff comes from two files that were reconciled by hand, the handoff is already old.",
      "Write once. Export the forms the day needs. Keep the plan in the place where a rewrite can still find it.",
    ],
  },
  {
    slug: "stale-tab",
    title: "An old tab should not get the last word",
    excerpt:
      "It keeps working when the network doesn’t, and it will not let an old tab overwrite the cut you just made.",
    category: "Product",
    author: TUSH,
    published: "2026-01-14",
    minutes: 3,
    cover: {
      kind: "finder",
      ground: "paper",
      accent: "var(--color-green)",
      note: "Refused",
      mark: "TAB",
    },
    paragraphs: [
      "Autosave is table stakes until it isn’t. The failure is specific: a tab left open on the train comes back online and writes this morning’s draft over the one you finished at the desk.",
      "Shotlist keeps working when the connection drops, and it refuses a save that is older than the one already stored. The stale tab does not win.",
      "You should not have to remember which window is the real one. The file should.",
      "A location with bad service is a normal day of prep, not an edge case. The page you wrote there has to come home intact, and it has to come home without clobbering the page someone else touched.",
    ],
  },
];

export function articlePreviews(): ArticlePreview[] {
  return ARTICLES.map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    author: article.author,
    published: article.published,
    cover: article.cover,
  }));
}

export function getArticle(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}

export function relatedArticles(slug: string, count = 3) {
  const current = getArticle(slug);
  if (!current) return [];
  const others = ARTICLES.filter((article) => article.slug !== slug);
  const same = others.filter((article) => article.category === current.category);
  const rest = others.filter((article) => article.category !== current.category);
  return [...same, ...rest].slice(0, count).map((article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    author: article.author,
    published: article.published,
    cover: article.cover,
  }));
}

export function formatArticleDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
}

export function authorInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 1).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}
