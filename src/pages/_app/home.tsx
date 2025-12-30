import { useSlides } from '../../context/slides-context'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Wand2, Sparkles, Zap } from 'lucide-react'
// @ts-ignore
import systemPrompt from '../../../docs/system-prompt.md?raw'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import parseTopics from '../../utils/parseTopics'
import { requestCarouselsRaw } from '../../services/openai'
import parseCarouselsFromRaw from '../../utils/parseOpenAIResponse'

export const Route = createFileRoute('/home')({
    head: () => ({
        meta: [
            { name: 'description', content: 'Crie carrosséis de slides para redes sociais com inteligência artificial de forma rápida e fácil.' },
            { title: 'Gerador de Carrossel - Crie Slides com IA' },
        ]
    }),
    component: Home,
})




function Home() {
    const { topic, setTopic, level, setLevel, carousels, setCarousels, setCurrentSlideIndex, setSelectedCarouselIndex } = useSlides()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)

    const handleSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const topics = parseTopics(topic, 3)
        if (topics.length === 0) {
            alert('Por favor, insira ao menos um tema.')
            setLoading(false)
            return
        }

        try {
            const raw = await requestCarouselsRaw(topics, level, systemPrompt)
            const carouselsResult = parseCarouselsFromRaw(raw, topics)

            setCarousels(carouselsResult)
            setSelectedCarouselIndex(0)
            setCurrentSlideIndex(0)

            navigate({ to: '/preview' })
        } catch (err) {
            console.error(err)
            alert('Erro ao gerar carrosséis. Veja o console para detalhes.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="relative min-h-full bg-linear-to-br from-indigo-50 via-white to-purple-50 p-8 flex flex-col">
            {/* Hero Section */}
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h1 className="text-xl md:text-3xl font-black bg-linear-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent mb-2">
                        Crie Carrosséis Incríveis
                    </h1>

                </div>
                <p className="text-gray-600 text-md md:text-lg max-w-md">
                    Transforme suas ideias em carrosséis de redes sociais com inteligência artificial
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-6 backdrop-blur-sm">
                <form className="space-y-6" onSubmit={handleSubmitForm}>
                    {/* Tema Principal */}
                    <div>
                        <label className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            Tema Principal
                        </label>
                        <input
                            type="text"
                            placeholder="Ex: Array Methods em JS, Desenvolvimento Web, React Hooks..."
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-400"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                        />
                        <p className="text-xs text-gray-500 mt-2">Você pode separar múltiplos temas por vírgula</p>
                    </div>

                    {/* Level Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-800 mb-3">Nível de Profundidade</label>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {['Iniciante', 'Intermediário', 'Avançado'].map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => setLevel(opt)}
                                    className={`py-3 px-4 rounded-lg font-medium transition-all border-2 ${level === opt
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md'
                                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-white'
                                        }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                        {loading && typeof document !== 'undefined' && createPortal(
                            <div aria-hidden className="fixed inset-0 z-50 flex items-center justify-center">
                                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
                                <div className="relative z-10 flex flex-col items-center gap-4 text-white">
                                    <div className="w-14 h-14 rounded-full border-4 border-white border-t-transparent animate-spin" />
                                    <div className="text-lg font-semibold">Carregando...</div>
                                </div>
                            </div>,
                            document.body
                        )}
                    </div>

                    {/* Generate Button */}
                    <button
                        type="submit"
                        disabled={topic.length === 0 || loading}
                        className="text-sm md:text-lg w-full mt-8 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <Wand2 size={20} />
                        {loading ? 'Gerando Slides...' : 'Gerar Carrossel de Slides'}
                    </button>
                    {
                        carousels.length > 0 && <Link to="/preview" className="w-full mt-8 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 cursor-pointer">Ir para Preview</Link>
                    }
                </form>
            </div>

            {/* Tips Section */}
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <span className="font-bold">💡 Dica:</span> Quanto mais específico o seu tema, melhores serão os carrosséis gerados
                    </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p className="text-sm text-purple-800">
                        <span className="font-bold">⚡ Sugestão:</span> Use temas técnicos ou educacionais para melhores resultados
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Home
