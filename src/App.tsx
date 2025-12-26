import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Wand2 } from 'lucide-react';

interface Slide {
    id: number;
    type: string;
    title: string;
    content: string;
    bg: string;
}

const App = () => {
    // Estado simulando os dados gerados pela IA (Baseado no PRD)
    const [slides, setSlides] = useState<Slide[]>([]);

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [topic, setTopic] = useState('');
    const [ctaCustom, setCtaCustom] = useState(false);
    const [level, setLevel] = useState('Iniciante');

    const handleGenerate = () => {
        alert(`Enviando prompt para IA: Tema "${topic}" para nível "${level}"...`);
        // Aqui entraria a integração com OpenAI/Gemini
    };

    // Atualizar texto do slide em tempo real
    const handleEditSlide = (field: 'title' | 'content', value: string) => {
        const newSlides = [...slides];
        newSlides[currentSlideIndex][field] = value;
        setSlides(newSlides);
    };

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-800">

            <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">

                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-indigo-700 mb-4">Criador de Carrossel AI</h1>

                    <div className="space-y-4 flex flex-col gap-2">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{topic.split(',').map(t => t.trim()).length >= 2 ? "Temas Principais" : "Tema Principal"}</label>
                            <input
                                type="text"
                                placeholder="Insira até 3 temas separados por vírgula"
                                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                            />
                            <label className="block text-sm font-medium text-gray-700 mb-1 mt-4">Opções Adicionais</label>
                            <div className="flex gap-2">
                                <span>CTA Customizável?</span>
                                <input
                                    type="checkbox"
                                    onChange={e => setCtaCustom(e.target.checked)}
                                />
                            </div>
                            {
                                ctaCustom && (
                                    <input
                                        type="text"
                                        placeholder="Insira um CTA personalizado (opcional)"
                                        className="w-full p-2 mt-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                    />
                                )
                            }
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nível</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={level}
                                    onChange={(e) => setLevel(e.target.value)}
                                >
                                    <option>Iniciante</option>
                                    <option>Intermediário</option>
                                    <option>Avançado</option>
                                </select>
                            </div>
                            <button
                                onClick={handleGenerate}
                                disabled={topic.trim() === "" && topic.split(',').map(t => t.trim()).length > 0}
                                className="self-end bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                            >
                                <Wand2 size={16} /> Gerar
                            </button>
                        </div>
                    </div>
                </div>

                {
                    slides.length === 0 ? (
                        <div className="p-6 flex-1 flex items-center justify-center text-center text-gray-400">
                            <p>
                                Nenhum slide gerado ainda. <br />
                                Use o painel acima para criar seu primeiro carrossel!
                            </p>
                        </div>
                    ) : <div className="p-6 flex-1 overflow-y-auto">
                        <h3 className="text-sm uppercase tracking-wide text-gray-500 font-bold mb-4">
                            Editando Slide {currentSlideIndex + 1} de {slides.length}
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600">Título do Slide</label>
                                <input
                                    value={slides[currentSlideIndex].title}
                                    onChange={(e) => handleEditSlide('title', e.target.value)}
                                    className="w-full p-2 border rounded bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600">Conteúdo Principal</label>
                                <textarea
                                    value={slides[currentSlideIndex].content}
                                    onChange={(e) => handleEditSlide('content', e.target.value)}
                                    rows={4}
                                    className="w-full p-2 border rounded bg-gray-50"
                                />
                            </div>

                            <div className="bg-yellow-50 p-3 rounded border border-yellow-200 text-sm text-yellow-800">
                                <strong>💡 Dica de IA:</strong> Para este nível, tente usar uma pergunta provocativa no título.
                            </div>
                        </div>
                    </div>
                }
            </div>

            {
                slides.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-400 text-lg">
                            Preview do Carrossel aparecerá aqui após a geração.
                        </p>
                    </div>
                ) :
                    <div className="flex-1 bg-gray-200 flex flex-col items-center justify-center p-8 relative">

                        {/* Barra de Ferramentas Superior */}
                        <div className="absolute top-6 right-6 flex gap-3">
                            <button className="bg-white text-gray-700 px-4 py-2 rounded shadow-sm hover:bg-gray-50 flex items-center gap-2 font-medium">
                                <Download size={18} /> Exportar PNG
                            </button>
                        </div>

                        <div
                            id="carousel-slide"
                            className={`w-125 h-125 ${slides[currentSlideIndex].bg} shadow-2xl rounded-lg flex flex-col items-center justify-center p-12 text-center text-white transition-all duration-300`}
                        >
                            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
                                {slides[currentSlideIndex].title}
                            </h2>
                            <p className="text-xl font-light opacity-90 leading-relaxed">
                                {slides[currentSlideIndex].content}
                            </p>

                            <div className="mt-auto pt-8 flex items-center gap-2 opacity-50 text-sm">
                                <span>@devemdobro</span>
                                <span>•</span>
                                <span>Slide {currentSlideIndex + 1}/{slides.length}</span>
                            </div>
                        </div>

                        {/* Navegação do Preview */}
                        <div className="mt-8 flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-lg">
                            <button
                                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                                disabled={currentSlideIndex === 0}
                                className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30"
                            >
                                <ChevronLeft />
                            </button>
                            <span className="font-mono font-medium text-gray-600">
                                {currentSlideIndex + 1} / {slides.length}
                            </span>
                            <button
                                onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                                disabled={currentSlideIndex === slides.length - 1}
                                className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-30"
                            >
                                <ChevronRight />
                            </button>
                        </div>
                    </div>
            }
        </div>
    );
};

export default App;