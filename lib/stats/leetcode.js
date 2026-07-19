/**
 * LeetCode stats fetcher and normalizer.
 * Upstream: https://leetcode.com/graphql
 */

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

const QUERY = `
query getUserStats($username: String!) {
  matchedUser(username: $username) {
    profile {
      ranking
    }
    submitStatsGlobal {
      acSubmissionNum {
        difficulty
        count
      }
    }
    userCalendar {
      submissionCalendar
    }
  }
}
`;

/**
 * Returns zeroed LeetCode stats shape.
 */
export function zeroedLeetCode() {
  return {
    totalSolved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    ranking: 0,
    submissionCalendar: {},
  };
}

/**
 * Normalizes raw LeetCode GraphQL response into the documented shape.
 */
export function normalizeLeetCode(data) {
  const user = data?.data?.matchedUser;
  if (!user) return zeroedLeetCode();

  const stats = user.submitStatsGlobal?.acSubmissionNum ?? [];
  const easy = stats.find((s) => s.difficulty === "Easy")?.count ?? 0;
  const medium = stats.find((s) => s.difficulty === "Medium")?.count ?? 0;
  const hard = stats.find((s) => s.difficulty === "Hard")?.count ?? 0;
  const totalSolved = easy + medium + hard;
  const ranking = user.profile?.ranking ?? 0;

  // Parse submission calendar — filter to trailing 12 months
  let submissionCalendar = {};
  try {
    const raw = JSON.parse(user.userCalendar?.submissionCalendar || "{}");
    const twelveMonthsAgo = Math.floor(Date.now() / 1000) - 365 * 24 * 60 * 60;

    for (const [timestamp, count] of Object.entries(raw)) {
      if (Number(timestamp) >= twelveMonthsAgo) {
        const date = new Date(Number(timestamp) * 1000).toISOString().split("T")[0];
        submissionCalendar[date] = count;
      }
    }
  } catch {
    submissionCalendar = {};
  }

  return { totalSolved, easy, medium, hard, ranking, submissionCalendar };
}

/**
 * Fetches LeetCode stats for a given username.
 * @param {string} username
 * @param {AbortSignal} [signal]
 */
export async function fetchLeetCodeStats(username, signal) {
  const res = await fetch(LEETCODE_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: QUERY, variables: { username } }),
    signal,
  });

  if (!res.ok) {
    throw new Error(`LeetCode upstream returned ${res.status}`);
  }

  const json = await res.json();
  return normalizeLeetCode(json);
}
