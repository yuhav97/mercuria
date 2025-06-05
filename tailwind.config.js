/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Mais importante para o App Router do Next.js
  ],
  theme: {
    extend: {
      colors: {
        // Adicionando a cor customizada usada no design
        'slate-850': '#172033', // Um tom entre slate-800 (#1e293b) e slate-900 (#0f172a)
        // Você pode adicionar outras cores customizadas aqui se necessário
      },
      // Exemplo de como estender outras propriedades do tema, se desejar:
      // fontFamily: {
      //   sans: ['Inter', 'sans-serif'], // Se quiser garantir 'Inter' como fonte principal
      // },
      // keyframes: { // Para as animações de pulso, se não quiser defini-las no <style jsx global>
      //   'pulse-slow': {
      //     '0%, 100%': { opacity: '0.1', transform: 'scale(1)' },
      //     '50%': { opacity: '0.15', transform: 'scale(1.05)' },
      //   },
      //   'pulse-slower': {
      //     '0%, 100%': { opacity: '0.05', transform: 'scale(0.95) rotate(45deg)' },
      //     '50%': { opacity: '0.1', transform: 'scale(1) rotate(50deg)' },
      //   }
      // },
      // animation: { // Para usar os keyframes definidos acima
      //   'pulse-slow': 'pulse-slow 8s infinite ease-in-out',
      //   'pulse-slower': 'pulse-slower 12s infinite ease-in-out',
      // }
    },
  },
  plugins: [
    // Aqui você pode adicionar plugins do Tailwind, se necessário
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
};
