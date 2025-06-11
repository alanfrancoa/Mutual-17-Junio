import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";

interface SupplierRegister {
  CUIT: string;
  LegalName: string;
  Address: string;
  Phone: string;
  Email: string;
}

const CreateSupplier: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<SupplierRegister>({
    CUIT: "",
    LegalName: "",
    Address: "",
    Phone: "",
    Email: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    try {
      const response = await fetch("/api/suppliers/provider", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.mensaje || "No se pudo registrar el proveedor");
      }
    } catch {
      setError("Error de red o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Nuevo Proveedor</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="cuit" value={form.CUIT} onChange={handleChange} placeholder="CUIT" required className="w-full border px-2 py-1" />
            <input name="legal_name" value={form.LegalName} onChange={handleChange} placeholder="Razon Social" required className="w-full border px-2 py-1" />
            <input name="address" value={form.Address} onChange={handleChange} placeholder="Dirección" className="w-full border px-2 py-1" />
            <input name="phone" value={form.Phone} onChange={handleChange} placeholder="Telefono" className="w-full border px-2 py-1" />
            <input name="email" value={form.Email} onChange={handleChange} placeholder="Email" className="w-full border px-2 py-1" />
            <div className="flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Guardar</button>
              <button type="button" onClick={() => navigate("/suppliers/allsuppliers")} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
            </div>
            {success && <div className="text-green-600">{success}</div>}
            {error && <div className="text-red-600">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateSupplier;