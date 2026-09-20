import "server-only";

import { createHash, randomUUID } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "kv_actor";
const adjectives = [
  "Curious",
  "Quiet",
  "Late-night",
  "Sunny",
  "Wandering",
  "Hungry",
  "Brave",
  "Gentle",
  "Loyal",
  "Bright",
  "Humble",
  "Restless",
  "Thoughtful",
  "Playful",
  "Patient",
  "Daring",
  "Misty",
  "Golden",
  "Kind",
  "Clever",
  "Dreaming",
  "Steady",
  "Open-hearted",
  "Moonlit",
];
const nouns = [
  "Tteokbokki",
  "Hanok",
  "Kimchi",
  "Haetae",
  "Magpie",
  "Tiger",
  "Onggi",
  "Han River",
  "Gat",
  "Bibimbap",
  "Pansori",
  "Turtle Ship",
  "Ginkgo",
  "Persimmon",
  "Namsan",
  "Moon Jar",
  "Bojagi",
  "Dol Hareubang",
  "Jangdokdae",
  "Dokkaebi",
  "Sotdae",
  "Bukhansan",
  "Dalgona",
  "Cheonggyecheon",
];

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function getActorId(): Promise<string | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  return value && isUuid(value) ? value : null;
}

export async function getOrCreateActorId(): Promise<string> {
  const store = await cookies();
  const current = store.get(COOKIE)?.value;
  if (current && isUuid(current)) return current;
  const actorId = randomUUID();
  store.set(COOKIE, actorId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return actorId;
}

export function guestName(actorId: string): string {
  const hash = createHash("sha256").update(actorId).digest();
  const adjective = adjectives[hash[0] % adjectives.length];
  const noun = nouns[hash[1] % nouns.length];
  return `${adjective} ${noun} · guest`;
}
