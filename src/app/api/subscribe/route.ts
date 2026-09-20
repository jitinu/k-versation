import { NextResponse } from "next/server";
import { z } from "zod";
import { countries } from "@/lib/countries";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
import { setSubscriberCookie } from "@/lib/subscriber";

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  countryCode: z.string().trim().length(2).toUpperCase(),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  website: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form.", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }
  if (parsed.data.website) return NextResponse.json({ ok: true, name: parsed.data.name });
  if (!hasSupabaseEnv())
    return NextResponse.json({ error: "Subscribe is not configured yet." }, { status: 503 });

  const country = countries.find(([code]) => code === parsed.data.countryCode);
  if (!country) return NextResponse.json({ error: "Choose a valid country." }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("subscribers")
    .upsert(
      {
        email,
        name: parsed.data.name,
        country_code: country[0],
        country_name: country[1],
        phone: parsed.data.phone || null,
      },
      { onConflict: "email" },
    )
    .select("*")
    .single();
  if (error || !data)
    return NextResponse.json({ error: "Unable to subscribe right now." }, { status: 500 });
  await setSubscriberCookie(data.token);
  return NextResponse.json({ ok: true, name: data.name });
}
