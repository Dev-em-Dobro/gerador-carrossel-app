import { Link } from '@tanstack/react-router'
import { useSlides } from '../../context/slides-context'

function Editor() {
    const { carousels, selectedCarouselIndex, currentSlideIndex, setCurrentSlideIndex, handleEditSlide, addSlideToCurrent, removeSlideFromCurrent } = useSlides()

    if (!carousels || carousels.length === 0) {
        return (
            <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Nenhum carrossel disponível para editar.</h2>
                <p>Por favor, crie carrosséis primeiro na página inicial.</p>
                <Link to="/home" className="text-indigo-600 hover:underline">Voltar para a página inicial</Link>
            </div>
        )
    }

    const slides = carousels[selectedCarouselIndex]?.slides || []

    return (
        <div>
            <h3 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-4">Editando Slide {currentSlideIndex + 1} de {slides.length}</h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título do Slide</label>
                    <input
                        value={slides[currentSlideIndex]?.title || ''}
                        onChange={(e) => handleEditSlide('title', e.target.value)}
                        className="w-full mt-2 p-3 border-2 border-gray-100 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Conteúdo Principal</label>
                    <textarea
                        value={slides[currentSlideIndex]?.content || ''}
                        onChange={(e) => handleEditSlide('content', e.target.value)}
                        rows={6}
                        className="w-full mt-2 p-3 border-2 border-gray-100 rounded-lg bg-gray-50 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                        className="px-4 py-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                        className="px-4 py-2 bg-gray-100 rounded-lg shadow-sm hover:bg-gray-200"
                    >
                        Próximo
                    </button>
                </div>
                <div className="flex gap-2">
                    <button onClick={addSlideToCurrent} className="px-4 py-2 bg-green-100 rounded-lg">Adicionar Slide</button>
                    <button onClick={() => removeSlideFromCurrent(currentSlideIndex)} className="px-4 py-2 bg-red-100 rounded-lg">Remover Slide</button>
                </div>
            </div>
        </div>
    )
}

export default Editor
