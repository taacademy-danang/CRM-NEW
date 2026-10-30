import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FCF4F5",
          100: "#F9E8E9",
          200: "#F2C7C9",
          300: "#E99FA3",
          400: "#DC6C73",
          500: "#C43842",
          600: "#A8242F",
          700: "#8B1D2C", // Màu chủ đạo T.A Academy Wine Red
          800: "#721422", // Màu nền thanh bên đậm
          900: "#5A0E1A",
          950: "#36050C",
        },
        champagne: {
          50: "#FAF7EE",
          100: "#F3ECD7",
          200: "#E7D8AF",
          300: "#DAC387",
          400: "#CCA95E",
          500: "#D4AF37", // Màu vàng champagne hoàng gia
          600: "#C5A059",
          700: "#996515",
          800: "#7A5013",
          900: "#5A3A0E",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
