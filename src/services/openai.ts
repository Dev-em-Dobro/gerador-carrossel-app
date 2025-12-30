import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

export async function requestCarouselsRaw(topics: string[], level: string, systemPrompt: string) {
    const userMessage = `Gere carrosséis separados para os seguintes temas na ordem: ${topics.join(' | ')}.\n\nREGRAS IMPORTANTES:\n- Responda SOMENTE com um JSON válido: um ARRAY com um objeto para cada tema.\n- Cada objeto deve ter: { "topic": "<tema>", "slides": [ { "title": "...", "content": "..." }, ... ] }\n- Cada carrossel deve conter entre 3 e 8 slides.\n- Não inclua campos de cor, HTML ou qualquer texto explicativo fora do JSON.\n\nExemplo de saída:\n[ { "topic": "Tema A", "slides": [ { "title": "T1", "content": "..." } ] }, { "topic": "Tema B", "slides": [ ... ] } ]`

    const response = await client.responses.create({
        model: 'gpt-4o',
        input: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
        ],
    })

    return response.output_text || JSON.stringify(response.output || '')
}

export default requestCarouselsRaw
