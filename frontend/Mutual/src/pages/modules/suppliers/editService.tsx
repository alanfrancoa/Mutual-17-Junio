import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { IServiceType } from "../../../types/IServiceType";

interface Supplier {
  id: number;
  cuit: string;
  legalName: string;
  address: string;
  phone?: string;
  email?: string;
  active: boolean;
  createdAt: string;
}

interface ServiceType {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

interface ServiceForm {
  ServiceTypeId: number | "";
  SupplierId: number | "";
  Description: string;
  MonthlyCost: string;
}

const EditService: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [form, setForm] = useState<ServiceForm>({
    ServiceTypeId: "",
    SupplierId: "",
    Description: "",
    MonthlyCost: "",
  });
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  // proveedores activos
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await apiMutual.GetAllSuppliers();
        setSuppliers(data.filter((s: Supplier) => s.active));
      } catch (err) {
        console.error("Error al cargar proveedores:", err);
        setSuppliers([]);
        setError("Error al cargar proveedores");
      }
    };
    fetchSuppliers();
  }, []);

// Cargar tipos de servicio activos
useEffect(() => {
  const fetchServiceTypes = async () => {
    try {
      const data = await apiMutual.GetServiceTypes();
      setServiceTypes(
        data
          .filter((t: IServiceType) => t.active)
          .map((t: IServiceType) => ({
            id: t.id,
            code: t.code,
            name: t.name,
            isActive: t.active,
          }))
      );
    } catch (err: any) {
      console.error("Error al cargar tipos de servicio:", err);
      setServiceTypes([]);
      setError("Error al cargar tipos de servicio");
    }
  };
  fetchServiceTypes();
}, []);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        setError("ID de servicio no válido");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await apiMutual.GetServiceById(Number(id));
        setForm({
          ServiceTypeId: data.serviceTypeId ?? "",
          SupplierId: data.supplierId ?? "",
          Description: data.description ?? "",
          MonthlyCost: data.monthlyCost?.toString() ?? "",
        });
      } catch (err: any) {
        setError(err.message || "Error al cargar el servicio");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

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

    if (!id) {
      setError("ID de servicio no válido");
      return;
    }

    try {
      await apiMutual.UpdateService(Number(id), {
        serviceTypeId: Number(form.ServiceTypeId),
        supplierId: Number(form.SupplierId),
        description: form.Description,
        monthlyCost: Number(form.MonthlyCost),
      });

      setSuccess("Servicio actualizado correctamente.");
      setTimeout(() => navigate("/proveedores/servicios"), 1500);
    } catch (err: any) {
      setError(err.message || "Error al actualizar el servicio");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1" style={{ marginLeft: "18rem" }}>
              <Header hasNotifications={true} loans={[]}  />

          <div className="flex items-center justify-center py-8">
            <div className="text-lg text-gray-600">Cargando servicio...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: "18rem" }}>
     <Header hasNotifications={true} loans={[]}  />
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Editar Servicio
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:bg-blue-400"
                disabled={loading}
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => navigate("/proveedores/servicios")}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Volver
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Servicio *
                </label>
                <select
                  name="ServiceTypeId"
                  value={form.ServiceTypeId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccione un tipo de servicio...</option>
                  {serviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Proveedor *
                </label>
                <select
                  name="SupplierId"
                  value={form.SupplierId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleccione un proveedor...</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.legalName} ({supplier.cuit})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  name="Description"
                  value={form.Description}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  maxLength={255}
                  rows={3}
                  required
                  placeholder="Descripción del servicio"
                />
                <small className="text-gray-500">{form.Description.length}/255 caracteres</small>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo Mensual *
                </label>
                <input
                  type="number"
                  name="MonthlyCost"
                  value={form.MonthlyCost}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditService;