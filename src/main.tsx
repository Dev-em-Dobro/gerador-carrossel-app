import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SlidesProvider } from './context/slides-context'
import { BlogProvider } from './context/blog-context'
import App from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SlidesProvider>
            <BlogProvider>
                <App></App>
            </BlogProvider>
        </SlidesProvider>
    </StrictMode>,
)
