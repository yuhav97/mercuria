"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Loader2, FileText, Palette, Layers, UploadCloud, Wand2, Download, Mic2, 
    ListChecks, Edit3, CheckCircle, Zap, Lightbulb, CornerDownRight, XCircle, 
    Sparkles, Image as ImageIcon, BarChart3, ArrowRight, CheckSquare, Square, Info, RefreshCw 
} from 'lucide-react';

// --- Definição do Componente Icon e Tipos Associados ---
const iconsMap = {
  loader: Loader2, file: FileText, palette: Palette, layers: Layers, upload: UploadCloud,
  wand: Wand2, download: Download, mic: Mic2, listChecks: ListChecks, edit3: Edit3,
  checkCircle: CheckCircle, zap: Zap, lightbulb: Lightbulb, cornerDownRight: CornerDownRight,
  xCircle: XCircle, sparkles: Sparkles, imageIcon: ImageIcon, barChart3: BarChart3,
  arrowRight: ArrowRight, checkSquare: CheckSquare, square: Square, info: Info, refreshCw: RefreshCw,
};
export type IconName = keyof typeof iconsMap;
interface IconProps extends React.SVGProps<SVGSVGElement> { name: IconName; className?: string; }
const Icon: React.FC<IconProps> = ({ name, className, ...props }) => {
  const LucideIconComponent = iconsMap[name];
  if (!LucideIconComponent) { console.warn(`[Icon Component] Ícone "${name}" não encontrado.`); return <div className={className} data-testid="icon-fallback" />; }
  const combinedClassName = name === 'loader' ? `animate-spin ${className || ''}`.trim() : className;
  return <LucideIconComponent className={combinedClassName} {...props} />;
};

