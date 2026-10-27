import type { TTourMedium } from "~/types";

// The alt for a medium's image: its alt text, or empty for decorative
// images (and anything not yet described), so screen readers skip them.
// The caption isn't used, since it's already shown, and read, beside it.
export const altFor = (medium: Pick<TTourMedium, "alt_text" | "decorative">) =>
  medium.decorative ? "" : (medium.alt_text?.trim() ?? "");
