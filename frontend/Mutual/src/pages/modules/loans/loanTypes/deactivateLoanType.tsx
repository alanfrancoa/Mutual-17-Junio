import React, { ReactNode, useState } from "react";
import { apiMutual } from "../../../../api/apiMutual";
import DeactivateLoanTypeModal from "../../../../components/ui/loanTypeDeactivateModal";
import useAppToast from "../../../../hooks/useAppToast";

interface DeactivateLoanTypeButtonProps {
  loanTypeId: number;
  loanTypeName: string;
  isActive: boolean;
  onDeactivated: (id: number) => void;
  children?: ReactNode;
}

const DeactivateLoanTypeButton: React.FC<DeactivateLoanTypeButtonProps> = ({
  loanTypeId,
  loanTypeName,
  isActive,
  onDeactivated,
  children,
}) => {
  const { showSuccessToast, showErrorToast } = useAppToast();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const openModal = () => {
    setModalError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmDeactivation = async () => {
    setIsLoading(true);
    setModalError(null);

    try {
      const response = await apiMutual.DeactivateLoanType(loanTypeId);
      showSuccessToast({
        title: "Éxito",
        message:
          response.message || "Tipo de préstamo desactivado exitosamente.",
      });
      onDeactivated(loanTypeId);
      closeModal();
    } catch (err: any) {
      let errorMessage =
        err.response?.data?.message ||
        err.response?.data?.mensaje ||
        "Error al desactivar el tipo de préstamo.";
      setModalError(errorMessage);
      showErrorToast({
        title: "Error",
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition text-xs font-medium disabled:opacity-50"
        onClick={openModal}
        disabled={!isActive}
      >
        {children || "Desactivar"}
      </button>

      <DeactivateLoanTypeModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDeactivation}
        loanTypeId={loanTypeId}
        loanTypeName={loanTypeName}
        modalError={modalError}
        isLoading={isLoading}
      />
    </>
  );
};

export default DeactivateLoanTypeButton;
