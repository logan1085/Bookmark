import { auth } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";
import type { Digest } from "@/types/digest";

const getResend = () => new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const digest: Digest = await req.json();
  const supabase = getSupabaseAdmin();

  // Save to Supabase
  const { data, error } = await supabase
    .from("digests")
    .upsert(
      {
        week: digest.week,
        year: digest.year,
        title: digest.title,
        intro: digest.intro,
        articles: digest.articles,
        published_at: new Date().toISOString(),
      },
      { onConflict: "week,year" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get subscribers and send email
  const { data: subscribers } = await supabase
    .from("subscribers")
    .select("email")
    .eq("active", true);

  if (subscribers && subscribers.length > 0) {
    const emails = subscribers.map((s: { email: string }) => s.email);
    const html = buildEmailHtml(digest);

    await getResend().emails.send({
      from: "Bookmark <LoganHorowitz2@gmail.com>",
      to: emails,
      subject: `📖 Week ${digest.week}: ${digest.title}`,
      html,
    });
  }

  return NextResponse.json({ ok: true, id: data.id, subscriberCount: subscribers?.length ?? 0 });
}

function buildEmailHtml(digest: Digest): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 16px; color: #1c1917;">
  <p style="font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #a8a29e; margin-bottom: 8px;">
    Week ${digest.week} · ${digest.year}
  </p>
  <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 12px;">${digest.title}</h1>
  <p style="font-size: 15px; color: #57534e; line-height: 1.6; margin-bottom: 32px;">${digest.intro}</p>
  <hr style="border: none; border-top: 1px solid #e7e5e4; margin-bottom: 32px;">
  ${digest.articles
    .map(
      (a, i) => `
  <div style="margin-bottom: 28px;">
    <p style="font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #a8a29e; margin: 0 0 6px;">
      ${["Top Pick", "Also Great", "Worth Reading"][i]} · ${a.source}
    </p>
    <h2 style="font-size: 18px; font-weight: 700; margin: 0 0 8px;">
      <a href="${a.url}" style="color: #1c1917; text-decoration: none;">${a.title}</a>
    </h2>
    <p style="font-size: 14px; color: #57534e; line-height: 1.6; margin: 0 0 8px;">${a.summary}</p>
    <p style="font-size: 13px; color: #78716c; border-left: 2px solid #e7e5e4; padding-left: 12px; margin: 0; font-style: italic;">${a.keyInsight}</p>
  </div>`
    )
    .join("")}
  <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 32px 0 16px;">
  <p style="font-size: 12px; color: #a8a29e; text-align: center;">
    Curated by Logan Horowitz · <a href="mailto:LoganHorowitz2@gmail.com" style="color: #a8a29e;">reply to suggest an article</a>
  </p>
</body>
</html>`;
}
