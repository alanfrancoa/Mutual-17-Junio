import React, { useState } from "react";
import { DocumentTextIcon, TableCellsIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import { IAccountingPeriodList } from "../../../../types/accountablePeriods/IAccountingPeriodList";

interface GenerateReportFormProps {
  closedPeriods: IAccountingPeriodList[];
}

const fakeReportData = {
  Mensual: {
    loansApproved: 8,
    totalCollected: "$25,000.00",
    delinquency: "3.1%",
    paymentsToSuppliers: "$9,500.00",
  },
  Trimestral: {
    loansApproved: 12,
    totalCollected: "$42,300.50",
    delinquency: "5.2%",
    paymentsToSuppliers: "$18,200.00",
  },
};

const GenerateReportForm: React.FC<GenerateReportFormProps> = ({
  closedPeriods,
}) => {
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [message, setMessage] = useState<{
    type: "error" | "info";
    text: string;
  } | null>(null);
  const [reportResult, setReportResult] = useState<any | null>(null);

  // Solo cerrados
  const closedFiltered = closedPeriods.filter((p) => p.status === "Cerrado");

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriodId(Number(e.target.value) || null);
    setMessage(null);
    setReportResult(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedPeriodId) {
      setMessage({
        type: "error",
        text: "Por favor, seleccione un período contable.",
      });
      return;
    }

    const period = closedFiltered.find((p) => p.id === selectedPeriodId);
    if (!period) return;

    // Generar datos falsos segun el tipo
    const fakeData = fakeReportData[period.periodType as "Mensual" | "Trimestral"];

    setReportResult({
      periodDisplay: `${period.code} (${period.periodType})`,
      ...fakeData,
    });
  };

  // mock aviso exportar a Excel
  const handleExportExcel = () => {
    if (reportResult) {
      toast.loading("Exportando a Excel el reporte...");
    } else {
      alert("Genere un reporte primero para exportar a Excel.");
    }
  };

  // mock aviso exportar a PDF
  const handleExportPdf = () => {
    if (reportResult) {
      toast.loading("Exportando a PDF el reporte...");
    } else {
      alert("Genere un reporte primero para exportar a PDF.");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-blue-900 mt-12 mb-6">
        Generar Reporte Contable
      </h2>
      <div className="w-full max-w-full bg-white rounded-lg shadow p-8">
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
                className="w-full bg-green-600 hover:bg-green-700 text-white px-14 py-3 rounded font-semibold shadow transition"
              >
                Generar Reporte
              </button>
            </div>
          </div>
        </form>

        {reportResult && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-2xl font-bold text-black-900  mb-4 text-center">
              Reporte de Periodos contables
            </h3>
            <hr className="my-4" />
            <div className="flex flex-row justify-end gap-4 mb-4">
              <button
                type="button"
                onClick={handleExportExcel}
                disabled={!reportResult}
                className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <TableCellsIcon className="h-5 w-5 mr-2" />
                Exportar Excel
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                disabled={!reportResult}
                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Exportar PDF
              </button>
            </div>
            <hr className="my-4" />

            {/* resultado del reporte */}
            <div className=" border-gray-100 p-4 mt-8 rounded-lg"> 
                {/* Encabezado  */}
                <div className="border-b border-gray-200 pb-2 mb-2">
                    <strong className="text-gray-800">Período: {reportResult.periodDisplay}</strong>
                </div>

                {/* Filas s */}
                <div className="grid grid-cols-2 text-gray-700 text-base">
                    <div className="col-span-1 py-2 px-2 border-r border-gray-200">
                        <strong>Préstamos aprobados:</strong>
                    </div>
                    <div className="col-span-1 py-2 px-2">
                        {reportResult.loansApproved}
                    </div>

                    <div className="col-span-1 py-2 px-2 border-r border-gray-200 border-t border-gray-200">
                        <strong>Total cobrado:</strong>
                    </div>
                    <div className="col-span-1 py-2 px-2 border-t border-gray-200">
                        {reportResult.totalCollected}
                    </div>

                    <div className="col-span-1 py-2 px-2 border-r border-gray-200 border-t border-gray-200">
                        <strong>Morosidad:</strong>
                    </div>
                    <div className="col-span-1 py-2 px-2 border-t border-gray-200">
                        {reportResult.delinquency}
                    </div>

                    <div className="col-span-1 py-2 px-2 border-r border-gray-200 border-t border-gray-200">
                        <strong>Pagos a proveedores:</strong>
                    </div>
                    <div className="col-span-1 py-2 px-2 border-t border-gray-200">
                        {reportResult.paymentsToSuppliers}
                    </div>
                </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};


export default GenerateReportForm;
