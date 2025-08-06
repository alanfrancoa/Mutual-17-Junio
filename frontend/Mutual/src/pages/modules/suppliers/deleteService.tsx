import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import useAppToast from "../../../hooks/useAppToast";

export interface Service {
  Id: number;
  Description: string;
  MonthlyCost: number;
  Active: boolean;
  Supplier: string;
  ServiceType: string;
}

const DeleteService: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast, showWarningToast } = useAppToast();

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      if (!id) {
        showErrorToast({
          title: "ID inválido",
          message: "ID de servicio no válido",
        });
        setLoading(false);
        return;
      }

      try {
        const data = await apiMutual.GetServices();
        const found = data.find((s: any) => s.id === Number(id));

        if (!found) {
          showErrorToast({
            title: "Servicio no encontrado",
            message: "No se encontró el servicio solicitado",
          });
          setLoading(false);
          return;
        }

        setService({
          Id: found.id,
          Description: found.description,
          MonthlyCost: found.monthlyCost,
          Active: found.active,
          Supplier: found.proveedor || "Sin proveedor",
          ServiceType: found.serviceType || "Sin tipo",
        });
      } catch (err: any) {
        console.error("Error al cargar servicio:", err);
        showErrorToast({
          title: "Error de carga",
          message: err.message || "Error al cargar el servicio",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const handleInactivate = async () => {
    if (!service) return;

    if (!window.confirm("¿Seguro que deseas desactivar este servicio?")) return;

    setProcessing(true);

    try {
      await apiMutual.UpdateServiceStatus(service.Id);

      showSuccessToast({
        title: "Servicio desactivado",
        message: "El servicio fue desactivado correctamente",
      });

      setTimeout(() => navigate("/proveedores/servicios"), 1500);
    } catch (err: any) {
      console.error("Error al desactivar servicio:", err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.mensaje ||
        (typeof err.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Error desconocido";

      showErrorToast({
        title: "Error al desactivar",
        message: errorMessage,
      });
    } finally {
      setProcessing(false);
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

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1" style={{ marginLeft: "18rem" }}>
          <Header hasNotifications={true} loans={[]} />
          <div className="flex items-center justify-center py-8">
            <div className="text-red-600 text-lg">Servicio no encontrado</div>
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
        <div className="flex flex-col items-center py-8 flex-1">
          <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6 text-red-700">
              Desactivar Servicio
            </h2>
            <div className="mb-6 space-y-2">
              <div><b>ID:</b> {service.Id}</div>
              <div><b>Tipo de Servicio:</b> {service.ServiceType}</div>
              <div><b>Descripción:</b> {service.Description}</div>
              <div><b>Costo Mensual:</b> ${service.MonthlyCost.toLocaleString()}</div>
              <div><b>Proveedor:</b> {service.Supplier}</div>
              <div>
                <b>Estado:</b>{" "}
                <span
                  className={
                    service.Active ? "text-green-600" : "text-red-600"
                  }
                >
                  {service.Active ? "Activo" : "Inactivo"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => navigate("/proveedores/servicios")}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition disabled:opacity-50" 
                disabled={processing}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleInactivate}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition disabled:opacity-50"
                disabled={!service.Active || processing}
              >
                {processing ? "Desactivando..." : "Desactivar Servicio"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteService;