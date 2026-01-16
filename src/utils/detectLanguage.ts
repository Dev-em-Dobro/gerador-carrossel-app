/**
 * Detecta a linguagem de programação de um bloco de código
 */
export const detectLanguage = (code: string): string => {
    const hasHTMLTags = /<(!DOCTYPE|html|head|body|div|span|p|h[1-6]|a|img|ul|ol|li|table|form|input|button|script|style|meta|link)/i.test(code)

    if (hasHTMLTags) {
        return 'markup'
    }

    const hasJSXSyntax = /<[A-Z][a-zA-Z0-9]*/.test(code) ||
        /<\/[A-Z][a-zA-Z0-9]*>/.test(code) ||
        /className=/.test(code) ||
        /<>/.test(code) ||
        /<\/>/.test(code)

    const hasTypeScript = /:\s*(string|number|boolean|any|void|unknown|never)/.test(code) ||
        /interface\s+\w+/.test(code) ||
        /type\s+\w+\s*=/.test(code)

    if (hasJSXSyntax) {
        return hasTypeScript ? 'tsx' : 'jsx'
    }

    if (hasTypeScript) {
        return 'typescript'
    }

    if (code.includes('function ') || code.includes('const ') || code.includes('let ') || code.includes('=>')) {
        return 'javascript'
    }

    if (code.includes('def ') || (code.includes('import ') && code.includes(' from ') && !code.includes('from "'))) {
        return 'python'
    }

    if (code.includes('SELECT ') || code.includes('FROM ') || code.includes('WHERE ')) {
        return 'sql'
    }

    if (code.trim().startsWith('{') && code.trim().endsWith('}') && code.includes(':')) {
        return 'json'
    }

    if (code.includes('public class ') || code.includes('public static void')) {
        return 'java'
    }

    return 'javascript'
}
