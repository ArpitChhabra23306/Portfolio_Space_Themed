/**
 * Codolio aggregated stats fetcher + normalizer.
 *
 * Codolio combines multiple coding platforms (LeetCode, CodeChef, GeeksforGeeks,
 * Code360, ...) into one profile. We read two public endpoints:
 *   - GET https://api.codolio.com/profile?userKey={key}         → DSA + contests + submission calendars
 *   - GET https://api.codolio.com/github/profile?userKey={key}  → GitHub commits/contributions + activity calendar
 *
 * NOTE: This is an unofficial endpoint (no public API contract). All parsing is
 * defensive and falls back to zeroed data on any shape change or failure.
 */

const BASE = "https://api.codolio.com";

const PLATFORM_LABELS = {
  leetcode: "LeetCode",
  codechef: "CodeChef",
  codestudio: "Code360",
  geeksforgeeks: "GeeksforGeeks",
  gfg: "GeeksforGeeks",
  codeforces: "Codeforces",
  hackerrank: "HackerRank",
  hackerearth: "HackerEarth",
  atcoder: "AtCoder",
};

function label(platform) {
  return PLATFORM_LABELS[String(platform || "").toLowerCase()] || platform || "Unknown";
}

export function zeroedCodolio() {
  return {
    dsa: {
      totalSolved: 0,
      easy: 0,
      medium: 0,
      hard: 0,
      totalQuestions: 0,
      contests: 0,
      totalActiveDays: 0,
      maxStreak: 0,
      currentStreak: 0,
      totalSubmissions: 0,
      platforms: [],
      submissionCalendar: {},
    },
    github: {
      username: null,
      stars: 0,
      commits: 0,
      totalContributions: 0,
      totalActiveDays: 0,
      pushRequests: 0,
      issues: 0,
      contributionCalendar: {},
      languages: {},
    },
  };
}

/** Convert a { unixSeconds(str): count } map into { "YYYY-MM-DD": count } (all years, non-zero only). */
function toDateCalendar(rawMap) {
  const out = {};
  if (!rawMap || typeof rawMap !== "object") return out;
  for (const [ts, count] of Object.entries(rawMap)) {
    const sec = Number(ts);
    if (!Number.isFinite(sec)) continue;
    const c = Number(count) || 0;
    if (c <= 0) continue;
    const date = new Date(sec * 1000).toISOString().slice(0, 10);
    out[date] = (out[date] || 0) + c;
  }
  return out;
}

/** Merge multiple { unixSeconds: count } maps by summing counts per day. */
function mergeCalendars(maps) {
  const merged = {};
  for (const m of maps) {
    const cal = toDateCalendar(m);
    for (const [date, c] of Object.entries(cal)) {
      merged[date] = (merged[date] || 0) + c;
    }
  }
  return merged;
}

/** Compute active days, max streak, and current streak from a date→count calendar. */
function streaks(calendar) {
  const days = Object.keys(calendar)
    .filter((d) => calendar[d] > 0)
    .sort();
  const totalActiveDays = days.length;
  if (totalActiveDays === 0) return { totalActiveDays: 0, maxStreak: 0, currentStreak: 0 };

  const DAY = 86400000;
  let maxStreak = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    const prev = Date.parse(days[i - 1]);
    const cur = Date.parse(days[i]);
    if (cur - prev === DAY) {
      run += 1;
      maxStreak = Math.max(maxStreak, run);
    } else {
      run = 1;
    }
  }

  // current streak: consecutive days ending today or yesterday
  let currentStreak = 0;
  const todayStr = new Date().toISOString().slice(0, 10);
  let cursor = Date.parse(todayStr);
  const set = new Set(days);
  if (!set.has(new Date(cursor).toISOString().slice(0, 10))) cursor -= DAY; // allow ending yesterday
  while (set.has(new Date(cursor).toISOString().slice(0, 10))) {
    currentStreak += 1;
    cursor -= DAY;
  }

  return { totalActiveDays, maxStreak, currentStreak };
}

