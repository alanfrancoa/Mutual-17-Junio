import React, { useEffect, useState } from "react";
import { IAccountingPeriodList } from "../../../../types/accountablePeriods/IAccountingPeriodList";
import ListInaesReport from "./listInaesReport";
import { apiMutual } from "../../../../api/apiMutual";

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

  // Solo cerrados
  const closedFiltered = closedPeriods.filter((p) => p.status === "Cerrado");

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriodId(Number(e.target.value) || null);
    setMessage(null);
  };

  // Obtener la lista de reportes al montar el componente
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const reports = await apiMutual.GetInaesReports();
        setInaesReports(Array.isArray(reports) ? reports : []);
      } catch {
        setInaesReports([]);
      }
    };
    fetchReports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedPeriodId) {
      setMessage({
        type: "error",
        text: "Por favor, seleccione un período contable.",
      });
      return;
    }

    try {
      await apiMutual.RegisterInaesReport(selectedPeriodId);
      setMessage({
        type: "info",
        text: "Reporte INAES registrado correctamente",
      });
      // actualizar lista de reportes
      const reports = await apiMutual.GetInaesReports();
      setInaesReports(Array.isArray(reports) ? reports : []);
    } catch (error: any) {
      // Para axios o wrappers similares
      if (error.response && error.response.status === 409) {
        setMessage({
          type: "error",
          text:
            error.response.data?.message ||
            error.response.data?.mensaje ||
            "El reporte ya existe para ese período.",
        });
      } else {
        setMessage({
          type: "error",
          text: error.message || "Error al registrar el reporte.",
        });
      }
    }
  };


  return (
    <>
      <h2 className="text-2xl font-bold text-gray-800 mt-12 mb-6">
        Reportes INAES
      </h2>
      <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
        {message && (
          <div
            className={`p-3 mb-4 rounded-md ${message.type === "error"
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
          <ListInaesReport reports={inaesReports} />
        </div>
      </div>
    </>
  );
};

export default RegisterReport;
