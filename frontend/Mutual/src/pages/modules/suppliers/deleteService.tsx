import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";

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

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/services`);
        if (!response.ok) throw new Error("No se pudo obtener el servicio");
        const data = await response.json();
        const found = data.find((o: Service) => o.Id === Number(id));
        if (!found) throw new Error("Servicio no encontrado");
        setService(found);
      } catch (err: any) {
        setError(err.message || "Error al cargar el servicio");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchService();
  }, [id]);

  const handleInactivate = async () => {
    setError("");
    setSuccess("");
    if (!window.confirm("¿Seguro que deseas desactivar este servicio?")) return;
    try {
      const response = await fetch(`/services/${id}/state`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(false),
      });
      if (!response.ok) throw new Error("No se pudo desactivar el servicio");
      setSuccess("Servicio desactivado correctamente");
      setTimeout(() => navigate("/proveedores/servicios"), 1200);
    } catch {
      setError("Error al desactivar el servicio");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Cargando servicio...</span>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-600">{error || "Servicio no encontrado"}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
     <Header hasNotifications={true} loans={[]}  />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6 text-red-700">Desactivar Orden de Servicio</h2>
          <div className="mb-4">
            <div><b>ID:</b> {service.Id}</div>
            <div><b>Tipo de Servicio:</b> {service.ServiceType}</div>
            <div><b>Descripción:</b> {service.Description}</div>
            <div><b>Costo Mensual:</b> ${service.MonthlyCost}</div>
            <div><b>Proveedor:</b> {service.Supplier}</div>
            <div>
              <b>Estado:</b>{" "}
              <span className={service.Active ? "text-green-600" : "text-red-600"}>
                {service.Active ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleInactivate}
              className="bg-red-600 text-white px-4 py-2 rounded"
              disabled={!service.Active}
            >
              Desactivar Servicio
            </button>
            <button
              type="button"
              onClick={() => navigate("/proveedores/ordenes")}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </div>
          {success && <div className="text-green-600 mt-4">{success}</div>}
          {error && <div className="text-red-600 mt-4">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default DeleteService;