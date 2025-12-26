import { createFileRoute, Link } from '@tanstack/react-router'
import { useSlides } from '../../context/slides-context'


export const Route = createFileRoute('/editor')({
    component: Editor,
})

function Editor() {
    const { slides, currentSlideIndex, setCurrentSlideIndex, handleEditSlide } = useSlides()
    
    if (slides.length === 0) {
        return (
            <div className="p-6">
                <h2 className="text-lg font-bold mb-4">Nenhum slide disponível para editar.</h2>
                <p>Por favor, crie slides primeiro na página inicial.</p>
                <Link to="/home" className="text-indigo-600 hover:underline">Voltar para a página inicial</Link>
            </div>
        )
    }

    return (
        <div className="p-6">
            <h3 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-4">
                Editando Slide {currentSlideIndex + 1} de {slides.length}
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-600">Título do Slide</label>
                    <input
                        value={slides[currentSlideIndex]?.title || ''}
                        onChange={(e) => handleEditSlide('title', e.target.value)}
                        className="w-full p-2 border rounded bg-gray-50"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600">Conteúdo Principal</label>
                    <textarea
                        value={slides[currentSlideIndex]?.content || ''}
                        onChange={(e) => handleEditSlide('content', e.target.value)}
                        rows={4}
                        className="w-full p-2 border rounded bg-gray-50"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                        className="px-3 py-2 bg-gray-200 rounded"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                        className="px-3 py-2 bg-gray-200 rounded"
                    >
                        Próximo
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Editor
