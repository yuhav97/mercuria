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
    <label htmlFor={id} className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-150 ${checked ? 'bg-cyan-50 border-cyan-500 shadow-md' : 'bg-white border-gray-300 hover:border-gray-400'}`}>
        <input type="checkbox" id={id} name={name} checked={checked} onChange={onChange} className="hidden" />
        <div className={`mr-3 mt-1 shrink-0 text-xl ${checked ? 'text-cyan-600' : 'text-gray-400'}`}><Icon name={checked ? "checkSquare" : "square"} /></div>
        <div>
            <div className={`font-semibold flex items-center ${checked ? 'text-cyan-700' : 'text-gray-700'}`}>{iconName && <Icon name={iconName} className={`w-5 h-5 mr-2 ${iconColor || (checked ? 'text-cyan-600' : 'text-gray-500')}`} />}{label}</div>
            {description && <p className={`text-xs mt-1 ${checked ? 'text-cyan-600' : 'text-gray-500'}`}>{description}</p>}
        </div>
    </label>
);

// --- Barra de Progresso ---
interface ProgressBarProps { currentStepKey: string; }
const ProgressBar: React.FC<ProgressBarProps> = ({ currentStepKey }) => {
    const steps = [
        { id: 1, name: "Conteúdo", stepKey: "initialInput" }, 
        { id: 2, name: "Foco", stepKey: "selectFocus" },
        { id: 3, name: "Rascunho", stepKey: "approveContent" }, 
        { id: 4, name: "Final", stepKey: "finalResult" },
    ];
    let currentStepIndex = steps.findIndex(s => s.stepKey === currentStepKey);
    if (currentStepIndex === -1) currentStepIndex = 0;
    const currentStepNumberForDisplay = currentStepIndex + 1;
    const progressPercentage = steps.length > 0 ? (currentStepNumberForDisplay / steps.length) * 100 : 0;
    return (
        <div className="w-full mb-10">
            <div className="flex justify-between mb-2">
                {steps.map((step, index) => (
                    <div key={step.id} className={`text-xs sm:text-sm text-center flex-1 px-1 ${index + 1 <= currentStepNumberForDisplay ? 'text-cyan-600 font-bold' : 'text-gray-500'}`}>
                        {step.name}
                    </div>
                ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }}></div>
            </div>
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
  const [primaryColor, setPrimaryColor] = useState('#0891B2'); 
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
  const [logoError, setLogoError] = useState(false);

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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    if (!API_KEY) {
        setSuggestedSubtitles(["MercurIA: Apresentações Inteligentes (Simulado).", "MercurIA: Do texto à ovation, com IA (Simulado).", "MercurIA: Design e conteúdo perfeitos (Simulado)."]);
        setCurrentSubtitleIndex(0);
        return;
    }
    const subtitlesText = await callGeminiAPI(promptSubtitles, "A gerar novos subtítulos...", false);
    if (subtitlesText && typeof subtitlesText === 'string') {
        const newSubtitles = subtitlesText.split('\n').filter(s => s.trim() !== '').slice(0, 3);
        if (newSubtitles.length > 0) { setSuggestedSubtitles(newSubtitles); setCurrentSubtitleIndex(Math.floor(Math.random() * newSubtitles.length)); } 
        else { setSuggestedSubtitles(["MercurIA: Apresentações impactantes.", "MercurIA: Ideias que brilham.", "MercurIA: Conteúdo em espetáculo."]); setCurrentSubtitleIndex(0); }
    } else { setSuggestedSubtitles(["MercurIA: Magia da IA.", "MercurIA: Slides profissionais.", "MercurIA: Inovação e clareza."]); setCurrentSubtitleIndex(0); }
  }, [callGeminiAPI, API_KEY]); 

  useEffect(() => {
    fetchCommercialSubtitles();
  }, [fetchCommercialSubtitles]);


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
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_e) { 
                baseContent = `Falha ao ler: ${uploadedFile.name}.`;
                console.error("Erro ao ler ficheiro de texto:", _e); 
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
    
    const approvalPrompt = `Desenvolva o conteúdo detalhado para uma apresentação com o objetivo de ter ${numSlides} slides.
