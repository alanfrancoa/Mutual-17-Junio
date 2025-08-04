import React from "react";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { InaesReport } from "../../../../types/reports/IReportInaes";
import { apiMutual } from "../../../../api/apiMutual";

interface ListInaesReportProps {
  reports: InaesReport[];
}

const REPORTS_PER_PAGE = 2;

const ListInaesReport: React.FC<ListInaesReportProps> = ({ reports }) => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(reports.length / REPORTS_PER_PAGE);

  const paginatedReports = reports.slice(
    (currentPage - 1) * REPORTS_PER_PAGE,
    currentPage * REPORTS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleExportPdf = async (id: number, code: string) => {
    try {
      const pdfBlob = await apiMutual.GenerateInaesReportPdf(id);
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Reporte_${code}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Error al descargar el PDF");
    }
  };

  return (
    <div className="flex-1 flex flex-col w-full">
      <div className="overflow-x-auto rounded-lg bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Código
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fecha Emisión
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Descarga
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedReports.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-gray-400">
                  No hay reportes INAES registrados para mostrar.
                </td>
              </tr>
            ) : (
              paginatedReports.map((report, idx) => (
                <tr
                  key={report.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {report.code}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {report.type}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {report.generationDate
                      ? new Date(report.generationDate).toLocaleDateString()
                      : ""}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    <button
                      type="button"
                      onClick={() => handleExportPdf(report.id, report.code)}
                      className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      Exportar PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Controles de paginación */}
        <div className="flex w-full items-center mt-6 gap-2">
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                onClick={handlePrev}
                disabled={currentPage === 1}
                aria-label="Anterior"
              >
                <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
              </button>
              <span className="text-gray-700">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                onClick={handleNext}
                disabled={currentPage === totalPages}
                aria-label="Siguiente"
              >
                <ChevronRightIcon className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
          <div
            className="flex-none flex justify-end"
            style={{ minWidth: "220px" }}
          >
            <span className="text-gray-500 text-sm min-w-max">
              {reports.length} reporte(s) encontrado(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListInaesReport;
