import type { Config } from "tailwindcss";
import { type PluginAPI } from "tailwindcss/types/config";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        shimmer: {
          "0%": { left: "-100%" },
          "100%": { left: "200%" },
        },
      },
      animation: {
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
  plugins: [
    function ({ addUtilities }: PluginAPI) {
      addUtilities({
        ".custom-image-gradient-stops": {
          "--tw-gradient-to":
            "rgb(113 113 122 / 0) var(--tw-gradient-to-position)",
          "--tw-gradient-stops":
            "var(--tw-gradient-from), rgb(113 113 122 / 0.1) var(--tw-gradient-via-position), var(--tw-gradient-to)",
        },
      });
    },
  ],
} satisfies Config;
