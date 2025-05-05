// import { plugin } from "postcss";
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  include: ["remix.env.d.ts", "**/*.ts", "**/*.tsx", "tailwind.config.ts"],
  important: true,
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    plugin(({ addBase }) => {
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

  safelist: ["grid-cols-3"],
} satisfies Config;
