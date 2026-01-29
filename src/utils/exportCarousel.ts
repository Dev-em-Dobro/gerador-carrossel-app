import html2canvas from "html2canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Carousel } from "@/context/slides-context";
import { getLogoFilename, isCodeLike } from "./logoUtils";
import { parseContentWithCode } from "./contentParser";
import { detectLanguage } from "./detectLanguage";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-markup";

export interface ExportProgress {
  current: number;
  total: number;
}

/**
 * Renderiza um slide específico em um elemento DOM offscreen com dimensões Instagram (1350x1080)
 */
function renderSlideToElement(
  carousel: Carousel,
  slideIndex: number,
): HTMLElement {
  const slide = carousel.slides[slideIndex];
  const parsedContent = parseContentWithCode(slide.content);
  const hasCodeBlock = isCodeLike(slide.content) && parsedContent?.code;

  const container = document.createElement("div");
  container.style.cssText = `
    position:absolute;
    left:-9999px;
    top:-9999px;
    width:1080px;
    height:1350px;
    background-image:url('/src/assets/template.png');
    background-size:cover;
    background-position:center;
    display:flex;
    align-items:center;
    justify-content:center;
    color:#fff;
    overflow:hidden;
  `;

  const content = document.createElement("div");
  content.style.cssText = `
    padding:260px 60px 80px;
    display:flex;
    flex-direction:column;
    align-items:center;
    gap:2.5rem;
    width:100%;
    max-width:850px;
    box-sizing:border-box;
  `;

  // 💀 KILL ABSOLUTO DOS LABELS DO PRISM
  const prismNuke = document.createElement("style");
  prismNuke.textContent = `
    pre[class*="language-"]::before,
    pre[class*="language-"]::after,
    code[class*="language-"]::before,
    code[class*="language-"]::after,
    .prism-toolbar,
    .toolbar,
    .language-label,
    .code-toolbar,
    .toolbar-item {
      display:none !important;
      content:none !important;
      visibility:hidden !important;
    }
  `;
  content.appendChild(prismNuke);

  // LOGO
  if (slideIndex === 0 && carousel.language_logo) {
    const filename = getLogoFilename(carousel.language_logo);
    if (filename) {
      const img = document.createElement("img");
      img.src = `/images/logos/${filename}.png`;
      img.style.cssText = "width:5rem;height:5rem;margin-bottom:.5rem;";
      content.appendChild(img);
    }
  }

  // ===== TÍTULO =====
  const title = document.createElement("h1");
  title.style.cssText = `
    font-size:3rem;
    line-height:3.5rem;
    font-weight:bold;
    font-family:'AnkaCoderRegular', monospace;
    text-align:center;
  `;
  title.textContent = slide.title;
  content.appendChild(title);

  // ============================
  // 👉 QUANDO TEM CÓDIGO
  // ============================
  if (hasCodeBlock && parsedContent) {
    if (parsedContent.text) {
      const text = document.createElement("p");
      text.style.cssText = `
        font-size:2rem;
        line-height:2.75rem;
        font-family:'AnkaCoderRegular', monospace;
        white-space:pre-line;
        text-align:left;
      `;
      text.textContent = parsedContent.text;
      content.appendChild(text);
    }

    const codeBox = document.createElement("div");
    codeBox.style.cssText = `
      background:linear-gradient(135deg,#1a1a2e,#16213e);
      border-radius:12px;
      overflow:hidden;
      width:100%;
      box-shadow:0 20px 25px rgba(0,0,0,.5);
      border:1px solid rgba(255,255,255,.1);
    `;

    // HEADER → SÓ BOLINHAS
    const header = document.createElement("div");
    header.style.cssText = `
      padding:12px;
      background:#1e1e2e;
      display:flex;
      gap:8px;
    `;

    ["#ff5f56", "#ffbd2e", "#27c93f"].forEach((color) => {
      const dot = document.createElement("div");
      dot.style.cssText = `
        width:12px;
        height:12px;
        border-radius:50%;
        background:${color};
      `;
      header.appendChild(dot);
    });

    codeBox.appendChild(header);

    const pre = document.createElement("pre");
    pre.style.cssText = `
      margin:0;
      padding:24px;
      background:transparent;
      font-size:1.55rem;
      line-height:2.1;
      font-family:'Fira Code', monospace;
      overflow-x:auto;
    `;

    const code = document.createElement("code");
    const language = detectLanguage(parsedContent.code!);
    code.className = `language-${language}`;

    code.innerHTML = Prism.highlight(
      parsedContent.code!,
      Prism.languages[language] || Prism.languages.javascript,
      language,
    );

    pre.appendChild(code);
    codeBox.appendChild(pre);
    content.appendChild(codeBox);
  }

  // ============================
  // 👉 TEXTO NORMAL
  // ============================
  else {
    const text = document.createElement("p");
    text.style.cssText = `
      font-size:2rem;
      line-height:2.75rem;
      font-family:'AnkaCoderRegular', monospace;
      white-space:pre-line;
      text-align:left;
    `;
    text.textContent = slide.content;
    content.appendChild(text);
  }

  container.appendChild(content);
  return container;
}

/**
 * Aguarda que todas as fontes sejam carregadas
 */
async function waitForFonts(): Promise<void> {
  if ("fonts" in document) {
    await document.fonts.ready;
  }
  return new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Aguarda que uma imagem seja carregada
 */
async function waitForImages(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll("img");
  const imagePromises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      // Timeout de 5 segundos
      setTimeout(() => resolve(null), 5000);
    });
  });
  await Promise.all(imagePromises);
}

/**
 * Exporta todos os slides de um carrossel como arquivo .zip
 */
export async function exportCarouselAsZip(
  carousel: Carousel,
  onProgress?: (progress: ExportProgress) => void,
): Promise<void> {
  const zip = new JSZip();
  const totalSlides = carousel.slides.length;

  await waitForFonts();

  for (let i = 0; i < totalSlides; i++) {
    if (onProgress) {
      onProgress({ current: i + 1, total: totalSlides });
    }

    const slideElement = renderSlideToElement(carousel, i);
    document.body.appendChild(slideElement);

    await waitForImages(slideElement);

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const canvas = await html2canvas(slideElement, {
      scale: 1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#212121",
      width: 1080,
      height: 1350,
    });

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, "image/png");
    });

    const slideNumber = String(i + 1).padStart(2, "0");
    zip.file(`slide - ${slideNumber}.png`, blob);

    document.body.removeChild(slideElement);

    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  saveAs(zipBlob, "carrossel-instagram.zip");
}
