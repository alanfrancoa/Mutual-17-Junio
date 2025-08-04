import React, { useState } from "react";
import { apiMutual } from "../../../../api/apiMutual";
import RelativeStatusModal from "../../../../components/ui/relativeStatusModal";
import { relative } from "path";
import useAppToast from "../../../../hooks/useAppToast";

interface DeleteAndReactivateRelativeProps {
  relativeId: number;
  currentStatus: boolean;
  onStatusChanged: () => Promise<void>;
  legalName: string;
  dni: string;
}

const DeleteAndReactivateRelative: React.FC<
  DeleteAndReactivateRelativeProps
> = ({ relativeId, currentStatus, onStatusChanged, legalName, dni }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const { showSuccessToast, showErrorToast } = useAppToast();

  const buttonText = currentStatus ? "Dar de Baja" : "Reactivar";
  const buttonClassName = `${
    currentStatus
      ? "bg-red-500 hover:bg-red-600"
      : "bg-green-500 hover:bg-green-600"
  } text-white px-6 py-2 rounded-full transition text-xs font-medium`;

  const handleConfirmStatus = async () => {
    setIsLoading(true);
    setModalError(null);

    //si pasa la validacion, continua cambiando el status
    try {
      const newStatus = !currentStatus;
      const response = await apiMutual.ChangeRelativeStatus(
        relativeId,
        newStatus
      );
      setIsModalOpen(false);
      setIsLoading(false);
      showSuccessToast({
        title: "Operación exitosa",
        message: response.mensaje || "Estado actualizado correctamente",
      });
      await onStatusChanged();
    } catch (err: any) {
      let errorMsg = "Error al cambiar el estado del familiar.";
      if (err.response?.status === 500) {
        errorMsg = "Error del sistema. Intente nuevamente más tarde.";
      } else if (err.response?.status === 409) {
        errorMsg =
          "No se puede reactivar al familiar porque su DNI ya está registrado como un asociado.";
      } else if (err.response?.data?.mensaje) {
        errorMsg = err.response.data.mensaje;
      } else if (err.message) {
        errorMsg = err.message;
      }
      setModalError(errorMsg);
      setIsLoading(false);
      showErrorToast({
        title: "Error",
        message: errorMsg,
      });
    }
  };

  return (
    <>
      <button
        className={buttonClassName}
        onClick={() => {
          setModalError(null);
          setIsModalOpen(true);
        }}
        disabled={isLoading}
      >
        {isLoading ? "Cargando..." : buttonText}
      </button>
      <RelativeStatusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmStatus}
        relativeName={legalName}
        action={currentStatus ? "deactivate" : "reactivate"}
        modalError={modalError}
        isLoading={isLoading}
      />
    </>
  );
};

export default DeleteAndReactivateRelative;
