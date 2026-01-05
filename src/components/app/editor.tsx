import { Link } from '@tanstack/react-router'
import { useSlides } from '@/context/slides-context'
import { ArrowBigLeft } from 'lucide-react'

function Editor() {
    const { carousels, selectedCarouselIndex, currentSlideIndex, setCurrentSlideIndex, handleEditSlide } = useSlides()

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
                        className="w-full mt-2 p-3 border-2 border-gray-100 rounded-lg bg-gray-50 resize-none focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                </div>

                <div className="flex items-center justify-between gap-3">
                    <button
                        onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                        aria-label="Slide anterior"
                        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                    >
                        <ArrowBigLeft size={20} className="text-indigo-700" />
                    </button>

                    <button
                        onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                        aria-label="Próximo slide"
                        className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-transform transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                    >
                        <ArrowBigLeft size={20} className="text-indigo-700 rotate-180" />
                    </button>
                </div>

            </div>
        </div>
    )
}

export default Editor
