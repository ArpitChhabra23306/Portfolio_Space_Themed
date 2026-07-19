import { NextResponse } from "next/server";
import { fetchCodolioStats, zeroedCodolio } from "@/lib/stats/codolio";

export const revalidate = 3600;

export async function GET(request) {
  const userKey = process.env.CODOLIO_USERNAME;

  if (!userKey) {
    return NextResponse.json({ ok: false, stale: true, ...zeroedCodolio() });
  }

  const fresh = new URL(request.url).searchParams.get("fresh") === "1";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const data = await fetchCodolioStats(userKey, controller.signal, fresh);
    const hasData = data.dsa.totalQuestions > 0 || data.github.commits > 0;
    return NextResponse.json({ ok: hasData, stale: !hasData, ...data });
  } catch {
    return NextResponse.json({ ok: false, stale: true, ...zeroedCodolio() });
  } finally {
    clearTimeout(timeout);
  }
}