FOCO PRINCIPAL DA APRESENTAÇÃO (definido pelo utilizador): "${focus}"
CONTEÚDO BASE PROCESSADO (para sua referência e inspiração): "${initialProcessedContent.substring(0, 5000)}"
TOM DE VOZ (definido pelo utilizador): "${tone}"
ESTILO DE CONTEÚDO (definido pelo utilizador): "${style}"

Siga rigorosamente os princípios de design instrucional:
- ESTRUTURA LÓGICA E PEDAGÓGICA: Organize o conteúdo de forma que facilite a compreensão e retenção. Crie uma narrativa fluida.
- CHUNKING: Divida a informação em blocos digestíveis, adequados para cada slide. Cada slide deve representar uma unidade de informação coesa.
- CLAREZA E CONCISÃO: Use linguagem precisa. Elimine redundâncias. Foque no essencial.
- HIERARQUIZAÇÃO DA INFORMAÇÃO: Destaque os pontos mais importantes em cada slide.
- OBJETIVOS DE APRENDIZAGEM (implícito): O conteúdo deve ser apresentado de forma a atingir o objetivo da apresentação (informar, convencer, ensinar).

${features}

INSTRUÇÃO CRÍTICA DE FORMATAÇÃO E ESTRUTURA:
Formate a saída RIGOROSAMENTE como uma sequência de slides, cada um começando com "Slide X: [Título do Slide]".
Distribua o conteúdo de forma equilibrada entre os ${numSlides} slides. Se o conteúdo for muito extenso para ${numSlides} slides, priorize os pontos mais importantes e seja conciso. Se o conteúdo for curto, detalhe os pontos existentes para preencher os ${numSlides} slides da melhor forma possível, mantendo a relevância e o foco.

Exemplo de formato para cada slide:
Slide 1: [Título do Slide 1]
- [Ponto chave 1.1 ou parágrafo conciso]
[Sugestão de Imagem/Gráfico, se aplicável e instruído pela funcionalidade de IA correspondente]

