/** @type {import('tailwindcss').Config} */

// Our CSS variables (in index.css) store full hex values, e.g. --primary: #ABA361;
// Tailwind's usual `<alpha-value>` trick needs raw "R G B" channel strings instead,
// which would mean rewriting every variable. Since modern browsers support
// color-mix(), we build an opacity-aware color helper that works directly
// with hex custom properties, so classes like `border-primary/60` keep working.
//
// IMPORTANT: Tailwind calls this function for EVERY color utility, even ones
// without a /opacity modifier (e.g. plain `bg-card`) — in that case it passes
// a non-numeric placeholder for opacityValue (for its bg-opacity-*/text-opacity-*
// utilities), not `undefined`. We must only do the color-mix math when
// opacityValue is an actual finite number; otherwise fall back to the plain var.
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined && !Number.isNaN(Number(opacityValue))) {
      return `color-mix(in srgb, var(${variableName}) ${Number(opacityValue) * 100}%, transparent)`;
    }
    return `var(${variableName})`;
  };
}

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: withOpacity('--background'),
        foreground: withOpacity('--foreground'),
        card: { DEFAULT: withOpacity('--card'), foreground: withOpacity('--card-foreground') },
        primary: { DEFAULT: withOpacity('--primary'), foreground: withOpacity('--primary-foreground') },
        secondary: { DEFAULT: withOpacity('--secondary'), foreground: withOpacity('--secondary-foreground') },
        muted: { DEFAULT: withOpacity('--muted'), foreground: withOpacity('--muted-foreground') },
        accent: { DEFAULT: withOpacity('--accent'), foreground: withOpacity('--accent-foreground') },
        destructive: { DEFAULT: withOpacity('--destructive'), foreground: withOpacity('--destructive-foreground') },
        border: withOpacity('--border'),
        sidebar: {
          DEFAULT: withOpacity('--sidebar'),
          foreground: withOpacity('--sidebar-foreground'),
          border: withOpacity('--sidebar-border'),
          active: withOpacity('--sidebar-active'),
          'active-foreground': withOpacity('--sidebar-active-foreground'),
        },
      },
      fontFamily: {
        display: ["'Fraunces'", 'Georgia', 'serif'],
        body: ["'Manrope'", 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", 'monospace'],
      },
      borderRadius: { lg: 'var(--radius)' },
    },
  },
  plugins: [],
}