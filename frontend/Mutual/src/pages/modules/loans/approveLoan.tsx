// src/components/LoanActions/ApproveLoanButton.tsx
import React, { useState } from "react";
import { apiMutual } from "../../../api/apiMutual";
import LoanStatusModal from "../../../components/LoanModal";
import { ILoanList } from "../../../types/loans/ILoanList";
import useAppToast from "../../../hooks/useAppToast";

interface ApproveLoanButtonProps {
  loan: ILoanList;
  onRefreshLoans: () => Promise<void>;
}

const ApproveLoanButton: React.FC<ApproveLoanButtonProps> = ({
  loan,
  onRefreshLoans,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [motive, setMotive] = useState("");
  const [modalError, setModalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { showSuccessToast, showErrorToast } = useAppToast();

  const handleOpenModal = () => {
    setMotive("");
    setModalError(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setMotive("");
    setModalError(null);
  };

  const handleConfirmApprove = async () => {
    if (!motive.trim()) {
      setModalError("El motivo es obligatorio para la aprobación.");
      showErrorToast({
        title: "Error de validación",
        message: "El motivo es obligatorio para la aprobación.",
      });
      return;
    }
    if (loan.status === "Aprobado") {
      setModalError("El préstamo ya está aprobado.");
      showErrorToast({
        title: "Error",
        message: "El préstamo ya está aprobado.",
      });
      return;
    }

    setLoading(true);
    setModalError(null);

    try {
      await apiMutual.UpdateLoan(loan.id!, {
        status: "Aprobado",
        reason: motive,
      });
      showSuccessToast({
        title: "Préstamo aprobado",
        message: "El préstamo ha sido aprobado exitosamente.",
      });
      await onRefreshLoans();
      handleCloseModal();
    } catch (error: any) {
      const statusCode = error.response?.status;
      let title = "Error";
      let message = "Ocurrió un error al aprobar el préstamo.";

      switch (statusCode) {
        case 400:
          title = "Error de validación";
          message =
            error.response?.data?.message ||
            "El motivo debe contener mas de 8 letras.";
          break;
        case 401:
          title = "No autorizado";
          message = "No tiene permisos para realizar esta acción.";
          break;
        case 404:
          title = "No encontrado";
          message = error.response?.data?.message || "Préstamo no encontrado.";
          break;
        case 409:
          title = "Conflicto";
          message =
            error.response?.data?.message ||
            "El préstamo no puede ser aprobado en su estado actual.";
          break;
        case 500:
          title = "Error del servidor";
          message =
            "Ocurrió un error en el servidor. Por favor, inténtelo más tarde.";
         
          break;
      }

      setModalError(message);
      showErrorToast({ title, message });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition text-xs font-medium disabled:opacity-50"
        onClick={handleOpenModal}
        disabled={loan.status !== "Pendiente" || loading}
      >
        {loading ? "Aprobando..." : "Aprobar"}
      </button>

      {showModal && (
        <LoanStatusModal
          loanId={loan.id!}
          isOpen={showModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmApprove}
          actionType="Aprobado"
          motive={motive}
          setMotive={setMotive}
          modalError={modalError}
          isLoading={loading}
          onUpdateSuccess={() => {}}
        />
      )}
    </>
  );
};

export default ApproveLoanButton;
