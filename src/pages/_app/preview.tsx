import { createFileRoute, Link } from '@tanstack/react-router'
import { useSlides } from '../../context/slides-context'

export const Route = createFileRoute('/preview')({
    component: Preview,
})

function Preview() {
    const { slides, currentSlideIndex } = useSlides()

    if (slides.length === 0) {
            return (
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-4">Nenhum slide disponível para editar.</h2>
                    <p>Por favor, crie slides primeiro na página inicial.</p>
                    <Link to="/home" className="text-indigo-600 hover:underline">Voltar para a página inicial</Link>
                </div>
            )
    }

    const slide = slides[currentSlideIndex]

    return (
        <div className="p-6">
            <h2 className="text-lg font-bold mb-4">Preview do Slide Atual</h2>
            <div className={`p-8 rounded-md text-white ${slide?.bg || 'bg-gray-800'}`}>
                <h3 className="text-2xl font-bold mb-2">{slide?.title}</h3>
                <p>{slide?.content}</p>
            </div>
        </div>
    )
}

export default Preview
