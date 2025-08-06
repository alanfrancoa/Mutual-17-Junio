import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import useAppToast from "../../../hooks/useAppToast";

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
  const { showSuccessToast, showErrorToast } = useAppToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      } catch (error: any) {
        const errorMessage =
          error.response?.status === 404
            ? "Proveedor no encontrado."
            : "Error al cargar el proveedor";

        setError(errorMessage);
        showErrorToast({
          title: "Error al cargar proveedor",
          message: errorMessage,
          options: { duration: 4000 },
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSupplier();
  }, [id]);

  const handleChangeStatus = async (newStatus: boolean) => {
    setSuccess("");
    setError("");
    setModalError(null);
    setIsProcessing(true);

    try {
      await apiMutual.ChangeSupplierStatus(Number(id), newStatus);

      showSuccessToast({
        title: newStatus ? "Proveedor reactivado" : "Proveedor inactivado",
        message: newStatus
          ? "El proveedor ha sido reactivado correctamente"
          : "El proveedor ha sido inactivado correctamente",
        options: { duration: 3000 },
      });

      try {
        const data = await apiMutual.GetSupplierById(Number(id));
        setSupplier((prev) => (prev ? { ...prev, active: data.active } : null));
      } catch (error) {
        console.error("Error al actualizar estado del proveedor:", error);
      }

      setIsModalOpen(false);
      setTimeout(() => navigate("/proveedores"), 1500);
    } catch (error: any) {
      const errorResponse = error.response;

      if (!errorResponse) {
        const message =
          "No se pudo establecer conexión con el servidor. Por favor, intente nuevamente.";
        setModalError(message);
        showErrorToast({
          title: "Error de conexión",
          message,
          options: { duration: 5000 },
        });
        return;
      }

      switch (errorResponse.status) {
        case 400:
          const badRequestMessage =
            "Datos inválidos para actualizar el estado del proveedor.";
          setModalError(badRequestMessage);
          showErrorToast({
            title: "Error de validación",
            message: badRequestMessage,
            options: { duration: 4000 },
          });
          break;

        case 401:
          const unauthorizedMessage =
            errorResponse.data?.mensaje ||
            "No tiene permisos para realizar esta acción.";
          setModalError(unauthorizedMessage);
          showErrorToast({
            title: "No autorizado",
            message: unauthorizedMessage,
            options: { duration: 4000 },
          });
          break;

        case 404:
          const notFoundMessage = "Proveedor no encontrado.";
          setModalError(notFoundMessage);
          showErrorToast({
            title: "Error",
            message: notFoundMessage,
            options: { duration: 4000 },
          });
          break;

        case 500:
          const serverError = errorResponse.data;
          const errorMessage =
            serverError?.message ||
            "Ocurrió un error al intentar actualizar el estado del proveedor.";
          const errorDetails = serverError?.errorDetails
            ? `\nDetalle: ${serverError.errorDetails}`
            : "";
          const innerError = serverError?.innerExceptionDetails
            ? `\nError interno: ${serverError.innerExceptionDetails}`
            : "";

          const fullErrorMessage = `${errorMessage}${errorDetails}${innerError}`;
          setModalError(fullErrorMessage);
          showErrorToast({
            title: "Error del servidor",
            message: fullErrorMessage,
            options: { duration: 6000 },
          });
          break;

        default:
          const defaultMessage =
            "Error inesperado al actualizar el estado del proveedor.";
          setModalError(defaultMessage);
          showErrorToast({
            title: "Error",
            message: defaultMessage,
            options: { duration: 4000 },
          });
      }

      console.error("Error al actualizar estado del proveedor:", {
        status: errorResponse?.status,
        data: errorResponse?.data,
        error: error,
      });
    } finally {
      setIsProcessing(false);
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
        <span className="text-red-600">
          {error || "Proveedor no encontrado"}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} loans={[]} />
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
            <strong>Estado:</strong> {supplier.active ? "Activo" : "Inactivo"}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/proveedores")}
              className="bg-gray-400 text-white px-4 py-2 rounded"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            {supplier.active ? (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-red-600 text-white px-4 py-2 rounded"
                disabled={isProcessing}
              >
                Inactivar proveedor
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleChangeStatus(true)}
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={isProcessing}
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
