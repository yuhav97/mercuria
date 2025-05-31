"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Loader2, FileText, Palette, Layers, UploadCloud, Wand2, Download, Mic2, ListChecks, Edit3, CheckCircle, Zap, Lightbulb, CornerDownRight, XCircle, Image as ImageIcon, BarChart3, SpellCheck, LayoutDashboard, FileEdit } from 'lucide-react';

// Componente para ícones
const Icon = (// Componente para ícones

// --- Início da Definição do Componente Icon ---

// Lista dos nomes de ícones válidos
const validIconNames = [
  'loader', 'file', 'palette', 'layers', 'upload', 'wand',
  'download', 'mic', 'listChecks', 'edit3', 'checkCircle',
  'zap', 'lightbulb', 'cornerDownRight', 'xCircle', 'image',
  'barChart', 'spellCheck', 'layoutDashboard', 'fileEdit'
] as const; // 'as const' torna os valores do array literais somente leitura

// Gera o tipo IconName a partir do array
type IconName = typeof validIconNames[number];

interface IconProps {
  name: IconName;
  className?: string;
}

const Icon = ({ name, className }: IconProps): JSX.Element | null => {
  const iconsList: { [key in IconName]: JSX.Element } = {
    loader: <Loader2 className={`animate-spin ${className || ''}`} />,
    file: <FileText className={className} />,
    palette: <Palette className={className} />,
    layers: <Layers className={className} />,
    upload: <UploadCloud className={className} />,
    wand: <Wand2 className={className} />,
    download: <Download className={className} />,
    mic: <Mic2 className={className} />,
    listChecks: <ListChecks className={className} />,
    edit3: <Edit3 className={className} />,
    checkCircle: <CheckCircle className={className} />,
    zap: <Zap className={className} />,
    lightbulb: <Lightbulb className={className} />,
    cornerDownRight: <CornerDownRight className={className} />,
    xCircle: <XCircle className={className} />,
    image: <ImageIcon className={className} />,
    barChart: <BarChart3 className={className} />,
    spellCheck: <SpellCheck className={className} />,
    layoutDashboard: <LayoutDashboard className={className} />,
    fileEdit: <FileEdit className={className} />,
  };

  if (validIconNames.includes(name)) {
    return iconsList[name];
  }

  console.warn(`Icone "${name}" não encontrado ou inválido.`);
  return null; 
};

// --- Fim da Definição do Componente Icon ---

// O resto do seu componente principal da página (App/HomePage) continua abaixo
// Exemplo:
// export default function HomePage() { ... }
// ou se o seu componente principal se chama App:
// export default function App() { ... }

// O resto do seu componente principal da página (App/HomePage) continua abaixo
// Exemplo:
// export default function HomePage() { ... }
// ou se o seu componente principal se chama App:
// export default function App() { ... }
};

