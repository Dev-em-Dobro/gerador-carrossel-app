import { createRouter, RouterProvider } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree, context: {} })

const App = () => {
    return <RouterProvider router={router} />
}

export default App