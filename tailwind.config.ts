import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        berry: "#7c3aed",
        ocean: "#0f766e",
        sunshine: "#f59e0b",
        ink: "#263238"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(38, 50, 56, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
