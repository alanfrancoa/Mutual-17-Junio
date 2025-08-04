"use client";

import React, { useState } from "react";
import ClosePeriodModal from "../../../../components/ui/closePeriodModal";
import { apiMutual } from "../../../../api/apiMutual";
import useAppToast from "../../../../hooks/useAppToast";

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
  const { showSuccessToast, showErrorToast, showInfoToast, showWarningToast } =
    useAppToast();

  const handleOpenModal = () => {
    if (isPeriodAlreadyClosed) {
      showWarningToast({
        title: "Período cerrado",
        message: `El período "${periodCode}" ya está cerrado.`,
      });
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

    showInfoToast({
      title: "Procesando",
      message: `Cerrando período contable ${periodCode}...`,
    });

    try {
      const result = await apiMutual.CloseAccountingPeriod(periodId);

      showSuccessToast({
        title: "Período cerrado",
        message:
          result.message || `Período "${periodCode}" cerrado exitosamente.`,
      });
      handleCloseModal();
      onPeriodClosedSuccess?.(periodId);
    } catch (error: any) {
      if (error.response && error.response.status) {
        switch (error.response.status) {
          case 400: {
            const errorMessage = error.response.data?.message || "";

            // Validación específica para el error de fecha de cierre
            if (
              errorMessage.includes(
                "solo puede ser cerrado en su fecha de finalización"
              )
            ) {
              showWarningToast({
                title: "Período no puede cerrarse aún",
                message: errorMessage,
              });
              setModalError(errorMessage);
            } else {
              showErrorToast({
                title: "Error de validación",
                message:
                  errorMessage ||
                  `El período contable ${periodCode} no puede ser cerrado.`,
              });
              setModalError(
                errorMessage ||
                  `El período contable ${periodCode} no puede ser cerrado.`
              );
            }
            break;
          }

          case 401:
            showErrorToast({
              title: "No autorizado",
              message: "No tiene permisos para cerrar períodos contables.",
            });
            break;

          case 404:
            showErrorToast({
              title: "No encontrado",
              message: "No se encontró el período contable especificado.",
            });
            break;

          case 500:
            showErrorToast({
              title: "Error del servidor",
              message:
                "Ocurrió un error interno al cerrar el período contable.",
            });

            console.error("Detalles del error:", {
              message: error.response.data?.message,
              errorDetails: error.response.data?.errorDetails,
              innerException: error.response.data?.innerExceptionDetails,
            });
            break;

          default:
            showErrorToast({
              title: "Error",
              message: `Error al cerrar el período contable. Status: ${error.response.status}`,
            });
        }
      } else if (error.request) {

        // solicitud hecha pero sin respuestaa
        console.error("No se recibió respuesta del servidor:", error.request);
        showErrorToast({
          title: "Error de conexión",
          message:
            "Se realizó la solicitud pero no se recibió respuesta del servidor.",
        });
       } else {

        // En caso de que el error venga en response
        const errorMessage = error.response?.data?.message || error.message;
        
        if (errorMessage && errorMessage.includes("solo puede ser cerrado en su fecha de finalización")) {
          showWarningToast({
            title: "Período no puede cerrarse aún",
            message: errorMessage,
          });
        } else {
          showErrorToast({
            title: "Error de conexión",
            message: "No se pudo conectar con el servidor. " + errorMessage,
          });
        }
        setModalError(errorMessage || "Ocurrió un error al cerrar el período.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {userRole === "Administrador" && (
        <button
          onClick={handleOpenModal}
          className="bg-red-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
