"use client";

import { useState, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
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

export default function Page() {
  const [originalText, setOriginalText] = useState("");
  const [improvedText, setImprovedText] = useState("");
  const [slideCount, setSlideCount] = useState(3);
  const [selectedTone, setSelectedTone] = useState("Profissional");
  const [selectedFormat, setSelectedFormat] = useState("Bullet points");
  const [message, setMessage] = useState("");

  const rewriteContent = async (text: string): Promise<string> => {
    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          tone: selectedTone,
          format: selectedFormat,
          slides: slideCount,
          model: "gpt-4-turbo",
          persona: `Você é um revisor e estruturador de conteúdo com ampla experiência em transformar textos e informações em apresentações de PowerPoint altamente profissionais, claras, didáticas e visualmente organizadas. Seu objetivo é revisar o conteúdo recebido, extrair os pontos mais relevantes e estruturá-los de forma lógica, pedagógica e impactante, sempre considerando princípios de design instrucional que promovem compreensão, retenção e engajamento.

Você aplica técnicas de hierarquização da informação, chunking (quebra de conteúdo em blocos digestíveis), uso estratégico de recursos visuais e definição clara de objetivos de aprendizagem, quando aplicável. Sua comunicação visual é planejada para facilitar o aprendizado, respeitar o perfil do público-alvo (executivo, técnico, comercial ou acadêmico) e reforçar as mensagens centrais de forma acessível e eficaz.

Você adapta o tom, o ritmo e a linguagem da apresentação com base na intenção do usuário, seja para ensinar, convencer ou informar, e sempre garante que o conteúdo seja visualmente limpo, conciso e com narrativa fluida. Sua abordagem é detalhista e busca explorar os conceitos com profundidade, contextualizando, explicando e enriquecendo cada ponto com exemplos e desdobramentos práticos.`
        }),
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
    await exportPPTX(blocks, titles);
    setMessage("📥 Apresentação exportada com sucesso!");
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10 bg-gradient-to-br from-slate-100 to-white text-gray-900 min-h-screen">
      <Card className="shadow-xl border border-gray-100 rounded-3xl backdrop-blur-md bg-white/90">
        <CardContent>
          <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">🎯 Geração Inteligente de Apresentações</h1>

          <section className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-2">Conteúdo original:</h2>
              <Textarea
                placeholder="Cole seu conteúdo aqui..."
                rows={10}
                value={originalText}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setOriginalText(e.target.value)}
                className="rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Conteúdo melhorado:</h2>
              <Textarea
                placeholder="O conteúdo melhorado aparecerá aqui..."
                rows={10}
                value={improvedText}
                readOnly
                className="rounded-xl bg-gray-50 border border-gray-200 shadow-inner"
              />
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <label className="block text-sm font-medium mb-1">Tom de voz desejado:</label>
              <select
                className="rounded-xl border border-gray-300 px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400"
                value={selectedTone}
                onChange={(e) => setSelectedTone(e.target.value)}
              >
                {toneOptions.map(({ label, description }) => (
                  <option key={label} value={label}>
                    {label} – {description}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Formato da apresentação:</label>
              <select
                className="rounded-xl border border-gray-300 px-3 py-2 w-full shadow-sm focus:ring-2 focus:ring-blue-400"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
              >
                {formatOptions.map(({ label, description }) => (
                  <option key={label} value={label}>
                    {label} – {description}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <label htmlFor="slides" className="font-medium">Qtd de slides:</label>
            <Input
              id="slides"
              type="number"
              min={1}
              max={20}
              value={slideCount}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSlideCount(Number(e.target.value))}
              className="w-24 rounded-xl"
            />
            <Button className="rounded-full bg-blue-600 hover:bg-blue-700 transition-all px-6 py-2 text-white font-semibold shadow-md" onClick={handleRewrite}>
              ✨ Melhorar Conteúdo com IA
            </Button>
            <Button className="rounded-full bg-green-600 hover:bg-green-700 transition-all px-6 py-2 text-white font-semibold shadow-md" onClick={handleExport}>
              📊 Exportar para PPTX
            </Button>
          </div>

          {message && (
            <div className="mt-6 text-sm text-blue-800 bg-blue-100 border border-blue-300 p-3 rounded-lg shadow-sm">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
