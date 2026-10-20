export const CATEGORIES = ["Shots", "Camera", "Light"] as const;

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
    })
  | {
      kind: "photo";
      ground: "ink" | "paper";
      src: string;
      alt: string;
      credit: string;
      creditHref: string;
      focus: string;
    };

export type ArticleBlock = { kind: "h2"; text: string } | { kind: "p"; text: string };

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
  body: ArticleBlock[];
};

const NOOR = { name: "Noor Alami", role: "DP", avatar: "blue" } as const;

export const ARTICLES: Article[] = [
  {
    slug: "what-shots-are-called",
    title: "What the shots are called",
    excerpt:
      "How much of a person is in the frame, from a speck in a field to an eye. Then the shots that name a job, not a size.",
    category: "Shots",
    author: NOOR,
    published: "2026-10-16",
    minutes: 4,
    cover: {
      kind: "photo",
      ground: "ink",
      src: "https://images.pexels.com/photos/31329890/pexels-photo-31329890.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "A cinematographer films a seated actor on a dark stage, with a lamp and a small television between them.",
      credit: "Dominika Poláková",
      creditHref: "https://www.pexels.com/photo/creative-film-set-with-cinematographer-and-actor-31329890/",
      focus: "object-[center_42%]",
    },
    body: [
      {
        kind: "p",
        text: "Shot size is how much of a person the frame holds. It is judged against the body, not against the room and not in meters. A close-up of a face is a close-up whether you stood an arm’s length away or across the street with a long lens. The name follows the frame.",
      },
      {
        kind: "p",
        text: "On a shot list the short forms are EWS, WS, MLS, MS, MCU, CU, and ECU. Learn the picture each one makes and the abbreviation is enough to write the shot down.",
      },
      { kind: "h2", text: "Extreme wide shot" },
      {
        kind: "p",
        text: "The person is small. The place is the subject: a field, a street, a room that dwarfs them. Use it when the viewer needs to know where they are, or when they should feel lost in it. Also called an extreme long shot.",
      },
      { kind: "h2", text: "Wide shot" },
      {
        kind: "p",
        text: "The whole body, head to toe, with space around it. You can read where someone stands and how they hold themselves. Also called a long shot. A full shot is the tighter cousin: still head to toe, with less room, so the body fills more of the frame.",
      },
      { kind: "h2", text: "Medium long shot" },
      {
        kind: "p",
        text: "From about the knees up. Hands, stance, and face are all available. Westerns framed it this way so the holster stayed in the picture, which is why you will also hear it called a cowboy shot.",
      },
      { kind: "h2", text: "Medium shot" },
      {
        kind: "p",
        text: "Waist up. This is the working size for a person doing something with their hands while you still see the face. A conversation can live here when the table, the desk, or the thing between two people belongs in the shot.",
      },
      { kind: "h2", text: "Medium close-up" },
      {
        kind: "p",
        text: "Chest up. The usual size for dialogue, and for someone talking to a camera. Expression leads. If their hands come up, the gesture is still in frame.",
      },
      { kind: "h2", text: "Close-up" },
      {
        kind: "p",
        text: "The face. The room drops away. Use it when the line, or the reaction to the line, is the point of the shot. A close-up of an object is the same idea: the thing fills the frame and the surroundings go.",
      },
      { kind: "h2", text: "Extreme close-up" },
      {
        kind: "p",
        text: "A detail. An eye, a mouth, a hand on a latch, the numbers on a phone. Context is gone on purpose. If the viewer cannot tell what they are looking at, you have gone closer than the shot can carry.",
      },
      {
        kind: "p",
        text: "Those seven are sizes. The next names can be any size. They describe the job of the shot.",
      },
      { kind: "h2", text: "Two-shot" },
      {
        kind: "p",
        text: "Two people in one frame. Wide, medium, or close, the point is that you see both of them, and the space between them, at the same time. A two-shot is how a scene shows a relationship without cutting.",
      },
      { kind: "h2", text: "Over-the-shoulder" },
      {
        kind: "p",
        text: "The camera sits behind one person and looks at the other. A shoulder and the back of a head sit in the foreground. The other person’s face is the subject. Written OTS. This is the ordinary way to shoot a conversation so the viewer never loses track of who is talking to whom. Shoot it from both sides and you can cut between them.",
      },
      { kind: "h2", text: "Point of view" },
      {
        kind: "p",
        text: "The camera is where that person’s eyes are. The shot shows what they see. A point-of-view shot usually needs the face first, or just after, so the viewer knows whose eyes they borrowed. Written POV.",
      },
      { kind: "h2", text: "Insert" },
      {
        kind: "p",
        text: "A close shot of an object that belongs to the action already underway. The page being turned. The key going into the lock. The message on the phone. Cut it in and the hands make sense.",
      },
      {
        kind: "p",
        text: "A cutaway is the neighbor people mix up with an insert. A cutaway leaves the action for something nearby: a clock, a listener, a dog in the doorway. An insert stays on the thing the scene is already doing.",
      },
      { kind: "h2", text: "Establishing shot" },
      {
        kind: "p",
        text: "A shot whose job is to say where the scene is, usually before you move closer. Most establishing shots are wide: a building, a street, the whole room. The name is the job, so a close shot of a sign can establish a place too.",
      },
    ],
  },
  {
    slug: "what-angles-are-called",
    title: "What the angles are called",
    excerpt:
      "Where the camera sits, separate from how close it is. Eye level, high, low, overhead, and a horizon that leans.",
    category: "Shots",
    author: NOOR,
    published: "2026-10-09",
    minutes: 2,
    cover: {
      kind: "photo",
      ground: "ink",
      src: "https://images.pexels.com/photos/23512331/pexels-photo-23512331.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "A low-angle photograph of a woman in a hat, with a glass skyscraper rising behind her.",
      credit: "Vika Glitter",
      creditHref: "https://www.pexels.com/photo/low-angle-shot-of-a-woman-standing-in-front-of-a-skyscraper-23512331/",
      focus: "object-[center_36%]",
    },
    body: [
      {
        kind: "p",
        text: "Angle is the height of the camera and the way it looks. A close-up can be shot from eye level or from the floor. How close the camera is does not decide the angle. The picture at the top of this page is a low angle: the lens is down near the ground, and the building rises behind her.",
      },
      { kind: "h2", text: "Eye level" },
      {
        kind: "p",
        text: "The lens sits about as high as the subject’s eyes. This is the view of a person standing there, talking to them. A face at eye level has no chin looming and no forehead looming. Start here. Leave it when you have a reason.",
      },
      { kind: "h2", text: "High angle" },
      {
        kind: "p",
        text: "The camera is above the eyes, tilted down. You see the top of the head and more of the floor. The person takes up less of the place. A high angle is still a view a person could have, from a chair, a stair, or a standing height over someone seated.",
      },
      { kind: "h2", text: "Low angle" },
      {
        kind: "p",
        text: "The camera is below the eyes, tilted up. You see under the chin. The ceiling, or the sky, replaces the room behind them. The person occupies more of the frame, and whatever they stand in front of gets tall. Hold the camera at your chest, or at your hip, and point it up. That is the angle.",
      },
      { kind: "h2", text: "Overhead" },
      {
        kind: "p",
        text: "The camera points straight down. A high angle still has a horizon somewhere. An overhead shot is a plan of the table, the hands, the floor. Far enough away to read as a map, it is also called a bird’s-eye view.",
      },
      {
        kind: "p",
        text: "The opposite has a name too. A worm’s-eye view puts the lens on the ground, or near it, looking straight up. A low angle looks up at a person. A worm’s-eye view looks up at the world.",
      },
      { kind: "h2", text: "Dutch angle" },
      {
        kind: "p",
        text: "The horizon leans. Also called a canted angle. The room looks unsteady because the floor is no longer level in the frame. Use it when you want that unease on purpose. A tripod that was never leveled is the same picture, and it does not get the name as a compliment.",
      },
    ],
  },
  {
    slug: "what-moves-are-called",
    title: "What the moves are called",
    excerpt:
      "Pan and tilt turn the camera. A push and a slide carry it. A zoom stays where it is and magnifies.",
    category: "Camera",
    author: NOOR,
    published: "2026-10-02",
    minutes: 3,
    cover: {
      kind: "photo",
      ground: "ink",
      src: "https://images.pexels.com/photos/37259882/pexels-photo-37259882.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "A cinema camera on a wheeled dolly, sitting on a metal track against a sunlit wall.",
      credit: "ZvukodiN",
      creditHref: "https://www.pexels.com/photo/professional-camera-setup-on-dolly-in-studio-37259882/",
      focus: "object-[28%_62%]",
    },
    body: [
      {
        kind: "p",
        text: "A move is what the camera does during the shot. The names fall into two groups. Some turn the camera while it stays in one spot. Some carry the camera through the room. The rig in the photo is built for the second kind: the camera sits on a dolly, and the dolly rides a track, so the move can be straight and the same on the next take.",
      },
      { kind: "h2", text: "Pan" },
      {
        kind: "p",
        text: "The camera stays put and turns left or right. The same motion as turning your head. A pan reveals something that was off to the side, or follows a person walking across the frame. The horizon stays level. If it dips, you added a tilt by accident.",
      },
      { kind: "h2", text: "Tilt" },
      {
        kind: "p",
        text: "The camera stays put and tips up or down. The same motion as looking from someone’s shoes to their face. A tilt is vertical. A pan is horizontal. People do them together all the time. Name the one that is doing the work, or write both.",
      },
      { kind: "h2", text: "Push in" },
      {
        kind: "p",
        text: "The whole camera moves closer to the subject. Also called a dolly in, from the wheeled platform that carries it. You are walking into the room. Things near the lens grow faster than things far away, so the face and the doorway behind it change their relationship. A push out is the same move backward: the camera retreats, and the place comes back into the frame.",
      },
      { kind: "h2", text: "Slide" },
      {
        kind: "p",
        text: "The camera moves sideways and stays about the same distance from the subject. Also called a truck, or a crab. You travel along a table, or alongside someone walking. The subject stays a similar size. The background slips past.",
      },
      { kind: "h2", text: "Zoom" },
      {
        kind: "p",
        text: "The camera does not move. The lens changes its focal length, and the subject gets bigger or smaller. You are still standing in the same spot, so the perspective is the perspective of that spot. A zoom in magnifies. A zoom out shows more of the room from where you already are.",
      },
      { kind: "h2", text: "A push and a zoom" },
      {
        kind: "p",
        text: "Both can make a face larger. They make different pictures. Walk closer and the nose comes forward, the ears sit back, and the doorway behind them grows at a different rate than the face. Zoom from the doorway and you remain in the doorway. The face is magnified, and its shape is the shape it had from there.",
      },
      {
        kind: "p",
        text: "If the feeling you want is approach, move the camera. If the feeling you want is a harder look from where you already stand, zoom. Doing both at once, moving in while zooming out, or the reverse, keeps the subject the same size while the room stretches or squeezes. That one is called a dolly zoom.",
      },
      { kind: "h2", text: "What holds the camera" },
      {
        kind: "p",
        text: "A tripod, a gimbal, a slider, and a dolly are supports. They are ways of holding the camera. A pan on a tripod and a pan on a gimbal are the same move. The gimbal hides your footsteps. The tripod holds the horizon still. Handheld is a support too: your body. The shake is part of the picture, and the move underneath it is still a pan, a tilt, or a walk toward the subject.",
      },
    ],
  },
  {
    slug: "lens-numbers",
    title: "What the lens numbers mean",
    excerpt:
      "24, 35, 50, and 85. What each one does to a face and to a room, including the cameras on a phone.",
    category: "Camera",
    author: NOOR,
    published: "2026-09-25",
    minutes: 3,
    cover: {
      kind: "photo",
      ground: "ink",
      src: "https://images.pexels.com/photos/35912546/pexels-photo-35912546.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "Close-up of a camera lens barrel marked AF 40/2, with an aperture scale from 16 to 2.",
      credit: "Richard L",
      creditHref: "https://www.pexels.com/photo/close-up-of-af-40-2-camera-lens-in-studio-light-35912546/",
      focus: "object-center",
    },
    body: [
      {
        kind: "p",
        text: "The number on a lens is the focal length, in millimeters. A smaller number sees more of the room. A larger number sees less of it, and from the same spot the subject looks bigger. The lens in the photo is marked AF 40/2. The 40 is the focal length, a little wider than a 50. The 2 is how wide the aperture opens, which is about light, not about how much of the room you see.",
      },
      {
        kind: "p",
        text: "The four lenses below are described for a full-frame camera, and for the equivalent number a phone already uses when it labels its cameras. On a camera with a smaller sensor, the number engraved on the lens sees a tighter picture than this list. A 35 on that body behaves closer to a 50.",
      },
      { kind: "h2", text: "24mm" },
      {
        kind: "p",
        text: "A wide lens. A room fits. Stand close to a face and the nose comes forward, the ears drop back, and straight lines near the edge of the frame bend. Use a 24 when the place has to be in the shot. When the face is the subject, take a step back before you press record.",
      },
      { kind: "h2", text: "35mm" },
      {
        kind: "p",
        text: "Still wide, and a person can stand in it without the face stretching, as long as the lens is not pressed against them. This is the usual lens for a scene in a real room. You see the person, and you see the place they are in. A lot of documentary and a lot of phone video live near here, because the room is part of the story.",
      },
      { kind: "h2", text: "50mm" },
      {
        kind: "p",
        text: "A normal lens. From a few steps away, a face looks ordinary: the nose does not loom, and the background does not pile up behind the head. The room is still there, smaller than it was at 24. Of the four, this is the least surprising picture, which is why it is a good default when you do not yet know what you want.",
      },
      { kind: "h2", text: "85mm" },
      {
        kind: "p",
        text: "A short telephoto. You stand further back and the face fills the frame. The background gets larger relative to the face, and it falls out of focus more easily. Features sit flatter. Portraits get made here for that reason. In a small room you may not have the distance. If you cannot step back, you are no longer shooting an 85. You are shooting whatever wider lens still fits.",
      },
      { kind: "h2", text: "A phone" },
      {
        kind: "p",
        text: "The main camera on most phones is a wide lens, around 24 to 28mm. That is why a face held close to the phone stretches, and why someone talking to the camera shows a deep room behind them. The ultra-wide camera is wider again, often near 13mm. It is a 24 pushed further: more room, more bend at the edges.",
      },
      {
        kind: "p",
        text: "On a phone with more than one rear camera, the 2x or 3x camera is the closer match to a 50 or an 85. Switching to it changes the picture. Pinching the screen on the main camera only magnifies the wide picture you already have. If a face looks wrong, move your feet before you pinch.",
      },
    ],
  },
  {
    slug: "key-fill-backlight",
    title: "Key, fill, and backlight",
    excerpt:
      "Three jobs a light can have, and the difference between a shadow with a hard edge and a shadow that fades.",
    category: "Light",
    author: NOOR,
    published: "2026-09-18",
    minutes: 3,
    cover: {
      kind: "photo",
      ground: "ink",
      src: "https://images.pexels.com/photos/36697250/pexels-photo-36697250.jpeg?auto=compress&cs=tinysrgb&w=1600",
      alt: "A photographer holds a camera beside a large white softbox, photographing a seated man.",
      credit: "Vitaly Gariev",
      creditHref: "https://www.pexels.com/photo/indoor-portrait-photography-session-with-studio-lighting-36697250/",
      focus: "object-[center_45%]",
    },
    body: [
      {
        kind: "p",
        text: "A light has a job before it has a name brand. The key makes the shadow. The fill decides how dark that shadow stays. The backlight draws a line between the person and the wall. One window can do the first job alone. A white wall can do the second. You add the third when the person disappears into the background.",
      },
      { kind: "h2", text: "Key light" },
      {
        kind: "p",
        text: "The main light on the subject. A window, the sun, a lamp, a softbox. It decides where the shadow of the nose falls. If you can point at one source and say that is the light, that is the key.",
      },
      {
        kind: "p",
        text: "Put it to one side of the face, a little above the eyes. Then look at the nose. A useful check: the shadow falls down and toward the cheek, and it stops short of the lip. If the shadow crosses the mouth, or covers an eye, move the light. Moving the person is the second resort.",
      },
      { kind: "h2", text: "Fill light" },
      {
        kind: "p",
        text: "Light on the shadow side, weaker than the key. It can be a second lamp. It can be a white foam board, a white wall, or a shirt, bouncing the key back into the shadow. Fill does not draw a new direction. It sets how dark the shadow already is.",
      },
      {
        kind: "p",
        text: "No fill, and the shadow side of the face can go black. Fill that matches the key, and the face goes flat, because no shadow is left to explain the shape of it. Most faces want something in between. If you can still see the eye on the shadow side, you have enough.",
      },
      { kind: "h2", text: "Backlight" },
      {
        kind: "p",
        text: "A light from behind the subject, catching the edge of the hair and the shoulder. Also called a rim, or a hair light, when it is only on the hair. It separates a person from a wall that is the same brightness as they are. Dark hair against a dark curtain is the case that needs it.",
      },
      {
        kind: "p",
        text: "Keep it off the face. A backlight that spills around the cheek becomes a second key, and the nose shadow you just placed starts to fight it.",
      },
      { kind: "h2", text: "Hard light and soft light" },
      {
        kind: "p",
        text: "Hard light comes from a small source. Direct sun, a bare bulb, a tiny LED. The edge of the shadow is a line. You can see the shape of the nose in it.",
      },
      {
        kind: "p",
        text: "Soft light comes from a large source, close to the subject. A big window, an overcast sky, a softbox. The edge of the shadow fades instead of cutting. A window is soft because the window is large. The sun is hard because the sun, from here, is a small disc. The same lamp gets softer when you hang a large white cloth in front of it and move that cloth closer to the person. The white octagon in the photo is a soft key: it is big, and it sits close.",
      },
      { kind: "h2", text: "A room you already have" },
      {
        kind: "p",
        text: "Turn the person toward a window, a little off to one side, so the window is the key. Put anything white on the shadow side and the bounce is the fill. If their hair melts into the wall, move them off the wall, or put a small lamp behind them for the rim. Before you roll, look at the nose shadow once. That look tells you whether the key is in the right place.",
      },
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
