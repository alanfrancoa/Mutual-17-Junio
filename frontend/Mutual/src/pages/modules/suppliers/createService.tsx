import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
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

  const handleSave = async () => {
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
      
      // Manejar diferentes tipos de error del backend según tu controller
      let errorMessage = "Error desconocido al crear el servicio";
      
      if (err.response?.status === 400) {
        // Error 400: String directo desde el backend
        if (typeof err.response.data === 'string') {
          if (err.response.data.includes("tipo de servicio no existe")) {
            errorMessage = "El tipo de servicio seleccionado no existe o no está disponible";
          } else if (err.response.data.includes("proveedor no existe")) {
            errorMessage = "El proveedor seleccionado no existe o no está disponible";
          } else {
            errorMessage = err.response.data;
          }
        } else {
          // Si es un objeto con errores de validación (ModelState)
          errorMessage = "Error de validación: Verifique que todos los campos estén completos y sean válidos";
        }
      } else if (err.response?.status === 500) {
        // Error 500: Objeto con message
        errorMessage = err.response.data?.message || "Error interno del servidor. Intente nuevamente más tarde";
      } else if (err.response?.data) {
        // Otros errores
        errorMessage = err.response.data.message || 
                     err.response.data.mensaje || 
                     (typeof err.response.data === 'string' ? err.response.data : null) ||
                     "Error del servidor";
      } else {
        // Error de red o conexión
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
      {/* Sidebar fija a la izquierda */}
      <Sidebar />

      {/* Contenido principal desplazado a la derecha */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        {/* Header */}
        <Header hasNotifications={true} loans={[]} />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">Nuevo Servicio</h1>

          <div className="flex-1 w-full">
            <div className="rounded-lg shadow bg-white p-6">
              {/* Botones de acción en la parte superior */}
              <div className="flex justify-end mb-6 gap-2">
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow transition disabled:opacity-50"
                >
                  {loading ? "Guardando..." : "Guardar Servicio"}
                </button>
                <button
                  onClick={() => navigate("/proveedores/servicios")}
                  disabled={loading}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow transition disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>

              {/* Formulario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de Servicio *
                  </label>
                  <select
                    name="serviceTypeId"
                    value={form.serviceTypeId}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Proveedor *
                  </label>
                  <select
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Costo Mensual *
                  </label>
                  <input
                    type="number"
                    name="monthlyCost"
                    value={form.monthlyCost}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                    min={0}
                    step="0.01"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción *
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:bg-gray-100"
                    rows={3}
                    maxLength={255}
                    placeholder="Ingrese una descripción del servicio..."
                    required
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {form.description.length}/255 caracteres
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      Información importante
                    </h3>
                    <div className="mt-1 text-sm text-blue-700">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Todos los campos marcados con (*) son obligatorios</li>
                        <li>El servicio se creará en estado activo por defecto</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateService;