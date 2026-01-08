import type { Carousel, Slide } from '../context/slides-context'

export function parseCarouselsFromRaw(raw: string, topics: string[]): Carousel[] {
    let parsed: any;
    
    try {
        parsed = JSON.parse(raw)
    } catch (e) {
        let cleanedJson = raw.trim()
        
        cleanedJson = cleanedJson.replace(/```json\n?/g, '').replace(/```\n?/g, '')
        
        if (!cleanedJson.startsWith('[') && !cleanedJson.startsWith('{')) {
            const arrayStart = cleanedJson.indexOf('[')
            const objectStart = cleanedJson.indexOf('{')
            
            if (arrayStart !== -1 && (objectStart === -1 || arrayStart < objectStart)) {
                cleanedJson = cleanedJson.slice(arrayStart)
            } else if (objectStart !== -1) {
                cleanedJson = cleanedJson.slice(objectStart)
            }
        }
        
        if (cleanedJson.startsWith('{') && !cleanedJson.trim().startsWith('[')) {
            cleanedJson = cleanedJson.replace(/\},\s*"id":/g, '},\n{"id":')
            cleanedJson = '[' + cleanedJson
            const lastBrace = cleanedJson.lastIndexOf('}')
            if (lastBrace !== -1) {
                cleanedJson = cleanedJson.slice(0, lastBrace + 1) + ']'
            }
        }
        
        cleanedJson = cleanedJson.replace(/,(\s*[\]}])/g, '$1')
        
        try {
            parsed = JSON.parse(cleanedJson)
        } catch (e2) {
            console.error('JSON original:', raw)
            console.error('JSON limpo:', cleanedJson)
            throw new Error('Não foi possível fazer parse do JSON retornado pela IA')
        }
    }

    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        if (Array.isArray(parsed.carousels)) {
            parsed = parsed.carousels
        } else if (Array.isArray(parsed.slides)) {
            parsed = [{ topic: topics[0] || 'Carrossel', slides: parsed.slides }]
        } else {
            const keys = Object.keys(parsed)
            if (keys.includes('id') && keys.includes('title')) {
                parsed = [parsed]
            }
        }
    }

    if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0])) {
        parsed = parsed.flat()
    }

    if (!Array.isArray(parsed)) {
        console.error('Parsed não é array:', parsed)
        throw new Error('Resposta não é um array válido')
    }

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
        const stripped = s.replace(/logo[:\s-]*/i, '').replaceAll(/[^a-z0-9]/gi, ' ').trim()
        if (!stripped) return undefined
        const tokens = stripped.split(/\s+/)
        for (const t of tokens) {
            if (ALIASES[t]) return ALIASES[t]
            if (AVAILABLE_LOGOS.includes(t)) return t
        }
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
        if (typeof obj.language_logo === 'string' && obj.language_logo.trim()) {
            const pick = pickAvailableLogo(obj.language_logo)
            if (pick) return pick
        }
        if (typeof obj.visual_suggestion === 'string' && obj.visual_suggestion.toLowerCase().includes('logo')) {
            const m = obj.visual_suggestion.match(/logo[:\s]*([\w\-\_]+)/i)
            if (m) {
                const pick = pickAvailableLogo(m[1])
                if (pick) return pick
            }
            const pick = pickAvailableLogo(obj.visual_suggestion)
            if (pick) return pick
        }
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

    // CASO 1: Array de slides direto (tema único)
    // Formato: [{ id: 1, title: "...", content: "..." }, ...]
    if (parsed.length > 0 && parsed[0].id !== undefined && parsed[0].title !== undefined && !parsed[0].slides) {
        const slides: Slide[] = parsed.map((s: any, i: number) => ({
            id: i,
            type: s.type || 'default',
            title: String(s.title || '').trim(),
            content: String(s.content || '').trim()
        }))
        
        let language_logo = extractLogo(parsed[0])
        
        return [{
            id: 0,
            topic: topics[0] || 'Carrossel',
            slides,
            language_logo
        }]
    }

    // CASO 2: Array de carrosséis (múltiplos temas)
    // Formato: [{ topic: "...", slides: [...] }, { topic: "...", slides: [...] }]
    const carousels = parsed.map((c: any, idx: number) => {
        const cTopic = typeof c.topic === 'string' && c.topic.trim().length > 0 
            ? c.topic.trim() 
            : (topics[idx] || `Tema ${idx + 1}`)
        
        const slides: Slide[] = (Array.isArray(c.slides) ? c.slides : []).map((s: any, i: number) => ({
            id: i,
            type: s.type || 'default',
            title: String(s.title || '').trim(),
            content: String(s.content || '').trim()
        }))
        
        let language_logo = extractLogo(c)
        if (!language_logo && Array.isArray(c.slides) && c.slides.length > 0) {
            language_logo = extractLogo(c.slides[0])
        }
        
        return { id: idx, topic: cTopic, slides, language_logo }
    })

    return carousels
}

export default parseCarouselsFromRaw