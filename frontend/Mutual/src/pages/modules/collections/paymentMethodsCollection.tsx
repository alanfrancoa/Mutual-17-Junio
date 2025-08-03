import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";

interface ICollectionMethod {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

const PaymentMethodsCollection: React.FC = () => {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<ICollectionMethod[]>([]);
  const [filteredMethods, setFilteredMethods] = useState<ICollectionMethod[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newMethod, setNewMethod] = useState({ code: "", name: "" });

  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "Administrador" && userRole !== "Gestor" && userRole !== "Consultor") {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    fetchMethods();
  }, []);

  useEffect(() => {
    const filtered = methods.filter(
      (method) =>
        method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        method.code.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMethods(filtered);
  }, [methods, searchTerm]);

  const fetchMethods = async () => {
    setLoading(true);
    try {
      const data = await apiMutual.GetCollectionMethods();
      setMethods(data);
      setError("");
    } catch (err: any) {
      setError(err.message || "Error al cargar métodos de cobro");
      setMethods([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!newMethod.code.trim() || !newMethod.name.trim()) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      await apiMutual.RegisterCollectionMethod(newMethod.code.trim(), newMethod.name.trim());
      setSuccess("Método de cobro registrado correctamente");
      setNewMethod({ code: "", name: "" });
      setShowModal(false);
      await fetchMethods();
    } catch (err: any) {
      setError(err.message || "Error al registrar método de cobro");
    }
  };

  const handleToggleMethodStatus = async (id: number, name: string, currentStatus: boolean) => {
    const action = currentStatus ? "desactivar" : "activar";
    if (!window.confirm(`¿Está seguro de ${action} el método "${name}"?`)) {
      return;
    }

    try {
      if (currentStatus) {
        await apiMutual.DeleteCollectionMethod(id);
        setSuccess("Método de cobro desactivado correctamente");
      } else {
        await apiMutual.ActivateCollectionMethod(id);
        setSuccess("Método de cobro activado correctamente");
      }
      await fetchMethods();
    } catch (err: any) {
      setError(err.message || `Error al ${action} método de cobro`);
    }
  };

  const userRole = sessionStorage.getItem("userRole");
  const canModify = userRole === "Administrador" || userRole === "Gestor";

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: "18rem" }}>
     <Header hasNotifications={true} loans={[]}  />
        <div className="flex flex-col items-center py-8">
          <div className="w-full max-w-6xl bg-white rounded-lg shadow p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Métodos de Cobro</h2>
              {canModify && (
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Agregar Método
                </button>
              )}
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

            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="text-lg text-gray-600">Cargando métodos de cobro...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">ID</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Código</th>
                      <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Nombre</th>
                      <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-700">Estado</th>
                      {canModify && (
                        <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-700">Acciones</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMethods.length === 0 ? (
                      <tr>
                        <td
                          colSpan={canModify ? 5 : 4}
                          className="text-center py-8 text-gray-500"
                        >
                          {searchTerm ? "No se encontraron métodos de cobro" : "No hay métodos de cobro registrados"}
                        </td>
                      </tr>
                    ) : (
                      filteredMethods.map((method, index) => (
                        <tr
                          key={method.id}
                          className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-25"}`}
                        >
                          <td className="border border-gray-300 px-4 py-3">{method.id}</td>
                          <td className="border border-gray-300 px-4 py-3 font-medium">{method.code}</td>
                          <td className="border border-gray-300 px-4 py-3">{method.name}</td>
                          <td className="border border-gray-300 px-4 py-3 text-center">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                method.isActive
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {method.isActive ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          {canModify && (
                            <td className="border border-gray-300 px-4 py-3 text-center">
                              <button
                                onClick={() => handleToggleMethodStatus(method.id, method.name, method.isActive)}
                                className={`px-3 py-1 rounded text-sm ${
                                  method.isActive
                                    ? "bg-red-500 hover:bg-red-600 text-white"
                                    : "bg-green-500 hover:bg-green-600 text-white"
                                }`}
                              >
                                {method.isActive ? "Desactivar" : "Activar"}
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => navigate("/cobros")}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Volver a Cobros
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Agregar Método de Cobro</h3>

            <form onSubmit={handleCreateMethod}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Código</label>
                <select
      value={newMethod.code}
      onChange={(e) => setNewMethod({ ...newMethod, code: e.target.value })}
      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
      required
    >
      <option value="">Seleccione un código...</option>
      <option value="Automatico">Automático</option>
      <option value="Transferencia">Transferencia</option>
      <option value="Efectivo">Efectivo</option>
    </select>
  </div>
  <div className="mb-4">
    <label className="block text-sm font-medium mb-2">Nombre</label>
    <input
      type="text"
      value={newMethod.name}
      onChange={(e) => setNewMethod({ ...newMethod, name: e.target.value })}
      className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
      required
    />
  </div>
  <div className="flex justify-end gap-2">
    <button
      type="button"
      onClick={() => {
        setShowModal(false);
        setNewMethod({ code: "", name: "" });
        setError("");
      }}
      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
    >
      Cancelar
    </button>
    <button
      type="submit"
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
    >
      Guardar
    </button>
  </div>
</form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethodsCollection;