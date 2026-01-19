import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowLeft, Copy, Check, Download, Edit3 } from 'lucide-react'
import { useBlog } from '../../../context/blog-context'
import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

export const Route = createFileRoute('/_app/blog/preview')({
    head: () => ({
        meta: [
            { name: 'description', content: 'Visualize e edite seu post de blog gerado por IA.' },
            { title: 'Preview do Post - Gerador de Blog' },
        ]
    }),
    component: BlogPreview,
})

// Code block component for ReactMarkdown - defined outside to avoid recreation
function CodeBlock({ className, children, inline, ...props }: { className?: string; children?: React.ReactNode; inline?: boolean }) {
    const match = /language-(\w+)/.exec(className || '')
    const codeString = String(children).replace(/\n$/, '')

    // Inline code
    if (inline || !match) {
        return (
            <code className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-mono text-sm" {...props}>
                {children}
            </code>
        )
    }

    // Code block with syntax highlighting
    return (
        <div className="relative my-6 group">
            <div className="absolute top-0 left-0 right-0 h-10 bg-gray-800 rounded-t-xl flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-gray-400 text-xs font-mono ml-2 uppercase">{match[1]}</span>
            </div>
            <SyntaxHighlighter
                style={oneDark as Record<string, React.CSSProperties>}
                language={match[1]}
                PreTag="div"
                customStyle={{
                    margin: 0,
                    borderRadius: '0.75rem',
                    paddingTop: '3.5rem',
                    fontSize: '0.875rem',
                }}
            >
                {codeString}
            </SyntaxHighlighter>
        </div>
    )
}

// Heading components with better styling
function H1({ children }: { children?: React.ReactNode }) {
    return (
        <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-6 leading-tight">
            {children}
        </h1>
    )
}

function H2({ children }: { children?: React.ReactNode }) {
    return (
        <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4 pb-2 border-b-2 border-purple-200">
            {children}
        </h2>
    )
}

function H3({ children }: { children?: React.ReactNode }) {
    return (
        <h3 className="text-xl font-bold text-gray-800 mt-8 mb-3">
            {children}
        </h3>
    )
}

// Paragraph with good reading experience
function Paragraph({ children }: { children?: React.ReactNode }) {
    return (
        <p className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg">
            {children}
        </p>
    )
}

// Lists with better styling
function UnorderedList({ children }: { children?: React.ReactNode }) {
    return (
        <ul className="my-4 space-y-2 list-none">
            {children}
        </ul>
    )
}

function OrderedList({ children }: { children?: React.ReactNode }) {
    return (
        <ol className="my-4 space-y-2 list-decimal list-inside marker:text-purple-600 marker:font-bold">
            {children}
        </ol>
    )
}

function ListItem({ children }: { children?: React.ReactNode }) {
    return (
        <li className="text-gray-700 leading-relaxed flex items-start gap-2">
            <span className="text-purple-500 mt-1.5">•</span>
            <span>{children}</span>
        </li>
    )
}

// Blockquote for tips/notes
function Blockquote({ children }: { children?: React.ReactNode }) {
    return (
        <blockquote className="my-6 pl-4 border-l-4 border-purple-400 bg-purple-50 py-4 pr-4 rounded-r-lg italic text-gray-700">
            {children}
        </blockquote>
    )
}

// Strong text
function Strong({ children }: { children?: React.ReactNode }) {
    return (
        <strong className="font-bold text-gray-900">{children}</strong>
    )
}

// Horizontal rule
function HorizontalRule() {
    return (
        <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent" />
    )
}

// Links
function Anchor({ href, children }: { href?: string; children?: React.ReactNode }) {
    return (
        <a href={href} className="text-purple-600 hover:text-purple-800 underline underline-offset-2 transition-colors" target="_blank" rel="noopener noreferrer">
            {children}
        </a>
    )
}

// Markdown components configuration
const markdownComponents = {
    code: CodeBlock,
    h1: H1,
    h2: H2,
    h3: H3,
    p: Paragraph,
    ul: UnorderedList,
    ol: OrderedList,
    li: ListItem,
    blockquote: Blockquote,
    strong: Strong,
    hr: HorizontalRule,
    a: Anchor,
}

function BlogPreview() {
    const { post, updatePostContent } = useBlog()
    const [copied, setCopied] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState('')

    useEffect(() => {
        if (post?.content) {
            setEditContent(post.content)
        }
    }, [post?.content])

    const handleCopy = async () => {
        if (!post) return
        await navigator.clipboard.writeText(post.content)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleDownload = () => {
        if (!post) return
        const blob = new Blob([post.content], { type: 'text/markdown' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${post.topic.toLowerCase().replaceAll(/\s+/g, '-')}.md`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    const handleSaveEdit = () => {
        updatePostContent(editContent)
        setIsEditing(false)
    }

    const handleCancelEdit = () => {
        if (!post) return
        setEditContent(post.content)
        setIsEditing(false)
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 p-8 flex flex-col items-center justify-center">
                <p className="text-gray-600 text-lg mb-4">Nenhum post gerado ainda.</p>
                <Link to="/blog" className="text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para o editor
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-indigo-50 p-4 md:p-8">
            {/* Header */}
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link to="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Voltar ao editor</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${isEditing
                                ? 'bg-gray-200 text-gray-700'
                                : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                }`}
                        >
                            <Edit3 className="w-4 h-4" />
                            {isEditing ? 'Visualizar' : 'Editar'}
                        </button>
                        <button
                            onClick={handleCopy}
                            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium hover:bg-indigo-200 transition-all flex items-center gap-2"
                        >
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copiado!' : 'Copiar'}
                        </button>
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-all flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Download .md
                        </button>
                    </div>
                </div>

                {/* Post Info */}
                <div className="mb-6 flex items-center gap-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                        {post.level}
                    </span>
                    <span className="text-gray-500 text-sm">
                        Gerado em {post.createdAt.toLocaleDateString('pt-BR')}
                    </span>
                </div>

                {/* Content */}
                {isEditing ? (
                    <div className="space-y-4">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="w-full h-150 p-6 font-mono text-sm bg-gray-900 text-gray-100 rounded-xl border-2 border-gray-700 focus:outline-none focus:border-purple-500 resize-none"
                            placeholder="Escreva seu post em Markdown..."
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleCancelEdit}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveEdit}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                ) : (
                    <article className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 md:p-12">
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={markdownComponents}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </article>
                )}
            </div>
        </div>
    )
}

export default BlogPreview
