import OpenAI from 'openai'

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
})

export async function requestCarouselsRaw(topics: string[], systemPrompt: string, level: string) {
    const isSingleTopic = topics.length === 1
    
    let userMessage: string
    
    if (isSingleTopic) {
        userMessage = `Tema: ${topics[0]}
Público: ${level}

IMPORTANTE: Retorne APENAS um array JSON válido de 10 objetos (slides), começando com [ e terminando com ].
Não adicione texto antes ou depois do JSON.

Exemplo de formato esperado:
[
  { "id": 1, "type": "intro", "title": "...", "content": "...", "visual_suggestion": "...", "language_logo": "typescript" },
  { "id": 2, "type": "problem", "title": "...", "content": "...", "visual_suggestion": "..." },
  ...
]`
    } else {
        userMessage = `Temas: ${topics.join(' | ')}
Público: ${level}

IMPORTANTE: Gere um carrossel SEPARADO para CADA tema listado acima.
Retorne APENAS um array JSON válido com um objeto para cada tema.
Cada objeto deve ter: "topic" (nome do tema) e "slides" (array de 10 slides).

Formato esperado:
[
  {
    "topic": "Tema 1",
    "slides": [
      { "id": 1, "type": "intro", "title": "...", "content": "...", "visual_suggestion": "...", "language_logo": "..." },
      { "id": 2, "type": "problem", "title": "...", "content": "...", "visual_suggestion": "..." },
      ...
    ]
  },
  {
    "topic": "Tema 2",
    "slides": [
      { "id": 1, "type": "intro", "title": "...", "content": "...", "visual_suggestion": "...", "language_logo": "..." },
      ...
    ]
  }
]

Não adicione texto antes ou depois do JSON.`
    }

    const response = await client.chat.completions.create({
        model: 'gpt-5.2',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
    })

    return response.choices[0]?.message?.content || ''
}

export default requestCarouselsRaw
