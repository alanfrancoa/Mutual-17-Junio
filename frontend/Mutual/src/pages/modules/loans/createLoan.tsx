import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const CreateLoan: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreAsociado: "",
    tipoPrestamo: "",
    fechaSolicitud: "",
    montoTotal: "",
    plazoMeses: "",
    periodoContable: "",
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!form.nombreAsociado.trim()) {
      setMessage({
        type: "error",
        text: "El nombre de asociado es obligatorio.",
      });
      return;
    }
    if (!form.tipoPrestamo.trim()) {
      setMessage({
        type: "error",
        text: "El tipo de préstamo es obligatorio.",
      });
      return;
    }
    if (!form.fechaSolicitud.trim()) {
      setMessage({
        type: "error",
        text: "La fecha de solicitud es obligatoria.",
      });
      return;
    }
    if (
      !form.montoTotal.trim() ||
      isNaN(Number(form.montoTotal)) ||
      Number(form.montoTotal) <= 0
    ) {
      setMessage({
        type: "error",
        text: "El monto total debe ser un número positivo.",
      });
      return;
    }
    if (
      !form.plazoMeses.trim() ||
      isNaN(Number(form.plazoMeses)) ||
      Number(form.plazoMeses) <= 0
    ) {
      setMessage({
        type: "error",
        text: "El plazo en meses debe ser un número positivo.",
      });
      return;
    }
    if (!form.periodoContable.trim()) {
      setMessage({
        type: "error",
        text: "El período contable es obligatorio.",
      });
      return;
    }

    // Aquí iría la lógica para guardar el préstamo
    setMessage({ type: "success", text: "¡Préstamo creado con éxito!" });
    setForm({
      nombreAsociado: "",
      tipoPrestamo: "",
      fechaSolicitud: "",
      montoTotal: "",
      plazoMeses: "",
      periodoContable: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} />
        <div className="flex flex-col items-center py-8 flex-1">
          <div className="w-full max-w-xl">
            <div className="flex justify-start mb-6">
              <button
                onClick={() => navigate("/prestamos")}
                className="text-gray-600 hover:text-gray-800 flex items-center"
                aria-label="Volver a Préstamos"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="ml-1">Volver</span>
              </button>
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6">
              Crear Préstamo
            </h2>
          </div>
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
                  htmlFor="nombreAsociado"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre de Asociado
                </label>
                <input
                  type="text"
                  id="nombreAsociado"
                  name="nombreAsociado"
                  value={form.nombreAsociado}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Juan Pérez"
                />
              </div>
              <div>
                <label
                  htmlFor="tipoPrestamo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Préstamo
                </label>
                <select
                  id="tipoPrestamo"
                  name="tipoPrestamo"
                  value={form.tipoPrestamo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  
                  <option value="Ayudas economicas">Ayudas económicas</option>
                  <option value="Electrodomesticos">Electrodomésticos</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="fechaSolicitud"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fecha de Solicitud
                </label>
                <input
                  type="date"
                  id="fechaSolicitud"
                  name="fechaSolicitud"
                  value={form.fechaSolicitud}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="montoTotal"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Monto Total
                </label>
                <input
                  type="number"
                  id="montoTotal"
                  name="montoTotal"
                  value={form.montoTotal}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 10000"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label
                  htmlFor="plazoMeses"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Plazo de Meses (Cuotas)
                </label>
                <input
                  type="number"
                  id="plazoMeses"
                  name="plazoMeses"
                  value={form.plazoMeses}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 12"
                  min="1"
                  step="1"
                />
              </div>
              <div>
                <label
                  htmlFor="periodoContable"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Período Contable
                </label>
                <input
                  type="text"
                  id="periodoContable"
                  name="periodoContable"
                  value={form.periodoContable}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 2024"
                />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/prestamos")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateLoan;
