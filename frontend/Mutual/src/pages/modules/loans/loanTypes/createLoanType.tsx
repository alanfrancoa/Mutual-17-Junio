import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../dashboard/components/Header";
import Sidebar from "../../../dashboard/components/Sidebar";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const CreateLoan: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombreTipoPrestamo: "",
    tasaInteres: "",
    montoMaximo: "",
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

    if (!form.nombreTipoPrestamo.trim()) {
      setMessage({
        type: "error",
        text: "El nombre del prestamo es obligatorio.",
      });
      return;
    }
    if (!form.tasaInteres.trim()) {
      setMessage({
        type: "error",
        text: "La tasa de interes es obligatoria.",
      });
      return;
    }
    if (!form.montoMaximo.trim()) {
      setMessage({
        type: "error",
        text: "El monto maximo es obligatorio.",
      });
      return;
    }
    if (
      !form.montoMaximo.trim() ||
      isNaN(Number(form.montoMaximo)) ||
      Number(form.montoMaximo) <= 0
    ) {
      setMessage({
        type: "error",
        text: "El monto Maximo debe ser un número positivo.",
      });
      return;
    }
    if (
      !form.tasaInteres.trim() ||
      isNaN(Number(form.tasaInteres)) ||
      Number(form.tasaInteres) <= 0
    ) {
      setMessage({
        type: "error",
        text: "La tasa de interes debe ser un número positivo.",
      });
      return;
    }

    // Aquí iría la lógica para guardar el préstamo
    setMessage({ type: "success", text: "¡Préstamo creado con éxito!" });
    setForm({
      nombreTipoPrestamo: "",
      tasaInteres: "",
      montoMaximo: "",
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
                  htmlFor="nombreTipoPrestamo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre del tipo de prestamo
                </label>
                <input
                  type="text"
                  id="nombreTipoPrestamo"
                  name="nombreTipoPrestamo"
                  value={form.nombreTipoPrestamo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ayudas económicas	tasa 20 - 100mil"
                />
              </div>
              <div>
                <label
                  htmlFor="tasaInteres"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tasa de interes (%)
                </label>
                <input
                  type="text"
                  id="tasaInteres"
                  name="tasaInteres"
                  value={form.tasaInteres}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 10"
                />
              </div>
              <div>
                <label
                  htmlFor="montoMaximo"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Monto maximo
                </label>
                <input
                  type="text"
                  id="montoMaximo"
                  name="montoMaximo"
                  value={form.montoMaximo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 100.000"
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
