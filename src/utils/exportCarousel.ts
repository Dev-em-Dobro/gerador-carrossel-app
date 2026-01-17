import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import type { Carousel } from '@/context/slides-context'
import { getLogoFilename, isCodeLike } from './logoUtils'
import { parseContentWithCode } from './contentParser'
import { detectLanguage } from './detectLanguage'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-markup'

export interface ExportProgress {
    current: number
    total: number
}

/**
 * Renderiza um slide específico em um elemento DOM offscreen com dimensões Instagram (1350x1080)
 */
function renderSlideToElement(carousel: Carousel, slideIndex: number): HTMLElement {
    const slide = carousel.slides[slideIndex]
    const parsedContent = parseContentWithCode(slide.content)
    const hasCodeBlock = isCodeLike(slide.content) && parsedContent?.code

    // Criar container principal com template de background
    const container = document.createElement('div')
    container.style.cssText = `
        position: absolute;
        left: -9999px;
        top: -9999px;
        width: 1080px;
        height: 1350px;
        background-image: url('/src/assets/template.png');
        background-size: cover;
        background-position: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        overflow: hidden;
    `

    // Content container - CENTRALIZADO verticalmente
    const content = document.createElement('div')
    content.style.cssText = `
        padding: 80px 60px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 1.5rem;
        width: 100%;
        height: 100%;
        position: relative;
        z-index: 2;
        box-sizing: border-box;
    `

    // Logo (apenas no primeiro slide)
    if (slideIndex === 0 && carousel.language_logo) {
        const filename = getLogoFilename(carousel.language_logo)
        if (filename) {
            const logoDiv = document.createElement('div')
            logoDiv.style.cssText = `
                display: flex;
                justify-content: center;
                margin-bottom: 0.5rem;
            `

            const logoImg = document.createElement('img')
            logoImg.src = `/images/logos/${filename}.png`
            logoImg.alt = filename
            logoImg.style.cssText = 'width: 5rem; height: 5rem;'

            logoDiv.appendChild(logoImg)
            content.appendChild(logoDiv)
        }
    }

    // Título - centralizado
    const title = document.createElement('h1')
    title.style.cssText = `
        font-size: 2.5rem;
        line-height: 3rem;
        font-weight: bold;
        font-family: 'AnkaCoderRegular', monospace;
        margin-bottom: 0.5rem;
        color: #ffffff;
        text-align: center;
    `
    title.textContent = slide.title
    content.appendChild(title)

    // Conteúdo
    if (hasCodeBlock && parsedContent) {
        const contentWrapper = document.createElement('div')
        contentWrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
            width: 100%;
        `

        // Texto antes do código - centralizado
        if (parsedContent.text) {
            const textPara = document.createElement('p')
            textPara.style.cssText = `
                font-size: 1.75rem;
                line-height: 2.5rem;
                font-family: 'AnkaCoderRegular', monospace;
                color: #ffffff;
                text-align: center;
            `
            textPara.textContent = parsedContent.text
            contentWrapper.appendChild(textPara)
        }

        // Bloco de código com Prism.js syntax highlighting - alinhado à esquerda
        if (parsedContent.code) {
            const language = detectLanguage(parsedContent.code)

            const codeWindow = document.createElement('div')
            codeWindow.style.cssText = `
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                border-radius: 0.75rem;
                overflow: hidden;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.1);
                width: 100%;
                text-align: left;
            `

            // Header do code window (dots + label)
            const header = document.createElement('div')
            header.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.75rem 1rem;
                background: #1e1e2e;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            `

            // Dots container
            const dotsContainer = document.createElement('div')
            dotsContainer.style.cssText = 'display: flex; gap: 0.375rem;'

            const redDot = document.createElement('div')
            redDot.style.cssText = 'width: 0.75rem; height: 0.75rem; border-radius: 9999px; background: #ff5f56;'
            const yellowDot = document.createElement('div')
            yellowDot.style.cssText = 'width: 0.75rem; height: 0.75rem; border-radius: 9999px; background: #ffbd2e;'
            const greenDot = document.createElement('div')
            greenDot.style.cssText = 'width: 0.75rem; height: 0.75rem; border-radius: 9999px; background: #27c93f;'

            dotsContainer.appendChild(redDot)
            dotsContainer.appendChild(yellowDot)
            dotsContainer.appendChild(greenDot)
            header.appendChild(dotsContainer)

            codeWindow.appendChild(header)

            // Code content
            const codeContent = document.createElement('div')
            codeContent.style.cssText = 'padding: 1.5rem; overflow-x: auto;'

            const pre = document.createElement('pre')
            pre.style.cssText = `
                margin: 0;
                padding: 0;
                background: transparent !important;
                font-size: 1.125rem;
                line-height: 2;
                font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
            `

            const code = document.createElement('code')
            code.className = `language-${language}`
            code.style.cssText = `
                color: #e4e4e7;
                font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
            `

            // Aplicar Prism.js syntax highlighting
            const highlightedHTML = Prism.highlight(
                parsedContent.code,
                Prism.languages[language] || Prism.languages.javascript,
                language
            )
            code.innerHTML = highlightedHTML

            // Aplicar estilos inline aos tokens do Prism para garantir que o html2canvas capture as cores
            const styleSheet = document.createElement('style')
            styleSheet.textContent = `
                .token.comment, .token.prolog, .token.doctype, .token.cdata { color: #6b7280; }
                .token.punctuation { color: #9ca3af; }
                .token.property, .token.tag, .token.boolean, .token.number, .token.constant, .token.symbol, .token.deleted { color: #fbbf24; }
                .token.selector, .token.attr-name, .token.string, .token.char, .token.builtin, .token.inserted { color: #34d399; }
                .token.operator, .token.entity, .token.url, .language-css .token.string, .style .token.string { color: #60a5fa; }
                .token.atrule, .token.attr-value, .token.keyword { color: #a78bfa; }
                .token.function, .token.class-name { color: #f472b6; }
                .token.regex, .token.important, .token.variable { color: #fb923c; }
            `
            codeWindow.appendChild(styleSheet)

            pre.appendChild(code)
            codeContent.appendChild(pre)
            codeWindow.appendChild(codeContent)
            contentWrapper.appendChild(codeWindow)
        }

        content.appendChild(contentWrapper)
    } else {
        // Apenas texto - centralizado
        const textPara = document.createElement('p')
        textPara.style.cssText = `
            font-size: 1.75rem;
            line-height: 2.5rem;
            font-family: 'AnkaCoderRegular', monospace;
            color: #ffffff;
            text-align: center;
            max-width: 900px;
        `
        textPara.textContent = slide.content
        content.appendChild(textPara)
    }

    container.appendChild(content)
    return container
}

/**
 * Aguarda que todas as fontes sejam carregadas
 */
async function waitForFonts(): Promise<void> {
    if ('fonts' in document) {
        await document.fonts.ready
    }
    // Aguardar um pouco mais para garantir
    return new Promise(resolve => setTimeout(resolve, 100))
}

/**
 * Aguarda que uma imagem seja carregada
 */
async function waitForImages(element: HTMLElement): Promise<void> {
    const images = element.querySelectorAll('img')
    const imagePromises = Array.from(images).map(img => {
        if (img.complete) return Promise.resolve()
        return new Promise((resolve, reject) => {
            img.onload = resolve
            img.onerror = reject
            // Timeout de 5 segundos
            setTimeout(() => resolve(null), 5000)
        })
    })
    await Promise.all(imagePromises)
}

/**
 * Exporta todos os slides de um carrossel como arquivo .zip
 */
export async function exportCarouselAsZip(
    carousel: Carousel,
    onProgress?: (progress: ExportProgress) => void
): Promise<void> {
    const zip = new JSZip()
    const totalSlides = carousel.slides.length

    // Aguardar fontes carregarem
    await waitForFonts()

    // Processar cada slide
    for (let i = 0; i < totalSlides; i++) {
        // Reportar progresso
        if (onProgress) {
            onProgress({ current: i + 1, total: totalSlides })
        }

        // Renderizar slide offscreen
        const slideElement = renderSlideToElement(carousel, i)
        document.body.appendChild(slideElement)

        // Aguardar imagens carregarem
        await waitForImages(slideElement)

        // Aguardar um frame para garantir renderização
        await new Promise(resolve => requestAnimationFrame(resolve))

        // Capturar com html2canvas (scale 1 para manter dimensões exatas)
        const canvas = await html2canvas(slideElement, {
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#212121',
            width: 1080,
            height: 1350
        })

        // Converter canvas para blob
        const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob!)
            }, 'image/png')
        })

        // Adicionar ao zip com nome formatado (slide-01.png, slide-02.png, etc.)
        const slideNumber = String(i + 1).padStart(2, '0')
        zip.file(`slide-${slideNumber}.png`, blob)

        // Remover elemento do DOM
        document.body.removeChild(slideElement)

        // Pequena pausa para não travar o navegador
        await new Promise(resolve => setTimeout(resolve, 50))
    }

    // Gerar e fazer download do arquivo .zip
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    saveAs(zipBlob, 'carrossel-instagram.zip')
}
