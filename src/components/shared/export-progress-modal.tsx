import type { ExportProgress } from '@/utils/exportCarousel'

interface ExportProgressModalProps {
    progress: ExportProgress
}

export function ExportProgressModal({ progress }: ExportProgressModalProps) {
    const percentage = Math.round((progress.current / progress.total) * 100)

    return (
        <div className="export-modal-overlay">
            <div className="export-modal-content">
                <div className="flex flex-col gap-4">
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Exportando Carrossel
                        </h3>
                        <p className="text-gray-600">
                            Exportando slide {progress.current} de {progress.total}
                        </p>
                    </div>

                    <div className="export-progress-bar">
                        <div
                            className="export-progress-fill"
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    <div className="text-center">
                        <span className="text-2xl font-bold text-blue-600">
                            {percentage}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
