import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import Header from "../../dashboard/components/Header";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.serviceTypeId || !form.supplierId || !form.description || !form.monthlyCost) {
      showWarningToast({
        title: "Campos incompletos",
        message: "Completa todos los campos obligatorios"
      });
      return;
    }

    // Validar que el costo mensual sea positivo
    if (Number(form.monthlyCost) <= 0) {
      showWarningToast({
        title: "Valor inválido",
        message: "El costo mensual debe ser mayor a cero"
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
      
      let errorMessage = "Error desconocido al crear el servicio";
      
      if (err.response?.status === 400) {
        if (typeof err.response.data === 'string') {
          if (err.response.data.includes("tipo de servicio no existe")) {
            errorMessage = "El tipo de servicio seleccionado no existe o no está disponible";
          } else if (err.response.data.includes("proveedor no existe")) {
            errorMessage = "El proveedor seleccionado no existe o no está disponible";
          } else {
            errorMessage = err.response.data;
          }
        } else {
          errorMessage = "Error de validación: Verifique que todos los campos estén completos y sean válidos";
        }
      } else if (err.response?.status === 500) {
        errorMessage = err.response.data?.message || "Error interno del servidor. Intente nuevamente más tarde";
      } else if (err.response?.data) {
        errorMessage = err.response.data.message || 
                     err.response.data.mensaje || 
                     (typeof err.response.data === 'string' ? err.response.data : null) ||
                     "Error del servidor";
      } else {
        errorMessage = err.message || "Error de conexión. Verifique su conexión a internet";
      }

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
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} loans={[]} />
        <div className="flex flex-col items-center py-8 flex-1">
          <div className="w-full max-w-xl">
            <div className="flex justify-start mb-6">
              <button
                onClick={() => navigate("/proveedores/servicios")}
                className="text-gray-600 hover:text-gray-800 flex items-center"
                aria-label="Volver a Servicios"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="ml-1">Volver</span>
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
              Nuevo Servicio
            </h2>
            <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Servicio *
                  </label>
                  <select
                    name="serviceTypeId"
                    value={form.serviceTypeId}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
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
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
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
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    maxLength={255}
                    rows={3}
                    placeholder="Descripción del servicio"
                  />
                  <small className="text-gray-500">{form.description.length}/255 caracteres</small>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costo Mensual *
                  </label>
                  <input
                    type="number"
                    name="monthlyCost"
                    value={form.monthlyCost}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/proveedores/servicios")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full transition duration-200 ease-in-out"
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition duration-200 ease-in-out disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : "Crear Servicio"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateService;