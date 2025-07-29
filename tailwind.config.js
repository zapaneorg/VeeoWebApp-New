/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom Veeo Palette (Light Theme)
        "brand-white": "#FFFFFF", // Pure White
        "brand-light-gray": "#F3F4F6", // Very Light Gray (bg-gray-100)
        "brand-medium-gray": "#E5E7EB", // Light Gray (bg-gray-200)
        "brand-gray": "#9CA3AF", // Medium Gray (bg-gray-400)
        "brand-dark-gray": "#374151", // Dark Gray (bg-gray-700) - Main text, primary elements
        "brand-primary": "#1F2937", // Very Dark Gray (bg-gray-800) - Accents, hover states
        "brand-accent-gray": "#4B5563", // Slightly lighter dark gray (bg-gray-600)
        "brand-black": "#111827", // Almost Black (bg-gray-900)
        "brand-blue": "#2563EB", // Example accent blue (can be removed or changed)
        "brand-red": "#DC2626", // For destructive actions
        "brand-green": "#16A34A", // For success states
        "brand-yellow": "#F59E0B", // For warnings or attention
        "brand-gray-50": "#F9FAFB",
        "brand-gray-100": "#F3F4F6",
        "brand-gray-200": "#E5E7EB",
        "brand-gray-300": "#D1D5DB",
        "brand-gray-400": "#9CA3AF",
        "brand-gray-500": "#6B7280",
        "brand-gray-600": "#4B5563",
        "brand-gray-700": "#374151",
        "brand-gray-800": "#1F2937",
        "brand-gray-900": "#111827",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "gradient-bg": {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "slide-out": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.02)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "gradient-bg": "gradient-bg 15s ease infinite",
        "slide-in": "slide-in 0.5s ease-out forwards",
        "slide-out": "slide-out 0.5s ease-in forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      fontSize: {
        'hero-title': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.05em' }],
        'section-title': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.04em' }],
        'body-emphasis': ['1.125rem', { lineHeight: '1.7' }],
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'medium': '0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'large': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-hero-title': {
          fontSize: theme('fontSize.4xl'),
          fontWeight: theme('fontWeight.black'),
          letterSpacing: theme('letterSpacing.tighter'),
          lineHeight: theme('lineHeight.tight'),
          '@screen sm': {
            fontSize: theme('fontSize.5xl'),
          },
          '@screen md': {
            fontSize: theme('fontSize.6xl'),
          },
        },
        '.text-section-title': {
          fontSize: theme('fontSize.3xl'),
          fontWeight: theme('fontWeight.bold'),
          letterSpacing: theme('letterSpacing.tight'),
          '@screen sm': {
            fontSize: theme('fontSize.4xl'),
          },
        },
         '.text-body-emphasis': {
          fontSize: theme('fontSize.lg'),
          lineHeight: theme('lineHeight.relaxed'),
           '@screen md': {
            fontSize: theme('fontSize.xl'),
          },
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    })
  ],
}