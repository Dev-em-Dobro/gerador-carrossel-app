export interface ParsedContent {
    text: string
    code?: string
    textAfter?: string
}

function isTextMeaningful(text: string): boolean {
    const cleaned = text.trim()
    if (cleaned.length < 3) return false
    const meaninglessPatterns = /^[.,;:!?\s\-_]+$/
    return !meaninglessPatterns.test(cleaned)
}

function shouldBeComment(text: string, language: string): boolean {
    const cleaned = text.trim()
    if (cleaned.length > 100) return false

    const commentKeywords = ['note', 'nota', 'importante', 'atenção', 'observação', 'lembre', 'cuidado']
    const hasKeyword = commentKeywords.some(kw => cleaned.toLowerCase().includes(kw))

    return hasKeyword || cleaned.split('\n').length <= 2
}

function detectLanguage(code: string): string {
    if (code.includes('def ') || code.includes('import ') && code.includes(' from ')) return 'python'
    if (code.includes('SELECT ') || code.includes('FROM ')) return 'sql'
    if (code.includes('<?php')) return 'php'
    if (code.includes('public class ') || code.includes('public static void')) return 'java'
    return 'javascript'
}

function addCommentToCode(code: string, comment: string): string {
    const lang = detectLanguage(code)
    const commentLines = comment.split('\n').map(line => line.trim()).filter(Boolean)

    let commentedText = ''

    if (lang === 'python') {
        commentedText = commentLines.map(line => `# ${line}`).join('\n')
    } else if (lang === 'sql') {
        commentedText = commentLines.map(line => `-- ${line}`).join('\n')
    } else {
        commentedText = commentLines.map(line => `// ${line}`).join('\n')
    }

    return `${code}\n\n${commentedText}`
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
    const codeBlockRegex = /```[\s\S]*?```/g
    const inlineCodeRegex = /`[^`]+`/g

    const codeBlockMatches = content.match(codeBlockRegex)

    if (codeBlockMatches) {
        const firstCodeBlock = codeBlockMatches[0]
        const codeStartIndex = content.indexOf(firstCodeBlock)
        const codeEndIndex = codeStartIndex + firstCodeBlock.length

        const textBefore = content.substring(0, codeStartIndex).trim()
        const textAfter = content.substring(codeEndIndex).trim()

        let code = firstCodeBlock
            .replace(/```[\w]*\n?/g, '')
            .replace(/```$/g, '')

        code = code.replace(/^["'\s]+|["'\s]+$/g, '')
        code = normalizeIndentation(code)

        if (textAfter && isTextMeaningful(textAfter)) {
            const lang = detectLanguage(code)
            if (shouldBeComment(textAfter, lang)) {
                code = addCommentToCode(code, textAfter)
                return { text: textBefore, code }
            }
            return { text: textBefore, code, textAfter }
        }

        return { text: textBefore, code }
    }

    const inlineMatches = content.match(inlineCodeRegex)
    if (inlineMatches && inlineMatches.length > 0) {
        const firstInline = inlineMatches[0]
        const codeStartIndex = content.indexOf(firstInline)
        const codeEndIndex = codeStartIndex + firstInline.length

        const textBefore = content.substring(0, codeStartIndex).trim()
        const textAfter = content.substring(codeEndIndex).trim()

        let code = firstInline.replace(/`/g, '')
        code = code.replace(/^["'\s]+|["'\s]+$/g, '')
        code = normalizeIndentation(code)

        if (textAfter && isTextMeaningful(textAfter)) {
            const lang = detectLanguage(code)
            if (shouldBeComment(textAfter, lang)) {
                code = addCommentToCode(code, textAfter)
                return { text: textBefore, code }
            }
            return { text: textBefore, code, textAfter }
        }

        return { text: textBefore, code }
    }

    const codeIndicators = ['function ', 'const ', 'let ', 'var ', 'def ', 'class ', '=>', 'import ', 'export']
    const lines = content.split('\n')

    let codeStartIndex = -1
    let codeEndIndex = lines.length

    for (let i = 0; i < lines.length; i++) {
        if (codeIndicators.some(indicator => lines[i].includes(indicator))) {
            codeStartIndex = i
            break
        }
    }

    if (codeStartIndex > 0) {
        for (let i = lines.length - 1; i > codeStartIndex; i--) {
            const line = lines[i].trim()
            if (line && !codeIndicators.some(indicator => lines[i].includes(indicator)) &&
                !line.match(/^[{}()\[\];,]/) &&
                line.length > 20) {
                codeEndIndex = i
                break
            }
        }

        const textBefore = lines.slice(0, codeStartIndex).join('\n').trim()
        let code = lines.slice(codeStartIndex, codeEndIndex).join('\n')
        const textAfter = codeEndIndex < lines.length ? lines.slice(codeEndIndex).join('\n').trim() : ''

        code = code.replace(/^["'\s]+|["'\s]+$/g, '')
        code = normalizeIndentation(code)

        if (textAfter && isTextMeaningful(textAfter)) {
            const lang = detectLanguage(code)
            if (shouldBeComment(textAfter, lang)) {
                code = addCommentToCode(code, textAfter)
                return { text: textBefore, code }
            }
            return { text: textBefore, code, textAfter }
        }

        return { text: textBefore, code }
    }

    return { text: content }
}