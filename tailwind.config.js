/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      // fontFamily: {
      //   lora: ["Lora", "serif"],
      //   playfair: ["Playfair Display", "serif"],
      // },
      // fontSize: {
      //   "16-20": "clamp(1rem, 0.9144rem + 0.3653vw, 1.25rem)",
      //   "20-28": "clamp(1.25rem, 1.0788rem + 0.7306vw, 1.75rem)",
      //   "24-32": "clamp(1.5rem, 1.3288rem + 0.7306vw, 2rem)",
      //   "28-40": "clamp(1.75rem, 1.4932rem + 1.0959vw, 2.5rem)",
      //   "32-48": "clamp(2rem, 1.6575rem + 1.4612vw, 3rem)",
      //   "32-56": "clamp(2rem, 1.4863rem + 2.1918vw, 3.5rem)",
      //   "36-48": "clamp(2.25rem, 1.9932rem + 1.0959vw, 3rem)",
      //   "72-144": "clamp(4.5rem, 2.9589rem + 6.5753vw, 9rem)",
      // },
      // colors: {
      //   beige: "#C4BFAF",
      //   black2: "#1E1E1E",
      //   blue2: "#2C3E50",
      //   red2: "#802F1D",
      //   paper: "#EEE4D3",
      //   yellow2: "#C98540",
      // },
    },
  },
  plugins: [],
};
