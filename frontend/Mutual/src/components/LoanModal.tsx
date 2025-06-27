// src/components/LoanStatusModal.tsx
import React, { useState } from 'react';
import { apiMutual } from '../api/apiMutual'; 
import { ILoanUpdate } from '../types/ILoanUpdate'; 
import Modal from './modal';

interface LoanStatusModalProps {
  loanId: number;
  isOpen: boolean;
  onClose: () => void;

  onUpdateSuccess: (message: string) => void;
  
  actionType: "Aprobado" | "Rechazado";
}

function LoanStatusModal({ loanId, isOpen, onClose, onUpdateSuccess, actionType }: LoanStatusModalProps) {
  const [reason, setReason] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
    if (error) setError(null); // Limpiar error 
  };

  const handleConfirmUpdate = async () => {
    // Validaciones
    if (reason.length < 10 || reason.length > 500) {
      setError('La razón debe tener entre 10 y 500 caracteres.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const dataToSend: ILoanUpdate = {
      status: actionType, 
      reason: reason,
    };

    try {
     
      const result = await apiMutual.UpdateLoan(loanId, dataToSend);
      onUpdateSuccess(result.reason); 
      handleCloseModalLogic(); 
    } catch (err: any) {
      console.error('Error al actualizar el estado del préstamo:', err);
       setError(err.message || 'Ocurrió un error inesperado al actualizar el estado.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModalLogic = () => {
    setReason('');
    setError(null);
    setIsLoading(false);
    onClose();
  };

  
  const modalContent = (
    <>
      <p className="mb-4">
        {`¿Está seguro de que desea ${actionType.toLowerCase()} el préstamo ID ${loanId}?`}
      </p>
      <div className="mb-4">
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
          Motivo <span className="text-red-500">*</span>
        </label>
        <textarea
          id="reason"
          placeholder="Escribe la razón (mínimo 10 caracteres, máximo 500)..."
          value={reason}
          onChange={handleReasonChange}
          rows={5}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 resize-y"
          disabled={isLoading}
        />
      </div>
      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      title={actionType === 'Rechazado' ? "Rechazar Préstamo" : "Aprobar Préstamo"}
      message={modalContent}
      confirmText={actionType === 'Rechazado' ? "Confirmar Rechazo" : "Confirmar Aprobación"}
      cancelText="Cancelar"
      onConfirm={handleConfirmUpdate}
      onCancel={handleCloseModalLogic}
    />
  );
}

export default LoanStatusModal;