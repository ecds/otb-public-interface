// Page titles read most specific first, e.g. "Map – Old Church – Town Tour",
// so tabs and screen readers lead with what's on the page. Empty parts are
// left out.
export const pageTitle = (...parts: (string | undefined | null)[]) =>
  parts.filter(Boolean).join(" – ");
