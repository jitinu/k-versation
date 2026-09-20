import { NextResponse } from "next/server";
import { createAdminClient, hasSupabaseEnv } from "@/lib/supabase/admin";
import { isHost } from "@/lib/host";

const csv = (value: string | null | undefined) => `"${String(value ?? "").replaceAll('"', '""')}"`;

export async function GET() {
  if (!(await isHost())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!hasSupabaseEnv())
    return NextResponse.json({ error: "Subscribers are not configured." }, { status: 503 });
  const { data, error } = await createAdminClient()
    .from("subscribers")
    .select("name,email,country_name,phone,created_at")
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Unable to export subscribers." }, { status: 500 });
  const lines = [
    "name,email,country,phone,subscribed_at",
    ...(data ?? []).map((subscriber) =>
      [
        csv(subscriber.name),
        csv(subscriber.email),
        csv(subscriber.country_name),
        csv(subscriber.phone),
        csv(subscriber.created_at),
      ].join(","),
    ),
  ];
  return new NextResponse(lines.join("\r\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="subscribers.csv"',
    },
  });
}
