import { createContext, useContext, useState, type ReactNode } from 'react'

export interface Slide {
    id: number
    type: string
    title: string
    content: string
}

export interface Carousel {
    id: number
    topic: string
    slides: Slide[]
    language_logo?: string
}

interface SlidesContextValue {
    carousels: Carousel[]
    setCarousels: (c: Carousel[]) => void
    selectedCarouselIndex: number
    setSelectedCarouselIndex: (i: number) => void
    currentSlideIndex: number
    setCurrentSlideIndex: (i: number) => void
    topic: string
    setTopic: (t: string) => void
    level: string
    setLevel: (l: string) => void
    handleEditSlide: (field: 'title' | 'content', value: string) => void
    addSlideToCurrent: () => void
    removeSlideFromCurrent: (index: number) => void
}

export const SlidesContext = createContext<SlidesContextValue | undefined>(undefined)

export const SlidesProvider = ({ children }: { children: ReactNode }) => {
    const [carousels, setCarousels] = useState<Carousel[]>([])

    const [selectedCarouselIndex, setSelectedCarouselIndex] = useState(0)
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [topic, setTopic] = useState('')
    const [level, setLevel] = useState('Iniciante')

    const handleEditSlide = (field: 'title' | 'content', value: string) => {
        const cIndex = selectedCarouselIndex
        if (cIndex == null || !carousels[cIndex]) return
        const newCarousels = [...carousels]
        const slides = [...newCarousels[cIndex].slides]
        slides[currentSlideIndex] = { ...slides[currentSlideIndex], [field]: value }
        newCarousels[cIndex] = { ...newCarousels[cIndex], slides }
        setCarousels(newCarousels)
    }

    const addSlideToCurrent = () => {
        const cIndex = selectedCarouselIndex
        if (cIndex == null || !carousels[cIndex]) return
        const newCarousels = [...carousels]
        const slides = [...newCarousels[cIndex].slides]
        const newSlide: Slide = { id: slides.length, type: 'default', title: '', content: '' }
        slides.push(newSlide)
        newCarousels[cIndex] = { ...newCarousels[cIndex], slides }
        setCarousels(newCarousels)
        setCurrentSlideIndex(slides.length - 1)
    }

    const removeSlideFromCurrent = (index: number) => {
        const cIndex = selectedCarouselIndex
        if (cIndex == null || !carousels[cIndex]) return
        const newCarousels = [...carousels]
        const slides = newCarousels[cIndex].slides.filter((_, i) => i !== index).map((s, i) => ({ ...s, id: i }))
        newCarousels[cIndex] = { ...newCarousels[cIndex], slides }
        setCarousels(newCarousels)
        setCurrentSlideIndex((prev) => Math.max(0, Math.min(prev, slides.length - 1)))
    }

    return (
        <SlidesContext.Provider
            value={{ carousels, setCarousels, selectedCarouselIndex, setSelectedCarouselIndex, currentSlideIndex, setCurrentSlideIndex, topic, setTopic, level, setLevel, handleEditSlide, addSlideToCurrent, removeSlideFromCurrent }}
        >
            {children}
        </SlidesContext.Provider>
    )
}

export const useSlides = () => {
    const ctx = useContext(SlidesContext)
    if (!ctx) throw new Error('useSlides must be used within SlidesProvider')
    return ctx
}


