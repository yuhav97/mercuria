"use client";
import { useState, ChangeEvent, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportPPTX } from "../utils/exportPptx";

const voiceStyles = [
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

const outputFormats = [
  { label: "Bullet points", description: "Resumo conciso com marcadores e tópicos curtos." },
  { label: "Blocos de texto", description: "Texto estruturado em parágrafos completos." }
];

const designTemplates = [
  { value: "classic", label: "Clássico – Estrutura tradicional e legível" },
  { value: "modern", label: "Moderno – Visual limpo e contemporâneo" },
  { value: "dark", label: "Escuro – Estilo noturno com alto contraste" },
  { value: "minimal", label: "Minimalista – Foco no conteúdo, com design enxuto" },
  { value: "colorful", label: "Colorido – Visual vibrante e expressivo" },
  { value: "corporate", label: "Corporativo – Elegante e institucional" },
  { value: "gradient", label: "Gradiente – Fundos com transições suaves de cor" },
  { value: "illustrated", label: "Ilustrado – Com suporte a imagens baseadas no conteúdo gerado" }
];

export default function PresentationMaker() {
  const [sourceText, setSourceText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [slideQuantity, setSlideQuantity] = useState(3);
  const [selectedVoice, setSelectedVoice] = useState("Profissional");
  const [selectedFormat, setSelectedFormat] = useState("Bullet points");
  const [selectedDesign, setSelectedDesign] = useState("classic");
  const [currentMessage, setCurrentMessage] = useState("");
  const [correctionData, setCorrectionData] = useState<{corrections: Array<{original: string, corrected: string}>, hasChanges: boolean} | null>(null);
  const [isWorking, setIsWorking] = useState(false);
  const textPreviewRef = useRef<HTMLTextAreaElement>(null);

  const fixSpellingErrors = async () => {
    if (!sourceText.trim()) {
      setCurrentMessage("⚠️ Digite algum conteúdo primeiro.");
      return;
    }
    
    setIsWorking(true);
    setCurrentMessage("🔍 Analisando ortografia...");
    
    try {
      const apiResponse = await fetch("/api/spell-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sourceText })
      });
      
      if (!apiResponse.ok) {
        throw new Error(`Falha na API: ${apiResponse.status}`);
      }
      
      const responseData = await apiResponse.json();
      
      if (responseData.hasChanges) {
        setSourceText(responseData.correctedText);
        setCorrectionData(responseData);
        setCurrentMessage(`✅ Ortografia corrigida! ${responseData.corrections.length} correções aplicadas.`);
      } else {
        setCurrentMessage("✅ Nenhum erro ortográfico detectado!");
        setCorrectionData(null);
      }
    } catch (error) {
      console.error("Falha na correção:", error);
      setCurrentMessage("❌ Erro na correção ortográfica. Tente novamente.");
    } finally {
      setIsWorking(false);
    }
  };

  const improveWithAI = async () => {
    if (!sourceText.trim()) {
      setCurrentMessage("⚠️ Digite algum conteúdo primeiro.");
      return;
    }
    
    setIsWorking(true);
    setCurrentMessage("🤖 Processando com inteligência artificial...");
    
    try {
      const apiResponse = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: sourceText,
          tone: selectedVoice,
          format: selectedFormat,
          slides: slideQuantity
        })
      });
      
      if (!apiResponse.ok) {
        const errorInfo = await apiResponse.json();
        throw new Error(errorInfo.error || `Falha na API: ${apiResponse.status}`);
      }
      
      const responseData = await apiResponse.json();
      setProcessedText(responseData.rewrittenText);
      setCurrentMessage("✅ Conteúdo aprimorado com sucesso!");
      
    } catch (error) {
      console.error("Falha no processamento IA:", error);
      setCurrentMessage("❌ Erro no processamento IA. Verifique sua chave OpenAI.");
    } finally {
      setIsWorking(false);
    }
  };

  const createSlideImages = async (contentBlocks: string[]) => {
    try {
      const apiResponse = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompts: contentBlocks })
      });
      
      if (!apiResponse.ok) return [];
      
      const responseData = await apiResponse.json();
      return responseData.imageUrls || [];
    } catch (error) {
      console.error("Falha na geração de imagens:", error);
      return [];
    }
  };

  const buildPresentation = async () => {
    if (!processedText.trim()) {
      setCurrentMessage("⚠️ Primeiro processe o conteúdo com IA.");
      return;
    }
    
    setIsWorking(true);
    setCurrentMessage("📊 Construindo apresentação...");
    
    try {
      const contentBlocks = processedText.split(/\n{2,}/).slice(0, slideQuantity);
      const slideHeaders = contentBlocks.map((_, idx) => `Slide ${idx + 1}`);
      
      let slideVisuals: string[] = [];
      if (selectedDesign === "illustrated") {
        setCurrentMessage("🖼️ Gerando elementos visuais...");
        slideVisuals = await createSlideImages(contentBlocks);
      }
      
      await exportPPTX(contentBlocks, slideHeaders, selectedDesign, slideVisuals);
      setCurrentMessage("📥 Apresentação criada e baixada!");
      
    } catch (error) {
      console.error("Falha na criação:", error);
      setCurrentMessage("❌ Erro na criação da apresentação.");
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-slate-100 to-white text-gray-900 min-h-screen">
      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <h1 className="text-4xl font-bold text-blue-700">🎯 Criador de Apresentações IA</h1>
          
          <Textarea
            placeholder="Insira seu conteúdo aqui..."
            rows={8}
            value={sourceText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setSourceText(e.target.value)}
            className="rounded-xl shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500"
            disabled={isWorking}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Estilo de voz:</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                disabled={isWorking}
              >
                {voiceStyles.map(({ label }) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Formato de saída:</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                disabled={isWorking}
              >
                {outputFormats.map(({ label }) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Quantidade de slides:</label>
              <Input
                type="number"
                min={1}
                max={20}
                value={slideQuantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSlideQuantity(Number(e.target.value))}
                className="rounded-xl w-full"
                disabled={isWorking}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Design da apresentação:</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                value={selectedDesign}
                onChange={(e) => setSelectedDesign(e.target.value)}
                disabled={isWorking}
              >
                {designTemplates.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={fixSpellingErrors} 
              disabled={isWorking}
              className="rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 shadow-md disabled:opacity-50"
            >
              📝 Corrigir Texto
            </Button>
            <Button 
              onClick={improveWithAI} 
              disabled={isWorking}
              className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-md disabled:opacity-50"
            >
              ✨ Processar com IA
            </Button>
            <Button 
              onClick={buildPresentation} 
              disabled={isWorking}
              className="rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 shadow-md disabled:opacity-50"
            >
              📊 Criar PPTX
            </Button>
          </div>
          
          {currentMessage && (
            <p className="text-blue-800 bg-blue-100 border border-blue-300 p-3 rounded-lg shadow-sm">
              {currentMessage}
            </p>
          )}
          
          {correctionData && correctionData.hasChanges && (
            <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">📝 Correções aplicadas:</h3>
              <div className="space-y-1">
                {correctionData.corrections.map((fix, idx) => (
                  <div key={idx} className="text-sm">
                    <span className="text-red-600 line-through">{fix.original}</span>
                    <span className="mx-2">→</span>
                    <span className="text-green-600 font-medium">{fix.corrected}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Visualização do resultado:</h2>
          <Textarea
            ref={textPreviewRef}
            value={processedText}
            onChange={(e) => setProcessedText(e.target.value)}
            rows={18}
            className="rounded-xl bg-gray-50 border border-gray-200 shadow-inner w-full h-full"
            placeholder="O conteúdo processado será exibido aqui..."
          />
        </section>
      </div>
    </main>
  );
}