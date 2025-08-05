import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ISupplierUpdate } from "../../../types/ISupplierRegister";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

const EditSupplier: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useAppToast();

  const [form, setForm] = useState<ISupplierUpdate>({
    id: 0,
    CUIT: "",
    LegalName: "",
    Address: "",
    Phone: "",
    Email: "",
    Active: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!id) {
        setLoading(false);
        toast.showErrorToast({
          title: "Error de ID",
          message: "ID de proveedor no válido",
        });
        return;
      }
      try {
        const supplier = await apiMutual.GetSupplierById(Number(id));
        setForm({
          id: supplier.id,
          CUIT: supplier.cuit ?? "",
          LegalName: supplier.legalName ?? "",
          Address: supplier.address ?? "",
          Phone: supplier.phone ?? "",
          Email: supplier.email ?? "",
          Active: supplier.active ?? true,
        });
      } catch (error: any) {
        toast.showErrorToast({
          title: "Error de carga",
          message: error.message || "No se pudo cargar el proveedor",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación del CUIT
    if (!/^\d{2}-\d{8}-\d{1}$/.test(form.CUIT)) {
      toast.showErrorToast({
        title: "CUIT inválido",
        message: "El CUIT debe tener el formato 20-12345678-3",
        options: { duration: 4000 },
      });
      return;
    }

    // Validación de campos requeridos
    if (!form.LegalName || !form.Address || !form.Phone || !form.Email) {
      toast.showErrorToast({
        title: "Error de validación",
        message: "Todos los campos son obligatorios",
        options: { duration: 4000 },
      });
      return;
    }

    setLoading(true);
    try {
      const response = await apiMutual.UpdateSupplier(form.id, {
        CUIT: form.CUIT,
        LegalName: form.LegalName,
        Address: form.Address,
        Phone: form.Phone,
        Email: form.Email,
      });

      toast.showSuccessToast({
        title: "¡Éxito!",
        message: response.mensaje || "Proveedor actualizado correctamente.",
        options: { duration: 3000 },
      });

      setTimeout(() => navigate("/proveedores"), 1500);
    } catch (error: any) {
      const errorResponse = error.response;

      if (!errorResponse) {
        toast.showErrorToast({
          title: "Error de conexión",
          message:
            "No se pudo establecer conexión con el servidor. Por favor, intente nuevamente.",
          options: { duration: 5000 },
        });
        return;
      }

      switch (errorResponse.status) {
        case 400:
          toast.showErrorToast({
            title: "Error de validación",
            message:
              errorResponse.data?.mensaje ||
              "Los datos ingresados no son válidos",
            options: { duration: 4000 },
          });
          break;

        case 401:
          toast.showErrorToast({
            title: "No autorizado",
            message: errorResponse.data?.mensaje || "Usuario no válido",
            options: { duration: 4000 },
          });
          break;

        case 404:
          toast.showErrorToast({
            title: "Error",
            message: errorResponse.data || "Proveedor no encontrado.",
            options: { duration: 4000 },
          });
          break;

        case 409:
          toast.showErrorToast({
            title: "Conflicto",
            message:
              errorResponse.data?.mensaje ||
              "Datos duplicados en otro proveedor.",
            options: { duration: 4000 },
          });
          break;

        case 500:
          const serverError = errorResponse.data;
          const errorMessage =
            serverError?.message ||
            "Ocurrió un error al intentar actualizar el proveedor.";

          const innerError = serverError?.innerExceptionDetails
            ? `\nError interno: ${serverError.innerExceptionDetails}`
            : "";

          toast.showErrorToast({
            title: "Error del servidor",
            message: `${errorMessage}${innerError}`,
            options: { duration: 6000 },
          });

          console.error("Detalles del error:", {
            message: serverError?.message,
            errorDetails: serverError?.errorDetails,
            innerException: serverError?.innerExceptionDetails,
          });
          break;

        default:
          toast.showErrorToast({
            title: "Error",
            message: "Error inesperado al actualizar el proveedor",
            options: { duration: 4000 },
          });
      }
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
                onClick={() => navigate("/proveedores")}
                className="text-gray-600 hover:text-gray-800 flex items-center"
                aria-label="Volver a proveedores"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="ml-1">Volver</span>
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
              Editar Proveedor
            </h2>
            <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
              {loading ? (
                <div className="text-center text-gray-500 py-8">
                  Cargando...
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cuit del proveedor
                    </label>
                    <input
                      name="CUIT"
                      value={form.CUIT}
                      onChange={handleChange}
                      placeholder="CUIT (ej. 20-12345678-3)"
                      required
                      pattern="\d{2}-\d{8}-\d{1}"
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre / Razón social
                    </label>

                    <input
                      name="LegalName"
                      value={form.LegalName}
                      onChange={handleChange}
                      placeholder="Razón Social"
                      required
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      name="Address"
                      value={form.Address}
                      onChange={handleChange}
                      placeholder="Dirección"
                      required
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      name="Phone"
                      value={form.Phone}
                      onChange={handleChange}
                      placeholder="Teléfono"
                      required
                      className="w-full border px-3 py-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      name="Email"
                      value={form.Email}
                      onChange={handleChange}
                      placeholder="Email"
                      required
                      className="w-full border px-3 py-2 rounded mb-5"
                    />
                  </div>

                  <div className="flex gap-2 justify-end mt-">
                    <button
                      type="button"
                      onClick={() => navigate("/proveedores")}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-full"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50"
                    >
                      {loading ? "Guardando..." : "Guardar cambios"}
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

export default EditSupplier;
