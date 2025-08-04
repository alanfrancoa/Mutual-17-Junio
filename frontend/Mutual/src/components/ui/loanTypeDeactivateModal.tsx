import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DeactivateLoanTypeModalProps {
  loanTypeId: number;
  loanTypeName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  modalError: string | null;
  isLoading: boolean;
}

const DeactivateLoanTypeModal: React.FC<DeactivateLoanTypeModalProps> = ({
  loanTypeId,
  loanTypeName,
  isOpen,
  onClose,
  onConfirm,
  modalError,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-fade-in relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
          disabled={isLoading}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-3 p-6 pb-2">
          <div className="flex items-center justify-center rounded-full h-10 w-10 bg-orange-100">
            <svg
              className="w-6 h-6 text-orange-500"
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
            Desactivar Tipo de Préstamo
          </h2>
        </div>

        <div className="px-6 pb-6 text-gray-700">
          <div className="mb-4 break-words max-w-full">
            <p className="block text-sm font-medium text-left text-gray-700 mb-2">
             ¿Desea desactivar: <strong>{loanTypeName}</strong>?
              
            </p>
          </div>
          <p className="block text-sm font-medium text-left text-gray-700 mb-2">
           Esta acción impedirá que se creen nuevos préstamos de este tipo.
          </p>
        </div>

        <div className="flex justify-end gap-2 px-6 pb-6">
          <button
            onClick={onClose}
            className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 px-6 py-2 rounded-full font-medium transition"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded-full font-medium shadow transition text-white bg-red-600 hover:bg-red-700 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Desactivando..." : "Confirmar Desactivación"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateLoanTypeModal;