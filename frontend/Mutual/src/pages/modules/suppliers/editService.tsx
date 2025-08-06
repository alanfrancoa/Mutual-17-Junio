import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
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
  const [error, setError] = useState<string | null>(null);

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
        const activeSuppliers = data.filter((s: ISupplier) => s.active);
        setSuppliers(activeSuppliers);
        
        if (activeSuppliers.length === 0) {
          showWarningToast({
            title: "Sin proveedores",
            message: "No hay proveedores activos disponibles. Contacte al administrador"
          });
        }
      } catch (error: any) {
        setSuppliers([]);
        
        let errorMessage = "Error desconocido al cargar proveedores";
        
        if (error.response?.status === 400) {
          errorMessage = error.response.data?.mensaje || 
                       (typeof error.response.data === 'string' ? error.response.data : null) ||
                       "Error de validación al cargar proveedores";
        } else if (error.response?.status === 500) {
          errorMessage = error.response.data?.message || "Error interno del servidor";
        } else {
          errorMessage = error.message || "Error de conexión";
        }
        
        showErrorToast({
          title: "Error al cargar proveedores",
          message: errorMessage
        });
      }
    };
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const data = await apiMutual.GetServiceTypes();
        const activeTypes = data.filter((t: IServiceType) => t.active);
        setServiceTypes(activeTypes);
        
        if (activeTypes.length === 0) {
          showWarningToast({
            title: "Sin tipos de servicio",
            message: "No hay tipos de servicio activos disponibles. Contacte al administrador"
          });
        }
      } catch (error: any) {
        setServiceTypes([]);
        
        let errorMessage = "Error desconocido al cargar tipos de servicio";
        
        if (error.response?.status === 400) {
          errorMessage = error.response.data?.mensaje || 
                       (typeof error.response.data === 'string' ? error.response.data : null) ||
                       "Error de validación al cargar tipos de servicio";
        } else if (error.response?.status === 500) {
          errorMessage = error.response.data?.message || "Error interno del servidor";
        } else {
          errorMessage = error.message || "Error de conexión";
        }
        
        showErrorToast({
          title: "Error al cargar tipos de servicio",
          message: errorMessage
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
        let errorMessage = "Error desconocido al cargar el servicio";
        
        if (err.response?.status === 400) {
          errorMessage = err.response.data?.mensaje || 
                        (typeof err.response.data === 'string' ? err.response.data : null) ||
                        "Error de validación al cargar el servicio";
        } else if (err.response?.status === 404) {
          errorMessage = err.response.data?.mensaje || "El servicio no fue encontrado";
        } else if (err.response?.status === 500) {
          errorMessage = err.response.data?.message || "Error interno del servidor";
        } else {
          errorMessage = err.message || "Error de conexión";
        }
        
        setError(errorMessage);
        showErrorToast({
          title: "Error al cargar servicio",
          message: errorMessage
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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.ServiceTypeId || !form.SupplierId || !form.Description || !form.amount) {
      showWarningToast({
        title: "Campos incompletos",
        message: "Completa todos los campos obligatorios"
      });
      return;
    }

    // Validar que el costo mensual sea positivo
    if (Number(form.amount) <= 0) {
      showWarningToast({
        title: "Valor inválido",
        message: "El costo mensual debe ser mayor a cero"
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
        title: "Cambio exitoso",
        message: "Servicio actualizado correctamente"
      });
      
      setTimeout(() => navigate("/proveedores/servicios"), 1500);
    } catch (err: any) {
      console.error("Error al actualizar servicio:", err);
      
      let errorMessage = "Error desconocido al actualizar el servicio";
      
      if (err.response?.status === 400) {
        if (err.response.data?.mensaje) {
          if (err.response.data.mensaje.includes("tipo de servicio no existe")) {
            errorMessage = "El tipo de servicio seleccionado no existe o no está disponible";
          } else if (err.response.data.mensaje.includes("proveedor no existe")) {
            errorMessage = "El proveedor seleccionado no existe o no está disponible";
          } else {
            errorMessage = err.response.data.mensaje;
          }
        } else {
          errorMessage = "Error de validación: Verifique que todos los campos estén completos y sean válidos";
        }
      } else if (err.response?.status === 404) {
        errorMessage = err.response.data?.mensaje || "El servicio no fue encontrado o ya no existe";
      } else if (err.response?.status === 500) {
        errorMessage = err.response.data?.message || "Error interno del servidor. Intente nuevamente más tarde";
      } else if (err.response?.data) {
        errorMessage = err.response.data.mensaje || 
                     err.response.data.message || 
                     (typeof err.response.data === 'string' ? err.response.data : null) ||
                     "Error del servidor";
      } else {
        errorMessage = err.message || "Error de conexión. Verifique su conexión a internet";
      }

      showErrorToast({
        title: "Error al actualizar servicio",
        message: errorMessage
      });
    } finally {
      setSaving(false);
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
              Editar Servicio
            </h2>
            <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Cargando datos del servicio...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : (
                <form onSubmit={handleSave} className="space-y-5" noValidate>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Servicio *
                    </label>
                    <select
                      name="ServiceTypeId"
                      value={form.ServiceTypeId}
                      onChange={handleChange}
                      disabled={saving}
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
                      name="SupplierId"
                      value={form.SupplierId}
                      onChange={handleChange}
                      disabled={saving}
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
                      name="Description"
                      value={form.Description}
                      onChange={handleChange}
                      disabled={saving}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                      maxLength={255}
                      rows={3}
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
                      disabled={saving}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition duration-200 ease-in-out disabled:opacity-50"
                      disabled={saving}
                    >
                      {saving ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditService;