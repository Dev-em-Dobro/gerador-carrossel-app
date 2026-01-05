import { createFileRoute, Link } from '@tanstack/react-router'
import { useSlides } from '../../context/slides-context'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Editor from '@/components/app/editor'
import CarouselPreview from '@/components/app/preview'

export const Route = createFileRoute('/_app/preview')({
    head: () => ({
        meta: [
            { name: 'description', content: 'Pré-visualize e edite os slides gerados para o seu carrossel.' },
            { title: 'Preview dos Slides - Gerador de Carrossel' },
        ]
    }),
    component: Preview,
})

function Preview() {
    const { carousels, selectedCarouselIndex, setSelectedCarouselIndex, setCurrentSlideIndex } = useSlides()

    if (!carousels || carousels.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 p-8 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 max-w-xl text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
                        <h2 className="text-2xl font-black bg-linear-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">Nenhum carrossel encontrado</h2>
                    </div>
                    <p className="text-gray-600 mb-6">Crie carrosséis na página inicial para começar a editar e visualizar.</p>
                    <Link to="/" className="inline-block px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:opacity-95">Ir para página inicial</Link>
                </div>
            </div>
        )
    }


    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 p-8 flex flex-col justify-center">
            <div className="mb-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-3">
                <div className="w-full md:flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            to="/"
                            aria-label="Voltar para Home"
                            title="Voltar"
                            className="inline-flex items-center justify-center px-3 py-2 min-w-12 h-10 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow hover:bg-indigo-50"
                        >
                            <ArrowLeft size={22} className="text-indigo-700" />
                        </Link>
                        <Sparkles className="hidden sm:flex w-5 h-5 text-indigo-600" />
                        <h1 className="text-3xl font-black bg-linear-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent ml-4 sm:ml-0">Editor & Preview</h1>
                    </div>
                    <p className="text-gray-600 text-center md:text-left">Edite o conteúdo à esquerda e veja o resultado à direita em tempo real.</p>
                </div>
                <div>
                    <label className="block text-sm text-gray-500 text-center">Escolha o Carrossel</label>
                    <select
                        value={String(selectedCarouselIndex)}
                        onChange={(e) => { setSelectedCarouselIndex(Number(e.target.value)); setCurrentSlideIndex(0) }}
                        className="mt-1 px-4 py-2 border-2 border-gray-200 rounded-lg bg-white text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-shadow shadow-sm"
                    >
                        {carousels.map((c, i) => (
                            <option key={c.id} value={i}>{c.topic}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Editor */}
                    <Editor />

                    {/* Preview */}
                    <CarouselPreview />

                </div>
            </div>

            <div className="text-sm text-gray-500">Dica: altere o título ou conteúdo para ver a prévia atualizar imediatamente.</div>
        </div>
    )
}

export default Preview
