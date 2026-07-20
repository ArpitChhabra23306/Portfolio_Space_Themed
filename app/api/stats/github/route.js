import { NextResponse } from "next/server";
import { fetchGitHubStats, zeroedGitHub } from "@/lib/stats/github";

export const revalidate = 3600;

export async function GET(request) {
  const username = process.env.GITHUB_USERNAME;
  const token = process.env.GITHUB_TOKEN;

  if (!username) {
    return NextResponse.json({ ok: false, stale: true, ...zeroedGitHub() });
  }

  const fresh = new URL(request.url).searchParams.get("fresh") === "1";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const data = await fetchGitHubStats(username, token, controller.signal, fresh);
    return NextResponse.json({ ok: true, stale: false, ...data });
  } catch {
    return NextResponse.json({ ok: false, stale: true, ...zeroedGitHub() });
  } finally {
    clearTimeout(timeout);
  }
}
