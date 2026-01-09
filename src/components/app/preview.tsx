import { useSlides } from "@/context/slides-context"
import { getLogoFilename, isCodeLike } from "@/utils/logoUtils"
import { CodeWindow } from "@/components/ui/code-window"
import { parseContentWithCode } from "@/utils/contentParser"

function CarouselPreview() {
    const { carousels, currentSlideIndex, addSlideToCurrent, removeSlideFromCurrent, selectedCarouselIndex } = useSlides()

    const carousel = carousels[selectedCarouselIndex]
    const slides = carousel.slides
    const currentSlide = slides[currentSlideIndex]

    const parsedContent = currentSlide?.content ? parseContentWithCode(currentSlide.content) : null
    const hasCodeBlock = parsedContent?.code && parsedContent.code.length > 0

    const renderContent = () => {
        if (!currentSlide?.content) return null

        if (isCodeLike(currentSlide.content) && parsedContent) {
            const { text, code, textAfter } = parsedContent
            
            return (
                <div className="flex flex-col gap-4">
                    {text && (
                        <p className="text-base font-['AnkaCoderRegular'] leading-relaxed">
                            {text}
                        </p>
                    )}
                    {code && (
                        <CodeWindow 
                            code={code}
                            title={currentSlide.title}
                        />
                    )}
                    {textAfter && (
                        <p className="text-base font-['AnkaCoderRegular'] leading-relaxed mt-2">
                            {textAfter}
                        </p>
                    )}
                </div>
            )
        }

        return (
            <p className="text-base font-['AnkaCoderRegular']">
                {currentSlide.content}
            </p>
        )
    }

    return (
        <div className='flex flex-col gap-3'>
            <div className='flex flex-col sm:flex-row gap-3 items-center justify-between'>
                <h3 className="text-sm uppercase tracking-wide text-gray-500 font-bold">Preview do Slide Atual</h3>
                <div className="flex gap-2">
                    <button onClick={() => removeSlideFromCurrent(currentSlideIndex)} className="px-4 py-2 bg-red-500 rounded-lg font-bold text-white cursor-pointer hover:bg-red-600">Remover Slide</button>
                    <button onClick={addSlideToCurrent} className="px-4 py-2 bg-green-600 rounded-lg font-bold text-white cursor-pointer hover:bg-green-700">Adicionar Slide</button>
                </div>
            </div>
            <div className="shadow-bg">
                <div
                    className="carousel-preview bg-center bg-cover flex items-center justify-center text-white h-96 bg-[#212121]"
                >
                    <div className="carousel-preview__overlay" />

                    {!hasCodeBlock && (
                        <div className="carousel-preview__dots" aria-hidden>
                            <span className="dot-1" />
                            <span className="dot-2" />
                            <span className="dot-3" />
                        </div>
                    )}

                    <div className="p-8 carousel-preview__content flex flex-col justify-center gap-3 w-full relative h-full overflow-y-auto">
                        {currentSlideIndex === 0 && (
                            <div className="text-indigo-800 rounded-full text-sm font-semibold shadow self-start gap-2">
                                {(() => {
                                    const filename = getLogoFilename(carousel.language_logo)
                                    if (!filename) return null
                                    const src = `/images/logos/${filename}.png`
                                    return (
                                        <img
                                            src={src}
                                            alt={filename}
                                            className="w-20 h-20"
                                        />
                                    )
                                })()}
                            </div>
                        )}

                        <h3 className="text-2xl font-bold font-['AnkaCoderRegular'] mb-2">
                            {currentSlide?.title}
                        </h3>
                        
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CarouselPreview