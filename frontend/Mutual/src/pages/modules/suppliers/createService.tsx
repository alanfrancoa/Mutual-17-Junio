import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../dashboard/components/Sidebar';

interface Supplier {
  Id: number;
  CUIT: string;
  LegalName: string;
  Address: string;
  Phone?: string;
  Email?: string;
  Active: boolean;
  CreatedAt: string;
}

interface ServiceType {
  Id: number;
  Code: string;
  Name: string;
  Active: boolean;
}

interface CreateServiceForm {
  ServiceTypeId: number | "";
  SupplierId: number | "";
  Description: string;
  MonthlyCost: string;
}

interface CreateServiceProps {
  onBack?: () => void;
}

const CreateService: React.FC<CreateServiceProps> = ({ onBack }) => {
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [form, setForm] = useState<CreateServiceForm>({
    ServiceTypeId: "",
    SupplierId: "",
    Description: "",
    MonthlyCost: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("/api/suppliers");
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data.filter((s: Supplier) => s.Active)); // Filtrar por proveedores activos
        }
      } catch {
        setSuppliers([]);
      }
    };
    fetchSuppliers();
  }, []);

     useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await fetch("/services-type");
        if (response.ok) {
          const data = await response.json();
          setServiceTypes(data.filter((t: ServiceType) => t.Active));
        }
      } catch {
        setServiceTypes([]);
      }
    };
    fetchServiceTypes();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setSuccess("");
    setError("");
    if (!form.ServiceTypeId || !form.SupplierId || !form.Description || !form.MonthlyCost) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    try {
      const response = await fetch("/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ServiceTypeId: Number(form.ServiceTypeId),
          SupplierId: Number(form.SupplierId),
          Description: form.Description,
          MonthlyCost: Number(form.MonthlyCost),
        }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.mensaje || "No se pudo registrar el servicio");
      }
      setSuccess("Servicio registrado correctamente.");
      setTimeout(() => navigate("/servicios"), 1200);
    } catch (err: any) {
      setError(err.message || "Error de red o servidor.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar fija a la izquierda */}
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: '18rem' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Nuevo Servicio</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Guardar
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Volver
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {success && <div className="text-green-600 mb-2">{success}</div>}
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
                <select
                  name="ServiceTypeId"
                  value={form.ServiceTypeId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccione un tipo de servicio...</option>
                  {serviceTypes.map((type) => (
                    <option key={type.Id} value={type.Id}>
                      {type.Name}
                    </option>
                  ))}
                </select>
              </div>

               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <select
                  name="SupplierId"
                  value={form.SupplierId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccione un proveedor...</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.Id} value={supplier.Id}>
                      {supplier.LegalName} ({supplier.CUIT})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="Description"
                  value={form.Description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  maxLength={255}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo Mensual</label>
                <input
                  type="number"
                  name="MonthlyCost"
                  value={form.MonthlyCost}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  min={0}
                  step="0.01"
                  required
                />
              </div>
               </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateService;