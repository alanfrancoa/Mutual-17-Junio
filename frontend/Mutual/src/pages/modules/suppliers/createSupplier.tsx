import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { ISupplierRegister } from "../../../types/ISupplierRegister";
import useAppToast from "../../../hooks/useAppToast";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const CreateSupplier: React.FC = () => {
  const navigate = useNavigate();
  const toast = useAppToast();
  const [form, setForm] = useState<ISupplierRegister>({
    CUIT: "",
    LegalName: "",
    Address: "",
    Phone: "",
    Email: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!/^\d{2}-\d{8}-\d{1}$/.test(form.CUIT)) {
      toast.showErrorToast({
        title: "CUIT inválido",
        message: "El CUIT debe tener el formato 20-12345678-3",
      });
      setLoading(false);
      return;
    }

    if (!form.LegalName || !form.Address || !form.Phone || !form.Email) {
      toast.showErrorToast({
        title: "Campos incompletos",
        message: "Todos los campos son obligatorios",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await apiMutual.RegisterSupplier(form);
      toast.showSuccessToast({
        title: "Proveedor creado",
        message: response.mensaje,
      });
      setTimeout(() => navigate("/proveedores"), 1500);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.mensaje ||
        (typeof error.response?.data === "string" ? error.response.data : null) ||
        error.message ||
        "Error desconocido";

      toast.showErrorToast({
        title: "Error al crear proveedor",
        message: errorMessage,
      });
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
                onClick={() => navigate("/proveedores")}
                className="text-gray-600 hover:text-gray-800 flex items-center"
                aria-label="Volver a Proveedores"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="ml-1">Volver</span>
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
              Nuevo Proveedor
            </h2>
          </div>
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CUIT
                </label>
                <input
                  name="CUIT"
                  value={form.CUIT}
                  onChange={handleChange}
                  placeholder="CUIT (ej. 20-12345678-3)"
                  required
                  pattern="\d{2}-\d{8}-\d{1}"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razón Social
                </label>
                <input
                  name="LegalName"
                  value={form.LegalName}
                  onChange={handleChange}
                  placeholder="Ingrese la razón social"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  name="Address"
                  value={form.Address}
                  onChange={handleChange}
                  placeholder="Ingrese la dirección"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  name="Phone"
                  value={form.Phone}
                  onChange={handleChange}
                  placeholder="Ingrese el teléfono"
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  name="Email"
                  value={form.Email}
                  onChange={handleChange}
                  placeholder="Ingrese el email"
                  required
                  type="email"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/proveedores")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-semibold rounded-full disabled:opacity-50"
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

export default CreateSupplier;