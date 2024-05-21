import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        home: "url('/images/bg.jpg')",
        diamond: "url('/images/DiamondPattern.png')",
      },
      fontFamily: {
        rubik: ["rubik", "sans-serif"],
        main: ["main", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
