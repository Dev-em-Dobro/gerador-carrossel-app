import { createFileRoute, Link } from '@tanstack/react-router'
import { useSlides } from '../../context/slides-context'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Editor from './editor'

export const Route = createFileRoute('/preview')({
    head: () => ({
        meta: [
            { name: 'description', content: 'Pré-visualize e edite os slides gerados para o seu carrossel.' },
            { title: 'Preview dos Slides - Gerador de Carrossel' },
        ]
    }),
    component: Preview,
})

function Preview() {
    const { carousels, selectedCarouselIndex, setSelectedCarouselIndex, currentSlideIndex, setCurrentSlideIndex, addSlideToCurrent, removeSlideFromCurrent } = useSlides()

    if (!carousels || carousels.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 p-8 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 max-w-xl text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
                        <h2 className="text-2xl font-black bg-linear-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">Nenhum carrossel encontrado</h2>
                    </div>
                    <p className="text-gray-600 mb-6">Crie carrosséis na página inicial para começar a editar e visualizar.</p>
                    <Link to="/home" className="inline-block px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:opacity-95">Ir para Home</Link>
                </div>
            </div>
        )
    }

    const carousel = carousels[selectedCarouselIndex]
    const slides = carousel.slides

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 p-8 flex flex-col justify-center">
            <div className="mb-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-3">
                <div className="w-full md:flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Link
                            to="/home"
                            aria-label="Voltar para Home"
                            title="Voltar"
                            className="inline-flex items-center justify-center px-3 py-2 min-w-[48px] h-10 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow hover:bg-indigo-50"
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
                    <div className='flex flex-col gap-3'>
                        <div className='flex flex-col sm:flex-row gap-3 items-center justify-between'>
                            <h3 className="text-sm uppercase tracking-wide text-gray-500 font-bold">Preview do Slide Atual</h3>
                            <div className="flex gap-2">
                                <button onClick={() => removeSlideFromCurrent(currentSlideIndex)} className="px-4 py-2 bg-red-500 rounded-lg font-bold text-white cursor-pointer hover:bg-red-600">Remover Slide</button>
                                <button onClick={addSlideToCurrent} className="px-4 py-2 bg-green-600 rounded-lg font-bold text-white cursor-pointer hover:bg-green-700">Adicionar Slide</button>
                            </div>
                        </div>
                        <div className="p-8 rounded-xl text-white bg-indigo-800 h-96 flex flex-col justify-center shadow-lg">
                            <h3 className="text-2xl font-bold mb-2">{slides[currentSlideIndex]?.title}</h3>
                            <p className="text-base">{slides[currentSlideIndex]?.content}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-sm text-gray-500">Dica: altere o título ou conteúdo para ver a prévia atualizar imediatamente.</div>
        </div>
    )
}

export default Preview
