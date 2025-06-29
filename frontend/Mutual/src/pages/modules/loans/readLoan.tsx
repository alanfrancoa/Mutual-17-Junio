import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { apiMutual } from "../../../api/apiMutual";
import useAppToast from "../../../hooks/useAppToast";
import { ILoanDetails, IInstallmentInfo } from "../../../types/loans/ILoan";

const ReadLoan: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showErrorToast } = useAppToast();
  const [loan, setLoan] = useState<ILoanDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchLoanDetails();
    }
  }, [id]);

  const fetchLoanDetails = async () => {
    if (!id) {
      setError("ID de préstamo no proporcionado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const loanId = parseInt(id);
      if (isNaN(loanId)) {
        setError("ID de préstamo inválido.");
        setLoading(false);
        return;
      }

      // Obtener detalles principales del préstamo
      const loanData = await apiMutual.GetLoanById(loanId);
      setLoan(loanData);
    } catch (err: any) {
      console.error("Error fetching loan details:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Error al cargar los detalles del préstamo.";
      setError(errorMessage);
      showErrorToast({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColorClass = (status: ILoanDetails["status"]) => {
    switch (status) {
      case "Aprobado":
        return "bg-green-100 text-green-800";
      case "Pendiente":
        return "bg-yellow-100 text-yellow-800";
      case "Rechazado":
        return "bg-red-100 text-red-800";
      case "Finalizado":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Sidebar />
        <Header hasNotifications={true} />
        <div className="flex-1 flex flex-col items-center justify-center">
          {" "}
          
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Cargando detalles del préstamo...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Sidebar />
        <Header hasNotifications={true} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/prestamos")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              Volver a la lista de préstamos
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!loan) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Sidebar />
        <Header hasNotifications={true} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8 text-center text-red-500">
            Préstamo no encontrado
            <div className="flex justify-center pt-4">
              {" "}
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

  
  const installmentsToDisplay = loan.installments;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} />

        <main className="flex-1 p-6 bg-gray-100">
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

          <h1 className="text-2xl font-bold text-blue-900 mb-6">
            Detalle de Préstamo
          </h1>

          <div className="w-full bg-white rounded-lg shadow p-8">
            {/* Estado e ID */}
            <div className="mb-6 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500 block">
                    ID del Préstamo:
                  </span>
                  <span className="font-mono font-semibold text-gray-800 text-lg">
                    #{loan.id.toString().padStart(5, "0")}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Estado:</span>
                  <span
                    className={`font-semibold px-3 py-1 rounded-full text-sm ${getStatusColorClass(
                      loan.status
                    )}`}
                  >
                    {loan.status}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">
                    Monto Original:
                  </span>
                  <span className="font-semibold text-gray-800 text-lg">
                    {formatCurrency(loan.originalAmount)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">
                    Plazo (Meses):
                  </span>
                  <span className="font-semibold text-gray-800 text-lg">
                    {loan.termMonths} meses
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block">
                    Tasa de Interés:
                  </span>
                  <span className="text-lg text-gray-900">
                    {loan.interestRate}%
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500 block">
                    Fecha de Solicitud:
                  </span>
                  <span className="text-lg text-gray-900">
                    {new Date(loan.applicationDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Datos del asociado */}
            <div className="mb-6 border-b pb-4">
              <h3 className="font-bold text-gray-700 mb-2 text-base">
                Información del Asociado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-semibold text-gray-500 block">
                    Nombre Completo:
                  </span>{" "}
                  <span className="text-gray-800 text-lg">
                    {loan.associateName}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500 block">
                    DNI:
                  </span>{" "}
                  <span className="text-gray-800 text-lg">
                    {loan.associateDni}
                  </span>
                </div>
              </div>
            </div>

            {/* Detalles del préstamo */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2 text-base">
                Tipo de Préstamo
              </h3>
              <div>
                <span className="text-sm font-semibold text-gray-500 block">
                  Tipo de Préstamo:
                </span>{" "}
                <span className="text-gray-800 text-lg">{loan.loanType}</span>
              </div>
            </div>

            {/* Tabla de cuotas*/}
            {(loan.status === "Aprobado" || loan.status === "Finalizado") &&
              installmentsToDisplay.length > 0 && (
                <div className="mt-6 border-t pt-6">
                  <h3 className="font-bold text-gray-700 mb-4 text-base">
                    Cuotas del Préstamo
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Nro. Cuota
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Fecha Vencimiento
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Monto
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {installmentsToDisplay.map(
                          (installment: IInstallmentInfo) => (
                            <tr key={installment.installmentNumber}>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                {installment.installmentNumber}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                {new Date(
                                  installment.dueDate
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                {formatCurrency(installment.amount)}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    installment.collected === "Pagado"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {installment.collected}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
            {/* Mensajes si no hay cuotas o no aplican */}
            {(loan.status === "Aprobado" || loan.status === "Finalizado") &&
              installmentsToDisplay.length === 0 && (
                <div className="mt-6 border-t pt-6">
                  <p className="text-gray-500">
                    Este préstamo está {loan.status.toLowerCase()}, pero no
                    tiene cuotas registradas.
                  </p>
                </div>
              )}
            {loan.status !== "Aprobado" && loan.status !== "Finalizado" && (
              <div className="mt-6 border-t pt-6">
                <p className="text-gray-500">
                  Las cuotas solo son visibles para préstamos aprobados o
                  finalizados.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReadLoan;
