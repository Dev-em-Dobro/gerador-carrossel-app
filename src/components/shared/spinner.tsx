export default function Spinner({ message = "Carregando..." }: Readonly<{ message?: string }>) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
            <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full animate-spin" />
                <span className="text-white text-base">{message}</span>
            </div>
        </div>
    );
}