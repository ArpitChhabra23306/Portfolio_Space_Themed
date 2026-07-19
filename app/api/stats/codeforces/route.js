import { NextResponse } from "next/server";
import { fetchCodeforcesStats, zeroedCodeforces } from "@/lib/stats/codeforces";

export const revalidate = 3600;

export async function GET() {
  const handle = process.env.CODEFORCES_HANDLE;

  if (!handle) {
    return NextResponse.json({ ok: false, stale: true, ...zeroedCodeforces() });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const data = await fetchCodeforcesStats(handle, controller.signal);
    return NextResponse.json({ ok: true, stale: false, ...data });
  } catch {
    return NextResponse.json({ ok: false, stale: true, ...zeroedCodeforces() });
  } finally {
    clearTimeout(timeout);
  }
}
