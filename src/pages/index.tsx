import { createFileRoute, Link } from '@tanstack/react-router'
import { FileText, LayoutGrid, Sparkles, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({
    head: () => ({
        meta: [
            { name: 'description', content: 'Crie conteúdos incríveis para redes sociais e blogs com inteligência artificial.' },
            { title: 'Gerador de Conteúdo - Dev em Dobro' },
        ]
    }),
    component: HomePage,
})

function HomePage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 p-8 flex flex-col items-center justify-center">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                    <Sparkles className="w-8 h-8 text-indigo-600" />
                    <h1 className="text-3xl md:text-5xl font-black bg-linear-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                        Gerador de Conteúdo
                    </h1>
                </div>
                <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                    Transforme suas ideias em conteúdos incríveis para redes sociais e blogs usando inteligência artificial
                </p>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
                {/* Carrossel Card */}
                <Link
                    to="/carrossel"
                    className="group bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-pointer"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-100 rounded-xl group-hover:bg-indigo-200 transition-colors">
                            <LayoutGrid className="w-8 h-8 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                Carrossel para Redes Sociais
                                <ArrowRight className="w-5 h-5 text-indigo-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Crie carrosséis educativos para Instagram e LinkedIn com slides profissionais e conteúdo técnico de qualidade.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">Instagram</span>
                                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">LinkedIn</span>
                                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-full">10 slides</span>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Blog Card */}
                <Link
                    to="/blog"
                    className="group bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 hover:shadow-xl hover:border-purple-200 transition-all duration-300 cursor-pointer"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-200 transition-colors">
                            <FileText className="w-8 h-8 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                                Post para Blog
                                <ArrowRight className="w-5 h-5 text-purple-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h2>
                            <p className="text-gray-600 mb-4">
                                Gere posts técnicos educativos para blogs como dev.to, Medium ou WordPress com estrutura profissional.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">WordPress</span>
                                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">dev.to</span>
                                <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium rounded-full">Markdown</span>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Footer info */}
            <div className="mt-12 text-center">
                <p className="text-gray-500 text-sm">
                    Escolha uma ferramenta acima para começar a criar conteúdo com IA
                </p>
            </div>
        </div>
    )
}

export default HomePage
