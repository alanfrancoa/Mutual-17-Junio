import React from "react";
import { XMarkIcon } from '@heroicons/react/24/outline'; 

interface LoanStatusModalProps {
  loanId: number;
  isOpen: boolean;
  onClose: () => void;
  onUpdateSuccess: (message: string) => void; 
  actionType: "Aprobado" | "Rechazado"; 
  onConfirm: () => void; 
  motive: string; 
  setMotive: (motive: string) => void; 
  modalError: string | null; 
  isLoading: boolean; 
}

const LoanStatusModal: React.FC<LoanStatusModalProps> = ({
  loanId,
  isOpen,
  onClose,
  actionType,
  onConfirm,
  motive,
  setMotive,
  modalError,
  isLoading,
}) => {
  if (!isOpen) return null;

  const isReject = actionType === "Rechazado";

  const confirmButtonText = isReject ? "Rechazar Préstamo" : "Aprobar Préstamo";
  const titleText = isReject ? `Rechazar Préstamo #${loanId}` : `Aprobar Préstamo #${loanId}`;
  const motiveLabel = isReject ? "Motivo de Rechazo" : "Motivo de Aprobación";
  const placeholderText = isReject ? "Ingrese el motivo del rechazo." : "Ingrese el motivo de la aprobación.";


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
          <div
            className={`flex items-center justify-center rounded-full h-10 w-10 ${
              isReject ? "bg-red-100" : "bg-green-100"
            }`}
          >
            {isReject ? (
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            )}
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{titleText}</h2>
        </div>

        {modalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-6 mb-4" role="alert">
            <span className="block sm:inline">{modalError}</span>
          </div>
        )}

        <div className="px-6 pb-6 text-gray-700 text-base">
          <label
            htmlFor="motive"
            className="block text-sm font-medium text-left text-gray-700 mb-2"
          >
            {motiveLabel}
          </label>
          <textarea
            id="motive"
            value={motive}
            onChange={(e) => setMotive(e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholderText}
            disabled={isLoading}
          ></textarea>
        </div>

        <div className="flex justify-end gap-2 px-6 pb-6">
          <button
            onClick={onClose}
            className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 px-5 py-2 rounded font-medium transition"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded font-medium shadow transition text-white ${
              isReject
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-500 hover:bg-green-600" 
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? "Procesando..." : confirmButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanStatusModal;