export{}
// // src/components/modals/TermsModal.tsx
// import { FC, useState } from "react";

// interface TermsModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onAccept: () => void;
// }

// const TermsModal: FC<TermsModalProps> = ({ isOpen, onClose, onAccept }) => {
//   const [accepted, setAccepted] = useState(false);

//   if (!isOpen) return null;

//   const handleAccept = () => {
//     if (accepted) {
//       onAccept();
//       onClose();
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="text-xl font-bold text-gray-800">Términos y Condiciones</h3>
//             <button 
//               onClick={onClose}
//               className="text-gray-500 hover:text-gray-700"
//               aria-label="Cerrar modal"
//             >
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//           <div className="prose prose-sm text-gray-600 mb-4">
//             {/* Contenido de términos y condiciones */}
//             <h4>1. Aceptación de los Términos</h4>
//             <p>Al acceder y utilizar este portal, usted acepta cumplir con estos términos y condiciones.</p>
            
//             <h4>2. Uso del Portal</h4>
//             <p>El portal está destinado exclusivamente para miembros de la mutual. No está permitido el uso no autorizado.</p>
            
//             <h4>3. Responsabilidades</h4>
//             <p>El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso.</p>
            
//             <h4>4. Modificaciones</h4>
//             <p>Nos reservamos el derecho de modificar estos términos en cualquier momento.</p>
//           </div>
          
//           <div className="flex items-center mb-6">
//             <input
//               type="checkbox"
//               id="acceptTerms"
//               checked={accepted}
//               onChange={(e) => setAccepted(e.target.checked)}
//               className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//             />
//             <label htmlFor="acceptTerms" className="ml-2 text-sm font-medium text-gray-700">
//               He leído y acepto los Términos y Condiciones
//             </label>
//           </div>
          
//           <div className="flex justify-end">
//             <button
//               onClick={handleAccept}
//               disabled={!accepted}
//               className={`px-4 py-2 text-white rounded ${
//                 accepted 
//                   ? "bg-blue-500 hover:bg-blue-600"
//                   : "bg-gray-400 cursor-not-allowed"
//               } transition`}
//             >
//               Aceptar y Continuar
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TermsModal;