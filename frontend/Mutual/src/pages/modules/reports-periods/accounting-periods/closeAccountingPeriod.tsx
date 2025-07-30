"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import ClosePeriodModal from "../../../../components/ui/closePeriodModal";
import { apiMutual } from "../../../../api/apiMutual";

interface CloseAccountingPeriodProps {
  periodId: number;
  periodCode: string;
  onPeriodClosedSuccess?: (periodId: number) => void;
  isPeriodAlreadyClosed: boolean;
}

const CloseAccountingPeriod: React.FC<CloseAccountingPeriodProps> = ({
  periodId,
  periodCode,
  onPeriodClosedSuccess,
  isPeriodAlreadyClosed,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const userRole = sessionStorage.getItem("userRole");

  const handleOpenModal = () => {
    if (isPeriodAlreadyClosed) {
      toast.error(`El período "${periodCode}" ya está cerrado.`);
      return;
    }
    setIsModalOpen(true);
    setModalError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalError(null);
  };

  const handleConfirmClosePeriod = async () => {
    setModalError(null);
    setIsLoading(true);
    try {
      const result = await apiMutual.CloseAccountingPeriod(periodId);

      toast.success(
        result.message || `Período "${periodCode}" cerrado con éxito.`
      );
      handleCloseModal();
      onPeriodClosedSuccess?.(periodId);
    } catch (error: any) {
      const errorMessage =
        error?.message ||
        error?.errorDetails ||
        "Ocurrió un error al cerrar el período.";
      setModalError(errorMessage);
      toast.error(`Error al cerrar el período: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {userRole === "Administrador" && (
        <button
          onClick={handleOpenModal}
          className="bg-red-500 hover:bg-orange-600 text-white px-4 py-1 rounded transition text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || isPeriodAlreadyClosed}
        >
          {isPeriodAlreadyClosed ? "Período Cerrado" : "Cerrar Período"}
        </button>
      )}
      {/* Usamos el nuevo modal específico */}
      <ClosePeriodModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmClosePeriod}
        modalError={modalError}
        isLoading={isLoading}
        periodCode={periodCode}
      />
    </>
  );
};

export default CloseAccountingPeriod;
