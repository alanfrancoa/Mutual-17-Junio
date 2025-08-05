import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

interface NewPaymentMethod {
  name: string;
  code: string;
}

interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  active: boolean;
}

const PaymentMethods: React.FC = () => {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [newPaymentMethods, setNewPaymentMethods] = useState<NewPaymentMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<Partial<PaymentMethod>>({});
  const { showSuccessToast, showErrorToast } = useAppToast();

  // Verificar permisos
  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "Administrador") {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      setDataLoading(true);
      const data = await apiMutual.GetPaymentMethods();
      setPaymentMethods(data);
    } catch (error: any) {
      showErrorToast({ message: error.message || "Error al cargar los métodos de pago" });
    } finally {
      setDataLoading(false);
    }
  };

  const addPaymentMethodLine = () => {
    setNewPaymentMethods([...newPaymentMethods, { name: "", code: "" }]);
  };

  const removePaymentMethodLine = (index: number) => {
    setNewPaymentMethods(newPaymentMethods.filter((_, i) => i !== index));
  };

  const updatePaymentMethodLine = (index: number, field: keyof NewPaymentMethod, value: string) => {
    const updated = newPaymentMethods.map((method, i) => {
      if (i === index) {
        return { ...method, [field]: value };
      }
      return method;
    });
    setNewPaymentMethods(updated);
  };

  const saveAllPaymentMethods = async () => {
    try {
      if (newPaymentMethods.length === 0) {
        showErrorToast({ message: "No hay métodos de pago para guardar" });
        return;
      }

      // Validaciones
      for (let i = 0; i < newPaymentMethods.length; i++) {
        const method = newPaymentMethods[i];
        
        if (!method.name.trim()) {
          showErrorToast({ message: `Línea ${i + 1}: El nombre es obligatorio` });
          return;
        }
        
        if (!method.code.trim()) {
          showErrorToast({ message: `Línea ${i + 1}: El código es obligatorio` });
          return;
        }
      }

      // Validar códigos únicos
      const codes = newPaymentMethods.map(m => m.code.trim().toLowerCase());
      const duplicates = codes.filter((item, index) => codes.indexOf(item) !== index);
      if (duplicates.length > 0) {
        showErrorToast({ message: "Hay códigos duplicados en las líneas" });
        return;
      }

      setLoading(true);
      
      for (const method of newPaymentMethods) {
        await apiMutual.RegisterPaymentMethod(method.code.trim(), method.name.trim());
      }

      setNewPaymentMethods([]);
      await loadPaymentMethods();
      showSuccessToast({
        title: "Métodos guardados",
        message: "Los métodos de pago se registraron correctamente"
      });
    } catch (error: any) {
      showErrorToast({ message: error.message || "Error al guardar los métodos de pago" });
    } finally {
      setLoading(false);
    }
  };

  const togglePaymentMethodStatus = async (id: number) => {
    try {
      setLoading(true);
      await apiMutual.PaymentMethodState(id);
      await loadPaymentMethods();
      showSuccessToast({ message: "Estado actualizado correctamente" });
    } catch (error: any) {
      showErrorToast({ message: error.message || "Error al cambiar el estado" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (index: number) => {
    try {
      const method = paymentMethods[index];

      if (!editedRow.name?.trim() || !editedRow.code?.trim()) {
        showErrorToast({ message: "El nombre y código no pueden estar vacíos" });
        return;
      }

      setLoading(true);
      await apiMutual.UpdatePaymentMethod(method.id, {
        name: editedRow.name ?? method.name,
        code: editedRow.code ?? method.code,
      });

      await loadPaymentMethods();
      setEditIndex(null);
      setEditedRow({});
      showSuccessToast({ message: "Método de pago actualizado correctamente" });
    } catch (error: any) {
      showErrorToast({ message: error.message || "Error al actualizar el método de pago" });
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
          <Header hasNotifications={true} loans={[]} />
          <div className="flex flex-col items-center justify-center py-8 flex-1">
            <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 text-center">
              <div className="text-lg text-gray-600">Cargando métodos de pago...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} loans={[]} />
        
        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <div className="flex justify-start mb-4">
            <button
              onClick={() => navigate("/proveedores/servicios")}
              className="text-gray-600 hover:text-gray-800 flex items-center"
              aria-label="Volver a Servicios"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="ml-1">Volver</span>
            </button>
          </div>
          
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Métodos de Pago
          </h1>

          <div className="flex-1 w-full">
            <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
              {/* Botón agregar */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex gap-2 w-full md:w-auto">
                  {/* Espacio para futuras funcionalidades de búsqueda */}
                </div>
                <button
                  onClick={addPaymentMethodLine}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-semibold shadow transition w-full md:w-auto"
                  disabled={loading}
                >
                  + Agregar Método
                </button>
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Código
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Métodos existentes */}
                  {paymentMethods.map((method, index) => (
                    <tr key={method.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editedRow.name ?? method.name}
                            onChange={(e) =>
                              setEditedRow({ ...editedRow, name: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        ) : (
                          method.name
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editedRow.code ?? method.code}
                            onChange={(e) =>
                              setEditedRow({ ...editedRow, code: e.target.value })
                            }
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                          />
                        ) : (
                          method.code
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            method.active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {method.active ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                        <div className="space-x-2 flex justify-end">
                          {editIndex === index ? (
                            <>
                              <button
                                onClick={() => handleSaveEdit(index)}
                                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition text-xs font-medium"
                                disabled={loading}
                              >
                                Guardar
                              </button>
                              <button
                                onClick={() => {
                                  setEditIndex(null);
                                  setEditedRow({});
                                }}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full transition text-xs font-medium"
                                disabled={loading}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditIndex(index);
                                  setEditedRow(method);
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full transition text-xs font-medium"
                                disabled={loading}
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => togglePaymentMethodStatus(method.id)}
                                className={`${
                                  method.active
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-green-500 hover:bg-green-600"
                                } text-white px-6 py-2 rounded-full transition text-xs font-medium`}
                                disabled={loading}
                              >
                                {method.active ? "Desactivar" : "Activar"}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Líneas nuevas */}
                  {newPaymentMethods.map((method, index) => (
                    <tr key={`new-${index}`} className="bg-blue-50 hover:bg-blue-100">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={method.name}
                          onChange={(e) => updatePaymentMethodLine(index, 'name', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nombre del método"
                          disabled={loading}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={method.code}
                          onChange={(e) => updatePaymentMethodLine(index, 'code', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Código"
                          disabled={loading}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          Nuevo
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                        <div className="space-x-2 flex justify-end">
                          <button
                            onClick={() => removePaymentMethodLine(index)}
                            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition text-xs font-medium"
                            disabled={loading}
                          >
                            Quitar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Fila vacía */}
                  {paymentMethods.length === 0 && newPaymentMethods.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-gray-400">
                        No hay métodos de pago registrados. Haz clic en "Agregar Método" para comenzar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Botones de acción para nuevos métodos */}
              {newPaymentMethods.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
                  <div className="flex justify-center items-center gap-4 flex-1">
                    <span className="text-gray-700 font-medium">
                      {newPaymentMethods.length} método(s) por guardar
                    </span>
                  </div>
                  <div className="flex gap-2 md:w-auto w-full">
                    <button
                      onClick={() => setNewPaymentMethods([])}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full transition duration-200 ease-in-out flex-1 md:flex-initial"
                      disabled={loading}
                    >
                      Limpiar Todo
                    </button>
                    <button
                      onClick={saveAllPaymentMethods}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition duration-200 ease-in-out disabled:opacity-50 flex-1 md:flex-initial"
                      disabled={loading}
                    >
                      {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PaymentMethods;
