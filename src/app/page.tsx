"use client";
import { useState, ChangeEvent, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportPPTX } from "./utils/exportPptx";

const voiceTones = [
  { label: "Profissional", description: "Objetivo, direto e com linguagem formal." },
  { label: "Didático", description: "Explicativo, com foco em facilitar o aprendizado." },
  { label: "Técnico", description: "Preciso, com uso de terminologia específica da área." },
  { label: "Executivo", description: "Clareza e foco em resultados, com tom estratégico." },
  { label: "Criativo", description: "Inovador, com analogias, metáforas e linguagem envolvente." },
  { label: "Motivacional", description: "Inspirador, com mensagens positivas e energizantes." },
  { label: "Persuasivo", description: "Voltado à conversão e convencimento, com argumentos fortes." },
  { label: "Institucional", description: "Formal, representando a voz de uma organização." },
  { label: "Acadêmico", description: "Estruturado, com embasamento teórico e linguagem formal." },
  { label: "Descontraído", description: "Informal, leve, como uma conversa entre amigos." }
];

const contentFormats = [
  { label: "Bullet points", description: "Resumo conciso com marcadores e tópicos curtos." },
  { label: "Blocos de texto", description: "Texto estruturado em parágrafos completos." }
];

const visualTemplates = [
  { value: "classic", label: "Clássico – Estrutura tradicional e legível" },
  { value: "modern", label: "Moderno – Visual limpo e contemporâneo" },
  { value: "dark", label: "Escuro – Estilo noturno com alto contraste" },
  { value: "minimal", label: "Minimalista – Foco no conteúdo, com design enxuto" },
  { value: "colorful", label: "Colorido – Visual vibrante e expressivo" },
  { value: "corporate", label: "Corporativo – Elegante e institucional" },
  { value: "gradient", label: "Gradiente – Fundos com transições suaves de cor" },
  { value: "illustrated", label: "Ilustrado – Com suporte a imagens baseadas no conteúdo gerado" }
];

