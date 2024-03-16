/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  theme: {
    extend: {},
    colors: {
      clight: "#F0F7F4",
      cgreen: "#6EABB0",
      clightgreen: "#96E1D9",
      cbrown: "#705D55",
      cblack: "#32292F",
    },
  },
  plugins: [require("flowbite/plugin"), require("tailwindcss-inner-border")],
};
