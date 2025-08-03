import React, { useState, useEffect } from "react";
import { apiMutual } from "../../../api/apiMutual";
import { IPaymentCreate, IPaymentList, IPaymentMethod } from "../../../types/IPayment";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadInitialData();
  }, [invoiceId]);

  useEffect(() => {
    setRemainingBalance(invoiceTotal - totalPaid);
  }, [invoiceTotal, totalPaid]);

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
      //Obtener todos los pagos (activos y cancelados)
      const [activePayments, cancelledPayments] = await Promise.all([
        apiMutual.GetSupplierPayments("Activo"),
        apiMutual.GetSupplierPayments("Cancelado")
      ]);

      // Combinar pagos activos y cancelados
      const allPayments = [...activePayments, ...cancelledPayments];
      const invoicePayments = allPayments.filter((p: IPaymentList) => p.invoiceId === invoiceId);
      setSavedPayments(invoicePayments);
      
      const activeInvoicePayments = invoicePayments.filter((p: IPaymentList) => p.status === 'Activo');
      const totalPaidAmount = activeInvoicePayments.reduce((sum: number, p: IPaymentList) => sum + p.amount, 0);
      setTotalPaid(totalPaidAmount);
      setRemainingBalance(invoiceTotal - totalPaidAmount);
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
    setError("");
    setSuccess("");

    try {
      if (paymentLines.length === 0) {
        window.alert("No hay pagos para guardar");
        return;
      }

      // Validaciones individuales
      for (let i = 0; i < paymentLines.length; i++) {
        const payment = paymentLines[i];
        
        if (!payment.methodId) {
          window.alert(`Línea ${i + 1}: Debe seleccionar un método de pago`);
          return;
        }
        
        if (!payment.amount || payment.amount <= 0) {
          window.alert(`Línea ${i + 1}: El monto debe ser mayor a cero`);
          return;
        }
        
        if (!payment.receiptNumber.trim()) {
          window.alert(`Línea ${i + 1}: El número de recibo es obligatorio`);
          return;
        }
        
        if (!payment.paymentDate) {
          window.alert(`Línea ${i + 1}: La fecha de pago es obligatoria`);
          return;
        }
      }

      // Validar números de recibo únicos entre líneas nuevas
      const receiptNumbers = paymentLines.map(p => p.receiptNumber.trim().toLowerCase());
      const duplicatesInNewLines = receiptNumbers.filter((item, index) => receiptNumbers.indexOf(item) !== index);
      if (duplicatesInNewLines.length > 0) {
        window.alert(`Hay números de recibo duplicados en las líneas nuevas`);
        return;
      }

      const activePayments = savedPayments.filter(p => p.status === 'Activo');
      const existingActiveReceipts = activePayments.map(p => p.receiptNumber.toLowerCase());
      const duplicatesWithActive = receiptNumbers.filter(num => existingActiveReceipts.includes(num));
      if (duplicatesWithActive.length > 0) {
        window.alert(`Los siguientes números de recibo ya existen en pagos activos para esta factura: ${duplicatesWithActive.join(', ')}`);
        return;
      }

      // Validar suma total contra saldo pendiente de pagos activos
      const totalNewPayments = paymentLines.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      if (totalNewPayments > remainingBalance) {
        window.alert(`El total de pagos ($${totalNewPayments.toLocaleString()}) no puede exceder el saldo pendiente ($${remainingBalance.toLocaleString()})`);
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
          
          setError(errorMessage);
          setTimeout(() => setError(""), 8000);
          return;
        }
      }

      setPaymentLines([]);
      await loadSavedPayments();
      setSuccess(`${savedCount} pagos registrados correctamente`);
      
      if (onPaymentsUpdate) {
        onPaymentsUpdate();
      }
      
      setTimeout(() => setSuccess(""), 3000);
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
      
      setError(errorMessage);
      setTimeout(() => setError(""), 8000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelPayment = async (paymentId: number) => {
    const reason = window.prompt("Ingrese el motivo de cancelación:");
    if (!reason || !reason.trim()) {
      window.alert("Debe ingresar un motivo de cancelación");
      return;
    }

    if (!window.confirm("¿Está seguro que desea cancelar este pago?")) {
      return;
    }

    try {
      setLoading(true);
      await apiMutual.CancelSupplierPayment(paymentId, reason.trim());
      await loadSavedPayments();
      setSuccess("Pago cancelado correctamente");
      
      if (onPaymentsUpdate) {
        onPaymentsUpdate();
      }
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError(`Error al cancelar el pago: ${error.message}`);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Gestión de Pagos</h3>
        <div className="text-sm text-gray-600">
          <span className="font-medium">Total: ${invoiceTotal.toLocaleString()}</span> | 
          <span className="font-medium text-green-600 ml-2">Pagado: ${totalPaid.toLocaleString()}</span> | 
          <span className="font-medium text-orange-600 ml-2">Saldo: ${remainingBalance.toLocaleString()}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

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
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
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
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                    disabled={loading}
                  >
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm inline-flex items-center"
              disabled={loading}
            >
              <span className="mr-1">+</span>
              Agregar línea
            </button>
          )}
        </div>

        {/* Resumen y botones de guardado */}
        {paymentLines.length > 0 && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                Total a registrar: ${paymentLines.reduce((sum, p) => sum + (Number(p.amount) || 0), 0).toLocaleString()}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPaymentLines([])}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                disabled={loading}
              >
                Limpiar Todo
              </button>
              <button
                type="button"
                onClick={saveAllPayments}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
                disabled={loading || paymentLines.length === 0}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
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
    </div>
  );
};

export default PaymentManagement;