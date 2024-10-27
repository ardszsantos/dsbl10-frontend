module.exports = {
  darkMode: 'class',
  content: [
    "./public/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#282828',
        secondary: '#121212',
        tertiary: '#8b8b8b'
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"], // Ensure both themes are available
  },
}
