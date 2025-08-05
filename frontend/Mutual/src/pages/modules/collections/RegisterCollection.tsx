import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ICollectionMethod } from "../../../types/ICollection";
import { IInstallmentInfo } from "../../../types/loans/ILoan";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

const RegisterCollection: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [installment, setInstallment] = useState<IInstallmentInfo | null>(null);
  const [methods, setMethods] = useState<ICollectionMethod[]>([]);
  const [form, setForm] = useState({
    methodId: "",
    receiptNumber: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const { showSuccessToast, showErrorToast } = useAppToast();

  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  // Cargar datos de la cuota y métodos de cobro
  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        if (id) {
           const installmentData = await apiMutual.GetInstallmentById(
            Number(id)
          );
          setInstallment(installmentData);
        }
        const methodsData = await apiMutual.GetCollectionMethods();
        setMethods(methodsData.filter((m) => m.isActive));
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message || "Error al cargar datos iniciales";
        showErrorToast({
          title: "Error",
          message: errorMessage,
        });
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validaciones específicas con toast
    if (!installment) {
      showErrorToast({
        message: "No se pudo cargar la información de la cuota.",
      });
      setLoading(false);
      return;
    }

    if (!form.methodId) {
      showErrorToast({ message: "Debe seleccionar un método de cobro." });
      setLoading(false);
      return;
    }

    if (!form.receiptNumber.trim()) {
      showErrorToast({ message: "El número de comprobante es obligatorio." });
      setLoading(false);
      return;
    }

    if (!form.date) {
      showErrorToast({ message: "La fecha de cobro es obligatoria." });
      setLoading(false);
      return;
    }

    // Validación de fecha no futura
    const selectedDate = new Date(form.date);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Hasta el final del día de hoy

    if (selectedDate > today) {
      showErrorToast({ message: "La fecha de cobro no puede ser futura." });
      setLoading(false);
      return;
    }

    try {
      const response = await apiMutual.RegisterCollection({
        installmentId: installment.id,
        amount: installment.amount,
        methodId: Number(form.methodId),
        receiptNumber: form.receiptNumber.trim(),
        collectionDate: form.date,
      });

      showSuccessToast({
        title: "Cobro registrado",
        message: "El cobro se registró correctamente.",
      });

      setTimeout(() => {
        navigate("/prestamos");
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Error de sistema al registrar el cobro.";
      showErrorToast({
        title: "Error",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
          <Header hasNotifications={true} loans={[]} />
          <div className="flex flex-col items-center justify-center py-8 flex-1">
            <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 text-center">
              <div className="text-lg text-gray-600">
                Cargando información de la cuota...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} loans={[]} />
        <div className="flex flex-col items-center py-8 flex-1">
          <div className="w-full max-w-xl">
            <div className="flex justify-start mb-6">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-800 flex items-center"
                aria-label="Volver a Asociados"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="ml-1">Volver</span>
              </button>
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Registrar Cobro
            </h2>

            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="overflow-x-auto rounded-lg shadow bg-white p-6">
                  {/* Información de la cuota */}
                  {installment && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Información de la Cuota
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Cuota N°:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {installment.installmentNumber}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Monto:
                          </span>
                          <span className="ml-2 text-gray-900">
                            ${installment.amount.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Vencimiento:
                          </span>
                          <span className="ml-2 text-gray-900">
                            {installment.dueDate}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Estado:
                          </span>
                          <span
                            className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
                              installment.collected === "Pendiente"
                                ? "bg-yellow-100 text-yellow-800"
                                : installment.collected === "Atrasado"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {installment.collected}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mensajes de error y éxito */}
                  {/* Formulario */}
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    noValidate
                  >
                    {/* Campo fecha de cobro */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fecha de cobro *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        max={new Date().toISOString().slice(0, 10)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      />
                    </div>

                    {/* Campo método de cobro */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Método de cobro *
                      </label>
                      <select
                        name="methodId"
                        value={form.methodId}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                      >
                        <option value="">Seleccione un método...</option>
                        {methods.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name} ({m.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Campo número de comprobante */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        N° de comprobante *
                      </label>
                      <input
                        type="text"
                        name="receiptNumber"
                        value={form.receiptNumber}
                        onChange={handleChange}
                        maxLength={255}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={loading}
                        placeholder="Ingrese el número del comprobante"
                      />
                      <div className="mt-1 text-right">
                        <small className="text-gray-500">
                          {form.receiptNumber.length}/255 caracteres
                        </small>
                      </div>
                    </div>

                    {/* Campo monto (solo lectura) */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Monto de la cuota
                      </label>
                      <input
                        type="text"
                        value={
                          installment
                            ? `$${installment.amount.toLocaleString()}`
                            : ""
                        }
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                      <small className="text-gray-500 mt-1 block">
                        Este monto no puede ser modificado
                      </small>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow transition duration-200 ease-in-out w-full md:w-auto"
                        disabled={loading}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow transition duration-200 ease-in-out disabled:opacity-50 w-full md:w-auto"
                        disabled={loading}
                      >
                        {loading ? "Registrando..." : "Registrar Cobro"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCollection;
