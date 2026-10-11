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
        "brand-pink": "#be185d",
        "brand-purple": "#7e22ce",
        ink: "#fafafa",
        surface: "#18181b"
      },
      boxShadow: {
        soft: "0 18px 45px rgba(88, 28, 135, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
