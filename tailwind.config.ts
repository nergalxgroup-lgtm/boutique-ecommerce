import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // À personnaliser selon l'identité visuelle de la marque
        brand: {
          50: "#fdf4f0",
          100: "#fbe3d9",
          300: "#e8a487",
          500: "#c9613f", // couleur principale
          700: "#8f4128",
          900: "#4a2415",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        serif: ["var(--font-serif)"],
      },
    },
  },
  plugins: [],
};
export default config;
