import React, { useState } from 'react';
import { IAccountingPeriod, PeriodType } from '../../../../types/accountablePeriods/IAccountingPeriod';

interface GenerateReportFormProps {
  closedPeriods: IAccountingPeriod[]; // Lista de períodos contables cerrados
  onGenerateReport: (selectedPeriodId: number | null, reportType: string) => void;
}

const GenerateReportForm: React.FC<GenerateReportFormProps> = ({
  closedPeriods,
  onGenerateReport,
}) => {
  const [selectedPeriodId, setSelectedPeriodId] = useState<number | null>(null);
  const [selectedReportType, setSelectedReportType] = useState<string>('');
  const [message, setMessage] = useState<{ type: 'error' | 'info', text: string } | null>(null);

  const availableReportTypes: PeriodType[] = ["Mensual", "Trimestral"];

  const reportTypeOptions = [
    { value: '', label: 'Seleccione Tipo de Reporte' },
    ...availableReportTypes.map(type => ({
      value: type.toLowerCase(),
      label: type
    }))
  ];

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPeriodId(Number(e.target.value) || null);
    setMessage(null);
  };

  const handleReportTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedReportType(e.target.value);
    setMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!selectedPeriodId) {
      setMessage({ type: 'error', text: 'Por favor, seleccione un período contable.' });
      return;
    }
    if (!selectedReportType) {
      setMessage({ type: 'error', text: 'Por favor, seleccione un tipo de reporte.' });
      return;
    }

    onGenerateReport(selectedPeriodId, selectedReportType);
    // Opcional: Resetear los campos después de generar el reporte
    // setSelectedPeriodId(null);
    // setSelectedReportType('');
  };

  return (
    <>
    <h2 className="text-2xl font-bold text-blue-900 mt-12 mb-6">Generar Reporte Contable</h2>

    <div className="w-full max-full bg-white rounded-lg shadow p-8">

      {message && (
        <div
          className={`p-3 mb-4 rounded-md ${
            message.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* === CAMBIO CLAVE AQUÍ: CONTENEDOR FLEX PARA DROPDOWNS Y BOTÓN === */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4"> {/* Agregado flex, flex-col para móvil, sm:flex-row para desktop */}

          {/* Dropdown de Períodos Cerrados */}
          <div className="flex-1 min-w-[350px]"> {/* flex-1 para que ocupe espacio, min-w para evitar que se achique demasiado */}
            <label htmlFor="period-select" className="block text-sm font-medium text-gray-700 mb-1">
              Período Contable Cerrado
            </label>
            <select
              id="period-select"
              value={selectedPeriodId || ''}
              onChange={handlePeriodChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Seleccione un Período</option>
              {closedPeriods.length > 0 ? (
                closedPeriods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.code} ({new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()})
                  </option>
                ))
              ) : (
                <option value="" disabled>No hay períodos cerrados disponibles</option>
              )}
            </select>
          </div>

          {/* Dropdown de Tipo de Reporte */}
          <div className="flex-1 min-w-[450px]"> {/* flex-1 para que ocupe espacio */}
            <label htmlFor="report-type-select" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Reporte
            </label>
            <select
              id="report-type-select"
              value={selectedReportType}
              onChange={handleReportTypeChange}
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {reportTypeOptions.map((typeOption) => (
                <option key={typeOption.value} value={typeOption.value}>
                  {typeOption.label}
                </option>
              ))}
            </select>
          </div>

          {/* Botón Generar */}
          {/* El botón ya no necesita el div justify-end, se alineará con flex-end en el contenedor padre */}
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-10 py-2 rounded font-semibold shadow transition" // self-end para alinearlo abajo si los otros crecen
          >
            Generar Reporte
          </button>
        </div> 
      </form>
    </div>
  );
</>
)}


export default GenerateReportForm;