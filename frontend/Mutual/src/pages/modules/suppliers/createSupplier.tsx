import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { ISupplierRegister } from "../../../types/ISupplierRegister";

const CreateSupplier: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<ISupplierRegister>({
    CUIT: "",
    LegalName: "",
    Address: "",
    Phone: "",
    Email: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setMessage(null);

  if (!/^\d{2}-\d{8}-\d{1}$/.test(form.CUIT)) {
    setMessage({ type: "error", text: "El CUIT debe tener el formato 20-12345678-3" });
    return;
  }
  if (!form.LegalName || !form.Address || !form.Phone || !form.Email) {
    setMessage({ type: "error", text: "Todos los campos son obligatorios" });
    return;
  }
  try {
    const response = await apiMutual.RegisterSupplier(form);
    setMessage({ type: "success", text: response.mensaje });
    setTimeout(() => navigate("/proveedores"), 1500);
  } catch (error: any) {
    setMessage({ type: "error", text: error.message });
  } finally {
    setLoading(false);
  }
};

 return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Nuevo Proveedor</h2>

          {message && (
            <div
              className={`p-3 rounded mb-4 text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
              role="alert"
            >
              {message.text}
            </div>
          )}

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

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => navigate("/proveedores")}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSupplier;