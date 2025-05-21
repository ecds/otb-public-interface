import type { Config } from "@tailwindcss/postcss";
import { aspectRatio } from "@tailwindcss/aspect-ratio";
import { createPlugin } from "@tailwindcss/postcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [
    aspectRatio,
    createPlugin(({ addBase }) => {
      addBase({
        html: {
          ".stop": {
            a: {
              color: "#1d4ed8",
              textDecorationLine: "underline",
            },
            "a:hover": {
              color: "#4338ca",
            },
          },
        },
      });
    }),
  ],
  safelist: ["grid-cols-3", "grid-cols-4", "grid-cols-2"],
} satisfies Config;
