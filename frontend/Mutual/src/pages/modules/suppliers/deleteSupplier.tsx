import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";

interface Supplier {
  id: number;
  cuit: string;
  legalName: string;
  address: string;
  phone: string;
  email: string;
  active?: boolean;
}

const DeleteSupplier: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const data = await apiMutual.GetSupplierById(Number(id));
        setSupplier({
          id: data.id,
          cuit: data.cuit,
          legalName: data.legalName,
          address: data.address,
          phone: data.phone,
          email: data.email,
          active: data.active,
        });
      } catch {
        setError("Error al cargar el proveedor");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSupplier();
  }, [id]);

  const handleChangeStatus = async (newStatus: boolean) => {
    setSuccess("");
    setError("");
    try {
      await apiMutual.ChangeSupplierStatus(Number(id), newStatus);
      setSuccess(
        newStatus
          ? "Proveedor reactivado correctamente"
          : "Proveedor inactivado correctamente"
      );
      //mostrar el estado actualizado
      const data = await apiMutual.GetSupplierById(Number(id));
      setSupplier({
        id: data.id,
        cuit: data.cuit,
        legalName: data.legalName,
        address: data.address,
        phone: data.phone,
        email: data.email,
        active: data.active,
      });
      // setTimeout(() => navigate("/proveedores/allsuppliers"), 1200);
    } catch {
      setError("Error al cambiar el estado del proveedor");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span>Cargando proveedor...</span>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-600">{error || "Proveedor no encontrado"}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">
            {supplier.active ? "Inactivar" : "Reactivar"} Proveedor
          </h2>
          <div className="mb-4">
            <strong>CUIT:</strong> {supplier.cuit}
            <br />
            <strong>Razón Social:</strong> {supplier.legalName}
            <br />
            <strong>Dirección:</strong> {supplier.address}
            <br />
            <strong>Teléfono:</strong> {supplier.phone}
            <br />
            <strong>Email:</strong> {supplier.email}
            <br />
            <strong>Estado:</strong>{" "}
            {supplier.active ? "Activo" : "Inactivo"}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/proveedores")}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
            {supplier.active ? (
              <button
                type="button"
                onClick={() => handleChangeStatus(false)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Inactivar proveedor
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleChangeStatus(true)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Reactivar proveedor
              </button>
            )}
          </div>
          {success && <div className="text-green-600 mt-4">{success}</div>}
          {error && <div className="text-red-600 mt-4">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default DeleteSupplier;