// Componente principal da aplicação
export default function App() {
  const [currentStep, setCurrentStep] = useState('initialInput');
  
  const [contentInputMode, setContentInputMode] = useState('text');
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [numSlides, setNumSlides] = useState(10);
  const [primaryColor, setPrimaryColor] = useState('#2563EB');
  const [presentationTone, setPresentationTone] = useState('neutro');
  const [contentStyle, setContentStyle] = useState('bullet_points'); 
  const [includeImages, setIncludeImages] = useState(false);
  const [includeDataVisualization, setIncludeDataVisualization] = useState(false);
  const [aiReviewLevel, setAiReviewLevel] = useState('grammar_and_improvement');
  const [selectedDesignTemplate, setSelectedDesignTemplate] = useState('moderno');
  const [editableSlides, setEditableSlides] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [initialProcessedContent, setInitialProcessedContent] = useState('');
  const [suggestedFocuses, setSuggestedFocuses] = useState([]);
  const [selectedFocus, setSelectedFocus] = useState('');
    
  const [finalResult, setFinalResult] = useState(null);

  const toneOptions = [
    { value: 'muito_formal', label: 'Muito Formal (Corporativo, Acadêmico)' },
    { value: 'formal', label: 'Formal (Profissional, Informativo)' },
    { value: 'neutro', label: 'Neutro (Padrão, Equilibrado)' },
    { value: 'informal', label: 'Informal (Engajador, Casual)' },
    { value: 'bem_descontraido', label: 'Bem Descontraído (Criativo, Divertido)' },
  ];
  const contentStyleOptions = [
    { value: 'bullet_points', label: 'Mais Concisa (Foco em Bullet Points)' },
    { value: 'texto_corrido', label: 'Mais Detalhada (Textos Corridos)' },
  ];
  const aiReviewOptions = [
    { value: 'grammar_and_improvement', label: 'Revisão Gramatical e Melhoria do Conteúdo' },
    { value: 'grammar_only', label: 'Apenas Revisão Gramatical' },
    { value: 'none', label: 'Nenhuma Revisão (Usar Conteúdo Original)' },
  ];
  const designTemplateOptions = [
    { value: 'moderno', label: 'Moderno (Cores vibrantes, fontes limpas)' },
    { value: 'classico', label: 'Clássico (Elegante, tipografia tradicional)' },
    { value: 'criativo', label: 'Criativo (Layouts ousados, elementos gráficos)' },
    { value: 'minimalista', label: 'Minimalista (Simples, foco no conteúdo)' },
    { value: 'tecnologico', label: 'Tecnológico/Futurista (Cores escuras, destaques vibrantes)' },
    { value: 'natural', label: 'Natural/Orgânico (Tons terrosos, fontes suaves)' },
    { value: 'academico', label: 'Acadêmico Formal (Clareza, estrutura para dados)' },
    { value: 'retro', label: 'Retrô/Vintage (Nostálgico, paleta e fontes de época)' },
  ];
  
  const API_KEY = ""; 
  const API_URL_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  const callGeminiAPI = async (prompt) => {
    if (!API_KEY) {
        console.warn("API Key for Gemini not set. Simulating API call.");
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Simulações mais detalhadas para refletir a persona
        if (prompt.includes("sugira 3 a 5 possíveis focos")) {
            return "Foco Estratégico 1: Maximizando o ROI com Novas Tecnologias\nFoco Estratégico 2: Otimização de Processos para Eficiência Operacional\nFoco Estratégico 3: Desenvolvimento de Lideranças para o Futuro (Simulado por Revisor Experiente)";
        } else if (prompt.includes("Desenvolva o conteúdo DETALHADO E ESTRUTURADO")) {
            const slideCount = numSlides > 0 ? numSlides : 3;
            let simulatedStructuredContent = "";
            for (let i = 1; i <= slideCount; i++) {
                simulatedStructuredContent += "[SLIDE_START]\n";
                simulatedStructuredContent += `[TITLE]\nTítulo Impactante para Slide ${i} (Foco: ${selectedFocus}, Template: ${selectedDesignTemplate})\n`;
                simulatedStructuredContent += `[CONTENT]\n- Ponto chave ${i}.1, claro e conciso.\n- Elaboração do ponto ${i}.2 com dados ou exemplo relevante.\n- Conclusão ou chamada para ação do slide ${i} (Estruturado por Revisor IA).\n`;
                if (includeImages) {
                    simulatedStructuredContent += `[IMAGE_SUGGESTION]\n[Sugestão de imagem profissional: Conceito visual alinhado ao slide ${i} e template ${selectedDesignTemplate}]\n`;
                } else {
                     simulatedStructuredContent += `[IMAGE_SUGGESTION]\n(Nenhuma)\n`;
                }
                if (includeDataVisualization && i % 2 === 0) {
                    simulatedStructuredContent += `[DATAVIZ_SUGGESTION]\n[Sugestão de visualização de dados: Gráfico de linhas mostrando tendência para slide ${i}]\n`;
                } else {
                    simulatedStructuredContent += `[DATAVIZ_SUGGESTION]\n(Nenhuma)\n`;
                }
                simulatedStructuredContent += "[SLIDE_END]\n\n";
            }
            return simulatedStructuredContent;
        } else if (prompt.includes("Corrija apenas a gramática e a ortografia")) {
            return "Texto original com gramática e ortografia impecavelmente corrigidas, mantendo a voz do autor (Simulado por Revisor IA).";
        } else if (prompt.includes("Analise o seguinte texto e prepare-o para uma apresentação.")) {
             return "Conteúdo base minuciosamente revisado e otimizado para uma apresentação profissional, com foco em clareza, lógica e impacto (Simulado por Revisor IA).";
        }
        return "Resposta genérica da IA (simulada).";
    }
    const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
    const response = await fetch(API_URL_GEMINI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro da API Gemini:', errorData);
      throw new Error(`Falha na IA: ${errorData?.error?.message || response.statusText}`);
    }
    const data = await response.json();
    if (data.candidates && data.candidates.length > 0 &&
        data.candidates[0].content && data.candidates[0].content.parts &&
        data.candidates[0].content.parts.length > 0) {
      return data.candidates[0].content.parts[0].text;
    }
    throw new Error("Resposta inesperada da IA.");
  };

  const parseStructuredContentToSlides = (structuredContent) => {
    if (!structuredContent || typeof structuredContent !== 'string') return [];
    const slidesData = [];
    const slideBlocks = structuredContent.split("[SLIDE_START]");

    slideBlocks.forEach((block, index) => {
        if (block.trim() === "") return;
        const titleMatch = block.match(/\[TITLE\]\s*([\s\S]*?)\s*\[CONTENT\]/);
        const contentMatch = block.match(/\[CONTENT\]\s*([\s\S]*?)\s*\[IMAGE_SUGGESTION\]/);
        const imageSuggestionMatch = block.match(/\[IMAGE_SUGGESTION\]\s*([\s\S]*?)\s*\[DATAVIZ_SUGGESTION\]/);
        const dataVizSuggestionMatch = block.match(/\[DATAVIZ_SUGGESTION\]\s*([\s\S]*?)\s*\[SLIDE_END\]/);

        slidesData.push({
            id: `slide-${index}-${Date.now()}`,
            title: titleMatch ? titleMatch[1].trim() : `Slide ${index +1}`,
            content: contentMatch ? contentMatch[1].trim() : "",
            imageSuggestion: imageSuggestionMatch && imageSuggestionMatch[1].trim() !== "(Nenhuma)" ? imageSuggestionMatch[1].trim() : null,
            dataVizSuggestion: dataVizSuggestionMatch && dataVizSuggestionMatch[1].trim() !== "(Nenhuma)" ? dataVizSuggestionMatch[1].trim() : null,
        });
    });
    return slidesData;
  };
  
  const convertSlidesToStructuredContent = (slides) => {
    return slides.map(slide => {
        let slideStr = "[SLIDE_START]\n";
        slideStr += `[TITLE]\n${slide.title}\n`;
        slideStr += `[CONTENT]\n${slide.content}\n`;
        slideStr += `[IMAGE_SUGGESTION]\n${slide.imageSuggestion || "(Nenhuma)"}\n`;
        slideStr += `[DATAVIZ_SUGGESTION]\n${slide.dataVizSuggestion || "(Nenhuma)"}\n`;
        slideStr += "[SLIDE_END]";
        return slideStr;
    }).join("\n\n");
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { setError('O ficheiro é muito grande. Limite de 5MB.'); setUploadedFile(null); return; }
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!allowedTypes.includes(file.type)) { setError('Tipo de ficheiro inválido. Apenas PDF, DOC, DOCX, TXT são permitidos.'); setUploadedFile(null); return;}
      setUploadedFile(file); setError('');
    }
  };

  const handleInitialSubmit = async () => {
    if ((contentInputMode === 'file' && !uploadedFile) || (contentInputMode === 'text' && !inputText.trim())) {
      setError('Por favor, forneça o conteúdo.'); return;
    }
    if (numSlides <= 0) { setError('O número de slides deve ser maior que zero.'); return; }

    setIsLoading(true); setError(''); 
    setSuggestedFocuses([]); setSelectedFocus(''); 
    setRawContentForEditing(''); setEditableSlides([]);
    setFinalResult(null);

    try {
      let baseContent = inputText;
      if (contentInputMode === 'file' && uploadedFile) {
        baseContent = `Conteúdo do ficheiro: ${uploadedFile.name}.`;
        if (uploadedFile.type === 'text/plain') {
          try { baseContent = await uploadedFile.text(); } catch (e) { console.error("Erro ao ler ficheiro de texto:", e); baseContent = `Falha ao ler o ficheiro: ${uploadedFile.name}. Usando nome do ficheiro como conteúdo.`;}
        }
      }
      if (baseContent.length > 15000) {
          baseContent = baseContent.substring(0, 15000) + "... (conteúdo truncado devido ao tamanho)";
      }

      let processedContentForFocus = baseContent;
      const personaPrefix = "Você é um revisor e estruturador de conteúdo com ampla experiência em transformar textos e informações em apresentações de PowerPoint altamente profissionais, claras e visualmente organizadas. Seu objetivo é revisar o conteúdo recebido, extrair os pontos mais relevantes e estruturá-los de forma lógica e impactante para públicos variados, conforme a intenção e o estilo desejado pelo usuário.\n\n";

      if (aiReviewLevel === 'grammar_and_improvement') {
        const selectedToneLabel = toneOptions.find(t => t.value === presentationTone)?.label || presentationTone;
        const selectedContentStyleLabel = contentStyleOptions.find(s => s.value === contentStyle)?.label || contentStyle;
        const improvementPrompt = `${personaPrefix}Analise o seguinte texto e prepare-o para uma apresentação. Faça correções gramaticais e melhorias no conteúdo para clareza, coesão e impacto. Extraia os pontos mais relevantes e estruture-os de forma lógica. O tom da apresentação deve ser: ${selectedToneLabel}. O estilo de conteúdo preferido é: ${selectedContentStyleLabel}. Apresente o resultado de forma clara e organizada, pronta para ser a base para definir os focos da apresentação. Texto Original: "${baseContent}"`;
        processedContentForFocus = await callGeminiAPI(improvementPrompt);
      } else if (aiReviewLevel === 'grammar_only') {
        const grammarPrompt = `${personaPrefix}Corrija apenas a gramática e a ortografia do seguinte texto, mantendo o estilo e a estrutura o mais próximo possível do original. Não faça melhorias de conteúdo ou reescrita significativa. Retorne apenas o texto corrigido. Texto Original: "${baseContent}"`;
        processedContentForFocus = await callGeminiAPI(grammarPrompt);
      }
      
      setInitialProcessedContent(processedContentForFocus);

      const focusPrompt = `${personaPrefix}Baseado no seguinte texto (que já passou por uma revisão inicial conforme solicitado), sugira 3 a 5 possíveis focos ou vertentes principais para uma apresentação. Cada foco deve ser um título curto, conciso e impactante (máximo 10 palavras), refletindo os pontos mais relevantes do material. Liste cada foco em uma nova linha, sem numeração ou marcadores adicionais.
Texto para análise de foco: "${processedContentForFocus.substring(0, 3000)}..."`; 
      const focusesText = await callGeminiAPI(focusPrompt);
      setSuggestedFocuses(focusesText.split('\n').filter(f => f.trim() !== ''));
      
      setCurrentStep('selectFocus');
    } catch (err) {
      console.error("Erro na etapa inicial:", err);
      setError(err.message || 'Ocorreu um erro ao processar o conteúdo inicial.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocusSelectionAndGenerateForEditing = async (focus) => {
    setSelectedFocus(focus);
    setIsLoading(true); setError(''); setRawContentForEditing(''); setEditableSlides([]);

    try {
      const selectedToneLabel = toneOptions.find(t => t.value === presentationTone)?.label || presentationTone;
      const selectedContentStyleLabel = contentStyleOptions.find(s => s.value === contentStyle)?.label || contentStyle;
      const selectedDesignTemplateLabel = designTemplateOptions.find(d => d.value === selectedDesignTemplate)?.label || selectedDesignTemplate;
      const personaPrefix = "Você é um revisor e estruturador de conteúdo com ampla experiência em transformar textos e informações em apresentações de PowerPoint altamente profissionais, claras e visualmente organizadas.\n\n";

      const imagePromptPart = includeImages ? "\nPara cada slide, inclua uma sugestão textual para uma imagem ou ilustração relevante e profissional ao conteúdo, dentro da tag [IMAGE_SUGGESTION]. Se não houver sugestão, coloque (Nenhuma)." : "\nPara cada slide, na tag [IMAGE_SUGGESTION], coloque (Nenhuma).";
      const dataVizPromptPart = includeDataVisualization ? "\nSe o conteúdo do slide mencionar dados ou estatísticas, sugira uma visualização (gráfico/tabela) apropriada e clara na tag [DATAVIZ_SUGGESTION]. Se não, coloque (Nenhuma)." : "\nPara cada slide, na tag [DATAVIZ_SUGGESTION], coloque (Nenhuma).";
      
      const structuredContentPrompt = `${personaPrefix}Desenvolva o conteúdo DETALHADO E ESTRUTURADO para uma apresentação de aproximadamente ${numSlides} slides.
Foco principal da apresentação: "${focus}"
Conteúdo base (já revisado conforme nível de IA escolhido): "${initialProcessedContent.substring(0, 8000)}" 
Tom da apresentação: ${selectedToneLabel}.
Estilo de conteúdo preferido: ${selectedContentStyleLabel}.
Template de Design Escolhido: ${selectedDesignTemplateLabel}. Sua tarefa é estruturar o conteúdo de forma lógica e impactante, considerando este template para o tipo de linguagem, profundidade do conteúdo por slide e sugestões visuais.

FORMATE A SAÍDA EXATAMENTE ASSIM PARA CADA SLIDE:
[SLIDE_START]
[TITLE]
(Crie um título conciso, chamativo e profissional para este slide, alinhado ao foco e ao template)
[CONTENT]
(Desenvolva o conteúdo do slide aqui, usando ${contentStyle === 'bullet_points' ? 'bullet points claros, concisos e bem estruturados' : 'parágrafos explicativos curtos, mas informativos e bem escritos'}. Extraia os pontos mais relevantes do conteúdo base para este slide.)
${imagePromptPart}
${dataVizPromptPart}
[SLIDE_END]

Repita essa estrutura [SLIDE_START]...[SLIDE_END] para cada um dos ${numSlides} slides.
Certifique-se de que a apresentação flui de maneira lógica e que cada slide contribui para o objetivo geral.
NÃO inclua texto fora desta estrutura.
`;
      const structuredContentResult = await callGeminiAPI(structuredContentPrompt);
      setRawContentForEditing(structuredContentResult);
      const parsedSlides = parseStructuredContentToSlides(structuredContentResult);
      setEditableSlides(parsedSlides);
      setCurrentStep('editSlides');
    } catch (err) {
      console.error("Erro ao gerar conteúdo estruturado para edição:", err);
      setError(err.message || 'Ocorreu um erro ao gerar o rascunho detalhado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlideContentChange = (slideId, field, value) => {
    setEditableSlides(prevSlides =>
      prevSlides.map(slide =>
        slide.id === slideId ? { ...slide, [field]: value } : slide
      )
    );
  };
  
  const handleFinishEditing = () => {
    setIsLoading(true); setError('');
    const finalContentFromEditedSlides = convertSlidesToStructuredContent(editableSlides);

    setTimeout(() => {
      const selectedToneLabel = toneOptions.find(t => t.value === presentationTone)?.label || presentationTone;
      const selectedContentStyleLabel = contentStyleOptions.find(s => s.value === contentStyle)?.label || contentStyle;
      const selectedAiReviewLabel = aiReviewOptions.find(r => r.value === aiReviewLevel)?.label || aiReviewLevel;
      const selectedDesignTemplateLabel = designTemplateOptions.find(d => d.value === selectedDesignTemplate)?.label || selectedDesignTemplate;

      setFinalResult({
        message: 'Apresentação gerada com sucesso após sua edição! (Simulação)',
        fileName: `apresentacao_editada_${Date.now()}.pptx`,
        slides: editableSlides.length,
        color: primaryColor,
        tone: selectedToneLabel,
        style: selectedContentStyleLabel,
        focus: selectedFocus,
        approvedContent: finalContentFromEditedSlides,
        imagePreference: includeImages ? "Sim, com sugestões de imagens" : "Não incluir imagens",
        dataVizPreference: includeDataVisualization ? "Sim, com sugestões de gráficos/tabelas" : "Não incluir gráficos/tabelas",
        aiReviewType: selectedAiReviewLabel, 
        designTemplate: selectedDesignTemplateLabel,
      });
      setCurrentStep('finalResult');
      setIsLoading(false);
    }, 1500);
  };
  
  const resetFlow = () => {
    setCurrentStep('initialInput');
    setInputText(''); setUploadedFile(null);
    setInitialProcessedContent(''); setSuggestedFocuses([]); setSelectedFocus(''); 
    setRawContentForEditing(''); setEditableSlides([]);
    setFinalResult(null); setError(''); setIsLoading(false);
    setNumSlides(10); setPrimaryColor('#2563EB'); setPresentationTone('neutro');
    setContentStyle('bullet_points'); setIncludeImages(false);
    setIncludeDataVisualization(false);
    setAiReviewLevel('grammar_and_improvement'); 
    setSelectedDesignTemplate('moderno');
  };

  const colorInputStyle = { width: '100%', height: '40px', border: '1px solid #CBD5E1', borderRadius: '0.375rem', padding: '2px' };
  const logoUrl = "C:\Users\Yuri\mercuriatech\public"; 

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-8 flex flex-col items-center font-sans">
      <header className="w-full max-w-3xl mb-6 text-center">
        <Image src={logoUrl} alt="Logo MercurIA" className="h-12 sm:h-16 mx-auto mb-4" onError={(e) => { e.target.onerror = null; e.target.src="C:\Users\Yuri\mercuriatech\public"; }}/>
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-pink-500 to-indigo-600 mb-2">
          MercurIA: Apresentações Perfeitas em Instantes!
        </h1>
        <p className="text-slate-600 text-lg">Sua apresentação profissional com a ajuda da IA - simples e prático!</p>
      </header>

      <main className="w-full max-w-3xl bg-white p-6 sm:p-8 rounded-xl shadow-2xl space-y-6">
        {isLoading && (
            <div className="fixed inset-0 bg-slate-500/50 flex items-center justify-center z-50">
                <div className="flex flex-col items-center bg-white p-8 rounded-lg shadow-xl">
                <Icon name="loader" className="w-12 h-12 text-blue-600 mb-4" />
                <p className="text-xl text-slate-700">A processar com IA, aguarde...</p>
                </div>
            </div>
        )}
        {error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm flex items-center">
                <Icon name="xCircle" className="w-5 h-5 mr-2 shrink-0 text-red-600" />
                <span><strong>Erro:</strong> {error}</span>
                <button onClick={() => setError('')} className="ml-auto text-red-600 hover:text-red-800">&times;</button>
            </div>
        )}

        {currentStep === 'initialInput' && (
          <>
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Como quer fornecer o conteúdo?</label>
                <div className="flex space-x-4">
                    <button onClick={() => setContentInputMode('text')} className={`flex-1 py-2 px-4 rounded-md transition-colors ${contentInputMode === 'text' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>Digitar Texto</button>
                    <button onClick={() => setContentInputMode('file')} className={`flex-1 py-2 px-4 rounded-md transition-colors ${contentInputMode === 'file' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}>Carregar Ficheiro</button>
                </div>
            </div>
            <section>
                <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center">
                    <Icon name={contentInputMode === 'file' ? 'upload' : 'edit3'} className="w-6 h-6 mr-2 text-blue-600" />
                    1. {contentInputMode === 'file' ? 'Carregue o seu Conteúdo' : 'Insira o seu Conteúdo'}
                </h2>
                {contentInputMode === 'text' ? (
                    <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Digite ou cole o seu texto, bullet points, ou rascunho aqui..." rows="7" className="w-full p-3 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 placeholder-slate-400 text-slate-800"/>
                ) : (
                    <div className="w-full p-4 bg-slate-50 border-2 border-dashed border-slate-300 rounded-md text-center">
                        <input type="file" id="fileUpload" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" className="hidden"/>
                        <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                            <Icon name="upload" className="w-10 h-10 text-blue-600 mb-2" />
                            <span className="text-blue-600 font-semibold">Clique para carregar</span>
                            <span className="text-xs text-slate-500 mt-1">PDF, DOC, DOCX, TXT (Máx. 5MB)</span>
                        </label>
                        {uploadedFile && <p className="text-sm text-slate-600 mt-3">Selecionado: {uploadedFile.name} ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)</p>}
                    </div>
                )}
            </section>
            <section>
              <h2 className="text-xl font-semibold text-slate-800 mb-3 flex items-center">
                <Icon name="layers" className="w-6 h-6 mr-2 text-green-600" />
                2. Personalize a sua Apresentação
              </h2>
              <div className="mb-4">
                  <label htmlFor="designTemplate" className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                    <Icon name="layoutDashboard" className="w-5 h-5 mr-2 text-indigo-600" />
                    Template de Design
                  </label>
                  <select 
                    id="designTemplate" 
                    value={selectedDesignTemplate} 
                    onChange={(e) => setSelectedDesignTemplate(e.target.value)} 
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-800 appearance-none focus:ring-2 focus:ring-indigo-500" 
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}
                  >
                    {designTemplateOptions.map(o => <option key={o.value} value={o.value} className="bg-white text-slate-800">{o.label}</option>)}
                  </select>
              </div>
              <div className="mb-4">
                  <label htmlFor="aiReviewLevel" className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                    <Icon name="spellCheck" className="w-5 h-5 mr-2 text-orange-600" />
                    Nível de Revisão IA do Conteúdo
                  </label>
                  <select id="aiReviewLevel" value={aiReviewLevel} onChange={(e) => setAiReviewLevel(e.target.value)} className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-800 appearance-none focus:ring-2 focus:ring-orange-500" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                    {aiReviewOptions.map(o => <option key={o.value} value={o.value} className="bg-white text-slate-800">{o.label}</option>)}
                  </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                <div>
                  <label htmlFor="numSlides" className="block text-sm font-medium text-slate-700 mb-1">Nº de Slides</label>
                  <input type="number" id="numSlides" value={numSlides} onChange={(e) => setNumSlides(Math.max(1, parseInt(e.target.value,10)))} min="1" className="w-full p-2 bg-white border border-slate-300 rounded-md text-slate-800 focus:ring-2 focus:ring-green-500"/>
                </div>
                <div>
                  <label htmlFor="primaryColor" className="block text-sm font-medium text-slate-700 mb-1">Cor Primária</label>
                  <input type="color" id="primaryColor" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} style={colorInputStyle} className="w-full h-10 p-0 border-0 bg-white rounded-md cursor-pointer"/>
                </div>
                <div>
                  <label htmlFor="presentationTone" className="block text-sm font-medium text-slate-700 mb-1">Tom</label>
                  <select id="presentationTone" value={presentationTone} onChange={(e) => setPresentationTone(e.target.value)} className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-800 appearance-none focus:ring-2 focus:ring-green-500" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                    {toneOptions.map(o => <option key={o.value} value={o.value} className="bg-white text-slate-800">{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="contentStyle" className="block text-sm font-medium text-slate-700 mb-1">Estilo do Conteúdo</label>
                  <select id="contentStyle" value={contentStyle} onChange={(e) => setContentStyle(e.target.value)} className="w-full p-2.5 bg-white border border-slate-300 rounded-md text-slate-800 appearance-none focus:ring-2 focus:ring-green-500" style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>
                    {contentStyleOptions.map(o => <option key={o.value} value={o.value} className="bg-white text-slate-800">{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-3 mt-4">
                <label htmlFor="includeImages" className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" id="includeImages" checked={includeImages} onChange={(e) => setIncludeImages(e.target.checked)} className="form-checkbox h-5 w-5 text-purple-600 bg-white border-slate-400 rounded focus:ring-purple-500 focus:ring-offset-white"/>
                  <span className="text-sm font-medium text-slate-700 flex items-center"><Icon name="image" className="w-5 h-5 mr-2 text-purple-600" /> Incluir sugestões de imagens/ilustrações</span>
                </label>
                <label htmlFor="includeDataVisualization" className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" id="includeDataVisualization" checked={includeDataVisualization} onChange={(e) => setIncludeDataVisualization(e.target.checked)} className="form-checkbox h-5 w-5 text-sky-600 bg-white border-slate-400 rounded focus:ring-sky-500 focus:ring-offset-white"/>
                  <span className="text-sm font-medium text-slate-700 flex items-center"><Icon name="barChart" className="w-5 h-5 mr-2 text-sky-600" /> Sugerir gráficos/tabelas (se houver dados)</span>
                </label>
              </div>
            </section>
            <button onClick={handleInitialSubmit} disabled={isLoading} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md flex items-center justify-center text-lg disabled:opacity-70 disabled:bg-blue-400">
              <Icon name="zap" className="w-5 h-5 mr-2" /> Analisar Conteúdo e Sugerir Focos
            </button>
          </>
        )}

        {currentStep === 'selectFocus' && (
          <section className="animate-fadeIn">
            <h2 className="text-2xl font-semibold text-slate-800 mb-4 flex items-center">
              <Icon name="lightbulb" className="w-7 h-7 mr-3 text-yellow-500" />
              3. Escolha um Foco para a sua Apresentação
            </h2>
            <p className="text-slate-600 mb-1">Com base no seu conteúdo (processado conforme o nível de revisão IA e template escolhidos), sugerimos os seguintes focos. Selecione um para prosseguir para a edição dos slides:</p>
            {initialProcessedContent && <details className="mb-4 bg-slate-100 p-3 rounded-md text-xs">
                <summary className="cursor-pointer text-slate-600 hover:text-slate-800">Ver conteúdo base usado para sugestão de focos</summary>
                <pre className="whitespace-pre-wrap mt-2 max-h-32 overflow-y-auto text-slate-500 p-2 bg-slate-200/70 rounded">{initialProcessedContent}</pre>
            </details>}
            <div className="space-y-3">
              {suggestedFocuses.length > 0 ? (
                suggestedFocuses.map((focus, index) => (
                  <button key={index} onClick={() => handleFocusSelectionAndGenerateForEditing(focus)}
                    className="w-full text-left p-4 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-500">
                    <span className="text-slate-700">{focus}</span>
                  </button>
                ))
              ) : <p className="text-slate-500">Nenhum foco específico pôde ser sugerido.</p>}
            </div>
            <button onClick={resetFlow} className="mt-6 w-full text-sm text-slate-500 hover:text-slate-700 py-2">
              &larr; Voltar e Editar Informações Iniciais
            </button>
          </section>
        )}

        {currentStep === 'editSlides' && (
          <section className="animate-fadeIn">
            <h2 className="text-2xl font-semibold text-slate-800 mb-2 flex items-center">
              <Icon name="fileEdit" className="w-7 h-7 mr-3 text-cyan-600" />
              4. Edite os Slides da sua Apresentação
            </h2>
            <p className="text-slate-600 mb-4">Ajuste o título e o conteúdo de cada slide. As sugestões de imagens e gráficos são baseadas nas suas escolhas anteriores.</p>
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
              {editableSlides.map((slide, slideIndex) => (
                <div key={slide.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <h3 className="text-lg font-semibold text-cyan-700 mb-2">Slide {slideIndex + 1}</h3>
                  <div className="mb-3">
                    <label htmlFor={`title-${slide.id}`} className="block text-sm font-medium text-slate-700 mb-1">Título do Slide</label>
                    <input
                      type="text"
                      id={`title-${slide.id}`}
                      value={slide.title}
                      onChange={(e) => handleSlideContentChange(slide.id, 'title', e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-500 text-slate-800"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor={`content-${slide.id}`} className="block text-sm font-medium text-slate-700 mb-1">Conteúdo do Slide</label>
                    <textarea
                      id={`content-${slide.id}`}
                      value={slide.content}
                      onChange={(e) => handleSlideContentChange(slide.id, 'content', e.target.value)}
                      rows="5"
                      className="w-full p-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-cyan-500 text-slate-800"
                    />
                  </div>
                  {slide.imageSuggestion && (
                    <p className="text-xs text-purple-700 bg-purple-100 p-2 rounded-md">
                      <Icon name="image" className="w-4 h-4 inline mr-1" /> <strong>Sugestão de Imagem:</strong> {slide.imageSuggestion}
                    </p>
                  )}
                  {slide.dataVizSuggestion && (
                     <p className="text-xs text-sky-700 bg-sky-100 p-2 rounded-md mt-2">
                       <Icon name="barChart" className="w-4 h-4 inline mr-1" /> <strong>Sugestão de Gráfico/Tabela:</strong> {slide.dataVizSuggestion}
                     </p>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
               <button onClick={() => setCurrentStep('selectFocus')}
                className="w-full sm:w-auto flex-1 py-3 px-4 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center">
                <Icon name="cornerDownRight" className="w-5 h-5 mr-2 transform scale-x-[-1]" />
                Voltar e Escolher Outro Foco
              </button>
              <button onClick={handleFinishEditing} disabled={isLoading}
                className="w-full sm:w-auto flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md flex items-center justify-center disabled:opacity-70">
                <Icon name="checkCircle" className="w-5 h-5 mr-2" />
                Concluir Edição e Gerar Apresentação
              </button>
            </div>
          </section>
        )}

        {currentStep === 'finalResult' && finalResult && (
          <section className="mt-8 p-6 bg-slate-50 rounded-lg animate-fadeIn border border-slate-200">
            <h2 className="text-2xl font-semibold text-green-700 mb-4 flex items-center">
              <Icon name="download" className="w-7 h-7 mr-2" />
              A sua Apresentação está Pronta! (Simulação)
            </h2>
            <div className="space-y-1 text-slate-700 mb-4">
              <p><strong>Ficheiro:</strong> {finalResult.fileName}</p>
              <p><strong>Slides:</strong> {finalResult.slides}</p>
              <p><strong>Template de Design:</strong> {finalResult.designTemplate}</p>
              <p><strong>Cor Primária:</strong> 
                <span style={{ backgroundColor: finalResult.color, padding: '2px 8px', borderRadius: '4px', marginLeft: '8px', border: '1px solid #0002', color: (parseInt(finalResult.color.substring(1,3),16)*0.299 + parseInt(finalResult.color.substring(3,5),16)*0.587 + parseInt(finalResult.color.substring(5,7),16)*0.114) > 186 ? '#000':'#fff' }}>
                  {finalResult.color}
                </span>
              </p>
              <p><strong>Nível de Revisão IA:</strong> {finalResult.aiReviewType}</p>
              <p><strong>Tom:</strong> {finalResult.tone}</p>
              <p><strong>Estilo:</strong> {finalResult.style}</p>
              <p><strong>Foco:</strong> {finalResult.focus}</p>
              <p><strong>Imagens:</strong> {finalResult.imagePreference}</p>
              <p><strong>Gráficos/Tabelas:</strong> {finalResult.dataVizPreference}</p>
            </div>
            <details className="mb-4 bg-slate-100 p-3 rounded-md text-xs">
                <summary className="cursor-pointer text-slate-600 hover:text-slate-800">Ver conteúdo final da apresentação (após edição)</summary>
                <pre className="whitespace-pre-wrap mt-2 max-h-40 overflow-y-auto text-slate-600 p-2 bg-slate-200/70 rounded">{finalResult.approvedContent}</pre>
            </details>
            <button onClick={() => alert('Download simulado! A geração de PPTX real requer backend.')}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center">
              <Icon name="download" className="w-5 h-5 mr-2" /> Baixar Apresentação (Simulado)
            </button>
            <button onClick={resetFlow} className="mt-4 w-full text-sm text-blue-600 hover:text-blue-700 hover:underline py-2">
              Criar Nova Apresentação
            </button>
            <p className="text-xs text-slate-500 mt-3 text-center">Lembre-se: A geração e download de ficheiros .pptx reais exigem funcionalidades de backend.</p>
          </section>
        )}
      </main>
      
      <footer className="w-full max-w-3xl mt-12 text-center text-sm text-slate-500">
        <p>&copy; 2025. MercurIA - Criado por AV</p>
      </footer>
      <style jsx global>{`
        .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        textarea::-webkit-scrollbar, 
        .max-h-32::-webkit-scrollbar, 
        .max-h-40::-webkit-scrollbar, 
        .max-h-\[400px\]::-webkit-scrollbar,
        .max-h-\[600px\]::-webkit-scrollbar { 
          width: 8px; 
        }
        textarea::-webkit-scrollbar-track, 
        .max-h-32::-webkit-scrollbar-track, 
        .max-h-40::-webkit-scrollbar-track, 
        .max-h-\[400px\]::-webkit-scrollbar-track,
        .max-h-\[600px\]::-webkit-scrollbar-track { 
          background: #e2e8f0;
          border-radius: 10px; 
        }
        textarea::-webkit-scrollbar-thumb, 
        .max-h-32::-webkit-scrollbar-thumb, 
        .max-h-40::-webkit-scrollbar-thumb, 
        .max-h-\[400px\]::-webkit-scrollbar-thumb,
        .max-h-\[600px\]::-webkit-scrollbar-thumb { 
          background: #94a3b8;
          border-radius: 10px; 
        }
        textarea::-webkit-scrollbar-thumb:hover, 
        .max-h-32::-webkit-scrollbar-thumb:hover, 
        .max-h-40::-webkit-scrollbar-thumb:hover, 
        .max-h-\[400px\]::-webkit-scrollbar-thumb:hover,
        .max-h-\[600px\]::-webkit-scrollbar-thumb:hover { 
          background: #64748b;
        }

        input[type="color"]::-moz-color-swatch { height: calc(100% - 4px); width: calc(100% - 4px); padding: 0; border: none; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 0.25rem; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
        
        .form-checkbox {
            appearance: none;
            background-color: #fff;
            border-width: 1px;
            padding: 0;
            display: inline-block;
            vertical-align: middle;
            background-origin: border-box;
            user-select: none;
            flex-shrink: 0;
            height: 1.25rem;
            width: 1.25rem;
            color: currentColor;
            border-radius: 0.25rem;
        }
        .form-checkbox:checked {
            border-color: transparent;
            background-color: currentColor;
            background-size: 100% 100%;
            background-position: center;
            background-repeat: no-repeat;
            background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
        }
        .form-checkbox:focus {
            outline: 2px solid transparent;
            outline-offset: 2px;
            --tw-ring-offset-width: 2px;
        }
      `}</style>
    </div>
  );
}
