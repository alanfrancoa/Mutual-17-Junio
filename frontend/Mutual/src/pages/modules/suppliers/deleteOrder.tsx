import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";

interface ServiceOrder {
  Id: number;
  TipoServicio: string;
  Description: string;
  MonthlyCost: number;
  Proveedor: string;
  Active: boolean;
}

const DeleteOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<ServiceOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/services`);
        if (!response.ok) throw new Error("No se pudo obtener la orden");
        const data = await response.json();
        const found = data.find((o: ServiceOrder) => o.Id === Number(id));
        if (!found) throw new Error("Orden no encontrada");
        setOrder(found);
      } catch (err: any) {
        setError(err.message || "Error al cargar la orden");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const handleInactivate = async () => {
    setError("");
    setSuccess("");
    if (!window.confirm("¿Seguro que deseas desactivar esta orden de servicio?")) return;
    try {
      const response = await fetch(`/services/${id}/state`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(false),
      });
      if (!response.ok) throw new Error("No se pudo desactivar la orden");
      setSuccess("Orden de servicio desactivada correctamente");
      setTimeout(() => navigate("/proveedores/ordenes"), 1200);
    } catch {
      setError("Error al desactivar la orden");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Cargando orden...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-600">{error || "Orden no encontrada"}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6 text-red-700">Desactivar Orden de Servicio</h2>
          <div className="mb-4">
            <div><b>ID:</b> {order.Id}</div>
            <div><b>Tipo de Servicio:</b> {order.TipoServicio}</div>
            <div><b>Descripción:</b> {order.Description}</div>
            <div><b>Costo Mensual:</b> ${order.MonthlyCost}</div>
            <div><b>Proveedor:</b> {order.Proveedor}</div>
            <div>
              <b>Estado:</b>{" "}
              <span className={order.Active ? "text-green-600" : "text-red-600"}>
                {order.Active ? "Activo" : "Inactivo"}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleInactivate}
              className="bg-red-600 text-white px-4 py-2 rounded"
              disabled={!order.Active}
            >
              Desactivar Orden
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

export default DeleteOrder;