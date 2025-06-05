import PptxGenJS from "pptxgenjs";

export async function exportPPTX(slideTexts, slideTitles) {
  const pptx = new PptxGenJS();

  slideTexts.forEach((text, index) => {
    const slide = pptx.addSlide();
    slide.addText(slideTitles[index], {
      x: 0.5,
      y: 0.3,
      fontSize: 20,
      bold: true,
    });
    slide.addText(text, {
      x: 0.5,
      y: 1,
      fontSize: 16,
      color: "363636",
      wrap: true,
    });
  });

  await pptx.writeFile({ fileName: "ApresentacaoIA.pptx" });
}
