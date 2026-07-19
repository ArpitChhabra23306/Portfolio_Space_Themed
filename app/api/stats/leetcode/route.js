import { NextResponse } from "next/server";
import { fetchLeetCodeStats, zeroedLeetCode } from "@/lib/stats/leetcode";

export const revalidate = 3600;

export async function GET() {
  const username = process.env.LEETCODE_USERNAME;

  if (!username) {
    return NextResponse.json({ ok: false, stale: true, ...zeroedLeetCode() });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const data = await fetchLeetCodeStats(username, controller.signal);
    return NextResponse.json({ ok: true, stale: false, ...data });
  } catch {
    return NextResponse.json({ ok: false, stale: true, ...zeroedLeetCode() });
  } finally {
    clearTimeout(timeout);
  }
}
