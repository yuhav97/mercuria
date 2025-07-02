import { NextResponse } from "next/server";

// Dicionário básico de correções comuns em português
const commonMistakes: Record<string, string> = {
  "vc": "você",
  "pq": "porque",
  "tbm": "também", 
  "ñ": "não",
  "q": "que",
  "qdo": "quando",
  "pra": "para",
  "hj": "hoje",
  "ontem": "ontem",
  "amanhã": "amanhã",
  "recebi": "recebi",
  "recebeu": "recebeu",
  "ocorreu": "ocorreu",
  "aconteceu": "aconteceu",
  "existem": "existem",
  "existir": "existir",
  "preciso": "preciso",
  "precisa": "precisa",
  "através": "através",
  "benefício": "benefício",
  "privilégio": "privilégio",
  "consciência": "consciência",
  "excesso": "excesso",
  "exceção": "exceção",
  "explicação": "explicação",
  "extensão": "extensão",
  "professor": "professor",
  "profissão": "profissão",
  "discussão": "discussão",
  "obsessão": "obsessão",
  "possessão": "possessão",
  "impressão": "impressão",
  "pressão": "pressão",
  "sucessão": "sucessão",
  "concessão": "concessão",
  "acessão": "acesso",
  "assessor": "assessor"
};

// Regras básicas de acentuação
const accentRules: Array<{pattern: RegExp, replacement: string}> = [
  // Palavras oxítonas terminadas em a, e, o, em, ens
  { pattern: /\bpara$/g, replacement: "pará" },
  { pattern: /\bcafe$/g, replacement: "café" },
  { pattern: /\bvoce$/g, replacement: "você" },
  { pattern: /\bporem$/g, replacement: "porém" },
  { pattern: /\btambem$/g, replacement: "também" },
  
  // Paroxítonas terminadas em ã, ão
  { pattern: /\borfa$/g, replacement: "órfã" },
  { pattern: /\borgao$/g, replacement: "órgão" },
  
  // Proparoxítonas sempre acentuadas
  { pattern: /\bmedico$/g, replacement: "médico" },
  { pattern: /\bmusica$/g, replacement: "música" },
  { pattern: /\bpratico$/g, replacement: "prático" },
  { pattern: /\bpsicologico$/g, replacement: "psicológico" },
  { pattern: /\beconomico$/g, replacement: "econômico" },
  { pattern: /\btecnico$/g, replacement: "técnico" },
  { pattern: /\bancora$/g, replacement: "âncora" },
];

function correctSpelling(text: string): { correctedText: string; corrections: Array<{original: string, corrected: string}> } {
  let correctedText = text;
  const corrections: Array<{original: string, corrected: string}> = [];

  // Aplicar correções de palavras comuns
  Object.entries(commonMistakes).forEach(([wrong, correct]) => {
    const regex = new RegExp(`\\b${wrong}\\b`, 'gi');
    if (regex.test(correctedText)) {
      corrections.push({ original: wrong, corrected: correct });
      correctedText = correctedText.replace(regex, correct);
    }
  });

  // Aplicar regras de acentuação
  accentRules.forEach(({ pattern, replacement }) => {
    const matches = correctedText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        corrections.push({ original: match, corrected: replacement });
      });
      correctedText = correctedText.replace(pattern, replacement);
    }
  });

  // Correções gerais de pontuação e espaçamento
  correctedText = correctedText
    .replace(/\s+/g, ' ') // múltiplos espaços
    .replace(/\s+([,.!?;:])/g, '$1') // espaços antes de pontuação
    .replace(/([,.!?;:])\s*([a-zA-Z])/g, '$1 $2') // espaços após pontuação
    .replace(/\.\s*\./g, '.') // pontos duplos
    .trim();

  return { correctedText, corrections };
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: "Texto inválido" }, { status: 400 });
    }

    const { correctedText, corrections } = correctSpelling(text);

    return NextResponse.json({ 
      originalText: text,
      correctedText,
      corrections,
      hasChanges: corrections.length > 0
    });

  } catch (error) {
    console.error("Erro na correção ortográfica:", error);
    return NextResponse.json({ error: "Erro ao processar a correção" }, { status: 500 });
  }
}