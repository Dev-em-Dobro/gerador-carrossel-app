import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SlidesProvider } from './context/slides-context'
import App from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <SlidesProvider>
            <App></App>
        </SlidesProvider>
    </StrictMode>,
)
