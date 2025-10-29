/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",   // Biru profesional
        secondary: "#9333EA", // Ungu kreatif
        accent: "#FACC15",    // Kuning energik
        base: "#F9FAFB",      // Background lembut
        textMain: "#1E293B",  // Teks utama
        borderLight: "#E5E7EB" // Border halus
      },
    },
  },
  plugins: [],
}
