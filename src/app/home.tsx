"use client";

import Link from 'next/link';
import { Poppins } from 'next/font/google';
import { AiOutlineRocket } from 'react-icons/ai';
import { GiArtificialIntelligence } from 'react-icons/gi';
import { FaPalette } from 'react-icons/fa';
import { MdDesignServices } from 'react-icons/md';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'] }); // Corrigido: weights -> weight

export default function Home() {
  return (
    <div className={`${poppins.className} min-h-screen bg-gradient-to-r from-indigo-900 via-purple-800 to-pink-600 text-white`}>
      {/* Estilos inline para animações */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
        .hover-scale {
          transition: all 0.3s;
        }
        .hover-scale:hover { /* Corrigido: sintaxe do hover */
          transform: scale(1.03);
          box-shadow: 0 0 25px rgba(74, 172, 255, 0.5);
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-black/30 backdrop-blur-lg px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center">
          <h1 className="text-3xl font-extrabold text-white flex items-center"> {/* Adicionado flex e items-center para alinhar o ícone */}
            MercurIA
            <GiArtificialIntelligence size={32} className="ml-2 animate-pulse text-cyan-400" />
          </h1>
        </div>
      </header>

      {/* Seção Hero */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-black/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg shadow-cyan-900/50">
          <h2 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 mb-8">
            Crie Apresentações Poderosas
          </h2>
          <Link href="page" passHref> {/* passHref é uma boa prática com botões ou elementos customizados dentro do Link */}
            <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-600 hover:to-cyan-500 font-semibold rounded-lg text-white transition-shadow hover-scale"> {/* Adicionado hover-scale aqui também se desejado */}
              Começar Agora
            </button>
          </Link>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 - Design Profissional */}
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-6 hover:shadow-lg hover-scale">
            <FaPalette size={40} className="text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white">Design Profissional</h3>
            <p className="text-slate-400">Criações modernas e personalizáveis</p>
          </div>

          {/* Card 2 - Recursos Avançados */}
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-6 hover:shadow-lg hover-scale">
            <MdDesignServices size={40} className="text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white">Recursos Avançados</h3>
            <p className="text-slate-400">Ferramentas inteligentes e intuitivas</p>
          </div>

          {/* Card 3 - Performance */}
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-6 hover:shadow-lg hover-scale">
            <AiOutlineRocket size={40} className="text-cyan-400 mb-4" />
            <h3 className="text-xl font-semibold text-white">Alta Performance</h3>
            <p className="text-slate-400">Velocidade e responsividade garantidas</p>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="bg-gradient-to-r from-indigo-900 to-purple-900 py-6 mt-12">
        <div className="max-w-7xl mx-auto text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} MercurIA. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
