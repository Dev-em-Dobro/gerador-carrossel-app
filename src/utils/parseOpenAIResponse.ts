import type { Carousel, Slide } from '../context/slides-context'

export function parseCarouselsFromRaw(raw: string, topics: string[]): Carousel[] {
    const arrStart = raw.indexOf('[')
    if (arrStart === -1) throw new Error('Não foi possível encontrar o JSON de array na resposta')
    const arrText = raw.slice(arrStart)

    const lastBracket = arrText.lastIndexOf(']')
    const jsonText = lastBracket === -1 ? arrText : arrText.slice(0, lastBracket + 1)

    const parsed = JSON.parse(jsonText)
    if (!Array.isArray(parsed)) throw new Error('Resposta não é um array')

    const carousels = parsed.map((c: any, idx: number) => {
        const cTopic = typeof c.topic === 'string' && c.topic.trim().length > 0 ? c.topic.trim() : (topics[idx] || `Tema ${idx + 1}`)
        const slides: Slide[] = (Array.isArray(c.slides) ? c.slides : []).map((s: any, i: number) => ({ id: i, type: 'default', title: String(s.title || '').trim(), content: String(s.content || '').trim() }))
        return { id: idx, topic: cTopic, slides }
    })

    return carousels
}

export default parseCarouselsFromRaw