async function getJson(url, signal, fresh = false) {
  const res = await fetch(url, {
    signal,
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
      Origin: "https://codolio.com",
      Referer: "https://codolio.com/",
    },
    ...(fresh ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
  });
  if (!res.ok) throw new Error(`Codolio ${url} returned ${res.status}`);
  return res.json();
}

export function normalizeProfile(json) {
  const data = json?.data;
  if (!data) return zeroedCodolio().dsa;

  const list = data?.platformProfiles?.platformProfiles || [];
  let easy = 0,
    medium = 0,
    hard = 0,
    totalQuestions = 0,
    contests = 0;
  const platforms = [];
  const rawCalendars = [];

  for (const p of list) {
    const tq = p?.totalQuestionStats || {};
    const e = Number(tq.easyQuestionCounts) || 0;
    const m = Number(tq.mediumQuestionCounts) || 0;
    const h = Number(tq.hardQuestionCounts) || 0;
    const total = Number(tq.totalQuestionCounts) || 0;
    easy += e;
    medium += m;
    hard += h;
    totalQuestions += total;

    const contestList = p?.contestActivityStats?.contestActivityList;
    const cContests = Array.isArray(contestList) ? contestList.length : 0;
    contests += cContests;

    const us = p?.userStats || {};
    const cal = p?.dailyActivityStatsResponse?.submissionCalendar;
    if (cal) rawCalendars.push(cal);

    if (total > 0 || us.currentRating != null) {
      platforms.push({
        platform: label(p.platform),
        key: String(p.platform || "").toLowerCase(),
        solved: total,
        rating: us.currentRating != null ? Math.round(Number(us.currentRating)) : null,
        maxRating: us.maxRating != null ? Math.round(Number(us.maxRating)) : null,
        rank: us.rank || us.maxRank || null,
        contests: cContests,
      });
    }
  }

  platforms.sort((a, b) => b.solved - a.solved);

  const submissionCalendar = mergeCalendars(rawCalendars);
  const totalSubmissions = Object.values(submissionCalendar).reduce((s, c) => s + c, 0);
  const { totalActiveDays, maxStreak, currentStreak } = streaks(submissionCalendar);

  return {
    totalSolved: easy + medium + hard,
    easy,
    medium,
    hard,
    totalQuestions,
    contests,
    totalActiveDays,
    maxStreak,
    currentStreak,
    totalSubmissions,
    platforms,
    submissionCalendar,
  };
}

export function normalizeGithub(json) {
  const d = json?.data;
  if (!d) return zeroedCodolio().github;
  return {
    username: d.githubProfile || null,
    stars: Number(d.stars) || 0,
    commits: Number(d.commitCounts) || 0,
    totalContributions: Number(d.totalContributions) || 0,
    totalActiveDays: Number(d.totalActiveDays) || 0,
    pushRequests: Number(d.pushRequestsCount) || 0,
    issues: Number(d.issues) || 0,
    contributionCalendar: toDateCalendar(d.developmentActivity),
    languages: d.languageDistributions || {},
  };
}

/**
 * Fetches and normalizes both Codolio endpoints.
 * @param {string} userKey - Codolio profile slug (e.g. "arpitChhabra")
 * @param {AbortSignal} [signal]
 */
export async function fetchCodolioStats(userKey, signal, fresh = false) {
  const [profileJson, githubJson] = await Promise.allSettled([
    getJson(`${BASE}/profile?userKey=${encodeURIComponent(userKey)}`, signal, fresh),
    getJson(`${BASE}/github/profile?userKey=${encodeURIComponent(userKey)}`, signal, fresh),
  ]);

  const dsa =
    profileJson.status === "fulfilled"
      ? normalizeProfile(profileJson.value)
      : zeroedCodolio().dsa;
  const github =
    githubJson.status === "fulfilled"
      ? normalizeGithub(githubJson.value)
      : zeroedCodolio().github;

  return { dsa, github };
}