// --- Componente Checkbox Personalizado ---
interface CustomCheckboxProps { id: string; label: string; checked: boolean; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; name: string; description?: string; iconName?: IconName; iconColor?: string; }
const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ id, label, checked, onChange, name, description, iconName, iconColor }) => (
    <label htmlFor={id} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-150 ${checked ? 'bg-blue-50 border-blue-500 shadow-md' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
        <input type="checkbox" id={id} name={name} checked={checked} onChange={onChange} className="hidden" />
        <div className={`mr-3 mt-1 shrink-0 text-xl ${checked ? 'text-blue-600' : 'text-gray-400'}`}><Icon name={checked ? "checkSquare" : "square"} /></div>
        <div>
            <div className={`font-semibold flex items-center ${checked ? 'text-blue-700' : 'text-gray-700'}`}>{iconName && <Icon name={iconName} className={`w-5 h-5 mr-2 ${iconColor || (checked ? 'text-blue-600' : 'text-gray-500')}`} />}{label}</div>
            {description && <p className={`text-xs mt-1 ${checked ? 'text-blue-600' : 'text-gray-500'}`}>{description}</p>}
        </div>
    </label>
);

// --- Barra de Progresso ---
interface ProgressBarProps { currentStepKey: string; }
const ProgressBar: React.FC<ProgressBarProps> = ({ currentStepKey }) => {
    const steps = [
        { id: 1, name: "Conteúdo e Opções", stepKey: "initialInput" }, { id: 2, name: "Escolher Foco", stepKey: "selectFocus" },
        { id: 3, name: "Revisar Rascunho", stepKey: "approveContent" }, { id: 4, name: "Resultado Final", stepKey: "finalResult" },
    ];
    let currentStepIndex = steps.findIndex(s => s.stepKey === currentStepKey);
    if (currentStepIndex === -1) currentStepIndex = 0;
    const currentStepNumberForDisplay = currentStepIndex + 1;
    const progressPercentage = steps.length > 0 ? (currentStepNumberForDisplay / steps.length) * 100 : 0;
    return (
        <div className="w-full mb-8">
            <div className="flex justify-between mb-1">{steps.map((step, index) => (<div key={step.id} className={`text-xs text-center flex-1 ${index + 1 <= currentStepNumberForDisplay ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>{step.name}</div>))}</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div></div>
        </div>
    );
};

// --- Interface para o resultado final ---
interface FinalResultType { message: string; fileName: string; slides: number; color: string; tone: string; style: string; focus: string; approvedContent: string; aiOptionsUsed: AIAptionsType; }
interface AIAptionsType { generateTitles: boolean; suggestImages: boolean; suggestDataVisuals: boolean; }

// --- Persona da IA ---
const aiPersonaInstructions = `
Você é um revisor e estruturador de conteúdo com ampla experiência em transformar textos e informações em apresentações de PowerPoint altamente profissionais, claras, didáticas e visualmente organizadas. Seu objetivo é revisar o conteúdo recebido, extrair os pontos mais relevantes e estruturá-los de forma lógica, pedagógica e impactante, sempre considerando princípios de design instrucional que promovem compreensão, retenção e engajamento.
Você aplica técnicas de hierarquização da informação, chunking (quebra de conteúdo em blocos digestíveis), uso estratégico de recursos visuais e definição clara de objetivos de aprendizagem, quando aplicável. Sua comunicação visual é planejada para facilitar o aprendizado, respeitar o perfil do público-alvo (executivo, técnico, comercial ou acadêmico) e reforçar as mensagens centrais de forma acessível e eficaz.
Você adapta o tom, o ritmo e a linguagem da apresentação com base na intenção do usuário, seja para ensinar, convencer ou informar, e sempre garante que o conteúdo seja visualmente limpo, conciso e com narrativa fluida.
`;

// --- Componente Principal ---
export default function MercurIAHomePage() {
  const [currentStep, setCurrentStep] = useState('initialInput');
  const [contentInputMode, setContentInputMode] = useState('text');
  const [inputText, setInputText] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [numSlides, setNumSlides] = useState(10);
  const [primaryColor, setPrimaryColor] = useState('#007BFF');
  const [presentationTone, setPresentationTone] = useState('neutro');
  const [contentStyle, setContentStyle] = useState('bullet_points'); 
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('A processar com IA, aguarde...');
  const [error, setError] = useState('');
  const [initialProcessedContent, setInitialProcessedContent] = useState(''); 
  const [suggestedSubtitles, setSuggestedSubtitles] = useState<string[]>([]);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [aiOptions, setAiOptions] = useState<AIAptionsType>({ generateTitles: true, suggestImages: false, suggestDataVisuals: false });
  const [baseContentProcessed, setBaseContentProcessed] = useState(false); 
  const [suggestedFocuses, setSuggestedFocuses] = useState<string[]>([]);
  const [selectedFocus, setSelectedFocus] = useState('');
  const [contentForApproval, setContentForApproval] = useState('');
  const [finalResult, setFinalResult] = useState<FinalResultType | null>(null);

  const toneOptions = [ { value: 'muito_formal', label: 'Muito Formal (Corporativo, Académico)' }, { value: 'formal', label: 'Formal (Profissional, Informativo)' }, { value: 'neutro', label: 'Neutro (Padrão, Equilibrado)' }, { value: 'informal', label: 'Informal (Interativo, Casual)' }, { value: 'bem_descontraido', label: 'Bem Descontraído (Criativo, Divertido)' }, ];
  const contentStyleOptions = [ { value: 'bullet_points', label: 'Mais Concisa (Foco em Pontos Chave)' }, { value: 'texto_corrido', label: 'Mais Detalhada (Textos Corridos)' }, ];
  
  const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 
  const API_URL_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  const callGeminiAPI = useCallback(async (prompt: string, operationDescription = "A comunicar com a Inteligência Artificial...", usePersona = true): Promise<string | null> => {
    setLoadingMessage(operationDescription); setIsLoading(true); setError(''); 
    if (!API_KEY) { console.error("[callGeminiAPI] ERRO CRÍTICO: API Key (NEXT_PUBLIC_GEMINI_API_KEY) não está definida no ambiente!"); setError("Erro de configuração: A Chave da API não foi encontrada."); setIsLoading(false); if (operationDescription.includes("subtítulos")) return "MercurIA: Config. pendente.\nMercurIA: Ative a IA.\nMercurIA: Chave API necessária."; return null; }
    const finalPrompt = usePersona ? `${aiPersonaInstructions}\n\nTAREFA:\n${prompt}` : prompt;
    const payload = { contents: [{ role: "user", parts: [{ text: finalPrompt }] }] };
    try {
        const response = await fetch(API_URL_GEMINI, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) { 
            let errMsg = `Falha na IA (HTTP ${response.status})`; 
            try { 
                const eData = await response.json(); 
                if (eData?.error?.message) errMsg = eData.error.message; 
            } catch (_jsonErr) { /* Silenciar erro de parse do JSON de erro, já temos uma msg base */ } 
            throw new Error(errMsg); 
        }
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text && typeof data.candidates[0].content.parts[0].text === 'string') { setIsLoading(false); return data.candidates[0].content.parts[0].text; }
        throw new Error("Resposta da IA com formato inesperado.");
    } catch (err: unknown) { setIsLoading(false); if (err instanceof Error) setError(`Erro IA: ${err.message}`); else setError("Erro IA desconhecido."); return null; }
  }, [API_KEY, API_URL_GEMINI]); 

  const fetchCommercialSubtitles = useCallback(async () => {
    const promptSubtitles = `Você é um copywriter especialista. Crie 3 subtítulos curtos (máx 12 palavras), impactantes e comerciais para 'MercurIA', uma IA que cria apresentações PowerPoint. DEVEM incluir 'MercurIA'. Liste cada um numa nova linha. Varie-os.`;
    const subtitlesText = await callGeminiAPI(promptSubtitles, "A gerar novos subtítulos...", false);
    if (subtitlesText && typeof subtitlesText === 'string') {
        const newSubtitles = subtitlesText.split('\n').filter(s => s.trim() !== '').slice(0, 3);
        if (newSubtitles.length > 0) { setSuggestedSubtitles(newSubtitles); setCurrentSubtitleIndex(Math.floor(Math.random() * newSubtitles.length)); } 
        else { setSuggestedSubtitles(["MercurIA: Apresentações impactantes.", "MercurIA: Ideias que brilham.", "MercurIA: Conteúdo em espetáculo."]); setCurrentSubtitleIndex(0); }
    } else { setSuggestedSubtitles(["MercurIA: Magia da IA.", "MercurIA: Slides profissionais.", "MercurIA: Inovação e clareza."]); setCurrentSubtitleIndex(0); }
  }, [callGeminiAPI]); 

  useEffect(() => {
    if (API_KEY && API_KEY.trim() !== "") { fetchCommercialSubtitles(); } 
    else { console.warn("API Key em falta. Usando subtítulos placeholder."); setSuggestedSubtitles(["MercurIA: A sua próxima apresentação.", "Transforme ideias com MercurIA.", "MercurIA - Brilhantismo sem esforço."]); }
  }, [fetchCommercialSubtitles, API_KEY]);

  const handleAiOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => { const { name, checked } = event.target; setAiOptions(prev => ({ ...prev, [name]: checked, })); };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; if (file) { if (file.size > 5*1024*1024) {setError('Ficheiro grande demais.'); return;} const types = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain']; if(!types.includes(file.type)){setError('Tipo de ficheiro inválido.');return;} setUploadedFile(file);setError('');setBaseContentProcessed(false);}};
  const handleInputTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => { setInputText(e.target.value); setBaseContentProcessed(false); };

  const handleProcessBaseContent = async () => {
    if ((contentInputMode === 'file' && !uploadedFile) || (contentInputMode === 'text' && !inputText.trim())) { setError('Forneça o conteúdo.'); return; }
    if (numSlides <= 0) { setError('Nº de slides inválido.'); return; }
    setError(''); setSuggestedFocuses([]); setSelectedFocus(''); setContentForApproval(''); setFinalResult(null);
    let baseContent = inputText;
    if (contentInputMode === 'file' && uploadedFile) { 
        baseContent = `Ficheiro: ${uploadedFile.name}.`; 
        if (uploadedFile.type === 'text/plain') { 
            try { 
                baseContent = await uploadedFile.text(); 
            } catch (_e) { // Variável 'e' prefixada com _ para indicar que é intencionalmente não usada
                baseContent = `Falha ao ler: ${uploadedFile.name}.`;
                console.error("Erro ao ler ficheiro de texto:", _e); // Opcional: logar o erro real
            }
        } 
    }
    if (baseContent.length > 15000) baseContent = baseContent.substring(0, 15000) + "... (truncado)";
    const initialPrompt = `Resuma e estruture o seguinte conteúdo base para uma apresentação, considerando princípios de design instrucional para clareza e impacto. Base para próximas etapas. Limite 300 palavras, foque nos pontos chave e estrutura lógica:\n\n"${baseContent}"`;
    const processed = await callGeminiAPI(initialPrompt, "A processar conteúdo base...");
    if (processed !== null) { setInitialProcessedContent(processed); setBaseContentProcessed(true); } 
    else if (!error && !isLoading) setError("Falha ao processar conteúdo. Tente novamente.");
  };
  
  const handleProceedToFocusSelection = async () => {
      if (!initialProcessedContent) { setError("Conteúdo base não processado."); return; }
      setError('');
      const focusPrompt = `Baseado no conteúdo processado, sugira 3-4 focos lógicos e pedagógicos. Títulos curtos e concisos.
Conteúdo Processado: "${initialProcessedContent.substring(0, 3000)}..."`;
      const focusesText = await callGeminiAPI(focusPrompt, "A identificar focos...");
      if (focusesText && typeof focusesText === 'string') { setSuggestedFocuses(focusesText.split('\n').filter(f => f.trim() !== '')); setCurrentStep('selectFocus'); } 
      else if (!error && !isLoading) setError("Falha ao sugerir focos.");
  };

  const handleFocusSelection = async (focus: string) => { 
    setSelectedFocus(focus); setError(''); setContentForApproval('');
    const tone = toneOptions.find(t => t.value === presentationTone)?.label || presentationTone;
    const style = contentStyleOptions.find(s => s.value === contentStyle)?.label || contentStyle;
    let features = "";
    if (aiOptions.generateTitles) features += `\n\nINSTRUÇÃO TÍTULOS: Sugira 3 títulos impactantes e claros para a apresentação (tom: "${tone}"). Formato:\n--- SUGESTÕES DE TÍTULO ---\n1.[T1]\n2.[T2]\n3.[T3]\n--- FIM ---`;
    if (aiOptions.suggestImages) features += `\n\nINSTRUÇÃO IMAGENS: Insira placeholders como '[Sugestão de Imagem/Ilustração: Descrição relevante aqui]'.`;
    if (aiOptions.suggestDataVisuals) features += `\n\nINSTRUÇÃO GRÁFICOS/TABELAS: Se houver dados, insira placeholders como '[Sugestão de Gráfico/Tabela: Descrição do gráfico/tabela aqui]'.`;
    const approvalPrompt = `Desenvolva slides (aprox. ${numSlides}) para uma apresentação. Foco: "${focus}". Conteúdo Base: "${initialProcessedContent.substring(0,5000)}". Tom: "${tone}". Estilo: "${style}". Siga princípios de DI (estrutura lógica, chunking, clareza, concisão, hierarquia, objetivos). ${features}\nFormato: Slide 1: [Título]\n- [Conteúdo]\n[Sugestões IA]\nSlide 2: ...`;
    const approvalContent = await callGeminiAPI(approvalPrompt, `A gerar rascunho para: "${focus}"...`);
    if (approvalContent !== null) { setContentForApproval(approvalContent); setCurrentStep('approveContent'); } 
    else if(!error && !isLoading) setError("Falha ao gerar rascunho.");
  };
  
  const handleApproval = () => { 
    setIsLoading(true); setError('');
    setTimeout(() => {
      const tone = toneOptions.find(t => t.value === presentationTone)?.label || presentationTone;
      const style = contentStyleOptions.find(s => s.value === contentStyle)?.label || contentStyle;
      setFinalResult({
        message: 'Apresentação gerada com sucesso! (Simulação)', fileName: `apresentacao_${Date.now()}.pptx`, slides: numSlides, color: primaryColor, tone, style, focus: selectedFocus, approvedContent: contentForApproval, aiOptionsUsed: aiOptions,
      });
      setCurrentStep('finalResult'); setIsLoading(false);
    }, 1500);
  };
  
  const resetFlow = () => {
    setCurrentStep('initialInput'); setInputText(''); setUploadedFile(null); setInitialProcessedContent(''); 
    setBaseContentProcessed(false); setAiOptions({ generateTitles: true, suggestImages: false, suggestDataVisuals: false });
    setSuggestedFocuses([]); setSelectedFocus(''); setContentForApproval('');
    setFinalResult(null); setError(''); setIsLoading(false); setNumSlides(10);
    setPrimaryColor('#007BFF'); setPresentationTone('neutro'); setContentStyle('bullet_points');
    if (API_KEY && API_KEY.trim() !== "") { fetchCommercialSubtitles(); } 
    else { setSuggestedSubtitles(["MercurIA: Apresentações.", "MercurIA: Ideias em slides.", "MercurIA: Conteúdo visual."]); }
  };

  const colorInputStyle = { width: '100%', height: '40px', border: '1px solid #CED4DA', borderRadius: '0.375rem', padding: '2px' };
  const themeColors = { background: 'bg-white', cardBackground: 'bg-gray-50', textPrimary: 'text-gray-800', textSecondary: 'text-gray-600', textAccent: 'text-blue-600', borderDefault: 'border-gray-300', borderInput: 'border-gray-400', buttonPrimaryBg: 'bg-blue-600 hover:bg-blue-700', buttonPrimaryText: 'text-white', buttonSecondaryBg: 'bg-gray-200 hover:bg-gray-300', buttonSecondaryText: 'text-gray-700', focusRing: 'focus:ring-blue-500', errorBg: 'bg-red-50', errorBorder: 'border-red-400', errorText: 'text-red-700', };
  
  return (
    <div className={`min-h-screen ${themeColors.background} ${themeColors.textPrimary} p-4 sm:p-8 flex flex-col items-center font-sans`}>
      <header className="w-full max-w-3xl mb-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-2">
          MercurIA ✨
        </h1>
        <div className="h-12 flex items-center justify-center relative group">
            {isLoading && loadingMessage.includes("subtítulos") && <p className={`${themeColors.textSecondary} text-lg italic`}>A gerar subtítulo inspirador...</p>}
            {!isLoading && suggestedSubtitles.length > 0 && ( <p className={`${themeColors.textSecondary} text-lg`}>{suggestedSubtitles[currentSubtitleIndex]}</p> )}
            {!isLoading && suggestedSubtitles.length === 0 && ( <div className="h-12 flex items-center justify-center"><p className={`${themeColors.textSecondary} text-lg`}>Transforme suas ideias em apresentações poderosas.</p></div> )}
            <button onClick={fetchCommercialSubtitles} disabled={isLoading && !loadingMessage.includes("subtítulos") } title="Gerar novo subtítulo" className={`absolute -right-2 sm:-right-8 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-opacity duration-150 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed`} aria-label="Gerar novo subtítulo"><Icon name="refreshCw" className="w-4 h-4" /></button>
        </div>
      </header>

      <main className={`w-full max-w-3xl ${themeColors.cardBackground} p-6 sm:p-8 rounded-xl shadow-lg space-y-6 border ${themeColors.borderDefault}`}>
        <ProgressBar currentStepKey={currentStep} />
        {isLoading && (<div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50"><div className={`flex flex-col items-center ${themeColors.cardBackground} p-8 rounded-lg shadow-xl border ${themeColors.borderDefault}`}><Icon name="loader" className={`w-12 h-12 ${themeColors.textAccent} mb-4`} /><p className={`text-xl ${themeColors.textPrimary}`}>{loadingMessage}</p></div></div>)}
        {error && (<div className={`p-3 ${themeColors.errorBg} border ${themeColors.errorBorder} ${themeColors.errorText} rounded-md text-sm flex items-center`}><Icon name="xCircle" className="w-5 h-5 mr-2 shrink-0" /><span><strong>Erro:</strong> {error}</span><button onClick={() => setError('')} className={`ml-auto ${themeColors.errorText} hover:opacity-75`}>&times;</button></div>)}

        {currentStep === 'initialInput' && (
          <>
            <div className="space-y-6">
                <section>
                    <h2 className={`text-2xl font-semibold ${themeColors.textPrimary} mb-1`}>Passo 1: O Seu Conteúdo</h2>
                    <p className={`${themeColors.textSecondary} text-sm mb-4`}>Comece por nos dar o material base para a sua apresentação.</p>
                    <div className="mb-4"><label className={`block text-sm font-medium ${themeColors.textSecondary} mb-2`}>Como prefere fornecer o conteúdo?</label><div className="flex space-x-4"><button onClick={() => {setContentInputMode('text'); setBaseContentProcessed(false);}} className={`flex-1 py-2 px-4 rounded-md transition-all duration-150 ease-in-out focus:outline-none ${themeColors.focusRing} focus:ring-offset-2 ${contentInputMode === 'text' ? `${themeColors.buttonPrimaryBg} ${themeColors.buttonPrimaryText} shadow-md` : `${themeColors.buttonSecondaryBg} ${themeColors.buttonSecondaryText} hover:bg-gray-300`}`}>Digitar Texto</button><button onClick={() => {setContentInputMode('file'); setBaseContentProcessed(false);}} className={`flex-1 py-2 px-4 rounded-md transition-all duration-150 ease-in-out focus:outline-none ${themeColors.focusRing} focus:ring-offset-2 ${contentInputMode === 'file' ? `${themeColors.buttonPrimaryBg} ${themeColors.buttonPrimaryText} shadow-md` : `${themeColors.buttonSecondaryBg} ${themeColors.buttonSecondaryText} hover:bg-gray-300`}`}>Carregar Ficheiro</button></div></div>
                    {contentInputMode === 'text' ? (<textarea value={inputText} onChange={handleInputTextChange} placeholder="Digite ou cole o seu texto, pontos chave, ou rascunho aqui..." rows={7} className={`w-full p-3 bg-white border ${themeColors.borderInput} rounded-md focus:ring-2 ${themeColors.focusRing} placeholder-gray-400 ${themeColors.textPrimary}`}/>) 
                    : (<div className={`w-full p-4 bg-white border-2 border-dashed ${themeColors.borderInput} rounded-md text-center`}><input type="file" id="fileUpload" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" className="hidden"/><label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center"><Icon name="upload" className={`w-10 h-10 ${themeColors.textAccent} mb-2`} /><span className={`${themeColors.textAccent} font-semibold`}>Clique para carregar</span><span className={`text-xs ${themeColors.textSecondary} mt-1`}>PDF, DOC, DOCX, TXT (Máx. 5MB)</span></label>{uploadedFile && <p className={`text-sm ${themeColors.textSecondary} mt-3`}>Selecionado: {uploadedFile.name} ({(uploadedFile.size/1024/1024).toFixed(2)} MB)</p>}</div>)}
                </section>
                <section>
                  <h2 className={`text-2xl font-semibold ${themeColors.textPrimary} mb-1`}>Passo 2: Personalize a Apresentação</h2>
                  <p className={`${themeColors.textSecondary} text-sm mb-4`}>Defina as características principais.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div><label htmlFor="numSlides" className={`block text-sm font-medium ${themeColors.textSecondary} mb-1`}>Nº de Slides</label><input type="number" id="numSlides" value={numSlides} onChange={(e) => {setNumSlides(Math.max(1, parseInt(e.target.value,10))); setBaseContentProcessed(false);}} min="1" className={`w-full p-2 bg-white border ${themeColors.borderInput} rounded-md focus:ring-2 focus:ring-green-500 ${themeColors.textPrimary}`}/></div>
                    <div><label htmlFor="primaryColor" className={`block text-sm font-medium ${themeColors.textSecondary} mb-1`}>Cor Primária</label><input type="color" id="primaryColor" value={primaryColor} onChange={(e) => {setPrimaryColor(e.target.value); setBaseContentProcessed(false);}} style={colorInputStyle} className={`w-full h-10 p-0 border-0 bg-white rounded-md cursor-pointer`}/></div>
                    <div><label htmlFor="presentationTone" className={`block text-sm font-medium ${themeColors.textSecondary} mb-1`}>Tom de Voz</label><select id="presentationTone" value={presentationTone} onChange={(e) => {setPresentationTone(e.target.value);setBaseContentProcessed(false);}} className={`w-full p-2.5 bg-white border ${themeColors.borderInput} rounded-md focus:ring-2 focus:ring-purple-500 ${themeColors.textPrimary} appearance-none`} style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>{toneOptions.map(o => <option key={o.value} value={o.value} className={`bg-white ${themeColors.textPrimary}`}>{o.label}</option>)}</select></div>
                    <div><label htmlFor="contentStyle" className={`block text-sm font-medium ${themeColors.textSecondary} mb-1`}>Estilo do Conteúdo</label><select id="contentStyle" value={contentStyle} onChange={(e) => {setContentStyle(e.target.value);setBaseContentProcessed(false);}} className={`w-full p-2.5 bg-white border ${themeColors.borderInput} rounded-md focus:ring-2 focus:ring-orange-500 ${themeColors.textPrimary} appearance-none`} style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em'}}>{contentStyleOptions.map(o => <option key={o.value} value={o.value} className={`bg-white ${themeColors.textPrimary}`}>{o.label}</option>)}</select></div>
                  </div>
                </section>
            </div>
            {!baseContentProcessed && (<button onClick={handleProcessBaseContent} disabled={isLoading} className={`w-full mt-6 ${themeColors.buttonPrimaryBg} ${themeColors.buttonPrimaryText} font-semibold py-3 px-4 rounded-lg shadow-md flex items-center justify-center text-lg disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none ${themeColors.focusRing} focus:ring-offset-2`}><Icon name="wand" className="w-5 h-5 mr-2" />Analisar e Definir Opções IA</button>)}
            {baseContentProcessed && (
                <section className="animate-fadeIn space-y-6 mt-6 pt-6 border-t border-gray-200">
                    <div>
                        <h2 className={`text-2xl font-semibold ${themeColors.textPrimary} mb-1`}>Passo 3: Assistência Criativa da IA</h2>
                        <p className={`${themeColors.textSecondary} text-sm mb-4`}>Selecione como a IA pode ajudar. Estas opções serão aplicadas ao gerar o rascunho.</p>
                        {initialProcessedContent && <details className={`mb-4 bg-white p-3 rounded-md text-xs border ${themeColors.borderDefault}`}><summary className={`cursor-pointer ${themeColors.textSecondary} hover:${themeColors.textPrimary} flex items-center`}><Icon name="info" className="w-4 h-4 mr-1 text-gray-400"/>Ver resumo do conteúdo base</summary><pre className={`whitespace-pre-wrap mt-2 max-h-32 overflow-y-auto ${themeColors.textSecondary} p-2 bg-gray-100 rounded`}>{initialProcessedContent}</pre></details>}
                        <div className="space-y-3">
                            <CustomCheckbox id="generateTitles" name="generateTitles" label="Criar Opções de Título com IA" description="Sugere 3 títulos alinhados com o tom de voz." checked={aiOptions.generateTitles} onChange={handleAiOptionChange} iconName="sparkles" iconColor="text-purple-500" />
                            <CustomCheckbox id="suggestImages" name="suggestImages" label="Incluir Sugestões de Imagens/Ilustrações" description="Insere indicações de imagens/ilustrações relevantes." checked={aiOptions.suggestImages} onChange={handleAiOptionChange} iconName="imageIcon" iconColor="text-sky-500" />
                            <CustomCheckbox id="suggestDataVisuals" name="suggestDataVisuals" label="Incluir Sugestões de Gráficos/Tabelas" description="Se houver dados, sugere locais para gráficos/tabelas." checked={aiOptions.suggestDataVisuals} onChange={handleAiOptionChange} iconName="barChart3" iconColor="text-green-500" />
                        </div>
                    </div>
                    <button onClick={handleProceedToFocusSelection} disabled={isLoading || !baseContentProcessed} className={`w-full ${themeColors.buttonPrimaryBg} ${themeColors.buttonPrimaryText} font-semibold py-3 px-4 rounded-lg shadow-md flex items-center justify-center text-lg disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none ${themeColors.focusRing} focus:ring-offset-2`}><Icon name="arrowRight" className="w-5 h-5 mr-2" />Prosseguir para Escolher Foco</button>
                </section>
            )}
          </>
        )}

        {currentStep === 'selectFocus' && ( 
            <section className="animate-fadeIn">
                <h2 className={`text-2xl font-semibold ${themeColors.textPrimary} mb-1`}>Passo 4: Escolha o Foco Principal</h2>
                <p className={`${themeColors.textSecondary} text-sm mb-4`}>A IA sugere os seguintes focos. Selecione um para direcionar a criação.</p>
                {initialProcessedContent && <details className={`mb-4 bg-white p-3 rounded-md text-xs border ${themeColors.borderDefault}`}><summary className={`cursor-pointer ${themeColors.textSecondary} hover:${themeColors.textPrimary} flex items-center`}><Icon name="info" className="w-4 h-4 mr-1 text-gray-400"/>Rever resumo base</summary><pre className={`whitespace-pre-wrap mt-2 max-h-32 overflow-y-auto ${themeColors.textSecondary} p-2 bg-gray-100 rounded`}>{initialProcessedContent}</pre></details>}
                <div className="space-y-3">
                {suggestedFocuses.length > 0 ? (suggestedFocuses.map((focus, index) => (<button key={index} onClick={() => handleFocusSelection(focus)} className={`w-full text-left p-4 bg-white hover:bg-gray-100 border ${themeColors.borderDefault} rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-yellow-500`}><span className={`${themeColors.textPrimary}`}>{focus}</span></button>))) 
                : <p className={`${themeColors.textSecondary}`}>Nenhum foco sugerido. Refine o texto inicial ou prossiga (IA usará tema geral).</p>}
                </div>
                <button onClick={() => { setCurrentStep('initialInput'); }} className={`mt-6 w-full text-sm ${themeColors.textSecondary} hover:${themeColors.textPrimary} py-2 focus:outline-none ${themeColors.focusRing} rounded`}>&larr; Voltar e Editar Opções</button>
            </section>
        )}
        
        {currentStep === 'approveContent' && ( 
            <section className="animate-fadeIn">
                <h2 className={`text-2xl font-semibold ${themeColors.textPrimary} mb-1`}>Passo 5: Reveja e Aprove o Rascunho</h2>
                <p className={`${themeColors.textSecondary} text-sm mb-2`}>Rascunho focado em: <strong className="text-teal-600">{`"${selectedFocus}"`}</strong>.</p>
                <p className={`text-xs ${themeColors.textSecondary} mb-1`}>Opções IA aplicadas (se selecionadas):</p>
                <ul className="text-xs list-disc list-inside mb-4 pl-4 text-gray-500">
                    {aiOptions.generateTitles && <li>Opções de Título</li>} {aiOptions.suggestImages && <li>Sugestões de Imagens</li>} {aiOptions.suggestDataVisuals && <li>Sugestões de Gráficos</li>}
                    {!aiOptions.generateTitles && !aiOptions.suggestImages && !aiOptions.suggestDataVisuals && <li>Nenhuma assistência IA selecionada.</li>}
                </ul>
                <div className={`p-4 bg-white rounded-md max-h-[400px] overflow-y-auto border ${themeColors.borderInput} mb-4`}><pre className={`whitespace-pre-wrap ${themeColors.textPrimary} text-sm`}>{contentForApproval || "Nenhum conteúdo gerado."}</pre></div>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button onClick={() => setCurrentStep('selectFocus')} className={`w-full sm:w-auto flex-1 py-3 px-4 ${themeColors.buttonSecondaryBg} ${themeColors.buttonSecondaryText} hover:bg-gray-300 font-semibold rounded-lg transition-colors duration-150 flex items-center justify-center focus:outline-none ${themeColors.focusRing} focus:ring-offset-2`}><Icon name="cornerDownRight" className="w-5 h-5 mr-2 transform scale-x-[-1]" />Escolher Outro Foco</button>
                <button onClick={handleApproval} disabled={isLoading} className={`w-full sm:w-auto flex-1 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}><Icon name="checkCircle" className="w-5 h-5 mr-2" />Aprovar e Gerar Apresentação</button>
                </div>
            </section>
        )}

        {currentStep === 'finalResult' && ( 
            <section className={`animate-fadeIn`}>
                <h2 className="text-2xl font-semibold text-green-600 mb-4 flex items-center"><Icon name="checkCircle" className="w-7 h-7 mr-2" />Passo 6: A sua Apresentação está Pronta!</h2>
                {finalResult && (
                    <>
                        <div className={`space-y-1 ${themeColors.textSecondary} mb-4 p-4 border ${themeColors.borderDefault} rounded-md bg-white`}>
                        <p><strong>Ficheiro (Simulado):</strong> {finalResult.fileName}</p>
                        <p><strong>Slides:</strong> {finalResult.slides}</p>
                        <p><strong>Cor Primária:</strong> <span style={{ backgroundColor: finalResult.color, padding: '2px 8px', borderRadius: '4px', marginLeft: '8px', border: `1px solid ${finalResult.color === '#FFFFFF' ? '#DDDDDD' : 'transparent'}` }} className={finalResult.color === '#FFFFFF' ? 'text-black' : 'text-white'}>{finalResult.color}</span></p>
                        <p><strong>Tom:</strong> {finalResult.tone}</p><p><strong>Estilo:</strong> {finalResult.style}</p><p><strong>Foco:</strong> {finalResult.focus}</p>
                        <p><strong>Assistência IA:</strong> {Object.entries(finalResult.aiOptionsUsed).filter(([, value]) => value).map(([key]) => (key === 'generateTitles' ? 'Títulos' : key === 'suggestImages' ? 'Imagens' : 'Gráficos')).join(', ') || 'Nenhuma'}</p>
                        </div>
                        <details className={`mb-4 bg-white p-3 rounded-md text-xs border ${themeColors.borderDefault}`}><summary className={`cursor-pointer ${themeColors.textSecondary} hover:${themeColors.textPrimary} flex items-center`}><Icon name="info" className="w-4 h-4 mr-1 text-gray-400"/>Ver conteúdo aprovado (simulação)</summary><pre className={`whitespace-pre-wrap mt-2 max-h-40 overflow-y-auto ${themeColors.textSecondary} p-2 bg-gray-100 rounded`}>{finalResult.approvedContent}</pre></details>
                        <button onClick={() => alert('Download simulado!')} className={`mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}><Icon name="download" className="w-5 h-5 mr-2" />Baixar Apresentação (Simulado)</button>
                    </>
                )}
                <button onClick={resetFlow} className={`mt-4 w-full text-sm ${themeColors.textSecondary} hover:${themeColors.textPrimary} py-2 focus:outline-none ${themeColors.focusRing} rounded`}>Criar Nova Apresentação</button>
                <p className={`text-xs ${themeColors.textSecondary} mt-3 text-center`}>Lembre-se: Geração de .pptx real requer backend.</p>
            </section>
        )}
      </main>
      
      <footer className={`w-full max-w-3xl mt-12 text-center text-sm ${themeColors.textSecondary}`}>
        <p>&copy; {new Date().getFullYear()} MercurIA. Protótipo.</p>
      </footer>
      <style jsx global>{`
        body { background-color: #FFFFFF; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        textarea::-webkit-scrollbar, .max-h-32::-webkit-scrollbar, .max-h-40::-webkit-scrollbar, .max-h-\\[400px\\]::-webkit-scrollbar { width: 8px; }
        textarea::-webkit-scrollbar-track, .max-h-32::-webkit-scrollbar-track, .max-h-40::-webkit-scrollbar-track, .max-h-\\[400px\\]::-webkit-scrollbar-track { background: #E9ECEF; border-radius: 10px; }
        textarea::-webkit-scrollbar-thumb, .max-h-32::-webkit-scrollbar-thumb, .max-h-40::-webkit-scrollbar-thumb, .max-h-\\[400px\\]::-webkit-scrollbar-thumb { background: #ADB5BD; border-radius: 10px; }
        textarea::-webkit-scrollbar-thumb:hover, .max-h-32::-webkit-scrollbar-thumb:hover, .max-h-40::-webkit-scrollbar-thumb:hover, .max-h-\\[400px\\]::-webkit-scrollbar-thumb:hover { background: #6C757D; }
        input[type="color"]::-moz-color-swatch { height: calc(100% - 4px); width: calc(100% - 4px); padding: 0; border: none; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 0.25rem; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
      `}</style>
    </div>
  );
}
