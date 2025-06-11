import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";

interface Supplier {
  id: number;
  CUIT: string;
  LegalName: string;
  Address: string;
  Phone: string;
  Email: string;
  Active?: boolean;
}

const EditSupplier: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [form, setForm] = useState<Supplier>({
    id: 0,
    CUIT: "",
    LegalName: "",
    Address: "",
    Phone: "",
    Email: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch(`/api/suppliers/${id}`);
        if (!response.ok) throw new Error("No se pudo obtener el proveedor");
        const data = await response.json();
        setForm({

          id: data.Id,
          CUIT: data.CUIT,
          LegalName: data.LegalName,
          Address: data.Address,
          Phone: data.Phone,
          Email: data.Email,
          Active: data.Active !== undefined ? data.Active : true,
        });
      } catch {
        setError("Error al cargar el proveedor");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSupplier();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const response = await fetch(`/api/suppliers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("No se pudo actualizar el proveedor");
      setSuccess("Proveedor actualizado correctamente");
      setTimeout(() => navigate("/proveedores/allsuppliers"), 1200);
    } catch {
      setError("Error al actualizar el proveedor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Cargando proveedor...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Editar Proveedor</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="cuit"
              value={form.CUIT}
              onChange={handleChange}
              placeholder="CUIT"
              required
              className="w-full border px-2 py-1"
            />
            <input
              name="legal_name"
              value={form.LegalName}
              onChange={handleChange}
              placeholder="Razón Social"
              required
              className="w-full border px-2 py-1"
            />
            <input
              name="address"
              value={form.Address}
              onChange={handleChange}
              placeholder="Dirección"
              className="w-full border px-2 py-1"
            />los 
            <input
              name="phone"
              value={form.Phone}
              onChange={handleChange}
              placeholder="Teléfono"
              className="w-full border px-2 py-1"
            />
            <input
              name="email"
              value={form.Email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full border px-2 py-1"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <input
                type="text"
                value={form.Active ? "Activo" : "Inactivo"}
                disabled
                className="w-full border px-2 py-1 bg-gray-100 text-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                Guardar Cambios
              </button>
              <button
                type="button"
                onClick={() => navigate("/proveedores/allsuppliers")}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
            {success && <div className="text-green-600">{success}</div>}
            {error && <div className="text-red-600">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSupplier;