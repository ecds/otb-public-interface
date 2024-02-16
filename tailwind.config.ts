import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  include: ["remix.env.d.ts", "**/*.ts", "**/*.tsx", "tailwind.config.ts"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/aspect-ratio")],
} satisfies Config;
