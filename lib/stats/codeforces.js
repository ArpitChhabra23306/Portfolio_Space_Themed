/**
 * Codeforces stats fetcher and normalizer.
 * Upstream: https://codeforces.com/api/user.info?handles={handle}
 */

const CODEFORCES_API_URL = "https://codeforces.com/api/user.info";

/**
 * Returns zeroed Codeforces stats shape.
 */
export function zeroedCodeforces() {
  return {
    rating: 0,
    maxRating: 0,
    rank: "unrated",
  };
}

/**
 * Normalizes raw Codeforces API response into the documented shape.
 */
export function normalizeCodeforces(data) {
  const user = data?.result?.[0];
  if (!user) return zeroedCodeforces();

  return {
    rating: user.rating ?? 0,
    maxRating: user.maxRating ?? 0,
    rank: user.rank ?? "unrated",
  };
}

/**
 * Fetches Codeforces stats for a given handle.
 * @param {string} handle
 * @param {AbortSignal} [signal]
 */
export async function fetchCodeforcesStats(handle, signal) {
  const url = `${CODEFORCES_API_URL}?handles=${encodeURIComponent(handle)}`;

  const res = await fetch(url, { signal });

  if (!res.ok) {
    throw new Error(`Codeforces upstream returned ${res.status}`);
  }

  const json = await res.json();
  return normalizeCodeforces(json);
}
