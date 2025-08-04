import React, { useEffect, useState } from "react";

import {
  IAccountingPeriodResponse,
  IErrorResponse,
} from "../../../../types/accountablePeriods/IAccountingPeriodResponse";
import { apiMutual } from "../../../../api/apiMutual";
import { PeriodType } from "../../../../types/accountablePeriods/IAccountingPeriod";
import { IAccountingPeriodList } from "../../../../types/accountablePeriods/IAccountingPeriodList";
import useAppToast from "../../../../hooks/useAppToast";

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
    periodType: PeriodType | "";
    code: string;
    startDate: string;
    endDate: string;
  }>({
    code: "",
    periodType: "",
    startDate: "",
    endDate: "",
  });

  const [, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const { showSuccessToast, showErrorToast, showWarningToast } = useAppToast();

  // Función para calcular fechas  inicio y fin
  const calculateDates = (periodType: PeriodType | "") => {
    const today = new Date();

    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

    let endDate: Date;

    if (periodType === "Trimestral") {
      // Para trimestral, calculamos 3 meses desde el inicio y el último día de ese mes
      const endMonth = startDate.getMonth() + 3;
      const endYear = startDate.getFullYear() + Math.floor(endMonth / 12);
      const adjustedEndMonth = endMonth % 12;
      endDate = new Date(endYear, adjustedEndMonth, 0);
    } else {
      // Para mensual, calculamos el último día del mes actual
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    const format = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;

    return {
      startDate: format(startDate),
      endDate: format(endDate),
    };
  };

  // Utiliza esta función para parsear la fecha correctamente
  function parseLocalDate(dateStr: string) {
    const [year, month, day] = dateStr.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

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
      showWarningToast({
        title: "Campo requerido",
        message: "El Código del Período es obligatorio.",
      });
      setLoading(false);
      return;
    }

    if (!form.code || form.code.length > 10) {
      showWarningToast({
        title: "Campo codigo invalido",
        message: "El Código no puede exceder los 10 caracteres.",
      });
      setLoading(false);
      return;
    }
    if (!form.periodType) {
      showWarningToast({
        title: "Campo requerido",
        message: "El Tipo de Período es obligatorio.",
      });
      setLoading(false);
      return;
    }

    try {
      const response: IAccountingPeriodResponse =
        await apiMutual.CreateAccountingPeriod(form.code, form.periodType);

       if (response && response.message) {
        showSuccessToast({
          title: "Periodo contable creado",
          message: response.message,
          options: {
            duration: 4000, 
          }
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
    }
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        const data: IErrorResponse = error.response.data;

        switch (status) {
          case 400:
            if (data && typeof data === "string") {
              showWarningToast({
                title: "Error de validación",
                message: data,
              });
            } else if (data && data.errors) {
              const validationErrors = Object.values(data.errors)
                .flat()
                .join(". ");
              showWarningToast({
                title: "Error de validación",
                message: `Errores de validación: ${validationErrors}`,
              });
            } else if (data && data.message) {
              showWarningToast({
                title: "Error de validación",
                message: data.message,
              });
            }
            break;
          case 401:
            showErrorToast({
              title: "No autorizado",
              message:
                data?.message ||
                "No autorizado. Por favor, inicie sesión nuevamente.",
            });
            break;
          case 409:
            showWarningToast({
              title: "Período Duplicado",
              message:
                data?.message ||
                `El código de período contable '${form.code}' ya existe.`,
            });
            break;
          case 500:
            showErrorToast({
              title: "Error del servidor",
              message: "Ocurrió un error interno al crear el período contable.",
            });
            console.error(
              "Detalles del error:",
              data?.errorDetails,
              data?.innerExceptionDetails
            );
            break;
          default:
            showErrorToast({
              title: "Error",
              message: data?.message || `Error del servidor: ${status}`,
            });
        }
      } else if (error.request) {
        showErrorToast({
          title: "Error de conexión",
          message:
            "No se pudo conectar con el servidor. Verifique su conexión a internet.",
        });
      } else {
        showErrorToast({
          title: "Error",
          message: error.message || "Ocurrió un error inesperado.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
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
            <option value="">Seleccione una opción</option>
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
            value={
              form.startDate
                ? parseLocalDate(form.startDate).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : ""
            }
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
            value={
              form.endDate
                ? parseLocalDate(form.endDate).toLocaleDateString("es-AR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : ""
            }
            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
            readOnly
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold"
          >
            {loading ? "Creando..." : "Crear Período"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountingPeriodForm;
