import React, { useState } from "react";

import { IAccountingPeriod } from "../../../../types/accountablePeriods/IAccountingPeriod";

type PeriodFormType = "Mensual" | "Trimestral";

interface CreateAccountingPeriodFormProps {
  onSuccess: (newPeriod: IAccountingPeriod) => void;
  onCancel: () => void;
}

const CreateAccountingPeriodForm: React.FC<CreateAccountingPeriodFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [form, setForm] = useState<
    Omit<IAccountingPeriod, "id" | "status" | "type"> & {
      status: string;
      type: PeriodFormType;
    }
  >({
    code: "",
    type: "Mensual",
    startDate: "",
    endDate: "",
    status: "Abierto",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Función para calcular las fechas de inicio y fin
  const calculateDates = (periodType: string) => {
    const today = new Date();
    let startDate = new Date(today.getFullYear(), today.getMonth(), 1); 
    let endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0); 

    if (periodType === "Trimestral") {
      const currentMonth = today.getMonth();
      const quarter = Math.floor(currentMonth / 3); 
      startDate = new Date(today.getFullYear(), quarter * 3, 1);
      endDate = new Date(today.getFullYear(), quarter * 3 + 3, 0);
    } else if (periodType === "Anual") {
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
    }

   
    const formatToISOString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}T00:00:00Z`; 
    };

    return {
      startDate: formatToISOString(startDate),
      endDate: formatToISOString(endDate),
    };
  };

  // Effect para calcular las fechas iniciales 
  React.useEffect(() => {
    const { startDate, endDate } = calculateDates(form.type);
    setForm((prevForm) => ({
      ...prevForm,
      startDate,
      endDate,
    }));
  }, [form.type]); 

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "type") {
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

    const numericCode = parseInt(form.code as string, 10);
    if (isNaN(numericCode) || numericCode <= 0) {
      setMessage({
        type: "error",
        text: "El Código debe ser un número positivo.",
      });
      return;
    }
    if (!form.type) {
      setMessage({ type: "error", text: "El Tipo de Período es obligatorio." });
      return;
    }

    try {
      // Aca va llamada a la API para crear el período contable

      const newPeriod: IAccountingPeriod = {
        ...form,
        code: form.code as string,
        id: Math.floor(Math.random() * 100000) + 1,
        status: form.status as "Abierto" | "Cerrado",
      };

      setMessage({
        type: "success",
        text: "¡Período contable creado con éxito!",
      });
      onSuccess(newPeriod);

      setForm({
        code: "",
        type: "Mensual",
        startDate: calculateDates("Mensual").startDate,
        endDate: calculateDates("Mensual").endDate,
        status: "Abierto",
      });
    } catch (error: any) {
      console.error("Error al crear período contable:", error);
      setMessage({
        type: "error",
        text: "Error al crear el período contable. Intente nuevamente.",
      });
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
            htmlFor="type"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tipo de Período
          </label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {" "}
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
            value={new Date(form.startDate).toLocaleDateString()}
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
            value={new Date(form.endDate).toLocaleDateString()}
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
          >
            Crear Período
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccountingPeriodForm;
