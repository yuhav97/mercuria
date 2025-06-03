"use client";

import { Poppins } from 'next/font/google';
import { AiOutlineRocket, GiArtificialIntelligence, FaPalette, MdDesignServices } from 'react-icons/all';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] });

export default function Home() {
  return (
    <div className={`${poppins.className} min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-600 text-white font-sans`}>
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-black/30 backdrop-blur-lg px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            MercurIA
            <GiArtificialIntelligence size={32} className="inline-block ml-2 animate-pulse text-cyan-400" />
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-black/60 backdrop-blur-lg rounded-3xl p-8 sm:p-12 shadow-lg shadow-cyan-900/50">
          <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 text-white bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">
            Crie Apresentações Poderosas com MercurIA
          </h2>
          <p className="text-lg text-slate-200 mb-8">
            Transforme suas ideias em apresentações impactantes com o poder da IA.
          </p>
          <Link href="/page">
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-600 hover:to-cyan-500 
              hover:scale-105 transition-all duration-300 
              text-white font-semibold rounded-lg shadow-md shadow-cyan-900/50 
              focus:outline-none focus:ring-2 focus:ring-cyan-400">
              Começar Agora
            </button>
          </Link>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        <h3 className="text-3xl font-bold text-center text-white mb-12">
          Por que escolher MercurIA?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <FaPalette size={40} className="text-cyan-400 mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Design Profissional</h4>
            <p className="text-slate-400">Crie apresentações com designs modernos e profissionais.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <GiArtificialIntelligence size={40} className="text-cyan-400 mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Assistência de IA</h4>
            <p className="text-slate-400">Sugestões personalizadas de conteúdo e layout.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
            <MdDesignServices size={40} className="text-cyan-400 mb-4" />
            <h4 className="text-xl font-semibold text-white mb-2">Facilidade de Uso</h4>
            <p className="text-slate-400">Interface intuitiva e intuitiva.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gradient-to-b from-indigo-900 to-purple-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h3 className="text-3xl font-bold text-center text-white mb-12">
            Como funciona o MercurIA?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Step 1 */}
            <div className="bg-black/60 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <AiOutlineRocket size={40} className="text-cyan-400 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">1. Forneça seu Conteúdo</h4>
              <p className="text-slate-400">Digite ou carregue seu texto, pontos-chave ou rascunho.</p>
            </div>
            {/* Step 2 */}
            <div className="bg-black/60 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <GiArtificialIntelligence size={40} className="text-cyan-400 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">2. Personalize</h4>
              <p className="text-slate-400">Defina opções como tom de voz e estilo.</p>
            </div>
            {/* Step 3 */}
            <div className="bg-black/60 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <AiOutlineRocket size={40} className="text-cyan-400 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">3. Gere sua Apresentação</h4>
              <p className="text-slate-400">A IA gera uma apresentação em segundos.</p>
            </div>
            {/* Step 4 */}
            <div className="bg-black/60 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <AiOutlineRocket size={40} className="text-cyan-400 mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">4. Baixe ou Compartilhe</h4>
              <p className="text-slate-400">Exporte em PDF, PPT ou compartilhe diretamente.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="bg-black/50 rounded-3xl p-8 sm:p-12 shadow-lg shadow-cyan-900/50">
            <h2 className="text-4xl font-extrabold text-white mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">
              Pronto para criar sua apresentação?
            </h2>
            <Link href="/page">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-600 hover:to-cyan-500 
                hover:scale-105 transition-all duration-200 
                text-white font-semibold rounded-lg shadow-md shadow-cyan-900/50 
                focus:outline-none focus:ring-2 focus:ring-cyan-400">
                Começar Agora
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col items-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} MercurIA. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
