import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { IServiceType } from "../../../types/IServiceType";
import { ISupplier } from "../../../types/ISupplier"; 
import { IServiceUpdate } from "../../../types/IServiceRegister";
import useAppToast from "../../../hooks/useAppToast";

const EditService: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast, showWarningToast } = useAppToast();

  const [suppliers, setSuppliers] = useState<ISupplier[]>([]);
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
  const [form, setForm] = useState<IServiceUpdate>({
    id: 0,
    ServiceTypeId: 0,
    SupplierId: 0,
    Description: "",
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); 

  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await apiMutual.GetAllSuppliers();
        setSuppliers(data.filter((s: ISupplier) => s.active));
      } catch (err: any) {
        console.error("Error al cargar proveedores:", err);
        setSuppliers([]);
        showErrorToast({
          title: "Error de carga",
          message: err.message || "Error al cargar proveedores"
        });
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const data = await apiMutual.GetServiceTypes();
        setServiceTypes(data.filter((t: IServiceType) => t.active));
      } catch (err: any) {
        console.error("Error al cargar tipos de servicio:", err);
        setServiceTypes([]);
        showErrorToast({
          title: "Error de carga",
          message: err.message || "Error al cargar tipos de servicio"
        });
      }
    };
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        showErrorToast({
          title: "ID inválido",
          message: "ID de servicio no válido"
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await apiMutual.GetServiceById(Number(id));
        
        setForm({
          id: data.id || 0,
          ServiceTypeId: data.serviceTypeId ?? 0,
          SupplierId: data.supplierId ?? 0,
          Description: data.description ?? "",
          date: new Date().toISOString().split('T')[0],
          amount: data.monthlyCost ?? 0,
          active: data.active ?? true,
        });
      } catch (err: any) {
        showErrorToast({
          title: "Error de carga",
          message: err.message || "Error al cargar el servicio"
        });
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

    if (!form.ServiceTypeId || !form.SupplierId || !form.Description || !form.amount) {
      showWarningToast({
        title: "Campos incompletos",
        message: "Completa todos los campos obligatorios"
      });
      return;
    }

    if (!id) {
      showErrorToast({
        title: "ID inválido",
        message: "ID de servicio no válido"
      });
      return;
    }

    setSaving(true);

    try {
      await apiMutual.UpdateService(Number(id), {
        serviceTypeId: Number(form.ServiceTypeId),
        supplierId: Number(form.SupplierId),
        description: form.Description,
        monthlyCost: Number(form.amount),
      });

      showSuccessToast({
        title: "¡Servicio actualizado!",
        message: "El servicio fue actualizado correctamente"
      });
      
      setTimeout(() => navigate("/proveedores/servicios"), 1500);
    } catch (err: any) {
      console.error("Error al actualizar servicio:", err);
      
      const errorMessage = 
        err.response?.data?.message || 
        err.response?.data?.mensaje || 
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        err.message || 
        "Error desconocido";

      showErrorToast({
        title: "Error al actualizar servicio",
        message: errorMessage
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1" style={{ marginLeft: "18rem" }}>
          <Header hasNotifications={true} loans={[]} />
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4 mx-auto"></div>
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
        <Header hasNotifications={true} loans={[]} />
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Editar Servicio
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50" 
                disabled={saving || loading} 
              >
                {saving ? "Guardando..." : "Guardar Cambios"} 
              </button>
              <button
                onClick={() => navigate("/proveedores/servicios")}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition disabled:opacity-50" 
                disabled={saving} 
              >
                Volver
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Servicio *
                </label>
                <select
                  name="ServiceTypeId"
                  value={form.ServiceTypeId}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
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
                  disabled={saving} 
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  name="Description"
                  value={form.Description}
                  onChange={handleChange}
                  disabled={saving} 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
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
                  name="amount" 
                  value={form.amount}
                  onChange={handleChange}
                  disabled={saving} 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
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