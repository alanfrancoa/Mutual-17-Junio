import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface PaymentMethodStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentMethodName: string;
  action: "deactivate" | "reactivate";
  modalError: string | null;
  isLoading: boolean;
}

const PaymentMethodStatusModal: React.FC<PaymentMethodStatusModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  paymentMethodName,
  action,
  modalError,
  isLoading,
}) => {
  if (!isOpen) return null;

  const isDeactivate = action === "deactivate";
  const title = isDeactivate
    ? "Dar de Baja Método de Pago"
    : "Reactivar Método de Pago";
  const confirmText = isDeactivate
    ? "Confirmar Baja"
    : "Confirmar Reactivación";
  const colorClass = isDeactivate
    ? "bg-red-100 text-red-500"
    : "bg-green-100 text-green-600";
  const buttonColor = isDeactivate
    ? "bg-red-600 hover:bg-red-700"
    : "bg-green-600 hover:bg-green-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-fade-in relative">
        {/* Botón de cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onClose}
          aria-label="Cerrar"
          disabled={isLoading}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3 p-6 pb-2">
          <div
            className={`flex items-center justify-center rounded-full h-10 w-10 ${colorClass}`}
          >
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
            {title}
          </h2>
        </div>

        {/* Contenido */}
        <div className="px-6 pb-6 text-gray-700">
          <div className="mb-4 break-words max-w-full">
            <p className="block text-sm font-medium text-left text-gray-700 mb-2">
              ¿Desea {isDeactivate ? "dar de baja" : "reactivar"} el método de
              pago: <strong>{paymentMethodName}</strong>?
            </p>
          </div>
          <p className="block text-sm font-medium text-left text-gray-700 mb-2">
            {isDeactivate
              ? "Esta acción impedirá que el método de pago esté disponible para nuevas operaciones y registros."
              : "Esta acción permitirá que el método de pago vuelva a estar disponible en el sistema."}
          </p>
          {modalError && (
            <p className="text-red-600 text-sm mt-2">{modalError}</p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button
            onClick={onClose}
            className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 px-5 py-2 rounded-full font-medium transition"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-full font-medium shadow transition text-white ${buttonColor} ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading
              ? isDeactivate
                ? "Dando de baja..."
                : "Reactivando..."
              : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodStatusModal;
