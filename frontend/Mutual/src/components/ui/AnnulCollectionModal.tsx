import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface AnnulCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  collectionId: number;
  associateName: string;
  modalError: string | null;
  isLoading: boolean;
}

const AnnulCollectionModal: React.FC<AnnulCollectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  collectionId,
  associateName,
  modalError,
  isLoading,
}) => {
  const [cancellationReason, setCancellationReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (cancellationReason.trim()) {
      onConfirm(cancellationReason.trim());
    }
  };

  const handleClose = () => {
    setCancellationReason("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-fade-in relative">
        {/* Botón de cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={handleClose}
          aria-label="Cerrar"
          disabled={isLoading}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 p-6 pb-2">
          <div className="flex items-center justify-center rounded-full h-10 w-10 bg-red-100 text-red-500">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.305 3.24 1.943 3.24h14.714c1.638 0 2.809-1.74 1.943-3.24L12.945 2.23a1.875 1.875 0 00-3.89 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 break-words max-w-[calc(100%-70px)]">
            Anular Cobro
          </h2>
        </div>

        {/* Contenido */}
        <div className="px-6 pb-6 text-gray-700">
          <div className="mb-4 break-words max-w-full">
            <p className="block text-sm font-medium text-left text-gray-700 mb-2">
              ¿Desea anular el cobro <strong>#{collectionId}</strong> del asociado <strong>{associateName}</strong>?
            </p>
          </div>
          <p className="block text-sm font-medium text-left text-gray-700 mb-4">
            Esta acción cambiará el estado del cobro a "Cancelado" y no se podrá revertir.
          </p>
          
          {/* Campo de motivo */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Motivo de anulación <span className="text-red-500">*</span>
            </label>
            <textarea
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              placeholder="Ingrese el motivo de la anulación..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
              rows={3}
              disabled={isLoading}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {cancellationReason.length}/500 caracteres
            </p>
          </div>

          {modalError && (
            <p className="text-red-600 text-sm mt-2">{modalError}</p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button
            onClick={handleClose}
            className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 px-5 py-2 rounded-full font-medium transition"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className={`px-5 py-2 rounded-full font-medium shadow transition text-white bg-red-600 hover:bg-red-700 ${
              isLoading || !cancellationReason.trim() ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading || !cancellationReason.trim()}
          >
            {isLoading ? "Anulando..." : "Confirmar Anulación"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnulCollectionModal;