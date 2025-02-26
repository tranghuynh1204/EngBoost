import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
  	extend: {
		fontFamily: {
			sans: ["Roboto", "Helvetica", "sans-serif"],
		  },
  		colors: {
			slate: {
				900: '#0a0b2b',
				800: '#3a466d',
				700: '#5a6a91',
				600: '#a1b4d8',
				500: '#d0e0f0',
				400: '#e6eff8',
				300: '#f3f9ff',
				200: '#f7fbff',
			  },
			  customBlue: {
				dark: '#1C325B', // rgb(28, 50, 91)
				light: '#344E8A', // rgb(52, 78, 138)
			  },
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: '#000000',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		}
  	}
  },
  plugins: [],
} satisfies Config;
