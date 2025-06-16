import React, { useState } from "react";
import { apiMutual } from "../../../../api/apiMutual";

interface DeleteAndReactivateRelativeProps {
  relativeId: number;
  currentStatus: boolean; 
  onStatusChanged: () => Promise<void>; 
}

const DeleteAndReactivateRelative: React.FC<DeleteAndReactivateRelativeProps> = ({
  relativeId,
  currentStatus,
  onStatusChanged,
}) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const buttonText = currentStatus ? "Dar de Baja" : "Reactivar";
  const buttonClassName = currentStatus
    ? "text-red-600 hover:text-red-900"
    : "text-green-600 hover:text-green-900";

  const handleChangeStatus = async () => {
    const actionVerb = currentStatus ? "dar de baja" : "reactivar";
    if (
      window.confirm(
        `¿Estás seguro de que quieres ${actionVerb} a este familiar?`
      )
    ) {
      setIsChangingStatus(true);
      try {
        const newStatus = !currentStatus; 
        const response = await apiMutual.ChangeRelativeStatus(
          relativeId,
          newStatus
        );
        alert(response.mensaje);
        await onStatusChanged(); 
      } catch (err: any) {
        console.error("Error al cambiar estado del familiar:", err);
        alert(
          err.response?.data?.mensaje ||
            "Error al cambiar el estado del familiar."
        );
      } finally {
        setIsChangingStatus(false);
      }
    }
  };

  return (
    <button
      onClick={handleChangeStatus}
      className={buttonClassName}
      disabled={isChangingStatus} 
    >
      {isChangingStatus ? "Cargando..." : buttonText}
    </button>
  );
};

export default DeleteAndReactivateRelative;