"use client";
import { useState, ChangeEvent, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exportPPTX } from "./utils/exportPptx";

const toneOptions = [
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

const formatOptions = [
  { label: "Bullet points", description: "Resumo conciso com marcadores e tópicos curtos." },
  { label: "Blocos de texto", description: "Texto estruturado em parágrafos completos." }
];

const templateOptions = [
  { value: "classic", label: "Clássico – Estrutura tradicional e legível" },
  { value: "modern", label: "Moderno – Visual limpo e contemporâneo" },
  { value: "dark", label: "Escuro – Estilo noturno com alto contraste" },
  { value: "minimal", label: "Minimalista – Foco no conteúdo, com design enxuto" },
  { value: "colorful", label: "Colorido – Visual vibrante e expressivo" },
  { value: "corporate", label: "Corporativo – Elegante e institucional" },
  { value: "gradient", label: "Gradiente – Fundos com transições suaves de cor" },
  { value: "illustrated", label: "Ilustrado – Com suporte a imagens baseadas no conteúdo gerado" }
];

export default function Page() {
  const [originalText, setOriginalText] = useState("");
  const [improvedText, setImprovedText] = useState("");
  const [slideCount, setSlideCount] = useState(3);
  const [selectedTone, setSelectedTone] = useState("Profissional");
  const [selectedFormat, setSelectedFormat] = useState("Bullet points");
  const [selectedTemplate, setSelectedTemplate] = useState("classic");
  const [message, setMessage] = useState("");
  const draftRef = useRef<HTMLTextAreaElement>(null);

  const rewriteContent = async (text: string): Promise<string> => {
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          tone: selectedTone,
          format: selectedFormat,
          slides: slideCount,
          model: "gpt-4-turbo"
        })
      });
      if (!res.ok) throw new Error("Erro na requisição");
      const data = await res.json();
      return data.rewrittenText;
    } catch (error) {
      console.error("Erro ao reescrever texto:", error);
      setMessage("❌ Erro ao processar o conteúdo com IA.");
      return text;
    }
  };

  const generateImages = async (texts: string[]) => {
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompts: texts })
      });
      const data = await res.json();
      return data.imageUrls;
    } catch (err) {
      console.error("Erro ao gerar imagens:", err);
      return Array(texts.length).fill(null);
    }
  };

  const handleRewrite = async () => {
    if (!originalText.trim()) {
      setMessage("⚠️ O conteúdo está vazio.");
      return;
    }
    const improved = await rewriteContent(originalText);
    setImprovedText(improved);
    setMessage("✅ Conteúdo melhorado com sucesso!");
  };

  const handleExport = async () => {
    if (!improvedText.trim()) {
      setMessage("⚠️ O conteúdo está vazio.");
      return;
    }
    const blocks = improvedText.split(/\n{2,}/).slice(0, slideCount);
    const titles = blocks.map((_, i) => `Slide ${i + 1}`);
    const images = selectedTemplate === "illustrated" ? await generateImages(blocks) : [];
    await exportPPTX(blocks, titles, selectedTemplate, images);
    setMessage("📥 Apresentação exportada com sucesso!");
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-slate-100 to-white text-gray-900 min-h-screen">
      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-6">
          <h1 className="text-4xl font-bold text-blue-700">🎯 Geração Inteligente de Apresentações</h1>
          <Textarea
            placeholder="Cole seu conteúdo aqui..."
            rows={8}
            value={originalText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setOriginalText(e.target.value)}
            className="rounded-xl shadow-sm border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Tom de voz:</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
              >
                {toneOptions.map(({ label }) => (
                  <option key={label} value={label}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Formato:</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                {formatOptions.map(({ label }) => (
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
                value={slideCount}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSlideCount(Number(e.target.value))}
                className="rounded-xl w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Template visual:</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-400"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                {templateOptions.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
            <Button onClick={handleRewrite} className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 shadow-md">
              ✨ Melhorar com IA
            </Button>
            <Button onClick={handleExport} className="rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 shadow-md">
              📊 Exportar PPTX
            </Button>
          </div>
          {message && <p className="text-blue-800 bg-blue-100 border border-blue-300 p-3 rounded-lg shadow-sm">{message}</p>}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Pré-visualização do conteúdo:</h2>
          <Textarea
            ref={draftRef}
            value={improvedText}
            onChange={(e) => setImprovedText(e.target.value)}
            rows={18}
            className="rounded-xl bg-gray-50 border border-gray-200 shadow-inner w-full h-full"
          />
        </section>
      </div>
    </main>
  );
}
