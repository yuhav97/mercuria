import PptxGenJS from "pptxgenjs";

export async function exportPPTX(slideTexts: string[], slideTitles: string[], template: string = "classic"): Promise<void> {
  const pptx = new PptxGenJS();

  const templates = {
    classic: {
      title: {
        x: 0.5,
        y: 0.3,
        w: "90%",
        h: 1,
        fontSize: 20,
        bold: true,
        color: "003366",
        fontFace: "Arial",
      },
      content: {
        x: 0.5,
        y: 1,
        w: "90%",
        h: "70%",
        fontSize: 16,
        color: "363636",
        wrap: true,
        valign: "top",
        fontFace: "Calibri",
        lineSpacingMultiple: 1.2,
      },
      backgroundColor: "FFFFFF",
    },
    modern: {
      title: {
        x: 0.5,
        y: 0.5,
        w: "80%",
        h: 1,
        fontSize: 24,
        bold: true,
        color: "2E86DE",
        align: "center",
        fontFace: "Helvetica Neue",
      },
      content: {
        x: 0.5,
        y: 1.5,
        w: "80%",
        h: "60%",
        fontSize: 18,
        color: "1C1C1C",
        wrap: true,
        valign: "top",
        align: "left",
        fontFace: "Segoe UI",
        lineSpacingMultiple: 1.3,
      },
      backgroundColor: "F2F4F8",
    },
    dark: {
      title: {
        x: 0.5,
        y: 0.3,
        w: "90%",
        h: 1,
        fontSize: 20,
        bold: true,
        color: "FFFFFF",
        fontFace: "Verdana",
      },
      content: {
        x: 0.5,
        y: 1,
        w: "90%",
        h: "70%",
        fontSize: 16,
        color: "EEEEEE",
        wrap: true,
        valign: "top",
        fontFace: "Verdana",
        lineSpacingMultiple: 1.2,
      },
      backgroundColor: "1E1E1E",
    },
    minimal: {
      title: {
        x: 0.6,
        y: 0.4,
        w: "80%",
        h: 0.8,
        fontSize: 22,
        bold: true,
        color: "000000",
        align: "left",
        fontFace: "Arial Narrow",
      },
      content: {
        x: 0.6,
        y: 1.3,
        w: "80%",
        h: "65%",
        fontSize: 15,
        color: "333333",
        wrap: true,
        valign: "top",
        align: "left",
        fontFace: "Arial Narrow",
        lineSpacingMultiple: 1.15,
      },
      backgroundColor: "FFFFFF",
    },
    colorful: {
      title: {
        x: 0.5,
        y: 0.4,
        w: "80%",
        h: 1,
        fontSize: 26,
        bold: true,
        color: "FFFFFF",
        align: "center",
        fontFace: "Comic Sans MS",
        underline: true,
      },
      content: {
        x: 0.5,
        y: 1.6,
        w: "80%",
        h: "60%",
        fontSize: 17,
        color: "FFFFFF",
        wrap: true,
        valign: "top",
        align: "left",
        fontFace: "Comic Sans MS",
        lineSpacingMultiple: 1.25,
      },
      backgroundColor: "5A189A",
    },
    corporate: {
      title: {
        x: 0.5,
        y: 0.3,
        w: "85%",
        h: 1,
        fontSize: 22,
        bold: true,
        color: "1A1A1A",
        fontFace: "Calibri Light",
      },
      content: {
        x: 0.5,
        y: 1.2,
        w: "85%",
        h: "65%",
        fontSize: 16,
        color: "444444",
        wrap: true,
        valign: "top",
        fontFace: "Calibri",
        lineSpacingMultiple: 1.2,
      },
      backgroundColor: "FAFAFA",
    },
  };

  const selected = templates[template] || templates["classic"];

  for (let i = 0; i < slideTexts.length; i++) {
    const slide = pptx.addSlide();
    const text = slideTexts[i];
    const title = slideTitles[i] || `Slide ${i + 1}`;

    if (selected.backgroundColor) {
      slide.background = { fill: selected.backgroundColor };
    }

    slide.addText(title, selected.title);
    slide.addText(text, selected.content);

    try {
      const imagePrompt = encodeURIComponent(text.slice(0, 100));
      const dalleResponse = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt })
      });

      if (dalleResponse.ok) {
        const { base64Image } = await dalleResponse.json();
        slide.addImage({ data: base64Image, x: 6.5, y: 0.3, w: 2, h: 2 });
      } else {
        console.warn(`❌ Falha ao gerar imagem para slide ${i + 1}`);
      }
    } catch (err) {
      console.warn(`⚠️ Erro ao adicionar imagem ao slide ${i + 1}:`, err);
    }
  }

  await pptx.writeFile({ fileName: "mercurIA_apresenta.pptx" });
}
