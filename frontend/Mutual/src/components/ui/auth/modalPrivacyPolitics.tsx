// src/components/modals/PrivacyModal.tsx
import { FC, useState } from "react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const PrivacyModal: FC<PrivacyModalProps> = ({ isOpen, onClose, onAccept }) => {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  const handleAccept = () => {
    if (accepted) {
      onAccept();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">Política de Privacidad</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Cerrar modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="prose prose-sm text-gray-600 mb-4">
            {/* Contenido de política de privacidad */}
            <h4>1. Recopilación de Información</h4>
            <p>Recopilamos información personal cuando usted se registra en nuestro portal y utiliza nuestros servicios.</p>
            
            <h4>2. Uso de la Información</h4>
            <p>La información recopilada se utiliza para proporcionar y mejorar nuestros servicios, y para comunicación con los miembros.</p>
            
            <h4>3. Protección de Datos</h4>
            <p>Implementamos medidas de seguridad para proteger su información personal contra accesos no autorizados.</p>
            
            <h4>4. Derechos del Usuario</h4>
            <p>Usted tiene derecho a acceder, rectificar y eliminar sus datos personales en cualquier momento.</p>
          </div>
          
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="acceptPrivacy"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="acceptPrivacy" className="ml-2 text-sm font-medium text-gray-700">
              He leído y acepto la Política de Privacidad
            </label>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleAccept}
              disabled={!accepted}
              className={`px-4 py-2 text-white rounded ${
                accepted 
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-gray-400 cursor-not-allowed"
              } transition`}
            >
              Aceptar y Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;