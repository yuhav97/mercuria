import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompts } = await req.json();

    if (!prompts || !Array.isArray(prompts)) {
      return NextResponse.json({ error: "Invalid prompts" }, { status: 400 });
    }

    const imagePromises = prompts.map(async (prompt: string) => {
      try {
        const response = await fetch("https://api.openai.com/v1/images/generations", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "dall-e-3",
            prompt: `Criar uma imagem profissional para apresentação baseada em: ${prompt}`,
            n: 1,
            size: "1024x1024",
            response_format: "b64_json"
          })
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("Erro na OpenAI:", data);
          return null;
        }

        return `data:image/png;base64,${data.data[0].b64_json}`;
      } catch (err) {
        console.error("Erro ao gerar imagem:", err);
        return null;
      }
    });

    const imageUrls = await Promise.all(imagePromises);
    
    return NextResponse.json({ imageUrls });
  } catch (error) {
    console.error("Erro no backend de imagens:", error);
    return NextResponse.json({ error: "Erro ao processar imagens" }, { status: 500 });
  }
}