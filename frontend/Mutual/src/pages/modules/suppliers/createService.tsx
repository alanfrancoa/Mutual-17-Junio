import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../dashboard/components/Sidebar';
import { apiMutual } from "../../../api/apiMutual";
import useAppToast from "../../../hooks/useAppToast";

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
  active: boolean;
}

interface CreateServiceForm {
  serviceTypeId: number | "";
  supplierId: number | "";
  description: string;
  monthlyCost: string;
}

interface CreateServiceProps {
  onBack?: () => void;
}

const CreateService: React.FC<CreateServiceProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast, showWarningToast } = useAppToast();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [form, setForm] = useState<CreateServiceForm>({
    serviceTypeId: "",
    supplierId: "",
    description: "",
    monthlyCost: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await apiMutual.GetAllSuppliers();
        
        if (Array.isArray(data)) {
          const activeSuppliers = data.filter((s: Supplier) => s.active);
          setSuppliers(activeSuppliers);
        } else {
          setSuppliers([]);
        }
      } catch (error: any) {
        setSuppliers([]);
        showErrorToast({
          title: "Error de carga",
          message: error.message || "No se pudieron cargar los proveedores"
        });
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const data = await apiMutual.GetServiceTypes();
        
        if (Array.isArray(data)) {
          const activeTypes = data.filter((t: ServiceType) => t.active);
          setServiceTypes(activeTypes);
        } else {
          setServiceTypes([]);
        }
      } catch (error: any) {
        setServiceTypes([]);
        showErrorToast({
          title: "Error de carga",
          message: error.message || "No se pudieron cargar los tipos de servicio"
        });
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

    if (!form.serviceTypeId || !form.supplierId || !form.description || !form.monthlyCost) {
      showWarningToast({
        title: "Campos incompletos",
        message: "Completa todos los campos obligatorios"
      });
      return;
    }

    setLoading(true);

    try {
      await apiMutual.RegisterService({
        ServiceTypeId: Number(form.serviceTypeId),
        SupplierId: Number(form.supplierId),
        Description: form.description,
        MonthlyCost: Number(form.monthlyCost),
      });
      
      showSuccessToast({
        title: "¡Servicio creado!",
        message: "El servicio fue registrado correctamente"
      });
      
      setTimeout(() => navigate("/proveedores/servicios"), 1500);
    } catch (err: any) {
      console.error("Error al crear servicio:", err);
      
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.mensaje || 
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message || 
        "Error desconocido";

      showErrorToast({
        title: "Error al crear servicio",
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: '18rem' }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Nuevo Servicio</h1>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
              <button
                onClick={() => navigate(-1)}
                disabled={loading}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition disabled:opacity-50"
              >
                Volver
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Servicio</label>
                <select
                  name="serviceTypeId"
                  value={form.serviceTypeId}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50" // ✅ AÑADIR disabled:opacity-50
                  required
                >
                  <option value="">Seleccione un tipo de servicio...</option>
                  {serviceTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <select
                  name="supplierId"
                  value={form.supplierId}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full p-2 border border-gray-300 rounded disabled:opacity-50"
                  maxLength={255}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Costo Mensual</label>
                <input
                  type="number"
                  name="monthlyCost"
                  value={form.monthlyCost}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full p-2 border border-gray-300 rounded disabled:opacity-50"
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