import React, { useState, useEffect } from "react";
import { apiMutual } from "../../../api/apiMutual";
import { IPaymentCreate, IPaymentList, IPaymentMethod } from "../../../types/IPayment";
import useAppToast from "../../../hooks/useAppToast";

interface PaymentManagementProps {
  invoiceId: number;
  invoiceTotal: number;
  invoicePaid: boolean;
  onPaymentsUpdate?: () => void;
}

const PaymentManagement: React.FC<PaymentManagementProps> = ({
  invoiceId,
  invoiceTotal,
  invoicePaid,
  onPaymentsUpdate
}) => {
  const [paymentLines, setPaymentLines] = useState<IPaymentCreate[]>([]);
  const [savedPayments, setSavedPayments] = useState<IPaymentList[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [remainingBalance, setRemainingBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showCancelPrompt, setShowCancelPrompt] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(null);
  const { showSuccessToast, showErrorToast } = useAppToast();

  useEffect(() => {
    loadInitialData();
  }, [invoiceId]);

  useEffect(() => {
    const activePaidAmount = savedPayments
      .filter(p => p.status === 'Activo')
      .reduce((sum, p) => sum + p.amount, 0);
    
    setTotalPaid(activePaidAmount);
    setRemainingBalance(invoiceTotal - activePaidAmount);
    
    console.log("=== RECALCULO DE SALDOS ===");
    console.log("Pagos guardados:", savedPayments);
    console.log("Pagos activos:", savedPayments.filter(p => p.status === 'Activo'));
    console.log("Total pagado (solo activos):", activePaidAmount);
    console.log("Saldo restante:", invoiceTotal - activePaidAmount);
  }, [invoiceTotal, savedPayments]);

  const loadInitialData = async () => {
    try {
      const [paymentMethodsData] = await Promise.all([
        apiMutual.GetPaymentMethods(),
      ]);

      setPaymentMethods((paymentMethodsData as IPaymentMethod[]).filter((pm: IPaymentMethod) => pm.active));
      await loadSavedPayments();
    } catch (error) {
      console.error("Error al cargar datos iniciales:", error);
    }
  };

  const loadSavedPayments = async () => {
    try {
      console.log("=== CARGANDO PAGOS ===");
      
      // Obtener todos los pagos (activos y cancelados)
      const [activePayments, cancelledPayments] = await Promise.all([
        apiMutual.GetSupplierPayments("Activo"),
        apiMutual.GetSupplierPayments("Cancelado")
      ]);

      // Combinar pagos activos y cancelados
      const allPayments = [...activePayments, ...cancelledPayments];
      const invoicePayments = allPayments.filter((p: IPaymentList) => p.invoiceId === invoiceId);
      setSavedPayments(invoicePayments);

    } catch (error) {
      console.error("Error al cargar pagos:", error);
      setSavedPayments([]);
      setTotalPaid(0);
      setRemainingBalance(invoiceTotal);
    }
  };

  const addPaymentLine = () => {
    const newPayment: IPaymentCreate = {
      invoiceId: invoiceId,
      paymentDate: new Date().toISOString().split('T')[0],
      amount: 0,
      methodId: 0,
      receiptNumber: "",
      notes: "",
    };
    setPaymentLines([...paymentLines, newPayment]);
  };

  const removePaymentLine = (index: number) => {
    setPaymentLines(paymentLines.filter((_, i) => i !== index));
  };

  const updatePaymentLine = (index: number, field: keyof IPaymentCreate, value: any) => {
    const updatedLines = paymentLines.map((line, i) => {
      if (i === index) {
        return {
          ...line,
          [field]: field === "amount" || field === "methodId" ? Number(value) : value
        };
      }
      return line;
    });
    setPaymentLines(updatedLines);
  };

  const saveAllPayments = async () => {
  try {
    if (paymentLines.length === 0) {
      showErrorToast({
        title: "Error",
        message: "No hay pagos para guardar"
      });
      return;
    }

    // Validaciones individuales
    for (let i = 0; i < paymentLines.length; i++) {
      const payment = paymentLines[i];

      if (!payment.methodId) {
        showErrorToast({
          title: "Error de validación",
          message: `Línea ${i + 1}: Debe seleccionar un método de pago`
        });
        return;
      }

      if (!payment.amount || payment.amount <= 0) {
        showErrorToast({
          title: "Error de validación",
          message: `Línea ${i + 1}: El monto debe ser mayor a cero`
        });
        return;
      }

      if (!payment.receiptNumber.trim()) {
        showErrorToast({
          title: "Error de validación",
          message: `Línea ${i + 1}: El número de recibo es obligatorio`
        });
        return;
      }

      if (!payment.paymentDate) {
        showErrorToast({
          title: "Error de validación",
          message: `Línea ${i + 1}: La fecha de pago es obligatoria`
        });
        return;
      }
    }

    const currentRemainingBalance = invoiceTotal - totalPaid;
    const totalNewPayments = paymentLines.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
    
    if (totalNewPayments > currentRemainingBalance) {
      showErrorToast({
        title: "Error de validación",
        message: `El total de pagos ($${totalNewPayments.toLocaleString()}) no puede exceder el saldo pendiente ($${currentRemainingBalance.toLocaleString()})`
      });
      return;
    }

    setLoading(true);

    let savedCount = 0;
    for (let i = 0; i < paymentLines.length; i++) {
      const payment = paymentLines[i];
      try {
        console.log(`Guardando pago ${i + 1}:`, payment);
        await apiMutual.RegisterSupplierPayment(payment);
        savedCount++;
      } catch (paymentError: any) {
        console.error(`Error en pago ${i + 1}:`, paymentError);

        let errorMessage = `Error en línea ${i + 1}: `;

        if (paymentError.response?.data?.message) {
          errorMessage += paymentError.response.data.message;
        } else if (paymentError.message) {
          errorMessage += paymentError.message;
        } else {
          errorMessage += "Error desconocido";
        }

        if (savedCount > 0) {
          errorMessage = `Se guardaron ${savedCount} pagos correctamente. ${errorMessage}`;
          await loadSavedPayments();
          setPaymentLines(paymentLines.slice(savedCount));
        }

        showErrorToast({
          title: "Error",
          message: errorMessage
        });
        return;
      }
    }

    setPaymentLines([]);
    await loadSavedPayments();
    showSuccessToast({
      title: "Éxito",
      message: `${savedCount} pagos registrados correctamente`
    });

    if (onPaymentsUpdate) {
      onPaymentsUpdate();
    }
  } catch (error: any) {
    console.error("Error general al guardar pagos:", error);

    let errorMessage = "Error al registrar pagos: ";

    if (error.response?.data?.message) {
      errorMessage += error.response.data.message;
    } else if (error.message) {
      errorMessage += error.message;
    } else {
      errorMessage += "Error desconocido";
    }

    showErrorToast({
      title: "Error",
      message: errorMessage
    });
  } finally {
    setLoading(false);
  }
};

  const handleCancelPayment = async (paymentId: number) => {
    setSelectedPaymentId(paymentId);
    setShowCancelPrompt(true);
  };

  const confirmCancelPayment = async () => {
    if (!cancelReason || !cancelReason.trim()) {
      showErrorToast({
        title: "Error",
        message: "Debe ingresar un motivo de cancelación"
      });
      return;
    }

    try {
      setLoading(true);
      await apiMutual.CancelSupplierPayment(selectedPaymentId!, cancelReason.trim());
      
      await loadSavedPayments();
      showSuccessToast({
        title: "Éxito",
        message: "Pago cancelado correctamente"
      });

      if (onPaymentsUpdate) {
        onPaymentsUpdate();
      }

      // Limpiar el estado
      setShowCancelPrompt(false);
      setCancelReason("");
      setSelectedPaymentId(null);
    } catch (error: any) {
      showErrorToast({
        title: "Error",
        message: `Error al cancelar el pago: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-blue-900 mb-4">Gestión de Pagos</h3>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Total: ${invoiceTotal.toLocaleString()}</span> |
          <span className="font-medium text-green-600 ml-2">Pagado: ${totalPaid.toLocaleString()}</span> |
          <span className="font-medium text-orange-600 ml-2">Saldo: ${remainingBalance.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método de Pago
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Recibo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {savedPayments.map((payment) => (
              <tr key={`saved-${payment.id}`} className={`hover:bg-gray-50 ${
                payment.status === 'Cancelado' ? 'bg-red-50' : ''
              }`}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  payment.status === 'Activo' ? 'text-green-600' : 'text-red-500 line-through'
                }`}>
                  ${payment.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {payment.receiptNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    payment.status === 'Activo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {payment.status === 'Activo' ? (
                    <button
                      onClick={() => handleCancelPayment(payment.id)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-full text-sm inline-flex items-center w-22"
                      disabled={loading}
                    >
    
                      Cancelar
                    </button>
                  ) : (
                    <span className="text-gray-400 text-xs">Cancelado</span>
                  )}  
                </td>
              </tr>
            ))}

            {/* Líneas de pagos nuevos */}
            {paymentLines.map((payment, index) => (
              <tr key={`new-${index}`} className="bg-blue-50 hover:bg-blue-100">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="date"
                    value={payment.paymentDate}
                    onChange={(e) => updatePaymentLine(index, 'paymentDate', e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none focus:border-blue-500"
                    disabled={loading}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="number"
                    value={payment.amount}
                    onChange={(e) => updatePaymentLine(index, 'amount', e.target.value)}
                    min="0.01"
                    max={remainingBalance}
                    step="0.01"
                    className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none focus:border-blue-500"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={payment.methodId}
                    onChange={(e) => updatePaymentLine(index, 'methodId', e.target.value)}
                    className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none focus:border-blue-500"
                    disabled={loading}
                  >
                    <option value="">Seleccione...</option>
                    {paymentMethods.map(method => (
                      <option key={method.id} value={method.id}>
                        {method.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="text"
                    value={payment.receiptNumber}
                    onChange={(e) => updatePaymentLine(index, 'receiptNumber', e.target.value)}
                    maxLength={50}
                    className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none focus:border-blue-500"
                    placeholder="REC-001"
                    disabled={loading}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    Nuevo
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => removePaymentLine(index)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm inline-flex items-center w-22"
                    disabled={loading}
                  >
                    <span className="mr-1">×</span>
                    Quitar
                  </button>
                </td>
              </tr>
            ))}

            {/* Filas para notas */}
            {paymentLines.map((payment, index) => (
              <tr key={`notes-${index}`} className="bg-blue-25">
                <td className="px-6 py-2 text-xs text-gray-500">
                  Notas #{index + 1}:
                </td>
                <td colSpan={5} className="px-6 py-2">
                  <input
                    type="text"
                    value={payment.notes || ""}
                    onChange={(e) => updatePaymentLine(index, 'notes', e.target.value)}
                    maxLength={250}
                    className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:outline-none focus:border-blue-500"
                    placeholder="Observaciones opcionales"
                    disabled={loading}
                  />
                </td>
              </tr>
            ))}

            {/* Fila vacía si no hay pagos */}
            {savedPayments.length === 0 && paymentLines.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  <div className="text-sm">No hay pagos registrados para esta factura</div>
                  <div className="text-xs mt-1">Haz clic en "Agregar línea" para comenzar</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-2">
          {!invoicePaid && remainingBalance > 0 && (
            <button
              type="button"
              onClick={addPaymentLine}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm inline-flex items-center"
              disabled={loading}
            >
              <span className="mr-1">+</span>
              Agregar línea
            </button>
          )}
          {paymentLines.length > 0 && (
            <button
              type="button"
              onClick={() => setPaymentLines([])}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full text-sm inline-flex items-center"
              disabled={loading}
            >
              <span className="mr-1">×</span>
              Limpiar Todo
            </button>
          )}
        </div>

        {/* Resumen y botón de guardado */}
        {paymentLines.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                Total a registrar: ${paymentLines.reduce((sum, p) => sum + (Number(p.amount) || 0), 0).toLocaleString()}
              </span>
            </div>
            {/* Botón Guardar Cambios */}
            <button
              type="button"
              onClick={saveAllPayments}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm inline-flex items-center"
              disabled={loading || paymentLines.length === 0}
            >
              {loading ? (
                <>
                  <span className="mr-1">⌛</span>
                  Guardando...
                </>
              ) : (
                <>
                  <span className="mr-1">✓</span>
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mensajes de estado */}
      {invoicePaid && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-green-600 text-lg mr-2">✅</div>
            <div className="text-green-800 font-medium">
              Esta factura está completamente pagada
            </div>
          </div>
        </div>
      )}

      {!invoicePaid && remainingBalance <= 0 && totalPaid > 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <div className="text-yellow-600 text-lg mr-2">⚠️</div>
            <div className="text-yellow-800">
              <div className="font-medium">Factura con saldo cero</div>
              <div className="text-sm">El sistema actualizará automáticamente el estado a "Pagada"</div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de cancelación */}
      {showCancelPrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Cancelar Pago</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de cancelación
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Ingrese el motivo de la cancelación..."
                maxLength={250}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowCancelPrompt(false);
                  setCancelReason("");
                  setSelectedPaymentId(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmCancelPayment}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700"
                disabled={loading}
              >
                {loading ? "Procesando..." : "Confirmar Cancelación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;