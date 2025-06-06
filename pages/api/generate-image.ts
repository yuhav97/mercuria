// File: /src/pages/api/generate-image.ts

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Invalid prompt" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro na OpenAI:", data);
      return res.status(500).json({ error: "Failed to generate image" });
    }

    const base64Image = `data:image/png;base64,${data.data[0].b64_json}`;
    return res.status(200).json({ base64Image });
  } catch (err) {
    console.error("Erro ao chamar a API da OpenAI:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
