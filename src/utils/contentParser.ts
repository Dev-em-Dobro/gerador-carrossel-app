export interface ParsedContent {
    text: string
    code?: string
}

function processEscapeSequences(str: string): string {
    return str
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '  ')
        .replace(/\\r/g, '')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
}

function normalizeIndentation(code: string): string {
    const lines = code.split('\n')
    const nonEmptyLines = lines.filter(line => line.trim().length > 0)

    if (nonEmptyLines.length === 0) return code

    const minIndent = Math.min(
        ...nonEmptyLines.map(line => {
            const match = line.match(/^(\s*)/)
            return match ? match[1].length : 0
        })
    )

    return lines
        .map(line => line.substring(minIndent))
        .join('\n')
        .trim()
}

export function parseContentWithCode(content: string): ParsedContent {
    const processedContent = processEscapeSequences(content)

    const exemploRegex = /Exemplo:\s*\n([\s\S]+?)(?:\n\n|$)/i
    const exemploMatch = processedContent.match(exemploRegex)

    if (exemploMatch) {
        const codeStartIndex = processedContent.indexOf(exemploMatch[0])
        const textBefore = processedContent.substring(0, codeStartIndex).trim()
        let code = exemploMatch[1].trim()

        code = normalizeIndentation(code)

        return { text: textBefore, code }
    }

    const codeBlockRegex = /```[\s\S]*?```/g
    const codeBlockMatches = processedContent.match(codeBlockRegex)

    if (codeBlockMatches) {
        const firstCodeBlock = codeBlockMatches[0]
        const codeStartIndex = processedContent.indexOf(firstCodeBlock)

        const textBefore = processedContent.substring(0, codeStartIndex).trim()

        let code = firstCodeBlock
            .replace(/```[\w]*\n?/g, '')
            .replace(/```$/g, '')

        code = normalizeIndentation(code)

        return { text: textBefore, code }
    }

    return { text: processedContent }
}