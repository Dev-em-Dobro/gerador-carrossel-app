import { createContext, useContext, useState, type ReactNode } from 'react'

export interface BlogPost {
    id: string
    title: string
    content: string // Markdown content
    topic: string
    level: string
    createdAt: Date
}

interface BlogContextValue {
    post: BlogPost | null
    setPost: (p: BlogPost | null) => void
    topic: string
    setTopic: (t: string) => void
    level: string
    setLevel: (l: string) => void
    isLoading: boolean
    setIsLoading: (l: boolean) => void
    updatePostContent: (content: string) => void
    updatePostTitle: (title: string) => void
}

export const BlogContext = createContext<BlogContextValue | undefined>(undefined)

export const BlogProvider = ({ children }: { children: ReactNode }) => {
    const [post, setPost] = useState<BlogPost | null>(null)
    const [topic, setTopic] = useState('')
    const [level, setLevel] = useState('Iniciante')
    const [isLoading, setIsLoading] = useState(false)

    const updatePostContent = (content: string) => {
        if (!post) return
        setPost({ ...post, content })
    }

    const updatePostTitle = (title: string) => {
        if (!post) return
        setPost({ ...post, title })
    }

    return (
        <BlogContext.Provider
            value={{
                post,
                setPost,
                topic,
                setTopic,
                level,
                setLevel,
                isLoading,
                setIsLoading,
                updatePostContent,
                updatePostTitle,
            }}
        >
            {children}
        </BlogContext.Provider>
    )
}

export const useBlog = () => {
    const ctx = useContext(BlogContext)
    if (!ctx) throw new Error('useBlog must be used within BlogProvider')
    return ctx
}
