import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, tone, format, slides, persona } = await req.json();

    const prompt = `
${persona}

Seu objetivo agora é reescrever o conteúdo abaixo para uma apresentação em PowerPoint, seguindo as seguintes diretrizes:
- Tom de voz: ${tone}
- Formato da apresentação: ${format}
- Quantidade de slides: aproximadamente ${slides}

Se o formato for "Bullet points", reestruture o conteúdo em tópicos curtos, objetivos e claros.
Se o formato for "Blocos de texto", utilize parágrafos bem estruturados e coesos, mas ainda adaptados para uso em slides.

O conteúdo a ser transformado é o seguinte:
"""
${text}
"""

Agora gere o conteúdo conforme solicitado.
`;

    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Você é um especialista em transformar textos em apresentações pedagógicas e visuais.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    const data = await completion.json();
    const rewrittenText = data.choices?.[0]?.message?.content || "Erro ao gerar conteúdo.";

    return NextResponse.json({ rewrittenText });
  } catch (error) {
    console.error("Erro ao processar reescrita:", error);
    return NextResponse.json({ rewrittenText: "Erro ao gerar conteúdo com IA." }, { status: 500 });
  }
}
