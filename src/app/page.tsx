"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { 
    Loader2, FileText, Palette, Layers, UploadCloud, Wand2, Download, Mic2, 
    ListChecks, Edit3, CheckCircle, Zap, Lightbulb, CornerDownRight, XCircle, 
    Sparkles, Image as ImageIcon, BarChart3, ArrowRight, CheckSquare, Square, Info, RefreshCw, Cpu, BarChartHorizontalBig, Palette as PaletteIcon
} from 'lucide-react';

// --- Definição do Componente Icon e Tipos Associados ---
const iconsMap = {
  loader: Loader2, file: FileText, palette: Palette, layers: Layers, upload: UploadCloud,
  wand: Wand2, download: Download, mic: Mic2, listChecks: ListChecks, edit3: Edit3,
  checkCircle: CheckCircle, zap: Zap, lightbulb: Lightbulb, cornerDownRight: CornerDownRight,
  xCircle: XCircle, sparkles: Sparkles, imageIcon: ImageIcon, barChart3: BarChart3,
  arrowRight: ArrowRight, checkSquare: CheckSquare, square: Square, info: Info, refreshCw: RefreshCw,
  cpu: Cpu, barChartHorizontalBig: BarChartHorizontalBig, paletteIcon: PaletteIcon,
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
                    <div key={step.id} className={`text-xs sm:text-sm text-center flex-1 px-1 ${index + 1 <= currentStepNumberForDisplay ? 'text-cyan-600 font-bold' : 'text-gray-500'}`}>{step.name}</div>
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

// --- Configurações Globais ---
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 
const API_URL_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

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


// --- Função de Chamada à API Gemini (agora fora do componente principal para ser reutilizável) ---
const callGeminiAPI = async (
    prompt: string, 
    operationDescription = "A comunicar com a Inteligência Artificial...", 
    usePersona = true,
    currentSetLoadingMessage: (msg: string) => void,
    currentSetIsLoading: (loading: boolean) => void,
    currentSetError: (errorMsg: string) => void
): Promise<string | null> => {
    currentSetLoadingMessage(operationDescription); currentSetIsLoading(true); currentSetError(''); 
    if (!API_KEY) { console.error("[callGeminiAPI] ERRO CRÍTICO: API Key (NEXT_PUBLIC_GEMINI_API_KEY) não está definida no ambiente!"); currentSetError("Erro de configuração: A Chave da API não foi encontrada."); currentSetIsLoading(false); if (operationDescription.includes("subtítulos")) return "MercurIA: Config. pendente.\nMercurIA: Ative a IA.\nMercurIA: Chave API necessária."; return null; }
    const finalPrompt = usePersona ? `${aiPersonaInstructions}\n\nTAREFA:\n${prompt}` : prompt;
    const payload = { contents: [{ role: "user", parts: [{ text: finalPrompt }] }] };
    try {
        const response = await fetch(API_URL_GEMINI, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
        if (!response.ok) { 
            let errMsg = `Falha na IA (HTTP ${response.status})`; 
            try { const eData = await response.json(); if (eData?.error?.message) errMsg = eData.error.message; 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (_jsonErr) { /* Silenciar erro */ } 
            throw new Error(errMsg); 
        }
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text && typeof data.candidates[0].content.parts[0].text === 'string') { currentSetIsLoading(false); return data.candidates[0].content.parts[0].text; }
        throw new Error("Resposta da IA com formato inesperado.");
    } catch (err: unknown) { currentSetIsLoading(false); if (err instanceof Error) currentSetError(`Erro IA: ${err.message}`); else currentSetError("Erro IA desconhecido."); return null; }
};


// --- Componente LandingPage ---
interface LandingPageProps {
    onStart: () => void;
}
const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    const [suggestedSubtitles, setSuggestedSubtitles] = useState<string[]>([]);
    const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
    const [isLoadingSubtitles, setIsLoadingSubtitles] = useState(false);
    const [logoError, setLogoError] = useState(false);
    // Estados locais para loading/error da landing page, para não interferir com o global da App
    const [_loadingMessage, _setLoadingMessage] = useState(''); 
    const [_error, _setError] = useState('');


    const fetchLandingSubtitles = useCallback(async () => {
        const promptSubtitles = `Você é um copywriter especialista. Crie 3 subtítulos curtos (máx 12 palavras), impactantes e comerciais para 'MercurIA', uma IA que cria apresentações PowerPoint. DEVEM incluir 'MercurIA'. Liste cada um numa nova linha. Varie-os.`;
        if (!API_KEY) {
            setSuggestedSubtitles(["MercurIA: Apresentações Inteligentes (Simulado).", "MercurIA: Do texto à ovation, com IA (Simulado).", "MercurIA: Design e conteúdo perfeitos (Simulado)."]);
            setCurrentSubtitleIndex(0);
            return;
        }
        setIsLoadingSubtitles(true);
        const subtitlesText = await callGeminiAPI(promptSubtitles, "A gerar slogan criativo...", false, _setLoadingMessage, setIsLoadingSubtitles, _setError);
        setIsLoadingSubtitles(false);
        if (subtitlesText && typeof subtitlesText === 'string') {
            const newSubtitles = subtitlesText.split('\n').filter(s => s.trim() !== '').slice(0, 3);
            if (newSubtitles.length > 0) { setSuggestedSubtitles(newSubtitles); setCurrentSubtitleIndex(Math.floor(Math.random() * newSubtitles.length)); } 
            else { setSuggestedSubtitles(["MercurIA: Apresentações impactantes.", "MercurIA: Ideias que brilham.", "MercurIA: Conteúdo em espetáculo."]); setCurrentSubtitleIndex(0); }
        } else { setSuggestedSubtitles(["MercurIA: Magia da IA.", "MercurIA: Slides profissionais.", "MercurIA: Inovação e clareza."]); setCurrentSubtitleIndex(0); }
    }, []); // callGeminiAPI não é dependência aqui pois usa os setters locais

    useEffect(() => {
        fetchLandingSubtitles();
    }, [fetchLandingSubtitles]);

    const features = [
        { icon: "cpu" as IconName, title: "Inteligência Artificial Avançada", description: "MercurIA analisa seu conteúdo e o transforma em slides coesos e bem estruturados." , iconColor: "text-cyan-500"},
        { icon: "paletteIcon" as IconName, title: "Personalização Completa", description: "Escolha cores, tom de voz, número de slides e estilo para uma apresentação única." , iconColor: "text-purple-500"},
        { icon: "barChartHorizontalBig" as IconName, title: "Foco e Clareza", description: "Defina o foco principal e deixe a IA otimizar a mensagem para máximo impacto." , iconColor: "text-green-500"},
    ];

    return (
        <div className={`min-h-screen ${themeColors.background} flex flex-col`}>
            <header className="w-full bg-white shadow-md py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    {logoError ? (
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">MercurIA</h1>
                    ) : (
                        <img src={logoUrl} alt="MercurIA Logo" className="h-12 sm:h-14 w-auto" onError={() => setLogoError(true)} />
                    )}
                    <button 
                        onClick={onStart}
                        className={`px-6 py-2.5 ${themeColors.buttonPrimaryBg} ${themeColors.buttonPrimaryText} font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-150 text-sm sm:text-base`}
                    >
                        Aceder à Ferramenta
                        <Icon name="arrowRight" className="inline-block w-4 h-4 ml-2" />
                    </button>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center text-center px-4 py-12 sm:py-20">
                <div className="max-w-3xl">
                    <h1 className={`text-4xl sm:text-5xl md:text-6xl font-bold ${themeColors.textPrimary} mb-4`}>
                        MercurIA: <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600">Apresentações Poderosas</span> com Inteligência Artificial.
                    </h1>
                    <div className="h-10 mb-8">
                        {isLoadingSubtitles && <p className={`${themeColors.textSecondary} text-lg sm:text-xl italic`}>A gerar um slogan inspirador...</p>}
                        {!isLoadingSubtitles && suggestedSubtitles.length > 0 && <p className={`${themeColors.textSecondary} text-lg sm:text-xl`}>{suggestedSubtitles[currentSubtitleIndex]}</p>}
                        {!isLoadingSubtitles && suggestedSubtitles.length === 0 && <p className={`${themeColors.textSecondary} text-lg sm:text-xl`}>Transforme qualquer conteúdo em slides profissionais em minutos.</p>}
                    </div>
                    <button 
                        onClick={onStart}
                        className={`px-8 py-3.5 ${themeColors.buttonPrimaryBg} ${themeColors.buttonPrimaryText} text-lg font-semibold rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-150`}
                    >
                        Comece a Criar Gratuitamente
                        <Icon name="zap" className="inline-block w-5 h-5 ml-2.5" />
                    </button>
                </div>

                <section className="mt-20 sm:mt-28 w-full max-w-5xl">
                    <h2 className={`text-2xl sm:text-3xl font-semibold ${themeColors.textPrimary} mb-10 sm:mb-12`}>Porquê escolher MercurIA?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map(feature => (
                            <div key={feature.title} className={`p-6 bg-white rounded-xl shadow-lg border ${themeColors.borderDefault}`}>
                                <Icon name={feature.icon} className={`w-10 h-10 mb-4 ${feature.iconColor}`} />
                                <h3 className={`text-lg font-semibold ${themeColors.textPrimary} mb-2`}>{feature.title}</h3>
                                <p className={`${themeColors.textSecondary} text-sm`}>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <footer className={`w-full py-8 text-center text-sm ${themeColors.textSecondary} border-t border-slate-200`}>
                <p>&copy; {new Date().getFullYear()} MercurIA. Todos os direitos reservados (Protótipo).</p>
            </footer>
        </div>
    );
};


// --- Componente AppPage (Antiga MercurIAHomePage) ---
const AppPage: React.FC = () => {
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
  const [aiOptions, setAiOptions] = useState<AIAptionsType>({ generateTitles: true, suggestImages: false, suggestDataVisuals: false });
  const [baseContentProcessed, setBaseContentProcessed] = useState(false); 
  const [suggestedFocuses, setSuggestedFocuses] = useState<string[]>([]);
  const [selectedFocus, setSelectedFocus] = useState('');
  const [contentForApproval, setContentForApproval] = useState('');
  const [finalResult, setFinalResult] = useState<FinalResultType | null>(null);
  const [logoError, setLogoError] = useState(false); // Embora a logo principal esteja na Landing Page, pode ser útil ter um fallback aqui

  // Reutilizar a função callGeminiAPI passando os setters de estado locais
  const localCallGeminiAPI = (prompt: string, operationDescription?: string, usePersona?: boolean) => 
    callGeminiAPI(prompt, operationDescription, usePersona, setLoadingMessage, setIsLoading, setError);


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
    const processed = await localCallGeminiAPI(initialPrompt, "A processar conteúdo base...");
    if (processed !== null) { setInitialProcessedContent(processed); setBaseContentProcessed(true); } 
    else if (!error && !isLoading) setError("Falha ao processar conteúdo. Tente novamente.");
  };
  
  const handleProceedToFocusSelection = async () => {
      if (!initialProcessedContent) { setError("Conteúdo base não processado."); return; }
      setError('');
      const focusPrompt = `Baseado no conteúdo processado, sugira 3-4 focos lógicos e pedagógicos. Títulos curtos e concisos.
Conteúdo Processado: "${initialProcessedContent.substring(0, 3000)}..."`;
      const focusesText = await localCallGeminiAPI(focusPrompt, "A identificar focos...");
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

    const approvalContent = await localCallGeminiAPI(approvalPrompt, `A gerar rascunho para: "${focus}"...`);
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
  };

  const colorInputStyle = { width: '100%', height: '40px', border: '1px solid #CBD5E1', borderRadius: '0.375rem', padding: '2px' };
  
  return (
    <> {/* Fragmento para envolver a lógica da página da app */}
      <header className="w-full bg-white shadow-sm sticky top-0 z-30"> {/* Header simplificado para a app */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
                {logoError ? (
                    <h1 className="text-xl font-bold text-cyan-600">MercurIA</h1>
                ) : (
                    <img src={logoUrl} alt="MercurIA Logo" className="h-8 w-auto" onError={() => setLogoError(true)} />
                )}
            </div>
        </div>
      </header>

      <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 ${themeColors.cardBackground} mt-0 sm:rounded-b-xl shadow-none sm:shadow-2xl space-y-10 border-x-0 border-b-0 sm:border ${themeColors.borderDefault}`}>
        <ProgressBar currentStepKey={currentStep} />
        
        {isLoading && (<div className="fixed inset-0 bg-slate-700/75 flex items-center justify-center z-50 backdrop-blur-sm"><div className={`flex flex-col items-center bg-white p-10 rounded-xl shadow-2xl border ${themeColors.borderDefault}`}><Icon name="loader" className={`w-14 h-14 ${themeColors.textAccent} mb-5`} /><p className={`text-xl ${themeColors.textPrimary}`}>{loadingMessage}</p></div></div>)}
        {error && (<div className={`p-4 ${themeColors.errorBg} border ${themeColors.errorBorder} ${themeColors.errorText} rounded-lg text-sm flex items-center gap-3`}><Icon name="xCircle" className="w-5 h-5 shrink-0" /><span><strong>Erro:</strong> {error}</span><button onClick={() => setError('')} className={`ml-auto ${themeColors.errorText} hover:opacity-75 font-bold`}>&times;</button></div>)}

        {currentStep === 'initialInput' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
                <div className="space-y-8">
                    <section className={`p-6 rounded-xl border ${themeColors.borderDefault} bg-white shadow-lg`}>
                        <h2 className={`text-xl sm:text-2xl font-semibold ${themeColors.textPrimary} mb-1.5 flex items-center`}><Icon name="file" className={`w-6 h-6 mr-2.5 ${themeColors.textAccent}`}/>Passo 1: O Seu Conteúdo</h2>
                        <p className={`${themeColors.textSecondary} text-sm mb-5`}>Forneça o material base para a sua apresentação.</p>
                        <div className="mb-5">
                            <label className={`block text-base font-medium ${themeColors.textSecondary} mb-3`}>Como prefere fornecer o conteúdo?</label>
                            <div className="flex space-