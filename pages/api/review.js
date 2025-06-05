// pages/api/review.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { text, style } = req.body;

  const prompt = `Reescreva o seguinte conteúdo no estilo "${style}". Mantenha fluidez, clareza e coerência:\n\n${text}`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer REMOVIDO`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    const result = await response.json();

    if (!result.choices || result.choices.length === 0) {
      return res.status(500).json({ error: "Falha na resposta da IA" });
    }

    res.status(200).json({ result: result.choices[0].message.content });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao processar conteúdo com IA" });
  }
}
