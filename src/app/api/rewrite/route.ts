import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, tone, format, slides, persona } = await req.json();

    const prompt = `
${persona}

--- Instruções ---
Você deve gerar uma apresentação com aproximadamente ${slides} slides no formato: ${format}.
O conteúdo deve ser adaptado com o tom de voz: ${tone}.
Texto original:
"""
${text}
"""

Retorne apenas o conteúdo estruturado para os slides, sem explicações adicionais.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const rewrittenText = response.choices[0].message.content || "";

    return NextResponse.json({ rewrittenText });
  } catch (error) {
    console.error("Erro no backend:", error);
    return NextResponse.json({ error: "Erro ao processar o conteúdo." }, { status: 500 });
  }
}
