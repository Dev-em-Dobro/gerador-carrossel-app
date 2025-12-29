import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface Slide {
    id: number
    type: string
    title: string
    content: string
}

interface SlidesContextValue {
    slides: Slide[]
    setSlides: (s: Slide[]) => void
    currentSlideIndex: number
    setCurrentSlideIndex: (i: number) => void
    topic: string
    setTopic: (t: string) => void
    level: string
    setLevel: (l: string) => void
    handleEditSlide: (field: 'title' | 'content', value: string) => void
    handleRemoveSlide: (slideIndexToRemove: number) => void
}

export const SlidesContext = createContext<SlidesContextValue | undefined>(undefined)

export const SlidesProvider = ({ children }: { children: ReactNode }) => {
    const [slides, setSlides] = useState<Slide[]>([])

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
    const [topic, setTopic] = useState('')
    const [level, setLevel] = useState('Iniciante')

    const handleEditSlide = (field: 'title' | 'content', value: string) => {
        const newSlides = [...slides]
        newSlides[currentSlideIndex] = { ...newSlides[currentSlideIndex], [field]: value }
        setSlides(newSlides)
    }

    const handleRemoveSlide = (slideIndexToRemove: number) => {
        const newSlides = [...slides]
        setSlides(newSlides.filter((_, index) => index !== slideIndexToRemove))
        
        if (currentSlideIndex >= slideIndexToRemove) {
            setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))
        }
    }

    return (
        <SlidesContext.Provider
            value={{ slides, setSlides, currentSlideIndex, setCurrentSlideIndex, topic, setTopic, level, setLevel, handleEditSlide, handleRemoveSlide }}
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

export default SlidesContext
