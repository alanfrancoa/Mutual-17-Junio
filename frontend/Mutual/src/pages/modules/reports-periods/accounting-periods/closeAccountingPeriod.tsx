"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import ClosePeriodModal from "../../../../components/ui/closePeriodModal";


interface CloseAccountingPeriodProps {
  periodId: number;
  periodCode: string;
  onPeriodClosedSuccess?: (periodId: number) => void;
  isPeriodAlreadyClosed: boolean;
}

interface MockActionResult {
  success: boolean;
  message?: string;
  errors?: string[];
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

  const mockClosePeriod = async (data: { periodId: number }): Promise<MockActionResult> => {
    return new Promise<MockActionResult>((resolve) => {
      setTimeout(() => {
        console.log(`[MOCK] Simulating closing period ${data.periodId}`);
        resolve({
          success: true,
          message: `Período "${periodCode}" cerrado (simulado) con éxito.`,
        });
      }, 1500);
    });
  };

  const handleConfirmClosePeriod = async () => {
    setModalError(null);
    setIsLoading(true);
    try {
      const result: MockActionResult = await mockClosePeriod({ periodId });

      if (result.success) {
        toast.success(result.message || `Período "${periodCode}" cerrado con éxito.`);
        handleCloseModal();
        onPeriodClosedSuccess?.(periodId);
      } else {
        const errorMessage = result.errors?.join(", ") || "Ocurrió un error al cerrar el período.";
        setModalError(errorMessage);
        toast.error(`Error al cerrar el período: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error al cerrar el período:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Ocurrió un error inesperado.";
      setModalError(errorMessage);
      toast.error(`Error al cerrar el período: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded transition text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || isPeriodAlreadyClosed}
      >
        {isPeriodAlreadyClosed ? "Período Cerrado" : "Cerrar Período"}
      </button>

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