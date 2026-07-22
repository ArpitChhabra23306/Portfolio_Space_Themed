/**
 * Single source of truth for contact details + social/profile links.
 *
 * HOW TO EDIT:
 * - Fill in any value marked TODO with your real handle/URL/number.
 * - Any entry with an empty `href` (or empty phone) is automatically hidden
 *   from the UI, so it's safe to leave unknowns blank.
 *
 * Verified this session (from the live stats APIs / your Codolio profile):
 *   GitHub, LeetCode, Codolio, and the account email.
 */

export const CONTACT = {
  email: "arpitchhabra.work@gmail.com",
  phone: "+91 79760 46473",
  location: "Sri Ganganagar, Rajasthan, India",
  timezone: "Asia/Kolkata (IST)",
};

/**
 * Ordered social/profile links. `key` maps to an icon in the UI.
 * Leave `href: ""` for anything you don't want shown yet.
 */
export const SOCIALS = [
  {
    key: "github",
    label: "GitHub",
    handle: "@ArpitChhabra23306",
    href: "https://github.com/ArpitChhabra23306",
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    handle: "", // TODO: e.g. "in/arpit-chhabra"
    href: "", // TODO: e.g. "https://www.linkedin.com/in/arpit-chhabra"
  },
  {
    key: "x",
    label: "X",
    handle: "", // TODO: e.g. "@arpitchhabra"
    href: "", // TODO: e.g. "https://x.com/arpitchhabra"
  },
  {
    key: "leetcode",
    label: "LeetCode",
    handle: "@ArpitChhabra9692",
    href: "https://leetcode.com/u/ArpitChhabra9692",
  },
  {
    key: "codechef",
    label: "CodeChef",
    handle: "", // TODO: e.g. "@arpit_chhabra"
    href: "", // TODO: e.g. "https://www.codechef.com/users/arpit_chhabra"
  },
  {
    key: "codolio",
    label: "Codolio",
    handle: "arpitChhabra",
    href: "https://codolio.com/profile/arpitChhabra",
  },
];

/** Socials that have a usable link — convenience for components. */
export const ACTIVE_SOCIALS = SOCIALS.filter((s) => s.href);
