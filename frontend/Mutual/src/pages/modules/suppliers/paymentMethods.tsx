import React, { useEffect, useState } from "react";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";


interface PaymentMethod {
  Id: number;
  Code: string;
  Name: string;
  Active: boolean;
}

const PaymentMethodsList: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/payment-method");
      if (!response.ok) throw new Error("No se pudieron obtener los métodos de pago");
      const data = await response.json();
      setMethods(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar los métodos de pago");
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas desactivar este método de pago?")) return;
    try {
      const response = await fetch(`/api/payment-method/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(false),
      });
      if (!response.ok) throw new Error("No se pudo desactivar el método de pago");
      setSuccess("Método de pago desactivado correctamente");
      fetchMethods();
    } catch {
      setError("Error al desactivar el método de pago");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await fetch("/api/payment-method", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Code: newCode, Name: newName }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.mensaje || "No se pudo agregar el método de pago");
      }
      setSuccess("Método de pago agregado correctamente");
      setShowNew(false);
      setNewCode("");
      setNewName("");
      fetchMethods();
    } catch (err: any) {
      setError(err.message || "Error al agregar el método de pago");
    }
  };

  return (

     <div className="min-h-screen bg-gray-100 flex">
    <Sidebar />
    <div className="flex-1" style={{ marginLeft: "18rem" }}>
      <Header hasNotifications={true} />
    <div className="flex flex-col items-center py-8">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-bold mb-6">Agregar/Desactivar medios de pago</h2>
        {success && <div className="text-green-600 mb-2">{success}</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <table className="min-w-full divide-y divide-gray-200 mb-4">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Código</th>
              <th className="px-4 py-2 text-left">Estado</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {methods.map((method) => (
              <tr key={method.Id}>
                <td className="px-4 py-2">{method.Name}</td>
                <td className="px-4 py-2">{method.Code}</td>
                <td className="px-4 py-2">
                  {method.Active ? (
                    <span className="text-green-600">Activo</span>
                  ) : (
                    <span className="text-red-600">Inactivo</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {method.Active && (
                    <button
                      onClick={() => handleDeactivate(method.Id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm mr-2"
                    >
                      Desactivar
                    </button>
                  )}
                  <button
                    onClick={() => setShowNew(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  >
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showNew && (
          <form onSubmit={handleAdd} className="flex gap-2 mb-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre"
              required
              maxLength={255}
              className="border px-2 py-1 rounded"
            />
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value)}
              placeholder="Código"
              required
              maxLength={15}
              className="border px-2 py-1 rounded"
            />
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
            >
              Guardar
            </button>
            <button
              type="button"
              onClick={() => setShowNew(false)}
              className="bg-gray-400 text-white px-3 py-1 rounded text-sm"
            >
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
    </div>
    </div>
  );
};

export default PaymentMethodsList;