Slide 2: [Título do Slide 2]
... e assim por diante, até Slide ${numSlides}.
`;

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
    setPrimaryColor('#0891B2'); setPresentationTone('neutro'); setContentStyle('bullet_points');
    if (API_KEY && API_KEY.trim() !== "") { fetchCommercialSubtitles(); } 
    else { setSuggestedSubtitles(["MercurIA: Apresentações.", "MercurIA: Ideias em slides.", "MercurIA: Conteúdo visual."]); }
  };

  const colorInputStyle = { width: '100%', height: '40px', border: '1px solid #CBD5E1', borderRadius: '0.375rem', padding: '2px' };
  const themeColors = { 
    background: 'bg-slate-100', 
    cardBackground: 'bg-white', 
    textPrimary: 'text-slate-800', 
    textSecondary: 'text-slate-600', 
    textAccent: 'text-cyan-600', 
    borderDefault: 'border-slate-300', 
    borderInput: 'border-slate-400', 
    buttonPrimaryBg: 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700', 
    buttonPrimaryText: 'text-white', 
    buttonSecondaryBg: 'bg-slate-200 hover:bg-slate-300', 
    buttonSecondaryText: 'text-slate-700', 
    focusRing: 'focus:ring-cyan-500', 
    errorBg: 'bg-red-50', errorBorder: 'border-red-400', errorText: 'text-red-700',
  };
  
  const logoUrl = "https://i.imgur.com/ygDaAq9.jpg"; 

  return (
    <div className={`min-h-screen ${themeColors.background} ${themeColors.textPrimary} flex flex-col items-center font-sans`}>
      <header className="w-full bg-white shadow-sm sticky top-0 z-40"> {/* Tornar o header fixo no topo */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
                <div className="flex items-center">
                    {logoError ? (
                        <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">
                            MercurIA
                        </h1>
                    ) : (
                        <img 
                            src={logoUrl} 
                            alt="MercurIA Logo" 
                            className="h-10 sm:h-12 w-auto" // Altura ajustada para o header fixo
                            onError={() => setLogoError(true)} 
                        />
                    )}
                </div>
                <div className="text-center sm:text-right relative group">
                    <div className="h-7 flex items-center justify-center sm:justify-end"> {/* Altura do subtítulo ajustada */}
                        {isLoading && loadingMessage.includes("subtítulos") && <p className={`${themeColors.textSecondary} text-xs sm:text-sm italic`}>A gerar subtítulo...</p>}
                        {!isLoading && suggestedSubtitles.length > 0 && ( <p className={`${themeColors.textSecondary} text-xs sm:text-sm`}>{suggestedSubtitles[currentSubtitleIndex]}</p> )}
                        {!isLoading && suggestedSubtitles.length === 0 && ( <p className={`${themeColors.textSecondary} text-xs sm:text-sm`}>Transforme ideias em apresentações poderosas.</p> )}
                    </div>
                    <button 
                        onClick={fetchCommercialSubtitles} 
                        disabled={isLoading && !loadingMessage.includes("subtítulos") }
                        title="Gerar novo subtítulo"
                        className={`absolute -top-0.5 -right-1 sm:left-full sm:ml-2 sm:top-1/2 sm:-translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-cyan-600 hover:bg-cyan-100 focus:outline-none focus:ring-2 ${themeColors.focusRing} focus:ring-offset-1 transition-opacity duration-150 opacity-0 group-hover:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed`}
                        aria-label="Gerar novo subtítulo"
                    >
                        <Icon name="refreshCw" className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                </div>
            </div>
        </div>
      </header>

      <main className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 ${themeColors.cardBackground} mt-0 sm:rounded-b-xl shadow-none sm:shadow-2xl space-y-10 border-x-0 border-b-0 sm:border ${themeColors.borderDefault}`}>
        <ProgressBar currentStepKey={currentStep} />
        
        {isLoading && (<div className="fixed inset-0 bg-slate-700/75 flex items-center justify-center z-50 backdrop-blur-sm"><div className={`flex flex-col items-center bg-white p-10 rounded-xl shadow-2xl border ${themeColors.borderDefault}`}><Icon name="loader" className={`w-14 h-14 ${themeColors.textAccent} mb-5`} /><p className={`text-xl ${themeColors.textPrimary}`}>{loadingMessage}</p></div></div>)}
        {error && (<div className={`p-4 ${themeColors.errorBg} border ${themeColors.errorBorder} ${themeColors.errorText} rounded-lg text-sm flex items-center gap-3`}><Icon name="xCircle" className="w-5 h-5 shrink-0" /><span><strong>Erro:</strong> {error}</span><button onClick={() => setError('')} className={`ml-auto ${themeColors.errorText} hover:opacity-75 font-bold`}>&times;</button></div>)}

        {currentStep === 'initialInput' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start"> {/* Layout de duas colunas para os Passos 1 e 2 */}
                {/* Coluna da Esquerda: Passo 1 e Passo 2 */}
                <div className="space-y-8">
                    <section className={`p-6 rounded-xl border ${themeColors.borderDefault} bg-white shadow-lg`}> {/* Card para Passo 1 */}
                        <h2 className={`text-xl sm:text-2xl font-semibold ${themeColors.textPrimary} mb-1.5 flex items-center`}><Icon name="fileText" className={`w-6 h-6 mr-2.5 ${themeColors.textAccent}`}/>Passo 1: O Seu Conteúdo</h2>
                        <p className={`${themeColors.textSecondary} text-sm mb-5`}>Forneça o material base para a sua apresentação.</p>
                        <div className="mb-5">
                            <label className={`block text-base font-medium ${themeColors.textSecondary} mb-3`}>Como prefere fornecer o conteúdo?</label>
                            <div className="flex space-x-3">
                                <button onClick={() => {setContentInputMode('text'); setBaseContentProcessed(false);}} className={`flex-1 py-2.5 px-4 rounded-md transition-all duration-150 ease-in-out focus:outline-none ${themeColors.focusRing} focus:ring-offset-2 text-sm font-medium ${contentInputMode === 'text' ? `${themeColors.buttonPrimaryBg} ${themeColors.buttonPrimaryText} shadow-md` : `bg-slate-50 ${themeColors.textPrimary} border ${themeColors.borderInput} hover:bg-slate-100`}`}>Digitar Texto</button>
                                <button onClick={() => {setContentInputMode('file'); setBaseContentProcessed(false);}} className={`flex-1 py-2.5 px-4 rounded-md transition-all duration-150 ease-in-out focus:outline-none ${themeColors.focusRing} focus:ring-offset-2 text-sm font-medium ${contentInputMode === 'file' ? `${themeColors.buttonPrimaryBg} ${themeColors.buttonPrimaryText} shadow-md` : `bg-slate-50 ${themeColors.textPrimary} border ${themeColors.borderInput} hover:bg-slate-100`}`}>Carregar Ficheiro</button>
                            </div>
                        </div>
                        {contentInputMode === 'text' ? (<textarea value={inputText} onChange={handleInputTextChange} placeholder="Digite ou cole o seu texto, pontos chave, ou rascunho aqui..." rows={8} className={`w-full p-3.5 bg-white border ${themeColors.borderInput} rounded-lg focus:ring-2 ${themeColors.focusRing} placeholder-slate-400 ${themeColors.textPrimary} text-sm`}/>) 
                        : (<div className={`w-full p-6 bg-white border-2 border-dashed ${themeColors.borderInput} rounded-lg text-center hover:border-cyan-500 transition-colors`}>
                            <input type="file" id="fileUpload" onChange={handleFileChange} accept=".pdf,.doc,.docx,.txt" className="hidden"/>
                            <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center">
                                <Icon name="upload" className={`w-12 h-12 ${themeColors.textAccent} mb-3`} />
                                <span className={`${themeColors.textAccent} font-semibold text-base`}>Clique para carregar</span>
                                <span className={`text-xs ${themeColors.textSecondary} mt-1.5`}>PDF, DOC, DOCX, TXT (Máx. 5MB)</span>
                            </label>
                            {uploadedFile && <p className={`text-sm ${themeColors.textSecondary} mt-4`}>Selecionado: {uploadedFile.name} ({(uploadedFile.size/1024/1024).toFixed(2)} MB)</p>}
                        </div>)}
                    </section>

                    <section className={`p-6 rounded-xl border ${themeColors.borderDefault} bg-white shadow-lg`}> {/* Card para Passo 2 */}
                        <h2 className={`text-xl sm:text-2xl font-semibold ${themeColors.textPrimary} mb-1.5 flex items-center`}><Icon name="layers" className={`w-6 h-6 mr-2.5 text-green-500`}/>Passo 2: Personalize</h2>
                        <p className={`${themeColors.textSecondary} text-sm mb-5`}>Defina as características principais.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                            <div><label htmlFor="numSlides" className={`block text-sm font-medium ${themeColors.textSecondary} mb-1.5`}>Nº de Slides</label><input type="number" id="numSlides" value={numSlides} onChange={(e) => {setNumSlides(Math.max(1, parseInt(e.target.value,10))); setBaseContentProcessed(false);}} min="1" className={`w-full p-2.5 bg-white border ${themeColors.borderInput} rounded-lg focus:ring-2 focus:ring-green-500 ${themeColors.textPrimary} text-sm`}/></div>
                            <div><label htmlFor="primaryColor" className={`block text-sm font-medium ${themeColors.textSecondary} mb-1.5`}>Cor Primária</label><input type="color" id="primaryColor" value={primaryColor} onChange={(e) => {setPrimaryColor(e.target.value); setBaseContentProcessed(false);}} style={colorInputStyle} className={`w-full h-11 p-0 border-0 bg-white rounded-lg cursor-pointer`}/></div>
                            <div><label htmlFor="presentationTone" className={`block text-sm font-medium ${themeColors.textSecondary} mb-1.5`}>Tom de Voz</label><select id="presentationTone" value={presentationTone} onChange={(e) => {setPresentationTone(e.target.value);setBaseContentProcessed(false);}} className={`w-full p-2.5 bg-white border ${themeColors.borderInput} rounded-lg focus:ring-2 focus:ring-purple-500 ${themeColors.textPrimary} appearance-none text-sm`} style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em 1.25em'}}>{toneOptions.map(o => <option key={o.value} value={o.value} className={`bg-white ${themeColors.textPrimary}`}>{o.label}</option>)}</select></div>
                            <div><label htmlFor="contentStyle" className={`block text-sm font-medium ${themeColors.textSecondary} mb-1.5`}>Estilo do Conteúdo</label><select id="contentStyle" value={contentStyle} onChange={(e) => {setContentStyle(e.target.value);setBaseContentProcessed(false);}} className={`w-full p-2.5 bg-white border ${themeColors.borderInput} rounded-lg focus:ring-2 focus:ring-orange-500 ${themeColors.textPrimary} appearance-none text-sm`} style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748B' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.25em 1.25em'}}>{contentStyleOptions.map(o => <option key={o.value} value={o.value} className={`bg-white ${themeColors.textPrimary}`}>{o.label}</option>)}</select></div>
                        </div>
                    </section>
                </div>
                 {/* Coluna da Direita: Passo 3 (Opções IA) ou Botão de Analisar */}
                <div className="md:mt-0"> {/* Garante que não haja margem superior extra em telas médias+ */}
                    {!baseContentProcessed && (
                        <div className="flex flex-col items-center justify-center h-full p-6 rounded-xl border bg-white shadow-lg">
                            <Icon name="wand" className={`w-16 h-16 mb-6 ${themeColors.textAccent} opacity-50`} />
                            <p className={`${themeColors.textSecondary} text-center mb-6`}>Preencha o conteúdo e as opções de personalização, depois clique abaixo para que a IA analise e sugira os próximos passos.</p>
                            <button onClick={handleProcessBaseContent} disabled={isLoading} className={`w-full ${themeColors.buttonPrimaryBg} ${themeColors.buttonPrimaryText} font-semibold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150 flex items-center justify-center text-lg disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none ${themeColors.focusRing} focus:ring-offset-2`}><Icon name="wand" className="w-6 h-6 mr-3" />Analisar e Definir Opções IA</button>
                        </div>
                    )}

                    {baseContentProcessed && (
                        <section className={`animate-fadeIn p-6 rounded-xl border ${themeColors.borderDefault} bg-white shadow-lg space-y-6`}> {/* Card para Passo 3 */}
                            <div>
                                <h2 className={`text-xl sm:text-2xl font-semibold ${themeColors.textPrimary} mb-1.5 flex items-center`}><Icon name="sparkles" className={`w-6 h-6 mr-2.5 text-purple-500`}/>Passo 3: Assistência Criativa</h2>
                                <p className={`${themeColors.textSecondary} text-sm mb-5`}>Selecione como a IA pode ajudar a enriquecer a sua apresentação.</p>
                                {initialProcessedContent && <details className={`mb-5 bg-slate-50 p-3.5 rounded-lg text-xs border ${themeColors.borderDefault} shadow-sm`}><summary className={`cursor-pointer ${themeColors.textSecondary} hover:${themeColors.textPrimary} flex items-center font-medium`}><Icon name="info" className="w-4 h-4 mr-1.5 text-slate-400"/>Ver resumo do conteúdo base</summary><pre className={`whitespace-pre-wrap mt-2.5 max-h-36 overflow-y-auto ${themeColors.textSecondary} p-2 bg-white rounded`}>{initialProcessedContent}</pre></details>}
                                <div className="space-y-4">
                                    <CustomCheckbox id="generateTitles" name="generateTitles" label="Criar Opções de Título com IA" description="Sugere 3 títulos alinhados com o tom de voz." checked={aiOptions.generateTitles} onChange={handleAiOptionChange} iconName="sparkles" iconColor="text-purple-500" />
                                    <CustomCheckbox id="suggestImages" name="suggestImages" label="Incluir Sugestões de Imagens/Ilustrações" description="Insere indicações de imagens/ilustrações relevantes." checked={aiOptions.suggestImages} onChange={handleAiOptionChange} iconName="imageIcon" iconColor="text-sky-500" />
                                    <CustomCheckbox id="suggestDataVisuals" name="suggestDataVisuals" label="Incluir Sugestões de Gráficos/Tabelas" description="Se houver dados, sugere locais para gráficos/tabelas." checked={aiOptions.suggestDataVisuals} onChange={handleAiOptionChange} iconName="barChart3" iconColor="text-green-500" />
                                </div>
                            </div>
                            <button onClick={handleProceedToFocusSelection} disabled={isLoading || !baseContentProcessed} className={`w-full ${themeColors.buttonPrimaryBg} ${themeColors.buttonPrimaryText} font-semibold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150 flex items-center justify-center text-lg disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none ${themeColors.focusRing} focus:ring-offset-2`}><Icon name="arrowRight" className="w-6 h-6 mr-3" />Prosseguir para Escolher Foco</button>
                        </section>
                    )}
                </div>
            </div>
          </>
        )}

        {currentStep === 'selectFocus' && ( 
            <section className="animate-fadeIn p-6 rounded-xl border bg-white shadow-lg">
                <h2 className={`text-2xl sm:text-3xl font-semibold ${themeColors.textPrimary} mb-2 flex items-center`}><Icon name="lightbulb" className={`w-7 h-7 mr-3 text-yellow-500`}/>Passo 4: Escolha o Foco Principal</h2>
                <p className={`${themeColors.textSecondary} text-sm mb-6`}>A IA sugere os seguintes focos. Selecione um para direcionar a criação.</p>
                {initialProcessedContent && <details className={`mb-6 bg-slate-50 p-3.5 rounded-lg text-xs border ${themeColors.borderDefault} shadow-sm`}><summary className={`cursor-pointer ${themeColors.textSecondary} hover:${themeColors.textPrimary} flex items-center font-medium`}><Icon name="info" className="w-4 h-4 mr-1.5 text-slate-400"/>Rever resumo base</summary><pre className={`whitespace-pre-wrap mt-2.5 max-h-32 overflow-y-auto ${themeColors.textSecondary} p-2 bg-white rounded`}>{initialProcessedContent}</pre></details>}
                <div className="space-y-4">
                {suggestedFocuses.length > 0 ? (suggestedFocuses.map((focus, index) => (<button key={index} onClick={() => handleFocusSelection(focus)} className={`w-full text-left p-4 bg-white hover:bg-slate-100 border ${themeColors.borderDefault} rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 ${themeColors.focusRing} shadow-sm hover:shadow-md`}><span className={`${themeColors.textPrimary} font-medium text-base`}>{focus}</span></button>))) 
                : <p className={`${themeColors.textSecondary}`}>Nenhum foco sugerido. Refine o texto inicial ou prossiga (IA usará tema geral).</p>}
                </div>
                <button onClick={() => { setCurrentStep('initialInput'); }} className={`mt-8 w-full text-sm ${themeColors.textSecondary} hover:${themeColors.textPrimary} py-2.5 focus:outline-none ${themeColors.focusRing} rounded-md hover:bg-slate-200 transition-colors`}>&larr; Voltar e Editar Opções</button>
            </section>
        )}
        
        {currentStep === 'approveContent' && ( 
            <section className="animate-fadeIn p-6 rounded-xl border bg-white shadow-lg">
                <h2 className={`text-2xl sm:text-3xl font-semibold ${themeColors.textPrimary} mb-2 flex items-center`}><Icon name="edit3" className={`w-7 h-7 mr-3 text-cyan-600`}/>Passo 5: Reveja e Aprove o Rascunho</h2>
                <p className={`${themeColors.textSecondary} text-sm mb-2`}>Rascunho focado em: <strong className="text-cyan-700">{`"${selectedFocus}"`}</strong>.</p>
                <p className={`text-xs ${themeColors.textSecondary} mb-1`}>Opções IA aplicadas (se selecionadas):</p>
                <ul className="text-xs list-disc list-inside mb-6 pl-4 text-slate-500">
                    {aiOptions.generateTitles && <li>Opções de Título</li>} {aiOptions.suggestImages && <li>Sugestões de Imagens</li>} {aiOptions.suggestDataVisuals && <li>Sugestões de Gráficos</li>}
                    {!aiOptions.generateTitles && !aiOptions.suggestImages && !aiOptions.suggestDataVisuals && <li>Nenhuma assistência IA selecionada.</li>}
                </ul>
                <div className={`p-4 bg-slate-50 rounded-lg max-h-[450px] overflow-y-auto border ${themeColors.borderInput} mb-6 shadow-inner`}><pre className={`whitespace-pre-wrap ${themeColors.textPrimary} text-sm leading-relaxed`}>{contentForApproval || "Nenhum conteúdo gerado."}</pre></div>
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button onClick={() => setCurrentStep('selectFocus')} className={`w-full sm:w-auto flex-1 py-3 px-4 ${themeColors.buttonSecondaryBg} ${themeColors.buttonSecondaryText} hover:bg-slate-300 font-semibold rounded-lg transition-all duration-150 flex items-center justify-center focus:outline-none ${themeColors.focusRing} focus:ring-offset-2 shadow hover:shadow-md`}><Icon name="cornerDownRight" className="w-5 h-5 mr-2 transform scale-x-[-1]" />Escolher Outro Foco</button>
                <button onClick={handleApproval} disabled={isLoading} className={`w-full sm:w-auto flex-1 ${themeColors.buttonPrimaryBg} ${themeColors.buttonPrimaryText} font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none ${themeColors.focusRing} focus:ring-offset-2`}><Icon name="checkCircle" className="w-5 h-5 mr-2" />Aprovar e Gerar Apresentação</button>
                </div>
            </section>
        )}

        {currentStep === 'finalResult' && ( 
            <section className={`animate-fadeIn p-6 rounded-xl border bg-white shadow-lg`}>
                <h2 className="text-2xl sm:text-3xl font-semibold text-green-600 mb-5 flex items-center"><Icon name="checkCircle" className="w-8 h-8 mr-3" />Passo 6: A sua Apresentação está Pronta!</h2>
                {finalResult && (
                    <>
                        <div className={`space-y-2 ${themeColors.textSecondary} mb-6 p-5 border ${themeColors.borderDefault} rounded-lg bg-slate-50 shadow-sm`}>
                        <p><strong>Ficheiro (Simulado):</strong> <span className="font-medium text-slate-700">{finalResult.fileName}</span></p>
                        <p><strong>Slides:</strong> <span className="font-medium text-slate-700">{finalResult.slides}</span></p>
                        <p><strong>Cor Primária:</strong> <span style={{ backgroundColor: finalResult.color, padding: '3px 9px', borderRadius: '6px', marginLeft: '8px', border: `1px solid ${finalResult.color === '#FFFFFF' ? '#DDDDDD' : 'transparent'}` }} className={`${finalResult.color === '#FFFFFF' ? 'text-black' : 'text-white'} text-xs font-medium`}>{finalResult.color}</span></p>
                        <p><strong>Tom:</strong> <span className="font-medium text-slate-700">{finalResult.tone}</span></p>
                        <p><strong>Estilo:</strong> <span className="font-medium text-slate-700">{finalResult.style}</span></p>
                        <p><strong>Foco:</strong> <span className="font-medium text-slate-700">{finalResult.focus}</span></p>
                        <p><strong>Assistência IA:</strong> <span className="font-medium text-slate-700">{Object.entries(finalResult.aiOptionsUsed).filter(([, value]) => value).map(([key]) => (key === 'generateTitles' ? 'Títulos' : key === 'suggestImages' ? 'Imagens' : 'Gráficos')).join(', ') || 'Nenhuma'}</span></p>
                        </div>
                        <details className={`mb-5 bg-slate-50 p-3.5 rounded-lg text-xs border ${themeColors.borderDefault} shadow-sm`}><summary className={`cursor-pointer ${themeColors.textSecondary} hover:${themeColors.textPrimary} flex items-center font-medium`}><Icon name="info" className="w-4 h-4 mr-1.5 text-slate-400"/>Ver conteúdo aprovado (simulação)</summary><pre className={`whitespace-pre-wrap mt-2.5 max-h-40 overflow-y-auto ${themeColors.textSecondary} p-2 bg-white rounded`}>{finalResult.approvedContent}</pre></details>
                        <button onClick={() => alert('Download simulado!')} className={`mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-150 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}><Icon name="download" className="w-5 h-5 mr-2" />Baixar Apresentação (Simulado)</button>
                    </>
                )}
                <button onClick={resetFlow} className={`mt-4 w-full text-sm ${themeColors.textSecondary} hover:${themeColors.textPrimary} py-2.5 focus:outline-none ${themeColors.focusRing} rounded-md hover:bg-slate-200 transition-colors`}>Criar Nova Apresentação</button>
                <p className={`text-xs ${themeColors.textSecondary} mt-4 text-center`}>Lembre-se: Geração de .pptx real requer backend.</p>
            </section>
        )}
      </main>
      
      <footer className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 py-8 text-center text-sm ${themeColors.textSecondary} border-t border-slate-200`}>
        <p>&copy; {new Date().getFullYear()} MercurIA. Todos os direitos reservados (Protótipo).</p>
      </footer>
      <style jsx global>{`
        body { background-color: #F1F5F9; /* Tailwind slate-100 */ }
        .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        textarea::-webkit-scrollbar, .max-h-32::-webkit-scrollbar, .max-h-40::-webkit-scrollbar, .max-h-\\[400px\\]::-webkit-scrollbar, .max-h-\\[450px\\]::-webkit-scrollbar { width: 8px; }
        textarea::-webkit-scrollbar-track, .max-h-32::-webkit-scrollbar-track, .max-h-40::-webkit-scrollbar-track, .max-h-\\[400px\\]::-webkit-scrollbar-track, .max-h-\\[450px\\]::-webkit-scrollbar-track { background: #E2E8F0; border-radius: 10px; } /* Tailwind slate-200 */
        textarea::-webkit-scrollbar-thumb, .max-h-32::-webkit-scrollbar-thumb, .max-h-40::-webkit-scrollbar-thumb, .max-h-\\[400px\\]::-webkit-scrollbar-thumb, .max-h-\\[450px\\]::-webkit-scrollbar-thumb { background: #94A3B8; border-radius: 10px; } /* Tailwind slate-400 */
        textarea::-webkit-scrollbar-thumb:hover, .max-h-32::-webkit-scrollbar-thumb:hover, .max-h-40::-webkit-scrollbar-thumb:hover, .max-h-\\[400px\\]::-webkit-scrollbar-thumb:hover, .max-h-\\[450px\\]::-webkit-scrollbar-thumb:hover { background: #64748B; } /* Tailwind slate-500 */
        input[type="color"]::-moz-color-swatch { height: calc(100% - 4px); width: calc(100% - 4px); padding: 0; border: none; }
        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; border-radius: 0.25rem; }
        select { -webkit-appearance: none; -moz-appearance: none; appearance: none; }
      `}</style>
    </div>
  );
}
