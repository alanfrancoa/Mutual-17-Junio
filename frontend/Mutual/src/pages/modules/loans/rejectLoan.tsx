// src/components/LoanActions/RejectLoanButton.tsx
import React, { useState } from "react";
import { apiMutual } from "../../../api/apiMutual";
import LoanStatusModal from "../../../components/LoanModal";
import { ILoanList } from "../../../types/loans/ILoanList";
import useAppToast from "../../../hooks/useAppToast"; 

interface RejectLoanButtonProps {
  loan: ILoanList;
  onRefreshLoans: () => Promise<void>; 
}

const RejectLoanButton: React.FC<RejectLoanButtonProps> = ({
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

  const handleConfirmReject = async () => {
    if (!motive.trim()) {
      setModalError("El motivo es obligatorio para el rechazo.");
      return;
    }
    if (loan.status === "Rechazado") {
      setModalError("El préstamo ya está rechazado.");
      return;
    }

    setLoading(true);
    setModalError(null); 

    try {
      await apiMutual.UpdateLoan(loan.id!, {
        status: "Rechazado",
        reason: motive,
      });
      showSuccessToast({ message: "Préstamo aprobado con éxito." }); 
      await onRefreshLoans(); 
      handleCloseModal();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Ocurrió un error al rechazar el préstamo.";
      setModalError(errorMessage);
      showErrorToast({ message: errorMessage }); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition text-xs font-medium disabled:opacity-50"
        onClick={handleOpenModal}
        disabled={loan.status !== "Pendiente" || loading}
      >
        {loading ? "Rechazando..." : "Rechazar"}
      </button>

      {showModal && (
        <LoanStatusModal
          loanId={loan.id!}
          isOpen={showModal}
          onClose={handleCloseModal}
          onConfirm={handleConfirmReject}
          actionType="Rechazado"
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

export default RejectLoanButton;
