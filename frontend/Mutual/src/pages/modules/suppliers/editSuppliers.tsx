import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ISupplierUpdate } from "../../../types/ISupplierRegister";
import useAppToast from "../../../hooks/useAppToast";

const EditSupplier: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useAppToast();

  const [form, setForm] = useState<ISupplierUpdate>({
    id: 0,
    CUIT: "",
    LegalName: "",
    Address: "",
    Phone: "",
    Email: "",
    Active: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!id) {
        setLoading(false);
        toast.showErrorToast({
          title: "Error de ID",
          message: "ID de proveedor no válido",
        });
        return;
      }
      try {
        const supplier = await apiMutual.GetSupplierById(Number(id));
        setForm({
          id: supplier.id,
          CUIT: supplier.cuit ?? "",
          LegalName: supplier.legalName ?? "",
          Address: supplier.address ?? "",
          Phone: supplier.phone ?? "",
          Email: supplier.email ?? "",
          Active: supplier.active ?? true,
        });
      } catch (error: any) {
        toast.showErrorToast({
          title: "Error de carga",
          message: error.message || "No se pudo cargar el proveedor",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{2}-\d{8}-\d{1}$/.test(form.CUIT)) {
      toast.showErrorToast({
        title: "CUIT inválido",
        message: "El CUIT debe tener el formato 20-12345678-3",
      });
      return;
    }
    if (!form.LegalName || !form.Address || !form.Phone || !form.Email) {
      toast.showErrorToast({
        title: "Campos incompletos",
        message: "Todos los campos son obligatorios",
      });
      return;
    }
    setLoading(true);
    try {
      await apiMutual.UpdateSupplier(form.id, {
        CUIT: form.CUIT,
        LegalName: form.LegalName,
        Address: form.Address,
        Phone: form.Phone,
        Email: form.Email,
      });
      toast.showSuccessToast({
        title: "Proveedor actualizado",
        message: "Proveedor actualizado correctamente",
      });
      setTimeout(() => navigate("/proveedores"), 1200);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.mensaje ||
        (typeof error.response?.data === "string" ? error.response.data : null) ||
        error.message ||
        "Error desconocido";

      toast.showErrorToast({
        title: "Error al actualizar proveedor",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} loans={[]} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Editar Proveedor</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="CUIT"
              value={form.CUIT}
              onChange={handleChange}
              placeholder="CUIT (ej. 20-12345678-3)"
              required
              pattern="\d{2}-\d{8}-\d{1}"
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="LegalName"
              value={form.LegalName}
              onChange={handleChange}
              placeholder="Razón Social"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="Address"
              value={form.Address}
              onChange={handleChange}
              placeholder="Dirección"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="Phone"
              value={form.Phone}
              onChange={handleChange}
              placeholder="Teléfono"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <input
              name="Email"
              value={form.Email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full border px-3 py-2 rounded"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <input
                type="text"
                value={form.Active ? "Activo" : "Inactivo"}
                disabled
                className="w-full border px-2 py-1 bg-gray-100 text-gray-700"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => navigate("/proveedores")}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Volver atrás
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;