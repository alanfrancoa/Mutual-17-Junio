import React, { useEffect, useState } from "react";
import { IAccountingPeriodList } from "../../../../types/accountablePeriods/IAccountingPeriodList";
import ListInaesReport from "./listInaesReport";
import { apiMutual } from "../../../../api/apiMutual";
import useAppToast from "../../../../hooks/useAppToast";

interface RegisterReportProps {
  closedPeriods: IAccountingPeriodList[];
}

const RegisterReport: React.FC<RegisterReportProps> = ({ closedPeriods }) => {
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: "error" | "info";
    text: string;
  } | null>(null);
  const [inaesReports, setInaesReports] = useState<any[]>([]);
  const { showSuccessToast, showErrorToast, showWarningToast } = useAppToast();

  // Solo cerrados
  const closedFiltered = closedPeriods.filter((p) => p.status === "Cerrado");

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriodId(Number(e.target.value) || null);
    setMessage(null);
  };

// Busca si existen reportes inaes en la lista y manda toast
useEffect(() => {
  const fetchReports = async () => {
    try {
      const reports = await apiMutual.GetInaesReports();
      const reportsList = Array.isArray(reports) ? reports : [];
      setInaesReports(reportsList);
      
      if (reportsList.length > 0) {
        showSuccessToast({
          title: "Reportes INAES",
          message: `Se encontraron ${reportsList.length} reporte(s) INAES.`,
        });
      }
    } catch (error: any) {
      showErrorToast({
        title: "Error al cargar reportes",
        message: "No se pudieron cargar los reportes INAES. Por favor, intente nuevamente.",
      });
    }
  };
  fetchReports();
}, []); 


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPeriodId) {
      showWarningToast({
        title: "Selección requerida",
        message: "Por favor, seleccione un período contable.",
      });
      return;
    }

    try {
      await apiMutual.RegisterInaesReport(selectedPeriodId);
      showSuccessToast({
        title: "Reporte registrado",
        message: "Reporte de INAES registrado exitosamente",
      });

      // actualizar lista de reportes
      const reports = await apiMutual.GetInaesReports();
      setInaesReports(Array.isArray(reports) ? reports : []);
    } catch (error: any) {
      // Manejar diferentes tipos de errores seguin status code
      if (error.response) {
        switch (error.response.status) {
          case 400:
            showErrorToast({
              title: "Error de validación",
              message:
                error.response.data?.message ||
                "El período contable no es válido o no se encuentra cerrado.",
            });
            break;
          case 401:
            showErrorToast({
              title: "Error de autorización",
              message: "No tiene permisos para realizar esta acción.",
            });
            break;
          case 404:
            showErrorToast({
              title: "No encontrado",
              message: "Periodo contable no encontrado.",
            });
            break;
          case 409:
            showWarningToast({
              title: "Reporte duplicado",
              message:
                error.response.data?.message ||
                "El reporte ya existe para este período.",
            });
            break;
          case 500:
            showErrorToast({
              title: "Error del servidor",
              message:
                error.response.data?.message ||
                "Ocurrió un error al intentar registrar el reporte de INAES.",
            });
            break;
          default:
            showErrorToast({
              title: "Error",
              message:
                error.response.data?.message ||
                "Error al registrar el reporte.",
            });
        }
      } else {
        showErrorToast({
          title: "Error de conexión",
          message:
            "No se pudo conectar con el servidor. Por favor, verifique su conexión.",
        });
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-blue-900 mt-12 mb-6">
        Reportes INAES
      </h2>
      <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
        {message && (
          <div
            className={`p-3 mb-4 rounded-md ${
              message.type === "error"
                ? "bg-red-100 text-red-800"
                : "bg-blue-100 text-blue-800"
            }`}
            role="alert"
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-start gap-4">
            {/*  Dropdown  Periodos Cerrados */}
            <div className="flex-1 w-full sm:max-w-xs md:max-w-sm lg:max-w-md">
              <label
                htmlFor="period-select"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Período Contable Cerrado
              </label>
              <select
                id="period-select"
                value={selectedPeriodId || ""}
                onChange={handlePeriodChange}
                className="w-full text-base border border-gray-300 rounded px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccione un Período</option>
                {closedFiltered.length > 0 ? (
                  closedFiltered.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.code} (
                      {new Date(period.startDate).toLocaleDateString()} -{" "}
                      {new Date(period.endDate).toLocaleDateString()})
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No hay períodos cerrados disponibles
                  </option>
                )}
              </select>
            </div>

            {/* Btn Generar Reporte */}
            <div className="w-full sm:w-auto mt-4 sm:mt-0">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-14 py-3 rounded-full font-semibold shadow transition"
              >
                Registrar Reporte
              </button>
            </div>
          </div>
        </form>

        {/* Lista de reportes INAES */}
        <div className="mt-8">
          <ListInaesReport
           reports={inaesReports} />
        </div>
      </div>
    </>
  );
};

export default RegisterReport;
