import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

// Opciones prestamos dropdown
const loanTypes = ["Ayudas Economicas 15 tasa 100mil", "Electrodomesticos 5 tasa 50mil"];

const RequestLoan: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    dni: "",
    associateName: "",
    loanType: loanTypes[0],
    amount: "",
    installments: "",
    applicationDate: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const parsedAmount = parseFloat(form.amount);
    const parsedInstallments = parseInt(form.installments, 10);

    // Validaciones por campos

    if (!form.dni.trim()) {
      setMessage({
        type: "error",
        text: "El DNI del asociado es obligatorio.",
      });
      return;
    }
    if (!form.associateName.trim()) {
      setMessage({
        type: "error",
        text: "El nombre del asociado es obligatorio.",
      });
      return;
    }
    if (!form.loanType || !loanTypes.includes(form.loanType)) {
      setMessage({
        type: "error",
        text: "Debe seleccionar un tipo de préstamo válido.",
      });
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage({
        type: "error",
        text: "El monto debe ser un número positivo.",
      });
      return;
    }
    if (isNaN(parsedInstallments) || parsedInstallments <= 0) {
      setMessage({
        type: "error",
        text: "La cantidad de cuotas debe ser un número entero positivo.",
      });
      return;
    }

    try {
      console.log("Datos del nuevo préstamo a enviar:", {
        dni: form.dni,
        associateName: form.associateName,
        loanType: form.loanType,
        amount: parsedAmount,
        installments: parsedInstallments,
      });

      setMessage({ type: "success", text: "¡Préstamo solicitado con éxito!" });

      setForm({
        dni: "",
        associateName: "",
        loanType: loanTypes[0],
        amount: "",
        installments: "",
        applicationDate: "",
      });
    } catch (error) {
      console.error("Error al solicitar préstamo:", error);
      setMessage({
        type: "error",
        text: "Error al solicitar el préstamo. Intente nuevamente.",
      });
    }
  };

  // Formulario de creacion prestamos

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
            <h2 className="text-2xl font-bold text-blue-900 mb-6 ">
              Solicitar Nuevo Préstamo
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
                  htmlFor="dni"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  DNI del Asociado
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: 30123456"
                />
              </div>

              <div>
                <label
                  htmlFor="associateName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre Completo del Asociado
                </label>
                <input
                  type="text"
                  id="associateName"
                  name="associateName"
                  value={form.associateName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              <div>
                {/* aca hay que traer el listado de loan_type */}
                <label
                  htmlFor="loanType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Préstamo
                </label>
                <select
                  id="loanType"
                  name="loanType"
                  value={form.loanType}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {loanTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="applicationDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fecha de Aplicación
                </label>
                <input
                  type="date"
                  id="applicationDate"
                  name="applicationDate"
                  value={form.applicationDate || ""}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Monto del Préstamo
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // <-- CLASES AÑADIDAS AQUÍ
                  placeholder="Ej: 15000.00"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label
                  htmlFor="installments"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cantidad de Cuotas
                </label>
                <input
                  type="number"
                  id="installments"
                  name="installments"
                  value={form.installments}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // <-- También puedes añadirlo aquí si quieres
                  placeholder="Ej: 12"
                  min="1"
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
                  Enviar Solicitud
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestLoan;
