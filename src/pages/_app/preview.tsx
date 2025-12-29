import { createFileRoute, Link } from '@tanstack/react-router'
import { useSlides } from '../../context/slides-context'
import { Sparkles } from 'lucide-react'

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
    const { slides, currentSlideIndex, setCurrentSlideIndex, handleEditSlide, handleRemoveSlide } = useSlides()

    if (slides.length === 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 p-8 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 max-w-xl text-center">
                    <div className="flex items-center justify-center mb-4">
                        <Sparkles className="w-6 h-6 text-indigo-600 mr-2" />
                        <h2 className="text-2xl font-black bg-linear-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">Nenhum slide encontrado</h2>
                    </div>
                    <p className="text-gray-600 mb-6">Crie um carrossel na página inicial para começar a editar e visualizar os slides.</p>
                    <Link to="/home" className="inline-block px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:opacity-95">Ir para Home</Link>
                </div>
            </div>
        )
    }

    const slide = slides[currentSlideIndex]

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 p-8 flex flex-col justify-center">
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <h1 className="text-3xl font-black bg-linear-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">Editor & Preview</h1>
                </div>
                <p className="text-gray-600">Edite o conteúdo à esquerda e veja o resultado à direita em tempo real.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Editor */}
                    <div>
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-4">Editando Slide {currentSlideIndex + 1} de {slides.length}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Título do Slide</label>
                                <input
                                    value={slide?.title || ''}
                                    onChange={(e) => handleEditSlide('title', e.target.value)}
                                    className="w-full mt-2 p-3 border-2 border-gray-100 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Conteúdo Principal</label>
                                <textarea
                                    value={slide?.content || ''}
                                    onChange={(e) => handleEditSlide('content', e.target.value)}
                                    rows={6}
                                    className="w-full mt-2 p-3 border-2 border-gray-100 rounded-lg bg-gray-50 resize-none focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>

                            <div className="flex items-center justify-between gap-3">
                                <button
                                    onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                                    className="px-4 py-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 cursor-pointer"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                                    className="px-4 py-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200 cursor-pointer"
                                >
                                    Próximo
                                    </button>
                            </div>
                            <Link
                                to="/home"
                                className="flex justify-center px-4 py-2 bg-indigo-600 text-white text-lg font-bold rounded-lg shadow-sm hover:bg-indigo-700"
                            >
                                Voltar para Home
                            </Link>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className='flex flex-col gap-3 '>
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-4">Preview do Slide Atual</h3>
                        <div className="p-8 rounded-xl text-white bg-indigo-800 h-96 flex flex-col justify-center shadow-lg">
                            <h3 className="text-2xl font-bold mb-2">{slide?.title}</h3>
                            <p className="text-base">{slide?.content}</p>
                        </div>
                       
                        <button
                            className="self-end px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-sm hover:bg-red-700 cursor-pointer"
                            onClick={() => handleRemoveSlide(currentSlideIndex)}
                        >
                            Remover Slide
                        </button>
                        
                    </div>
                </div>
            </div>

            <div className="text-sm text-gray-500">Dica: altere o título ou conteúdo para ver a prévia atualizar imediatamente.</div>
        </div>
    )
}

export default Preview
