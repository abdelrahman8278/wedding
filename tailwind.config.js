/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        cairo: ['var(--font-cairo)', 'sans-serif'],
      },
      animation: {
        'gradient-shift': 'gradientShift 18s ease infinite',
        'float-particles': 'floatParticles 9s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'seal-pulse': 'sealPulse 4s ease-in-out infinite 1.5s',
        'blink-hint': 'blinkHint 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
