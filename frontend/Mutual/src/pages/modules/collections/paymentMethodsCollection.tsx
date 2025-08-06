import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

interface ICollectionMethod {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

interface NewCollectionMethod {
  code: string;
  name: string;
  wasEdited?: boolean;
}

const PAGE_SIZE = 10;

const PaymentMethodsCollection: React.FC = () => {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<ICollectionMethod[]>([]);
  const [newMethods, setNewMethods] = useState<NewCollectionMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<Partial<ICollectionMethod>>({});
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { showSuccessToast, showErrorToast } = useAppToast();

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

  const fetchMethods = async () => {
    setDataLoading(true);
    try {
      const data = await apiMutual.GetCollectionMethods();
      if (Array.isArray(data)) {
        setMethods(data);
      } else {
        setMethods([]);
        showErrorToast({ message: "Formato de datos incorrecto" });
      }
    } catch (err: any) {
      setMethods([]);
      showErrorToast({ message: err.message || "Error al cargar métodos de cobro" });
    } finally {
      setDataLoading(false);
    }
  };

  // Filtrado de métodos
  const getFilteredMethods = () => {
    return methods.filter(method => {
      if (!searchTerm) return true;
      
      const lowerSearchTerm = searchTerm.toLowerCase();
      return (
        method.name.toLowerCase().includes(lowerSearchTerm) ||
        method.code.toLowerCase().includes(lowerSearchTerm) ||
        (method.isActive ? "activo" : "inactivo").includes(lowerSearchTerm) ||
        method.id.toString().includes(searchTerm)
      );
    });
  };

  const filteredMethods = getFilteredMethods();
  const totalPages = Math.max(1, Math.ceil(filteredMethods.length / PAGE_SIZE));
  const paginatedMethods = filteredMethods.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchTerm]);

  const handleAddRow = () => {
    setNewMethods([...newMethods, { code: "", name: "", wasEdited: false }]);
  };

  const handleNewRowChange = (
    index: number,
    field: keyof NewCollectionMethod,
    value: string | boolean
  ) => {
    setNewMethods(prevRows => {
      const updatedRows = [...prevRows];
      if (field === "wasEdited") {
        updatedRows[index][field] = Boolean(value);
      } else {
        updatedRows[index][field] = value as string;
      }
      updatedRows[index].wasEdited = true;
      return updatedRows;
    });
  };

  const removeMethodLine = (index: number) => {
    const row = newMethods[index];
    if (row.wasEdited) {
      showErrorToast({ message: "No puedes quitar una línea que ya fue editada" });
      return;
    }
    setNewMethods(newMethods.filter((_, i) => i !== index));
  };

  const handleSaveNewMethods = async () => {
    try {
      if (newMethods.length === 0) {
        showErrorToast({ message: "No hay métodos de cobro para guardar" });
        return;
      }

      // Validaciones
      for (let i = 0; i < newMethods.length; i++) {
        const method = newMethods[i];
        
        if (!method.code || !method.name) {
          showErrorToast({ message: `Línea ${i + 1}: Completa todos los campos` });
          return;
        }
      }

      // Validar códigos únicos
      const codes = newMethods.map(m => m.code.trim().toLowerCase());
      const duplicates = codes.filter((item, index) => codes.indexOf(item) !== index);
      if (duplicates.length > 0) {
        showErrorToast({ message: "Hay códigos duplicados en las líneas" });
        return;
      }

      setLoading(true);
      
      for (const method of newMethods) {
        await apiMutual.RegisterCollectionMethod(method.code.trim(), method.name.trim());
      }

      setNewMethods([]);
      await fetchMethods();
      showSuccessToast({
        title: "Métodos guardados",
        message: "Los métodos de cobro se registraron correctamente"
      });
    } catch (err: any) {
      showErrorToast({ message: err.message || "Error al agregar métodos de cobro" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMethodStatus = async (id: number, name: string, currentStatus: boolean) => {
    try {
      setLoading(true);
      if (currentStatus) {
        await apiMutual.DeleteCollectionMethod(id);
        showSuccessToast({ message: `Método "${name}" desactivado correctamente` });
      } else {
        await apiMutual.ActivateCollectionMethod(id);
        showSuccessToast({ message: `Método "${name}" activado correctamente` });
      }
      await fetchMethods();
    } catch (err: any) {
      showErrorToast({ message: err.message || "Error al cambiar el estado del método" });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (index: number) => {
    try {
      const method = filteredMethods[index];

      if (!editedRow.name?.trim() || !editedRow.code?.trim()) {
        showErrorToast({ message: "El nombre y código no pueden estar vacíos" });
        return;
      }

      setLoading(true);
      await apiMutual.UpdateCollectionMethod(method.id, {
        name: editedRow.name ?? method.name,
        code: editedRow.code ?? method.code,
      });

      await fetchMethods();
      setEditIndex(null);
      setEditedRow({});
      showSuccessToast({ message: "Método de cobro actualizado correctamente" });
    } catch (err: any) {
      showErrorToast({ message: err.message || "Error al actualizar el método de cobro" });
    } finally {
      setLoading(false);
    }
  };

  const userRole = sessionStorage.getItem("userRole");
  const canModify = userRole === "Administrador" || userRole === "Gestor";

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
          <Header hasNotifications={true} loans={[]} />
          <div className="flex flex-col items-center justify-center py-8 flex-1">
            <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 text-center">
              <div className="text-lg text-gray-600">Cargando métodos de cobro...</div>
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
        
        <main className="flex-1 p-6 bg-gray-100">
          <div className="flex justify-start mb-4">
            <button
              onClick={() => navigate("/cobros")}
              className="text-gray-600 hover:text-gray-800 flex items-center"
              aria-label="Volver a Cobros"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="ml-1">Volver</span>
            </button>
          </div>
          
          <h1 className="text-2xl font-bold text-blue-900 mb-4">
            Métodos de Cobro
          </h1>

          <div className="flex-1 w-full">
            <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex gap-2 w-full md:w-auto">
                  {/* Búsqueda */}
                  <input
                    type="text"
                    placeholder="Buscar por ID, nombre, código o estado..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {canModify && (
                  <button
                    onClick={handleAddRow}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-semibold shadow transition w-full md:w-auto"
                    disabled={loading}
                  >
                    + Agregar Método
                  </button>
                )}
              </div>

              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
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
                  {paginatedMethods.map((method, index) => {
                    const globalIndex = filteredMethods.indexOf(method);
                    return (
                      <tr key={method.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {method.id}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editIndex === globalIndex ? (
                            <input
                              type="text"
                              value={editedRow.name ?? method.name}
                              onChange={(e) =>
                                setEditedRow({ ...editedRow, name: e.target.value })
                              }
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={loading}
                              maxLength={255}
                            />
                          ) : (
                            method.name
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {editIndex === globalIndex ? (
                            <select
                              value={editedRow.code ?? method.code}
                              onChange={(e) =>
                                setEditedRow({ ...editedRow, code: e.target.value })
                              }
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={loading}
                            >
                              <option value="">Seleccione un código...</option>
                              <option value="Transferencia">Transferencia</option>
                              <option value="Automatico">Automático</option>
                              <option value="Efectivo">Efectivo</option>
                            </select>
                          ) : (
                            method.code
                          )}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              method.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {method.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                          <div className="space-x-2 flex justify-end">
                            {editIndex === globalIndex ? (
                              <>
                                <button
                                  onClick={() => handleSaveEdit(globalIndex)}
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
                                {canModify && (
                                  <button
                                    onClick={() => {
                                      setEditIndex(globalIndex);
                                      setEditedRow(method);
                                    }}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full transition text-xs font-medium"
                                    disabled={loading}
                                  >
                                    Editar
                                  </button>
                                )}
                                {canModify && (
                                  <button
                                    onClick={() => handleToggleMethodStatus(method.id, method.name, method.isActive)}
                                    className={`${
                                      method.isActive
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-green-500 hover:bg-green-600"
                                    } text-white px-6 py-2 rounded-full transition text-xs font-medium`}
                                    disabled={loading}
                                  >
                                    {method.isActive ? "Desactivar" : "Activar"}
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {/* Líneas nuevas */}
                  {newMethods.map((method, idx) => (
                    <tr key={`new-${idx}`} className="bg-blue-50 hover:bg-blue-100">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        Nuevo
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={method.name}
                          onChange={(e) => handleNewRowChange(idx, "name", e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nombre del método"
                          disabled={loading}
                          maxLength={255}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={method.code}
                          onChange={(e) => handleNewRowChange(idx, "code", e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          disabled={loading}
                        >
                          <option value="">Seleccione un código...</option>
                          <option value="Transferencia">Transferencia</option>
                          <option value="Automatico">Automático</option>
                          <option value="Efectivo">Efectivo</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          Nuevo
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                        <div className="space-x-2 flex justify-end">
                          <button
                            onClick={() => removeMethodLine(idx)}
                            className={`bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition text-xs font-medium ${
                              method.wasEdited ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            disabled={loading || method.wasEdited}
                            title={method.wasEdited ? "No puedes quitar una línea que ya fue editada" : ""}
                          >
                            Quitar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {/* Fila vacía */}
                  {paginatedMethods.length === 0 && newMethods.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-400">
                        {searchTerm ? "No se encontraron métodos de cobro que coincidan con la búsqueda." : "No hay métodos de cobro registrados. Haz clic en \"Agregar Método\" para comenzar."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Paginación */}
              {filteredMethods.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
                  <div className="flex justify-center items-center gap-4 flex-1">
                    <button
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      aria-label="Anterior"
                    >
                      <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                    </button>
                    <span className="text-gray-700">
                      Página {page} de {totalPages}
                    </span>
                    <button
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      aria-label="Siguiente"
                    >
                      <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                  <span className="text-gray-500 text-sm md:ml-4 md:w-auto w-full text-center md:text-right">
                    {filteredMethods.length} método(s) encontrado(s)
                  </span>
                </div>
              )}

              {/* Botones de acción para nuevos métodos */}
              {newMethods.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2 pt-4 border-t border-gray-200">
                  <div className="flex justify-center items-center gap-4 flex-1">
                    <span className="text-gray-700 font-medium">
                      {newMethods.length} método(s) por guardar
                    </span>
                  </div>
                  <div className="flex gap-2 md:w-auto w-full">
                    <button
                      onClick={() => setNewMethods([])}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full transition duration-200 ease-in-out flex-1 md:flex-initial"
                      disabled={loading}
                    >
                      Limpiar Todo
                    </button>
                    <button
                      onClick={handleSaveNewMethods}
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

export default PaymentMethodsCollection;