import React from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  //Var que detecta si es una accion de rechazo
  const isReject = confirmText.toLowerCase().includes("rechaz");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full animate-fade-in relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
          onClick={onCancel}
          aria-label="Cerrar"
        >
          &times;
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
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="px-6 pb-6 text-gray-700 text-base">{message}</div>
        <div className="flex justify-end gap-2 px-6 pb-6">
          <button
            className="border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 px-5 py-2 rounded font-medium transition"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className={`px-5 py-2 rounded font-medium shadow transition text-white ${
              isReject
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-500 hover:bg-green-500"
            }`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
        <style>
          {`
            .animate-fade-in {
              animation: fadeInModal 0.2s ease;
            }
            @keyframes fadeInModal {
              from { opacity: 0; transform: translateY(20px);}
              to { opacity: 1; transform: translateY(0);}
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Modal;