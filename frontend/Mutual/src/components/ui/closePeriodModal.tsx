import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

interface ClosePeriodConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  modalError: string | null;
  isLoading: boolean;
  periodCode: string; 
}

const ClosePeriodConfirmationModal: React.FC<
  ClosePeriodConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  modalError,
  isLoading,
  periodCode, 
}) => {
  if (!isOpen) return null;

  const iconBgColor = "bg-orange-100";
  const iconTextColor = "text-orange-500";
  const confirmButtonColor = "bg-red-600 hover:bg-red-700"; 

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full animate-fade-in relative flex flex-col">
        
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
          disabled={isLoading}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Encabezado del modal  */}
        <div className="flex items-center gap-3 p-6 pb-2">
          <div
            className={`flex items-center justify-center rounded-full h-10 w-10 ${iconBgColor}`}
          >
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
            Cerrar Período Contable
          </h2>
        </div>
        
      
        {/* Contenido principal del modal */}
        <div className="flex-grow px-4 pb-6 flex flex-col">
          <div className="mb-4">
            <p className="block text-sm font-medium text-left text-gray-700 mb-2">
              ¿Desea cerrar el período: <strong>{periodCode}</strong>?
            </p>

            <p className="block text-sm font-medium text-left text-gray-700 mt-6">
              Esta acción impedirá que se realicen nuevas operaciones contables
              en este período.
            </p>
          </div>
        </div>
        {/* Botones */}
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
            className={`px-6 py-2 rounded-full font-medium shadow transition text-white ${confirmButtonColor} ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Cerrando..." : "Confirmar Cierre"}{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClosePeriodConfirmationModal;
