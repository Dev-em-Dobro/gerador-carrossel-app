import type { Carousel, Slide } from '../context/slides-context'

export function parseCarouselsFromRaw(raw: string, topics: string[]): Carousel[] {
    const arrStart = raw.indexOf('[')
    if (arrStart === -1) throw new Error('Não foi possível encontrar o JSON de array na resposta')
    const arrText = raw.slice(arrStart)

    const lastBracket = arrText.lastIndexOf(']')
    const jsonText = lastBracket === -1 ? arrText : arrText.slice(0, lastBracket + 1)

    const parsed = JSON.parse(jsonText)
    if (!Array.isArray(parsed)) throw new Error('Resposta não é um array')

    const AVAILABLE_LOGOS = [
        'css',
        'html',
        'javascript',
        'nodejs',
        'postgres',
        'python',
        'typescript',
        'react'
    ]

    const ALIASES: Record<string, string> = {
        js: 'javascript',
        javascript: 'javascript',
        ts: 'typescript',
        typescript: 'typescript',
        py: 'python',
        python: 'python',
        node: 'nodejs',
        nodejs: 'nodejs',
        pg: 'postgres',
        postgres: 'postgres',
        css: 'css',
        html: 'html',
        react: 'react',
    }

    const pickAvailableLogo = (rawName?: string | null): string | undefined => {
        if (!rawName) return undefined
        const s = String(rawName).toLowerCase()
        // normalize patterns like "logo:javascript" or "javascript logo"
        const stripped = s.replace(/logo[:\s-]*/i, '').replaceAll(/[^a-z0-9]/gi, ' ').trim()
        if (!stripped) return undefined
        // try exact alias match first
        const tokens = stripped.split(/\s+/)
        for (const t of tokens) {
            if (ALIASES[t]) return ALIASES[t]
            if (AVAILABLE_LOGOS.includes(t)) return t
        }
        // try contains
        for (const a of Object.keys(ALIASES)) {
            if (stripped.includes(a)) return ALIASES[a]
        }
        for (const l of AVAILABLE_LOGOS) {
            if (stripped.includes(l)) return l
        }
        return undefined
    }

    const extractLogo = (obj: any): string | undefined => {
        if (!obj) return undefined
        // direct field
        if (typeof obj.language_logo === 'string' && obj.language_logo.trim()) {
            const pick = pickAvailableLogo(obj.language_logo)
            if (pick) return pick
        }
        // visual_suggestion may contain "logo:..."
        if (typeof obj.visual_suggestion === 'string' && obj.visual_suggestion.toLowerCase().includes('logo')) {
            const m = obj.visual_suggestion.match(/logo[:\s]*([\w\-\_]+)/i)
            if (m) {
                const pick = pickAvailableLogo(m[1])
                if (pick) return pick
            }
            // fallback: try to parse any word
            const pick = pickAvailableLogo(obj.visual_suggestion)
            if (pick) return pick
        }
        // also check title or content hints
        if (typeof obj.title === 'string') {
            const pick = pickAvailableLogo(obj.title)
            if (pick) return pick
        }
        if (typeof obj.content === 'string') {
            const pick = pickAvailableLogo(obj.content)
            if (pick) return pick
        }
        return undefined
    }

    const carousels = parsed.map((c: any, idx: number) => {
        const cTopic = typeof c.topic === 'string' && c.topic.trim().length > 0 ? c.topic.trim() : (topics[idx] || `Tema ${idx + 1}`)
        const slides: Slide[] = (Array.isArray(c.slides) ? c.slides : []).map((s: any, i: number) => ({ id: i, type: 'default', title: String(s.title || '').trim(), content: String(s.content || '').trim() }))
        // try several places for logo: top-level fields, visual_suggestion, or first slide
        let language_logo = extractLogo(c)
        if (!language_logo && Array.isArray(c.slides) && c.slides.length > 0) {
            language_logo = extractLogo(c.slides[0])
        }
        return { id: idx, topic: cTopic, slides, language_logo }
    })

    return carousels
}

export default parseCarouselsFromRaw
