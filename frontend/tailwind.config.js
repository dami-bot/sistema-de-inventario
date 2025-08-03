/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // si usás App Router
    "./pages/**/*.{js,ts,jsx,tsx}", // si usás Pages Router
    "./components/**/*.{js,ts,jsx,tsx}", // componentes comunes
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindcss],
}
