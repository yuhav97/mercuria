"use client";
import React from 'react';

const Page = () => {
  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="w-full bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center">
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">
                MercurIA
              </h1>
            </div>
          </div>
        </div>
      </header>
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-white mt-0 sm:rounded-b-xl shadow-none sm:shadow-2xl space-y-10 border-x-0 border-b-0 sm:border border-slate-300">
        <div className="hero text-center py-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4">Crie Apresentações Poderosas com MercurIA</h1>
          <p className="text-lg sm:text-xl text-slate-600 mb-8">Transforme suas ideias em apresentações impactantes com o poder da IA.</p>
          <button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150">Começar Agora</button>
        </div>
        <div className="benefits py-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6 text-center">Por que escolher MercurIA?</h2>
          <div className="benefit-cards flex flex-wrap justify-center gap-6">
            <div className="benefit-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 w-full sm:w-1/3">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Design Profissional</h3>
              <p className="text-slate-600">Crie apresentações com designs modernos e profissionais.</p>
            </div>
            <div className="benefit-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 w-full sm:w-1/3">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Assistência de IA</h3>
              <p className="text-slate-600">Receba sugestões personalizadas de conteúdo e layout.</p>
            </div>
            <div className="benefit-card bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 w-full sm:w-1/3">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Facilidade de Uso</h3>
              <p className="text-slate-600">Interface intuitiva para criar apresentações sem complicações.</p>
            </div>
          </div>
        </div>
        <div className="how-it-works py-12 bg-slate-50">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6 text-center">Como funciona o MercurIA?</h2>
          <div className="steps flex flex-wrap justify-center gap-6">
            <div className="step bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 w-full sm:w-1/4">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">1. Forneça seu Conteúdo</h3>
              <p className="text-slate-600">Digite ou carregue seu texto, pontos chave, ou rascunho.</p>
            </div>
            <div className="step bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 w-full sm:w-1/4">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">2. Personalize</h3>
              <p className="text-slate-600">Defina o tom de voz, estilo, e outras opções de personalização.</p>
            </div>
            <div className="step bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 w-full sm:w-1/4">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">3. Deixe a IA Trabalhar</h3>
              <p className="text-slate-600">Nossa IA processa seu conteúdo e cria uma apresentação personalizada.</p>
            </div>
            <div className="step bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 w-full sm:w-1/4">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">4. Reveja e Compartilhe</h3>
              <p className="text-slate-600">Reveja sua apresentação e compartilhe com o mundo.</p>
            </div>
          </div>
        </div>
        <div className="call-to-action text-center py-12 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Pronto para criar sua primeira apresentação?</h2>
          <button className="bg-white text-cyan-600 hover:bg-slate-100 font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150">Começar Agora</button>
        </div>
      </main>
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-8 text-center text-sm text-slate-600 border-t border-slate-200">
        <p>&copy; {new Date().getFullYear()} MercurIA. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Page;
