"use client";
import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { AiOutlineRocket, AiOutlineBulb } from 'react-icons/ai';
import { GiArtificialIntelligence, GiMagicSwirl } from 'react-icons/gi';
import { FaPalette } from 'react-icons/fa';
import { MdDesignServices } from 'react-icons/md';
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });
export default function Home() {
  return (
    <div className={${poppins.className} min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700 text-white}>
      {/* Estilos inline para animações */}
      <style jsx global>{
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-icon { /* Renomeado para evitar conflito com Tailwind pulse */
          animation: pulse 2s infinite;
        }
        .hover-scale-lg { /* Efeito de hover um pouco maior */
          transition: all 0.3s ease-in-out;
        }
        .hover-scale-lg:hover {
          transform: scale(1.05); /* Aumentado o scale */
          box-shadow: 0 10px 30px rgba(74, 172, 255, 0.4); /* Sombra mais pronunciada */
        }
        .card-hover {
          transition: all 0.3s ease-in-out;
        }
        .card-hover:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
        }
}</style>
  {/* Header */}
  &lt;header className="sticky top-0 z-50 w-full bg-black/40 backdrop-blur-xl px-4 sm:px-8 py-4 shadow-lg"&gt;
    &lt;div className="max-w-7xl mx-auto flex items-center justify-between"&gt;
      &lt;div className="flex items-center"&gt;
        &lt;GiMagicSwirl size={36} className="mr-2 text-cyan-400" /&gt;
        &lt;h1 className="text-3xl font-bold text-white"&gt;
          MercurIA
        &lt;/h1&gt;
      &lt;/div&gt;
      {/* Você pode adicionar um CTA no header aqui se desejar */}
      {/* &lt;Link href="/page" passHref&gt;
        &lt;button className="hidden sm:block px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors"&gt;
          Começar
        &lt;/button&gt;
      &lt;/Link&gt; */}
    &lt;/div&gt;
  &lt;/header&gt;

  {/* Seção Hero */}
  &lt;section className="py-24 md:py-32 max-w-7xl mx-auto px-4 sm:px-8 text-center"&gt;
    &lt;div className="bg-black/50 backdrop-blur-md rounded-3xl p-8 sm:p-16 shadow-2xl shadow-cyan-700/30"&gt;
      &lt;h2 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 mb-6"&gt;
        Apresentações Deslumbrantes, &lt;br className="hidden sm:block" /&gt;Criadas por IA em Segundos.
      &lt;/h2&gt;
      &lt;p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10"&gt;
        Diga adeus ao design demorado. Com a MercurIA, você foca na sua mensagem e nossa inteligência artificial cuida de criar slides impactantes e profissionais.
      &lt;/p&gt;
      &lt;Link href="/page" passHref&gt;
        &lt;button
          className="px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-semibold rounded-lg text-white text-lg shadow-lg transform transition-all duration-300 ease-in-out hover:shadow-xl hover-scale-lg"
        &gt;
          Criar Minha Apresentação Agora
        &lt;/button&gt;
      &lt;/Link&gt;
    &lt;/div&gt;
  &lt;/section&gt;

  {/* Seção Como Funciona */}
  &lt;section className="py-16 sm:py-24 bg-black/20"&gt;
    &lt;div className="max-w-7xl mx-auto px-4 sm:px-8"&gt;
      &lt;h2 className="text-3xl sm:text-4xl font-bold text-center mb-4"&gt;Mágica em Poucos Cliques&lt;/h2&gt;
      &lt;p className="text-xl text-slate-300 text-center mb-16 max-w-2xl mx-auto"&gt;Veja como é fácil transformar suas ideias em realidade com a MercurIA:&lt;/p&gt;
      &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"&gt;
        &lt;div className="flex flex-col items-center p-6"&gt;
          &lt;div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-full mb-4 inline-block"&gt;
            &lt;AiOutlineBulb size={40} className="text-white" /&gt;
          &lt;/div&gt;
          &lt;h3 className="text-2xl font-semibold text-white mb-2"&gt;1. Descreva sua Ideia&lt;/h3&gt;
          &lt;p className="text-slate-300"&gt;Forneça o tema, pontos chave ou um rascunho do seu conteúdo.&lt;/p&gt;
        &lt;/div&gt;
        &lt;div className="flex flex-col items-center p-6"&gt;
          &lt;div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-full mb-4 inline-block"&gt;
            &lt;FaPalette size={40} className="text-white" /&gt;
          &lt;/div&gt;
          &lt;h3 className="text-2xl font-semibold text-white mb-2"&gt;2. Personalize o Estilo&lt;/h3&gt;
          &lt;p className="text-slate-300"&gt;Escolha cores, fontes e o tom que mais combinam com sua mensagem.&lt;/p&gt;
        &lt;/div&gt;
        &lt;div className="flex flex-col items-center p-6"&gt;
          &lt;div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-4 rounded-full mb-4 inline-block"&gt;
            &lt;GiArtificialIntelligence size={40} className="text-white" /&gt;
          &lt;/div&gt;
          &lt;h3 className="text-2xl font-semibold text-white mb-2"&gt;3. A IA Entra em Ação&lt;/h3&gt;
          &lt;p className="text-slate-300"&gt;Nossa inteligência cria uma apresentação completa e otimizada para você.&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/section&gt;

  {/* Seção de Benefícios */}
  &lt;section className="py-16 sm:py-24"&gt;
    &lt;div className="max-w-7xl mx-auto px-4 sm:px-8"&gt;
      &lt;h2 className="text-3xl sm:text-4xl font-bold text-center mb-16"&gt;Vantagens que Fazem a Diferença&lt;/h2&gt;
      &lt;div className="grid grid-cols-1 md:grid-cols-3 gap-8"&gt;
        {/* Card 1 */}
        &lt;div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 shadow-xl card-hover"&gt;
          &lt;div className="flex items-center text-cyan-400 mb-5"&gt;
            &lt;MdDesignServices size={40} /&gt;
            &lt;h3 className="ml-4 text-2xl font-semibold text-white"&gt;Designs que Cativam&lt;/h3&gt;
          &lt;/div&gt;
          &lt;p className="text-slate-300 leading-relaxed"&gt;Crie apresentações com visuais modernos, elegantes e totalmente personalizáveis que prendem a atenção do seu público.&lt;/p&gt;
        &lt;/div&gt;
        {/* Card 2 */}
        &lt;div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 shadow-xl card-hover"&gt;
          &lt;div className="flex items-center text-cyan-400 mb-5"&gt;
            &lt;GiArtificialIntelligence size={40} className="animate-pulse-icon" /&gt;
            &lt;h3 className="ml-4 text-2xl font-semibold text-white"&gt;Inteligência ao Seu Dispor&lt;/h3&gt;
          &lt;/div&gt;
          &lt;p className="text-slate-300 leading-relaxed"&gt;Nossa IA não apenas monta slides, mas sugere layouts, otimiza seu conteúdo e simplifica todo o processo criativo.&lt;/p&gt;
        &lt;/div&gt;
        {/* Card 3 */}
        &lt;div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-2xl p-8 shadow-xl card-hover"&gt;
          &lt;div className="flex items-center text-cyan-400 mb-5"&gt;
            &lt;AiOutlineRocket size={40} /&gt;
            &lt;h3 className="ml-4 text-2xl font-semibold text-white"&gt;Criação Rápida e Intuitiva&lt;/h3&gt;
          &lt;/div&gt;
          &lt;p className="text-slate-300 leading-relaxed"&gt;Plataforma otimizada para máxima velocidade e usabilidade. Crie e edite suas apresentações com fluidez, sem complicações.&lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  &lt;/section&gt;

  {/* Seção de Chamada para Ação Final */}
  &lt;section className="py-20 sm:py-28"&gt;
    &lt;div className="max-w-4xl mx-auto px-4 sm:px-8 text-center"&gt;
      &lt;GiMagicSwirl size={60} className="mx-auto mb-6 text-cyan-400 animate-pulse-icon" /&gt;
      &lt;h2 className="text-3xl sm:text-4xl font-bold text-white mb-6"&gt;Pronto para Revolucionar Suas Apresentações?&lt;/h2&gt;
      &lt;p className="text-lg sm:text-xl text-slate-300 mb-10"&gt;
        Junte-se a milhares de usuários que já estão criando apresentações incríveis com a MercurIA.
        Experimente agora e veja a diferença!
      &lt;/p&gt;
      &lt;Link href="/page" passHref&gt;
        &lt;button
          className="px-12 py-5 bg-gradient-to-r from-pink-600 to-purple-700 hover:from-pink-500 hover:to-purple-600 font-bold rounded-lg text-white text-xl shadow-lg transform transition-all duration-300 ease-in-out hover:shadow-2xl hover-scale-lg"
        &gt;
          Começar Gratuitamente
        &lt;/button&gt;
      &lt;/Link&gt;
      &lt;p className="text-sm text-slate-400 mt-4"&gt;(Ou explore nossos planos)&lt;/p&gt; {/* Opcional */}
    &lt;/div&gt;
  &lt;/section&gt;

  {/* Rodapé */}
  &lt;footer className="bg-black/50 py-10 mt-12 border-t border-slate-700"&gt;
    &lt;div className="max-w-7xl mx-auto px-4 sm:px-8 text-center text-slate-400"&gt;
      &lt;p className="mb-2"&gt;&copy; {new Date().getFullYear()} MercurIA. Todos os direitos reservados.&lt;/p&gt;
      &lt;p className="text-sm"&gt;
        &lt;Link href="/termos" className="hover:text-cyan-400 transition-colors"&gt;Termos de Serviço&lt;/Link&gt; | &lt;Link href="/privacidade" className="hover:text-cyan-400 transition-colors"&gt;Política de Privacidade&lt;/Link&gt;
      &lt;/p&gt;
    &lt;/div&gt;
  &lt;/footer&gt;
&lt;/div&gt;

);
}