import React from "react";

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const PrivacyModal = ({ isOpen, onClose, onAccept }: PrivacyModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Política de Privacidad</h2>
        <div className="prose prose-sm mb-6">
          <h3 className="border-b pb-1 mb-2">1. Responsable del Tratamiento</h3>
          <ul>
            <li><strong>Nombre:</strong> Mutual 17 de Junio</li>
            <li><strong>CUIT:</strong> 30-65673315-9</li>
            <li><strong>Domicilio:</strong> San Martin 987, CABA</li>
            <li><strong>Email:</strong> <a href="mailto:notificaciones17dejunio@gmail.com" className="text-blue-600">notificaciones17dejunio@gmail.com</a></li>
          </ul>
          <hr />
          <h3 className="border-b pb-1 mb-2">2. Finalidad del Tratamiento</h3>
          <ul>
            <li><strong>Gestión de asociados y contacto:</strong> Consentimiento</li>
            <li><strong>Evaluación de préstamos y control de morosidad:</strong> Obligación legal</li>
            <li><strong>Alertas automatizadas y reportes regulatorios:</strong> Interés legítimo</li>
          </ul>
          <hr />
          <h3 className="border-b pb-1 mb-2">3. Datos Tratados</h3>
          <table className="table-auto w-full text-left mb-4">
            <thead>
              <tr>
                <th className="font-semibold">Tipo</th>
                <th className="font-semibold">Ejemplos</th>
                <th className="font-semibold">Protección</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Identificadores</td>
                <td>Nombre completo, DNI</td>
                <td>Cifrado AES-256</td>
              </tr>
              <tr>
                <td>Contacto</td>
                <td>Teléfono, email</td>
                <td>Acceso con 2FA</td>
              </tr>
              <tr>
                <td>Financieros</td>
                <td>Ingresos, historial crediticio</td>
                <td>Auditorías trimestrales</td>
              </tr>
              <tr>
                <td>Excluidos</td>
                <td>Salud, creencias, biometría</td>
                <td>No recolectados</td>
              </tr>
            </tbody>
          </table>
          <hr />
          <h3 className="border-b pb-1 mb-2">4. Base Legal</h3>
          <ul>
            <li><strong>Consentimiento:</strong> Gestión de asociados</li>
            <li><strong>Obligación legal:</strong> Reportes INAES</li>
            <li><strong>Interés legítimo:</strong> Control de morosidad y prevención de fraudes</li>
          </ul>
          <hr />
          <h3 className="border-b pb-1 mb-2">5. Destinatarios</h3>
          <ul>
            <li><strong>Personal autorizado:</strong> Gestión operativa diaria (RBAC)</li>
            <li><strong>BDO:</strong> Auditorías y reportes (NDA + cifrado PGP)</li>
            <li><strong>INAES:</strong> Recepción de reporte anual</li>
          </ul>
          <hr />
          <h3 className="border-b pb-1 mb-2">6. Plazo de Conservación</h3>
          <ul>
            <li><strong>Datos personales:</strong> 2 años tras baja</li>
            <li><strong>Financieros:</strong> 5 años</li>
            <li><strong>Auditoría:</strong> 10 años</li>
          </ul>
          <hr />
          <h3 className="border-b pb-1 mb-2">7. Derechos del Titular</h3>
          <ul>
            <li>Acceso, rectificación, portabilidad, oposición, supresión</li>
            <li>Solicitudes: <a href="mailto:notificaciones17dejunio@gmail.com" className="text-blue-600">notificaciones17dejunio@gmail.com</a></li>
          </ul>
          <hr />
          <h3 className="border-b pb-1 mb-2">8. Transparencia Algorítmica</h3>
          <ul>
            <li>Rechazo de préstamos por morosidad &gt; 30 días o cuotas impagas</li>
            <li>Derecho a explicación: <a href="mailto:notificaciones17dejunio@gmail.com" className="text-blue-600">notificaciones17dejunio@gmail.com</a></li>
          </ul>
          <hr />
          <h3 className="border-b pb-1 mb-2">9. Seguridad</h3>
          <ul>
            <li>Cifrado TLS 1.3 y AES-256, autenticación con hash y sal, backups semanales</li>
            <li>Auditorías ISO 27001</li>
          </ul>
          <hr />
          <h3 className="border-b pb-1 mb-2">10. Revocación del Consentimiento</h3>
          <p>
            Solicitar por email a <a href="mailto:notificaciones17dejunio@gmail.com" className="text-blue-600">notificaciones17dejunio@gmail.com</a>. Conservación de datos si existen obligaciones legales.
          </p>
          <hr />
          <h3 className="border-b pb-1 mb-2">11. Autoridad de Control</h3>
          <p>
            Agencia de Acceso a la Información Pública (AAIP): <a href="https://www.argentina.gob.ar/aaip" target="_blank" rel="noopener noreferrer" className="text-blue-600">www.argentina.gob.ar/aaip</a>, <a href="mailto:denuncias@aaip.gob.ar" className="text-blue-600">denuncias@aaip.gob.ar</a>
          </p>
          <hr />
          <h3 className="border-b pb-1 mb-2">12. Modificaciones</h3>
          <p>
            Notificación previa por email y banner. Consentimiento renovado si afectan derechos fundamentales.
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-gray-600 rounded-full hover:text-white bg-gray-700 hover:bg-gray-800"
          >
            Cerrar
          </button>

        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;