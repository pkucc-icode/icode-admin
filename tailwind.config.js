module.exports = {
    darkMode: ['class'],
    content: ['./index.html', './src/**/*.{vue,ts,tsx}'],
  important: true,
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
		colors: {
			background: 'var(--background)',
			foreground: 'var(--foreground)',
      card: {
        DEFAULT: 'var(--card)',
        foreground: 'var(--card-foreground)'
      },
      popover: {
        DEFAULT: 'var(--popover)',
        foreground: 'var(--popover-foreground)'
      },
      primary: {
        DEFAULT: 'var(--primary)',
        foreground: 'var(--primary-foreground)'
      },
      secondary: {
        DEFAULT: 'var(--secondary)',
        foreground: 'var(--secondary-foreground)'
      },
      muted: {
        DEFAULT: 'var(--muted)',
        foreground: 'var(--muted-foreground)'
      },
      shallow: {
        DEFAULT: 'var(--shallow)',
        foreground: 'var(--shallow-foreground)'
      },
      accent: {
        DEFAULT: 'var(--accent)',
        foreground: 'var(--accent-foreground)'
      },
      decoration: {
        DEFAULT: 'var(--decoration)',
        foreground: 'var(--decoration-foreground)'
      },
      destructive: {
        DEFAULT: 'var(--destructive)',
        foreground: 'var(--destructive-foreground)'
      },
      table: {
        DEFAULT: 'var(--table)',
        foreground: 'var(--table-foreground)'
      },
      border: 'var(--border)',
      input: 'var(--input)',
      ring: 'var(--ring)',
      chart: {
        '1': 'var(--chart-1)',
        '2': 'var(--chart-2)',
        '3': 'var(--chart-3)',
        '4': 'var(--chart-4)',
        '5': 'var(--chart-5)'
      },
      info: {
        DEFAULT: 'var(--info)'
      },
      success: {
        DEFAULT: 'var(--success)'
      },
      warning: {
        DEFAULT: 'var(--warning)'
      },
      error: {
        DEFAULT: 'var(--error)'
      },
      text: 'var(--text)'
     }
  	}
  },
    plugins: [require("tailwindcss-animate")]
};
