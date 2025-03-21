/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            boxShadow: {
                custom: '0 0 40px rgba(8, 7, 16, 0.6)',
            },
            fontFamily: {
                poppins: ['Poppins', 'sans-serif'],
            }
        }
    },
    plugins: [
        require("tailwind-scrollbar")
    ],
    darkMode: 'class'
}