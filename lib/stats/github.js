/**
 * GitHub stats fetcher and normalizer.
 * Upstream: REST /users/{user} + /users/{user}/repos + GraphQL contributionsCollection
 */

const GITHUB_API_URL = "https://api.github.com";
const GITHUB_GRAPHQL_URL = "https://api.github.com/graphql";

const CONTRIBUTIONS_QUERY = `
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            date
            contributionCount
          }
        }
      }
    }
  }
}
`;

/**
 * Returns zeroed GitHub stats shape.
 */
export function zeroedGitHub() {
  return {
    publicRepos: 0,
    followers: 0,
    totalStars: 0,
    contributionCalendar: { weeks: [] },
  };
}

/**
 * Fetches user profile from GitHub REST API.
 */
async function fetchUserProfile(username, signal, fresh = false) {
  const res = await fetch(`${GITHUB_API_URL}/users/${encodeURIComponent(username)}`, {
    headers: { Accept: "application/vnd.github.v3+json" },
    signal,
    ...(fresh ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
  });
  if (!res.ok) throw new Error(`GitHub user API returned ${res.status}`);
  return res.json();
}

/**
 * Fetches all owner repos and sums non-fork stars.
 */
async function fetchTotalStars(username, signal, fresh = false) {
  const res = await fetch(
    `${GITHUB_API_URL}/users/${encodeURIComponent(username)}/repos?per_page=100&type=owner`,
    {
      headers: { Accept: "application/vnd.github.v3+json" },
      signal,
      ...(fresh ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
    }
  );
  if (!res.ok) throw new Error(`GitHub repos API returned ${res.status}`);
  const repos = await res.json();

  return repos
    .filter((r) => !r.fork)
    .reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
}

/**
 * Fetches contribution calendar via GitHub GraphQL (requires token).
 */
async function fetchContributionCalendar(username, token, signal, fresh = false) {
  if (!token) return { weeks: [] };

  const res = await fetch(GITHUB_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `bearer ${token}`,
    },
    body: JSON.stringify({ query: CONTRIBUTIONS_QUERY, variables: { username } }),
    signal,
    ...(fresh ? { cache: "no-store" } : { next: { revalidate: 3600 } }),
  });

  if (!res.ok) throw new Error(`GitHub GraphQL returned ${res.status}`);

  const json = await res.json();
  const calendar =
    json?.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar) return { weeks: [] };

  return {
    weeks: calendar.weeks.map((week) => ({
      contributionDays: week.contributionDays.map((day) => ({
        date: day.date,
        count: day.contributionCount,
      })),
    })),
  };
}

/**
 * Normalizes GitHub data from multiple sources into the documented shape.
 */
export function normalizeGitHub(profile, totalStars, contributionCalendar) {
  return {
    publicRepos: profile?.public_repos ?? 0,
    followers: profile?.followers ?? 0,
    totalStars: totalStars ?? 0,
    contributionCalendar: contributionCalendar ?? { weeks: [] },
  };
}

/**
 * Fetches all GitHub stats for a given username.
 * @param {string} username
 * @param {string|undefined} token - GitHub PAT for contribution calendar
 * @param {AbortSignal} [signal]
 */
export async function fetchGitHubStats(username, token, signal, fresh = false) {
  const [profile, totalStars, contributionCalendar] = await Promise.all([
    fetchUserProfile(username, signal, fresh),
    fetchTotalStars(username, signal, fresh),
    fetchContributionCalendar(username, token, signal, fresh),
  ]);

  return normalizeGitHub(profile, totalStars, contributionCalendar);
}
