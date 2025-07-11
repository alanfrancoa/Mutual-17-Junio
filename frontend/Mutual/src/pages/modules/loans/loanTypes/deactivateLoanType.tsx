// src/components/LoanTypes/DeactivateLoanTypeButton.tsx
import React, { ReactNode, useState } from 'react';
import { apiMutual } from '../../../../api/apiMutual'; 
import useAppToast from '../../../../hooks/useAppToast'; 
import DeactivateLoanTypeModal from '../../../../components/ui/loanTypeDeactivateModal';

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
      showSuccessToast({ message: response.message || "Tipo de préstamo desactivado exitosamente." });
      onDeactivated(loanTypeId); 
      closeModal(); 
    } catch (err: any) {
      console.error("Error al desactivar el tipo de préstamo:", err);
      const errorMessage = err.response?.data?.message || "Error al desactivar el tipo de préstamo.";
      setModalError(errorMessage); 
      showErrorToast({ message: errorMessage }); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition text-xs font-medium disabled:opacity-50"
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