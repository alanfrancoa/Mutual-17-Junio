import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../dashboard/components/Header";
import Sidebar from "../../../dashboard/components/Sidebar";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { apiMutual } from "../../../../api/apiMutual";
import useAppToast from "../../../../hooks/useAppToast";

const loanCodeOptions = [
  { label: "Ayudas Economicas", value: "AYUDAS ECONOMICAS" },
  { label: "Electrodomesticos", value: "ELECTRODOMESTICOS" },
];

const CreateLoan: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useAppToast();

  const [form, setForm] = useState({
    code: "",
    name: "",
    interestRate: 0,
    maxAmount: 0,
  });

  const [loading, setLoading] = useState<boolean>(false);
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
    setLoading(true);
    setMessage(null);

    if (!form.code.trim()) {
      showErrorToast({
        title: "Error",
        message: "El código del préstamo es obligatorio.",
      });
      setLoading(false);
      return;
    }

    if (!form.name.trim()) {
      showErrorToast({
        title: "Error",
        message: "El nombre del préstamo es obligatorio.",
      });
      setLoading(false);
      return;
    }
    if (!/[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]/.test(form.name)) {
      showErrorToast({
        title: "Error",
        message: "El nombre del préstamo debe contener letras.",
      });
      setLoading(false);
      return;
    }

    if (!form.name.trim()) {
      showErrorToast({
        title: "Error",
        message: "El nombre del préstamo es obligatorio.",
      });
      setLoading(false);

      return;
    }
    if (!form.interestRate) {
      showErrorToast({
        title: "Error",
        message: "La tasa de interés es obligatoria.",
      });
      setLoading(false);
      return;
    }
    if (!form.maxAmount) {
      showErrorToast({
        title: "Error",
        message: "El monto máximo es obligatorio.",
      });
      setLoading(false);
      return;
    }
    if (
      !form.maxAmount ||
      isNaN(Number(form.maxAmount)) ||
      Number(form.maxAmount) <= 0
    ) {
      showErrorToast({
        title: "Error",
        message: "El monto máximo debe ser un número positivo.",
      });
      setLoading(false);
      return;
    }
    if (
      !form.interestRate ||
      isNaN(Number(form.interestRate)) ||
      Number(form.interestRate) <= 0
    ) {
      showErrorToast({
        title: "Error",
        message: "La tasa de interés debe ser un número positivo.",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await apiMutual.CreateLoanType(form);
      showSuccessToast({
        title: "Éxito",
        message: response.message || "¡Préstamo creado con éxito!",
      });

      setTimeout(() => {
        navigate("/prestamos");
      }, 2000);

      setForm({
        code: "",
        name: "",
        interestRate: 0,
        maxAmount: 0,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Ocurrió un error al registrar el tipo de préstamo.";
      showErrorToast({ title: "Error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} loans={[]} />
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
              Crear Tipo de Préstamo
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Codigo de prestamo
                </label>
                <select
                  name="code"
                  value={form.code}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  <option value="">Seleccione una opcion</option>
                  {loanCodeOptions.map((lc) => (
                    <option key={lc.value} value={lc.value}>
                      {lc.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre del tipo de prestamo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Ayudas económicas	tasa 20 - 100mil"
                />
              </div>
              <div>
                <label
                  htmlFor="interestRate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tasa de interes (%)
                </label>
                <input
                  type="text"
                  id="interestRate"
                  name="interestRate"
                  value={form.interestRate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 10"
                />
              </div>
              <div>
                <label
                  htmlFor="maxAmount"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Monto maximo
                </label>
                <input
                  type="text"
                  id="maxAmount"
                  name="maxAmount"
                  value={form.maxAmount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 100.000"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/prestamos")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2  font-semibold rounded-full"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar"}
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
