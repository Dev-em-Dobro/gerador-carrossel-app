import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen';

const router = createRouter({
    routeTree, 
    context: {}, 
    defaultNotFoundComponent: () => {
        return (
            <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 p-8 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 max-w-md text-center">
                    <h2 className="text-2xl font-black mb-4 bg-linear-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">Página não encontrada</h2>
                    <p className="text-gray-600 mb-6">A página que você está procurando não existe ou foi movida.</p>
                    <a href="/home" className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:opacity-95">Ir para Home</a>
                </div>
            </div>
        );
    },
})


const App = () => {
    return <RouterProvider router={router} />
}

export default App