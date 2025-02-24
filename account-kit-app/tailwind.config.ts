/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: "#4a90e2",
        orange: "#eca15a",
        green: "#4ecca6",
      },
      gridTemplateColumns: {
        'auto-fill-64': 'repeat(auto-fill, minmax(64px, 1fr))',
      },
    },
  },
  plugins: [],
}

