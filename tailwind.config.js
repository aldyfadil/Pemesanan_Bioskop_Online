/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#E50914', // Merah khas bioskop
                dark: '#080808',
            }
        },
    },
    plugins: [],
}