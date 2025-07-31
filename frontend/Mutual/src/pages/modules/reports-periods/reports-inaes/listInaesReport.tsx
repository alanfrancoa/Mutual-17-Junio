import React from "react";
import { DocumentTextIcon } from "@heroicons/react/24/solid";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

// Ejemplo de datos de reportes INAES
const inaesReports = [
  {
    id: 1,
    periodCode: "2024-01",
    periodType: "Mensual",
    startDate: "2024-01-01",
    endDate: "2024-01-31",
    loansApproved: 8,
    totalCollected: "$25,000.00",
    delinquency: "3.1%",
    paymentsToSuppliers: "$9,500.00",
  },
  {
    id: 2,
    periodCode: "2024-T1",
    periodType: "Trimestral",
    startDate: "2024-01-01",
    endDate: "2024-03-31",
    loansApproved: 12,
    totalCollected: "$42,300.50",
    delinquency: "5.2%",
    paymentsToSuppliers: "$18,200.00",
  },
  {
    id: 3,
    periodCode: "2024-02",
    periodType: "Mensual",
    startDate: "2024-02-01",
    endDate: "2024-02-28",
    loansApproved: 10,
    totalCollected: "$28,000.00",
    delinquency: "2.8%",
    paymentsToSuppliers: "$10,000.00",
  },
  {
    id: 4,
    periodCode: "2024-T2",
    periodType: "Trimestral",
    startDate: "2024-04-01",
    endDate: "2024-06-30",
    loansApproved: 15,
    totalCollected: "$50,000.00",
    delinquency: "4.0%",
    paymentsToSuppliers: "$20,000.00",
  },
  {
    id: 5,
    periodCode: "2024-03",
    periodType: "Mensual",
    startDate: "2024-03-01",
    endDate: "2024-03-31",
    loansApproved: 9,
    totalCollected: "$26,500.00",
    delinquency: "3.5%",
    paymentsToSuppliers: "$9,800.00",
  },
  {
    id: 6,
    periodCode: "2024-T3",
    periodType: "Trimestral",
    startDate: "2024-07-01",
    endDate: "2024-09-30",
    loansApproved: 13,
    totalCollected: "$45,000.00",
    delinquency: "4.5%",
    paymentsToSuppliers: "$17,500.00",
  },
];

const REPORTS_PER_PAGE = 3;

const ListInaesReport: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(inaesReports.length / REPORTS_PER_PAGE);

  const paginatedReports = inaesReports.slice(
    (currentPage - 1) * REPORTS_PER_PAGE,
    currentPage * REPORTS_PER_PAGE
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
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
                Fecha Inicio
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fecha Fin
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
                    {report.periodCode}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {report.periodType}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(report.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(report.endDate).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    <button
                      type="button"
                      // onClick={""}
                      // disabled={""}
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
          <div className="flex-none flex justify-end" style={{ minWidth: "220px" }}>
            <span className="text-gray-500 text-sm min-w-max">
              {inaesReports.length} reporte(s) encontrado(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListInaesReport;
