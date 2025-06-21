import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { initialLoans } from "./listLoans";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const mockAssociate = {
  email: "juan.perez@ejemplo.com",
  telefono: "1155551234",
  direccion: "Calle Falsa 123, Ciudad, Provincia, Código Postal",
};

const mockLoanDetails = {
  tipo: "Ayudas Economicas",
  frecuencia: "Mensual",
};

const ReadLoan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loan, setLoan] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const found = initialLoans.find((l: any) => l.id === Number(id));
    setLoan(found || null);
  }, [id]);

  if (!loan) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Sidebar />
        <Header hasNotifications={true} />
        <div className="flex flex-col items-center py-8 flex-1">
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
            <div className="text-center text-red-500 py-8">
              Préstamo no encontrado
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate("/prestamos")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-xl">
          <div className="flex justify-start mb-6">
            <button
              onClick={() => navigate("/prestamos")}
              className="text-gray-600 hover:text-gray-800 flex items-center"
              aria-label="Volver a Préstamos"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="ml-1">Volver</span>
            </button>
          </div>

          {/* formulario detalle prestamo */}
          <div className="w-full max-w-2xl">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
              Detalle de Préstamo
            </h2>
          </div>
          <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
            {/* Estado e id*/}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">ID del Préstamo:</span>
                <span className="font-mono font-semibold text-gray-800">
                  #{loan.id.toString().padStart(5, "0")}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Estado:</span>
                <span
                  className={`font-semibold px-3 py-1 rounded-full text-xs ${
                    loan.status === "Aprobado"
                      ? "bg-green-100 text-green-800"
                      : loan.status === "Pendiente"
                      ? "bg-yellow-100 text-yellow-800"
                      : loan.status === "Rechazado"
                      ? "bg-red-100 text-red-800"
                      : loan.status === "Vigente"
                      ? "bg-blue-100 text-blue-800"
                      : loan.status === "Finalizado"
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {loan.status}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500">Monto Original:</span>
                <span className="font-semibold text-gray-800">
                  $
                  {loan.amount.toLocaleString("es-AR", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Cuotas:</span>
                <span className="font-semibold text-gray-800">
                  {loan.installments
                    ? `${loan.installments.current} de ${loan.installments.total}`
                    : "-"}
                </span>
              </div>
            </div>
            <hr className="my-6" />

            {/* Datos del asociado */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2 text-sm">
                Información del Asociado
              </h3>
              <div className="mb-1">
                <span className="text-sm font-semibold text-gray-500">
                  Nombre Completo:
                </span>{" "}
                <span className="text-gray-800">{loan.associateLegalName}</span>
              </div>
              <div className="mb-1">
                <span className="text-sm font-semibold text-gray-500">DNI:</span>{" "}
                <span className="text-gray-800">{loan.associateDni}</span>
              </div>
              <div className="mb-1">
                <span className="text-sm font-semibold text-gray-500">Email:</span>{" "}
                <span className="text-gray-800">{mockAssociate.email}</span>
              </div>
              <div className="mb-1">
                <span className="text-sm font-semibold text-gray-500">Teléfono:</span>{" "}
                <span className="text-gray-800">{mockAssociate.telefono}</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-500">Dirección:</span>{" "}
                <span className="text-gray-800">{mockAssociate.direccion}</span>
              </div>
            </div>
            <hr className="my-6" />

            {/* Detalles del prstamo */}
            <div>
              <h3 className="font-bold text-gray-700 mb-2 text-sm">
                Detalles del Préstamo
              </h3>
              <div className="mb-1">
                <span className="text-sm font-semibold text-gray-500">
                  Tipo de Préstamo:
                </span>{" "}
                <span className="text-gray-800">{mockLoanDetails.tipo}</span>
              </div>
              <div className="mb-1">
                <span className="text-sm font-semibold text-gray-500">
                  Fecha de Solicitud:
                </span>{" "}
                <span className="text-gray-800">
                  {new Date(loan.loanDate).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-1">
                <span className="text-sm font-semibold text-gray-500">
                  Fecha de Vencimiento Final:
                </span>{" "}
                <span className="text-gray-800">
                  {new Date(loan.dueDate).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-1">
                <span className="text-sm font-semibold text-gray-500">
                  Tasa de Interés:
                </span>{" "}
                <span className="text-gray-800">{loan.interestRate}% Anual</span>
              </div>
              <div className="mb-1">
                <span className="text-sm font-semibold text-gray-500">
                  Monto por Cuota:
                </span>{" "}
                <span className="text-gray-800">
                  $
                  {loan.installments && loan.installments.total > 0
                    ? (loan.amount / loan.installments.total).toLocaleString(
                        "es-AR",
                        { minimumFractionDigits: 2 }
                      )
                    : "-"}
                </span>
              </div>
              <div className="mb-1">
                <span className="text-sm font-semibold text-gray-500">
                  Frecuencia de Pago:
                </span>{" "}
                <span className="text-gray-800">{mockLoanDetails.frecuencia}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadLoan;