export default function PresentationGenerator() {
  const [inputText, setInputText] = useState("");
  const [enhancedText, setEnhancedText] = useState("");
  const [numberOfSlides, setNumberOfSlides] = useState(3);
  const [chosenTone, setChosenTone] = useState("Profissional");
  const [chosenFormat, setChosenFormat] = useState("Bullet points");
  const [chosenTemplate, setChosenTemplate] = useState("classic");
  const [statusMessage, setStatusMessage] = useState("");
  const [spellingResults, setSpellingResults] = useState<{corrections: Array<{original: string, corrected: string}>, hasChanges: boolean} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const previewRef = useRef<HTMLTextAreaElement>(null);

  const performSpellCheck = async () => {
    if (!inputText.trim()) {
      setStatusMessage("⚠️ O conteúdo está vazio.");
      return;
    }
    
    setIsProcessing(true);
    setStatusMessage("🔍 Verificando ortografia...");
    
    try {
      const response = await fetch("/api/spell-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText })
      });
      
      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.hasChanges) {
        setInputText(result.correctedText);
        setSpellingResults(result);
        setStatusMessage(`✅ Ortografia corrigida! ${result.corrections.length} correções feitas.`);
      } else {
        setStatusMessage("✅ Nenhum erro ortográfico encontrado!");
        setSpellingResults(null);
      }
    } catch (error) {
      console.error("Erro na correção ortográfica:", error);
      setStatusMessage("❌ Erro ao corrigir ortografia. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const enhanceContentWithAI = async () => {
    if (!inputText.trim()) {
      setStatusMessage("⚠️ O conteúdo está vazio.");
      return;
    }
    
    setIsProcessing(true);
    setStatusMessage("🤖 Melhorando conteúdo com IA...");
    
    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          tone: chosenTone,
          format: chosenFormat,
          slides: numberOfSlides
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
      }
      
      const result = await response.json();
      setEnhancedText(result.rewrittenText);
      setStatusMessage("✅ Conteúdo melhorado com sucesso!");
      
    } catch (error) {
      console.error("Erro ao melhorar conteúdo:", error);
      setStatusMessage("❌ Erro ao processar com IA. Verifique sua chave OpenAI.");
    } finally {
      setIsProcessing(false);
    }
  };

  const generateSlideImages = async (textBlocks: string[]) => {
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompts: textBlocks })
      });
      
      if (!response.ok) return [];
      
      const result = await response.json();
      return result.imageUrls || [];
    } catch (error) {
      console.error("Erro ao gerar imagens:", error);
      return [];
    }
  };

  const exportPresentation = async () => {
    if (!enhancedText.trim()) {
      setStatusMessage("⚠️ Primeiro melhore o conteúdo com IA.");
      return;
    }
    
    setIsProcessing(true);
    setStatusMessage("📊 Gerando apresentação...");
    
    try {
      const slideBlocks = enhancedText.split(/\n{2,}/).slice(0, numberOfSlides);
      const slideTitles = slideBlocks.map((_, index) => `Slide ${index + 1}`);
      
      let slideImages: string[] = [];
      if (chosenTemplate === "illustrated") {
        setStatusMessage("🖼️ Gerando imagens...");
        slideImages = await generateSlideImages(slideBlocks);
      }
      
      await exportPPTX(slideBlocks, slideTitles, chosenTemplate, slideImages);
      setStatusMessage("📥 Apresentação exportada com sucesso!");
      
    } catch (error) {
      console.error("Erro ao exportar:", error);
      setStatusMessage("❌ Erro ao gerar apresentação.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-slate-100 to-white text-gray-900 min-h-screen">
      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <h1 className="text-4xl font-bold text-blue-700">🎯 Geração Inteligente de Apresentações</h1>
          
          <Textarea
            placeholder="Cole seu conteúdo aqui..."
            rows={8}
            value={inputText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
            className="rounded-xl shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tom de voz:</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                value={chosenTone}
                onChange={(e) => setChosenTone(e.target.value)}
                disabled={isProcessing}
              >
                {voiceTones.map(({ label }) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Formato:</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                value={chosenFormat}
                onChange={(e) => setChosenFormat(e.target.value)}
                disabled={isProcessing}
              >
                {contentFormats.map(({ label }) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Qtd de slides:</label>
              <Input
                type="number"
                min={1}
                max={20}
                value={numberOfSlides}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setNumberOfSlides(Number(e.target.value))}
                className="rounded-xl w-full"
                disabled={isProcessing}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Template visual:</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                value={chosenTemplate}
                onChange={(e) => setChosenTemplate(e.target.value)}
                disabled={isProcessing}
              >
                {visualTemplates.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={performSpellCheck} 
              disabled={isProcessing}
              className="rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 shadow-md disabled:opacity-50"
            >
              📝 Corrigir Ortografia
            </Button>
            <Button 
              onClick={enhanceContentWithAI} 
              disabled={isProcessing}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-md disabled:opacity-50"
            >
              ✨ Melhorar com IA
            </Button>
            <Button 
              onClick={exportPresentation} 
              disabled={isProcessing}
              className="rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 shadow-md disabled:opacity-50"
            >
              📊 Exportar PPTX
            </Button>
          </div>
          
          {statusMessage && (
            <p className="text-blue-800 bg-blue-100 border border-blue-300 p-3 rounded-lg shadow-sm">
              {statusMessage}
            </p>
          )}
          
          {spellingResults && spellingResults.hasChanges && (
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">📝 Correções realizadas:</h3>
              <div className="space-y-1">
                {spellingResults.corrections.map((correction, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-red-600 line-through">{correction.original}</span>
                    <span className="mx-2">→</span>
                    <span className="text-green-600 font-medium">{correction.corrected}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Pré-visualização do conteúdo:</h2>
          <Textarea
            ref={previewRef}
            value={enhancedText}
            onChange={(e) => setEnhancedText(e.target.value)}
            rows={18}
            className="rounded-xl bg-gray-50 border border-gray-200 shadow-inner w-full h-full"
            placeholder="O conteúdo melhorado aparecerá aqui..."
          />
        </section>
      </div>
    </main>
  );
}
