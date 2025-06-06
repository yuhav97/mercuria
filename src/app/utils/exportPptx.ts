import PptxGenJS from "pptxgenjs";

export async function exportPPTX(
  slideTexts: string[],
  slideTitles: string[],
  template = "classic",
  images: string[] = []
) {
  const pptx = new PptxGenJS();

  type SlideTemplate = {
    backgroundColor: string;
    title: PptxGenJS.TextPropsOptions;
    content: PptxGenJS.TextPropsOptions;
    image?: PptxGenJS.ImagePropsOptions;
  };

  const templates: Record<string, SlideTemplate> = {
    classic: {
      backgroundColor: "FFFFFF",
      title: { x: 0.5, y: 0.3, fontSize: 24, bold: true, color: "000000" },
      content: { x: 0.5, y: 1.2, fontSize: 16, color: "333333", wrap: true, w: 8.5, h: 4.5 },
    },
    modern: {
      backgroundColor: "F4F4F5",
      title: { x: 0.5, y: 0.4, fontSize: 26, bold: true, color: "1F2937" },
      content: { x: 0.5, y: 1.4, fontSize: 18, color: "4B5563", wrap: true, w: 8.5, h: 4.5 },
    },
    dark: {
      backgroundColor: "1F2937",
      title: { x: 0.5, y: 0.4, fontSize: 24, bold: true, color: "F9FAFB" },
      content: { x: 0.5, y: 1.4, fontSize: 16, color: "E5E7EB", wrap: true, w: 8.5, h: 4.5 },
    },
    minimal: {
      backgroundColor: "FFFFFF",
      title: { x: 0.7, y: 0.5, fontSize: 22, bold: true, color: "000000" },
      content: { x: 0.7, y: 1.5, fontSize: 15, color: "444444", wrap: true, w: 8, h: 4 },
    },
    colorful: {
      backgroundColor: "E0F2FE",
      title: { x: 0.5, y: 0.5, fontSize: 26, bold: true, color: "0284C7" },
      content: { x: 0.5, y: 1.5, fontSize: 16, color: "075985", wrap: true, w: 8.5, h: 4.5 },
    },
    corporate: {
      backgroundColor: "F8FAFC",
      title: { x: 0.5, y: 0.4, fontSize: 24, bold: true, color: "0F172A" },
      content: { x: 0.5, y: 1.3, fontSize: 17, color: "1E293B", wrap: true, w: 8.5, h: 4.5 },
    },
    gradient: {
      backgroundColor: "FFFFFF", // pptxgenjs não suporta gradientes diretamente
      title: { x: 0.5, y: 0.5, fontSize: 25, bold: true, color: "6D28D9" },
      content: { x: 0.5, y: 1.6, fontSize: 17, color: "5B21B6", wrap: true, w: 8.5, h: 4.5 },
    },
    illustrated: {
      backgroundColor: "FFFFFF",
      title: { x: 0.5, y: 0.3, fontSize: 24, bold: true, color: "111827" },
      content: { x: 0.5, y: 1, fontSize: 16, color: "374151", wrap: true, w: 8.5, h: 3 },
      image: { x: 0.5, y: 4.5, w: 6, h: 3.5 },
    },
  };

  const selected = templates[template] || templates["classic"];

  slideTexts.forEach((text, index) => {
    const slide = pptx.addSlide();

    if (selected.backgroundColor) {
      slide.background = { fill: selected.backgroundColor };
    }

    slide.addText(slideTitles[index] || `Slide ${index + 1}`, selected.title);
    slide.addText(text, selected.content);

    if (images[index] && selected.image) {
      slide.addImage({ ...selected.image, path: images[index] });
    }
  });

  await pptx.writeFile({ fileName: "ApresentacaoIA.pptx" });
}
