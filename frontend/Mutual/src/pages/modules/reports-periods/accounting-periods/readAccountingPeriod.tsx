import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../../dashboard/components/Header";
import Sidebar from "../../../dashboard/components/Sidebar";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

import { IAccountingPeriodList } from "../../../../types/accountablePeriods/IAccountingPeriodList";
import { apiMutual } from "../../../../api/apiMutual";
import useAppToast from "../../../../hooks/useAppToast";

const ReadAccountingPeriod: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { showErrorToast } = useAppToast();

  const [period, setPeriod] = useState<IAccountingPeriodList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPeriodDetails = async () => {
    if (!id) {
      setError("ID del período no proporcionado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const periodId = parseInt(id);
      if (isNaN(periodId)) {
        setError("ID del período inválido.");
        setLoading(false);
        return;
      }

      const data = await apiMutual.GetAccountingPeriodById(periodId);
      setPeriod(data);
    } catch (err: any) {
      console.error("Error fetching accounting period details:", err);
      const errorMessage =
        err.message ||
        err.response?.data?.message ||
        "Error al cargar los detalles del período contable.";
      setError(errorMessage);
      showErrorToast({ message: errorMessage });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPeriodDetails();
  }, [id]);

  // Función auxiliar para clases de color del estado
  const getStatusColorClass = (status: string) => {
    if (status === "Abierto") return "bg-green-100 text-green-800";
    if (status === "Cerrado") return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  // Renderizado condicional para estados de carga, error y no encontrado
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Sidebar />
     <Header hasNotifications={true} loans={[]}  />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8 text-center text-gray-500">
            Cargando detalles del período contable...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Sidebar />
     <Header hasNotifications={true} loans={[]}  />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => navigate("/periodos")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
            >
              Volver a la lista de períodos
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!period) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Sidebar />
     <Header hasNotifications={true} loans={[]}  />
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8 text-center text-red-500">
            Período contable no encontrado
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={() => navigate("/periodos")}
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
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
     <Header hasNotifications={true} loans={[]}  />

        <main className="flex-1 p-6 bg-gray-100">
          <div className="flex justify-start mb-6">
            <button
              onClick={() => navigate("/periodos")}
              className="text-gray-600 hover:text-gray-800 flex items-center"
              aria-label="Volver a Períodos Contables"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="ml-1">Volver</span>
            </button>
          </div>

          <h1 className="text-2xl font-bold text-blue-900 mb-6">
            Detalle de Período Contable
          </h1>

          <div className="w-full bg-white rounded-lg shadow p-8">
            {/* Estado e ID */}
            <div className="mb-6 border-b pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500 block">
                    ID del Período:
                  </span>
                  <span className="font-mono font-semibold text-gray-800 text-lg">
                    #{period.id.toString().padStart(5, "0")}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Código:</span>
                  <span className="font-semibold text-gray-800 text-lg">
                    {period.code}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block">Estado:</span>
                  <span
                    className={`font-semibold px-3 py-1 rounded-full text-sm ${getStatusColorClass(period.status)}`}
                  >
                    {period.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Detalles del Período */}
            <div className="mb-6">
              <h3 className="font-bold text-gray-700 mb-2 text-base">
                Información del Período
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-semibold text-gray-500 block">
                    Tipo de Período:
                  </span>{" "}
                  <span className="text-gray-800 text-lg">
                    {period.periodType}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500 block">
                    Fecha de Inicio:
                  </span>{" "}
                  <span className="text-gray-800 text-lg">
                    {new Date(period.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500 block">
                    Fecha de Fin:
                  </span>{" "}
                  <span className="text-gray-800 text-lg">
                    {new Date(period.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReadAccountingPeriod;
