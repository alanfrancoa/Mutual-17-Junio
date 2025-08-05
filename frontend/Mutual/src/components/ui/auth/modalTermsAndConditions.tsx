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

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsModal = ({ isOpen, onClose, onAccept }: TermsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">TÉRMINOS Y CONDICIONES DE USO</h2>
        <div className="prose prose-sm mb-6">
          <p className="mb-2"><strong>Sistema de Gestión Web - Mutual 17 de Junio</strong></p>
          <p className="mb-4"><em>Última actualización: 30/05/2025</em></p>

          <h3 className="border-b pb-1 mb-2">1. Introducción</h3>
          <p>
            Bienvenido/a al sistema de gestión web de la Mutual 17 de Junio. Este sistema, desarrollado bajo los estándares de la Ley 20.321 (INAES) y Ley 25.326 (Protección de Datos), regula el acceso y uso exclusivo del personal autorizado para la gestión interna de préstamos, cobranzas y reportes regulatorios.
          </p>
          <hr />

          <h3 className="border-b pb-1 mb-2">2. Alcance del Sistema</h3>
          <h4 className="font-semibold mt-2 mb-1">2.1 Contenido y Funcionalidades</h4>
          <ul>
            <li>Usuarios y Auditoría: Autenticación JWT, Roles RBAC, registro de movimientos monetarios.</li>
            <li>Asociados: CRUD de datos personales (nombre, DNI, contacto).</li>
            <li>Préstamos: Cálculo de intereses, digitalización de pagarés.</li>
            <li>Cobranzas: Alertas automáticas de morosidad (&gt;30 días).</li>
            <li>Proveedores: Registro de facturas.</li>
            <li>Reportes: Generación automática en PDF/XLSX (Res. INAES 2362/19).</li>
          </ul>
          <h4 className="font-semibold mt-2 mb-1">2.2 Reglas Automatizadas de Evaluación</h4>
          <ol className="list-decimal ml-4">
            <li>Ingreso de solicitud</li>
            <li>Verificación de morosidad (≤30 días)</li>
            <li>Revisión de cuotas impagas</li>
            <li>Aprobación/Rechazo</li>
          </ol>
          <hr />

          <h3 className="border-b pb-1 mb-2">3. Obligaciones del Usuario</h3>
          <ul>
            <li>Utilizar el sistema solo para tareas administrativas asignadas.</li>
            <li>Mantener credenciales en secreto.</li>
            <li>Notificar accesos no autorizados a <a href="mailto:notificaciones17dejunio@gmail.com" className="text-blue-600">notificaciones17dejunio@gmail.com</a> (asunto: “ACCESO NO AUTORIZADO”).</li>
            <li>No copiar, modificar o distribuir datos sensibles (Art. 9 Ley 25.326).</li>
          </ul>
          <hr />

          <h3 className="border-b pb-1 mb-2">4. Protección de Datos Personales</h3>
          <h4 className="font-semibold mt-2 mb-1">4.1 Principios de Tratamiento</h4>
          <table className="table-auto w-full text-left mb-4">
            <thead>
              <tr>
                <th className="font-semibold">Tipo de Dato</th>
                <th className="font-semibold">Finalidad</th>
                <th className="font-semibold">Base Legal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Datos personales (nombre, DNI)</td>
                <td>Gestión de asociados</td>
                <td>Consentimiento</td>
              </tr>
              <tr>
                <td>Datos financieros (ingresos, morosidad)</td>
                <td>Evaluación de préstamos</td>
                <td>Art. 5 Ley 25.326</td>
              </tr>
            </tbody>
          </table>
          <h4 className="font-semibold mt-2 mb-1">4.2 Medidas de Seguridad</h4>
          <ul>
            <li>Cifrado TLS 1.3 (en tránsito) y AES-256 (en reposo).</li>
            <li>Auditorías trimestrales.</li>
            <li>Acceso restringido por roles (RBAC).</li>
          </ul>
          <hr />

          <h3 className="border-b pb-1 mb-2">5. Transparencia Algorítmica</h3>
          <h4 className="font-semibold mt-2 mb-1">5.1 Criterios Automatizados</h4>
          <ul>
            <li>Rechazo inmediato si: Morosidad &gt; 30 días.</li>
            <li>≥1 cuota impaga en préstamos vigentes.</li>
            <li>Límites de montos definidos por administrador (no automatizados).</li>
          </ul>
          <h4 className="font-semibold mt-2 mb-1">5.2 Derechos del Titular</h4>
          <ul>
            <li>Solicitar explicación de decisiones en <a href="mailto:notificaciones17dejunio@gmail.com" className="text-blue-600">notificaciones17dejunio@gmail.com</a> (asunto: “EXPLICABILIDAD”).</li>
            <li>Revisión humana obligatoria en 72h hábiles para rechazos automatizados.</li>
          </ul>
          <hr />

          <h3 className="border-b pb-1 mb-2">6. Consentimiento Digital</h3>
          <ul>
            <li>Libre: Sin coerción.</li>
            <li>Específico: Solo para gestión mutualista.</li>
            <li>Informado: Mediante esta política.</li>
            <li>Inequívoco: Mediante acción afirmativa en primer acceso.</li>
          </ul>
          <hr />

          <h3 className="border-b pb-1 mb-2">7. Propiedad Intelectual</h3>
          <p>
            Todo código (React, C#, SQL), documentación y diseños son propiedad exclusiva de la Mutual 17 de Junio. Queda prohibida su reproducción sin autorización escrita.
          </p>
          <hr />

          <h3 className="border-b pb-1 mb-2">8. Responsabilidad</h3>
          <h4 className="font-semibold mt-2 mb-1">8.1 Exclusiones</h4>
          <ul>
            <li>La Mutual no asume responsabilidad por:</li>
            <li>Uso indebido por negligencia del usuario.</li>
            <li>Fallas en servicios externos (ej: cortes de energía).</li>
            <li>Daños por acceso no autorizado sin 2FA activado.</li>
          </ul>
          <h4 className="font-semibold mt-2 mb-1">8.2 Auditoría y Cumplimiento</h4>
          <ul>
            <li>Registro de logs para trazabilidad de operaciones (módulo de auditoría).</li>
            <li>Sanciones por incumplimiento: Desde suspensión hasta acciones legales (Ley 26.388).</li>
          </ul>
          <hr />

          <h3 className="border-b pb-1 mb-2">9. Modificaciones</h3>
          <ul>
            <li>Correo electrónico institucional.</li>
            <li>Banner destacado en el sistema.</li>
          </ul>
          <p>
            Requerirá re-aceptación si afecta derechos fundamentales.
          </p>
          <hr />

          <h3 className="border-b pb-1 mb-2">10. Jurisdicción</h3>
          <p>
            Este acuerdo se rige por las leyes argentinas. Los conflictos se resolverán en tribunales de CABA, renunciando a cualquier otra jurisdicción.
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-600 rounded-full hover:text-white bg-gray-700 hover:bg-gray-800"
          >
            Cerrar
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;