import React, { useEffect, useState } from "react";

import {
  IAccountingPeriodResponse,
  IErrorResponse,
} from "../../../../types/accountablePeriods/IAccountingPeriodResponse"; // Asegúrate de crear este archivo
import { apiMutual } from "../../../../api/apiMutual";
import {
  IAccountingPeriod,
  PeriodType,
  PeriodStatus,
  ICreateAccountingPeriodDTO,
} from "../../../../types/accountablePeriods/IAccountingPeriod";
import { IAccountingPeriodList } from "../../../../types/accountablePeriods/IAccountingPeriodList";

type PeriodFormType = PeriodType;

interface CreateAccountingPeriodFormProps {
  onSuccess: (newPeriod: IAccountingPeriodList) => void;
  onCancel: () => void;
}

const CreateAccountingPeriodForm: React.FC<CreateAccountingPeriodFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [form, setForm] = useState<{
    periodType: PeriodType; 
    code: string;
    startDate: string; 
    endDate: string;
  }>({
    code: "",
    periodType: "Mensual",
    startDate: "",
    endDate: "",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);

  // Función para calcular fechas  inicio y fin
  const calculateDates = (periodType: PeriodType) => {
    const today = new Date();
    
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    let endDate: Date;

    if (periodType === "Trimestral") {
      endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);
    } else {
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }
    const formatToISOString = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    return {
      startDate: formatToISOString(startDate),
      endDate: formatToISOString(endDate),
    };
  };

  useEffect(() => {
    const { startDate, endDate } = calculateDates(form.periodType);
    setForm((prevForm) => ({
      ...prevForm,
      startDate,
      endDate,
    }));
  }, [form.periodType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "periodType") {
      const selectedType = value as PeriodFormType;
      const { startDate, endDate } = calculateDates(selectedType);
      setForm((prevForm) => ({
        ...prevForm,
        [name]: selectedType,
        startDate,
        endDate,
      }));
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    // Validaciones de FE antes de la llamada a la API

    if (!form.code.trim()) {
      setMessage({
        type: "error",
        text: "El Código del Período es obligatorio.",
      });
      setLoading(false);
      return;
    }
    if (!form.periodType) {
      setMessage({
        type: "error",
        text: "El Tipo de Período es obligatorio.",
      });
      setLoading(false);
      return;
    }

    try {
     
      const response: IAccountingPeriodResponse =
        await apiMutual.CreateAccountingPeriod(form.code, form.periodType);

      setMessage({
        type: "success",
        text: response.message,
      });

      onSuccess({
        id: 0,
        code: form.code,
        startDate: form.startDate, 
        endDate: form.endDate, 
        periodType: form.periodType,
        status: "Abierto",
      });

      const { startDate: newStartDate, endDate: newEndDate } =
        calculateDates("Mensual");

      setForm({
        code: "",
        periodType: "Mensual",
        startDate: newStartDate,
        endDate: newEndDate,
      });
    } catch (error: any) {
      let errorMessage =
        "Error al crear el período contable. Intente nuevamente.";
        console.error("Error de API:", error)

      if (error.response) {
        const status = error.response.status;
        const data: IErrorResponse = error.response.data;

        switch (status) {
          case 400: 
            if (data && typeof data === "string") {
              errorMessage = data; 
            } else if (data && data.errors) {
             
              const validationErrors = Object.values(data.errors)
                .flat()
                .join(". ");
              errorMessage = `Errores de validación: ${validationErrors}`;
            } else if (data && data.message) {
              errorMessage = data.message;
            }
            break;
          case 401: 
            errorMessage =
              data?.message ||
              "No autorizado. Por favor, inicie sesión nuevamente.";
            break;
          case 409: 
            errorMessage =
              data?.message || "El código de período contable ya existe."; // Mensaje genérico para 409 si no hay 'message'
            break;
          case 500:
            errorMessage =
              data?.message ||
              "Error interno del servidor. Por favor, contacte a soporte.";
            console.error(
              "Detalles del error 500 del backend:",
              data?.errorDetails,
              data?.innerExceptionDetails
            );
            break;
          default:
            errorMessage = data?.message || `Error del servidor: ${status}`;
            break;
        }
      } else if (error.request) {
        errorMessage =
          "No se pudo conectar con el servidor. Verifique su conexión a internet.";
      } else {
        errorMessage = error.message || "Ocurrió un error inesperado.";
      }

      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
      {message && (
        <div
          className={`p-3 mb-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
          role="alert"
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="code"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Código del Período
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={form.code}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="Ej: 2025"
            min="1"
          />
        </div>

        <div>
          <label
            htmlFor="periodType"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de Período
          </label>
          <select
            id="periodType"
            name="periodType"
            value={form.periodType}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Mensual">Mensual</option>
            <option value="Trimestral">Trimestral</option>
          </select>
        </div>
        <div>
          <label
            htmlFor="startDateDisplay"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fecha de Inicio (Automático)
          </label>
          <input
            type="text"
            id="startDateDisplay"
            value={new Date(form.startDate).toLocaleDateString("es-AR")}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            readOnly
          />
        </div>

        <div>
          <label
            htmlFor="endDateDisplay"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Fecha de Fin (Automático)
          </label>
          <input
            type="text"
            id="endDateDisplay"
            value={new Date(form.endDate).toLocaleDateString("es-AR")}
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            readOnly
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
          >
            {loading ? "Creando..." : "Crear Período"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountingPeriodForm;
