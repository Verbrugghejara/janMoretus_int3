/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
      extend: {
        fontFamily: {
          playfair: ['"Playfair Display"', 'serif'],
          lora: ['"Lora"', 'serif'],
      },
    },
  },
  plugins: [],
};
