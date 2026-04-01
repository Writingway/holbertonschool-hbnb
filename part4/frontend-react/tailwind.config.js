/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './index.html',
        './src/**/*.{js,jsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: '#F5F9FA',
                surface: '#E8F2F5',
                accent: '#00C49A',
                'accent-dark': '#00A883',
                primary: '#1264A3',
                secondary: '#0F7D64',
                'ink-black': '#0C2030',
                'deep-space-blue': '#1264A3',
                'blue-slate': '#3A5869',
                'dusty-denim': '#B0CDD8',
                eggshell: '#F5F9FA',
                border: '#B0CDD8',
                'text-primary': '#0C2030',
                'text-secondary': '#3A5869',
                'text-tertiary': '#4F7488',
                'bg-secondary': '#E8F2F5',
                'bg-tertiary': '#FFFFFF',
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
            },
            spacing: {
                'xs': '0.25rem',
                'sm': '0.5rem',
                'md': '1rem',
                'lg': '1.5rem',
                'xl': '2rem',
                '2xl': '3rem',
                '3xl': '4rem',
            },
            fontSize: {
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['2rem', { lineHeight: '2.5rem' }],
                '4xl': ['2.5rem', { lineHeight: '3rem' }],
            },
            boxShadow: {
                'sm': '0 1px 3px rgba(0, 0, 0, 0.08)',
                'md': '0 2px 8px rgba(0, 0, 0, 0.12)',
                'lg': '0 8px 24px rgba(0, 0, 0, 0.15)',
            },
        },
    },
    plugins: [],
}
