import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-markup'
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

interface CodeWindowProps {
    code: string
    language?: string
    title?: string
}

const detectLanguage = (code: string): string => {
    const hasJSXSyntax = /<[A-Z][a-zA-Z0-9]*/.test(code) ||
        /<\/[A-Z][a-zA-Z0-9]*>/.test(code) ||
        /className=/.test(code) ||
        /<>/.test(code) ||
        /<\/>/.test(code)

    const hasTypeScript = /:\s*(string|number|boolean|any|void|unknown|never)/.test(code) ||
        /interface\s+\w+/.test(code) ||
        /type\s+\w+\s*=/.test(code) ||
        /<[A-Z]\w*>/.test(code) && code.includes('Props')

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

const getLanguageLabel = (lang: string): string => {
    const labels: Record<string, string> = {
        javascript: 'JavaScript',
        typescript: 'TypeScript',
        jsx: 'React JSX',
        tsx: 'React TSX',
        python: 'Python',
        java: 'Java',
        css: 'CSS',
        json: 'JSON',
        bash: 'Bash',
        sql: 'SQL'
    }
    return labels[lang] || lang.toUpperCase()
}

const processCode = (code: string): string => {
    return code
        .replace(/\\n/g, '\n')
        .replace(/\\t/g, '  ')
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .replace(/\\\\/g, '\\')
}

export function CodeWindow({ code, language, title }: CodeWindowProps) {
    const codeRef = useRef<HTMLElement>(null)
    const detectedLanguage = language || detectLanguage(code)
    const processedCode = processCode(code)

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current)
        }
    }, [processedCode, detectedLanguage])

    return (
        <div className="rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-white/10">
            <div className="flex items-center justify-between px-4 py-3 bg-[#1e1e2e] border-b border-white/10">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                        <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                    </div>
                    {title && (
                        <span className="text-xs text-gray-400 ml-2 font-mono">{title}</span>
                    )}
                </div>
                <div className="text-xs text-gray-400 font-mono px-2 py-1 bg-white/5 rounded">
                    {getLanguageLabel(detectedLanguage)}
                </div>
            </div>

            <div className="p-4 overflow-x-auto">
                <pre className="!bg-transparent !p-0 !m-0 text-sm">
                    <code ref={codeRef} className={`language-${detectedLanguage} !text-sm`}>
                        {processedCode}
                    </code>
                </pre>
            </div>
        </div>
    )
}