import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: '480px',
        md: '768px',
        lg: '976px',
        xl: '1440px',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        "bf-navyblue": "#000080",
        "bf-royalblue": "#4169E1",
        "bf-skyblue": "#87CEEB",
        "bf-steelblue": "#4682B4",
        "bf-cobaltblue": "#0047AB",
        "bf-comp-bg": "#1B1B1B",
        "bf-comp-border": "white",
        "bf-page-bg": "#1E293B"
      },
      fontFamily: {
        "garamond": ["Garamond"],
      }
    },
  },
  plugins: [],
};
export default config;
