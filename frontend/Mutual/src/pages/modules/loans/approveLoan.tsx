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
      return;
    }
    if (loan.status === "Aprobado") {
      setModalError("El préstamo ya está aprobado.");
      return;
    }

    setLoading(true);
    setModalError(null);

    try {
      await apiMutual.UpdateLoan(loan.id!, {
        status: "Aprobado",
        reason: motive,
      });
      showSuccessToast({ message: "Préstamo aprobado con éxito." }); 
      await onRefreshLoans();
      handleCloseModal();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        "Ocurrió un error al aprobar el préstamo.";
      setModalError(errorMessage);
      showErrorToast({ message: errorMessage }); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full transition text-xs font-medium disabled:opacity-50"
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