import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { ILoanTypesList } from "../../../types/loans/ILoanTypesList";
import { apiMutual } from "../../../api/apiMutual";
import useAppToast from "../../../hooks/useAppToast";

const RequestLoan: React.FC = () => {
  const navigate = useNavigate();

  const [loanTypes, setLoanTypes] = useState<ILoanTypesList[]>([]);

  const [form, setForm] = useState({
    associateDni: "",
    associateName: "",
    applicationDate: "",
    loanTypeId: "",
    amount: 0,
    termMonths: 0,
  });

  useEffect(() => {
    const fetchLoanTypes = async () => {
      try {
        const allTypes = await apiMutual.GetLoanTypes();
        const activos = allTypes.filter((type) => type.active === "Activo");
        setLoanTypes(activos);
        // Quitar la selección automática del primer tipo
      } catch (error) {
        setLoanTypes([]);
      }
    };
    fetchLoanTypes();
  }, []);

  const [loading, setLoading] = useState<boolean>(false);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { showSuccessToast, showErrorToast } = useAppToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Validaciones por campos
    if (!form.associateDni.trim()) {
      showErrorToast({
        title: "Error de validación",
        message: "El DNI del asociado es obligatorio.",
      });
      setLoading(false);
      return;
    }
    if (!form.associateName.trim()) {
      showErrorToast({
        title: "Error de validación",
        message: "El nombre del asociado es obligatorio.",
      });
      setLoading(false);
      return;
    }
    if (!form.loanTypeId) {
      showErrorToast({
        title: "Error de validación",
        message: "Debe seleccionar un tipo de préstamo válido.",
      });
      setLoading(false);
      return;
    }
    if (isNaN(form.amount) || form.amount <= 0) {
      showErrorToast({
        title: "Error de validación",
        message: "El monto debe ser un número positivo.",
      });
      setLoading(false);
      return;
    }
    if (isNaN(form.termMonths) || form.termMonths <= 0) {
      showErrorToast({
        title: "Error de validación",
        message: "La cantidad de cuotas debe ser un número entero positivo.",
      });
      setLoading(false);
      return;
    }
    if (!form.applicationDate) {
      showErrorToast({
        title: "Error de validación",
        message: "La fecha de aplicación es obligatoria.",
      });
      setLoading(false);
      return;
    }

    // Convertir loanTypeId a number antes de enviar
    const payload = {
      ...form,
      loanTypeId: Number(form.loanTypeId),
    };

    try {
      const response = await apiMutual.CreateLoan(payload);

      showSuccessToast({
        title: "¡Éxito!",
        message:
          response.message ||
          "¡Préstamo solicitado con éxito! Estado: Pendiente",
      });

      setForm({
        associateDni: "",
        associateName: "",
        loanTypeId: "",
        amount: 0,
        termMonths: 0,
        applicationDate: "",
      });

      setTimeout(() => {
        navigate("/prestamos");
      }, 2000);
    } catch (error: any) {
      const statusCode = error.response?.status;
      let title = "Error";
      let message = "Ocurrió un error al solicitar el préstamo.";

      switch (statusCode) {
        case 400:
          title = "Error de validación";
          message =
            error.response?.data?.message ||
            "Los datos proporcionados no son válidos.";
          break;
        case 401:
          title = "No autorizado";
          message = "No tiene permisos para realizar esta acción.";
          break;
        case 404:
          title = "No encontrado";
          message = error.response?.data?.message || "Recurso no encontrado.";
          break;
        case 409:
          title = "Conflicto";
          message =
            error.response?.data?.message ||
            "Existe un conflicto con la solicitud.";
          break;
        case 500:
          title = "Error del servidor";
          message =
            "Ocurrió un error en el servidor. Por favor, inténtelo más tarde.";
       
          break;
        default:
          title = "Error";
          message =
            error.response?.data?.message || "Ocurrió un error inesperado.";
      }

      showErrorToast({ title, message });
    } finally {
      setLoading(false);
    }
  };

  // Formulario de creacion prestamos

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
                aria-label="Volver a prestamos"
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
                  htmlFor="associateDni"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  DNI del Asociado
                </label>
                <input
                  type="text"
                  id="associateDni"
                  name="associateDni"
                  value={form.associateDni}
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
                  id="loanTypeId"
                  name="loanTypeId"
                  value={form.loanTypeId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccione una opcion</option>
                  {loanTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
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
                  htmlFor="termMonths"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cantidad de Cuotas
                </label>
                <input
                  type="number"
                  id="termMonths"
                  name="termMonths"
                  value={form.termMonths}
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
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2  font-semibold rounded-full"
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
