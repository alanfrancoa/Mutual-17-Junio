import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { IServiceType } from "../../../types/IServiceType";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

interface NewServiceType {
  code: string;
  name: string;
  active?: boolean;
  wasEdited?: boolean;
}

const PAGE_SIZE = 5;

const ServiceTypeList: React.FC = () => {
  const navigate = useNavigate();
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [newRows, setNewRows] = useState<NewServiceType[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<Partial<IServiceType>>({});
  const { showSuccessToast, showErrorToast } = useAppToast();
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<
    "Todos" | "Activo" | "Inactivo"
  >("Todos");
  const [page, setPage] = useState(1);

  // Verificar permisos
  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "Administrador") {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const filtered = serviceTypes.filter(
    (type) =>
      (estadoFiltro === "Todos" ||
        (estadoFiltro === "Activo" ? type.active : !type.active)) &&
      ((type.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (type.code?.toLowerCase() || "").includes(search.toLowerCase()))
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const fetchServiceTypes = async () => {
    setDataLoading(true);
    try {
      const data = await apiMutual.GetServiceTypes();
      if (Array.isArray(data)) {
        setServiceTypes(data);
      } else {
        setServiceTypes([]);
        showErrorToast({ message: "Formato de datos incorrecto" });
      }
    } catch (err: any) {
      setServiceTypes([]);
      if (err.response?.status === 500) {
        const serverError = err.response.data;
        const errorMessage =
          serverError?.message ||
          "Ocurrió un error interno al obtener los tipos de servicios.";
        const innerError = serverError?.innerExceptionDetails
          ? `\nError interno: ${serverError.innerExceptionDetails}`
          : "";
        showErrorToast({
          title: "Error del servidor.",
          message: `${errorMessage}${innerError}`,
          options: { duration: 6000 },
        });
      } else {
        showErrorToast({
          message: err.message || "Error al cargar los tipos de servicio",
        });
      }
    } finally {
      setDataLoading(false);
    }
  };

  const handleAddRow = () => {
    setNewRows([
      ...newRows,
      { code: "", name: "", active: true, wasEdited: false },
    ]);
  };

  const handleNewRowChange = (
    index: number,
    field: keyof NewServiceType,
    value: string | boolean
  ) => {
    setNewRows((prevRows) => {
      const updatedRows = [...prevRows];
      if (field === "active" || field === "wasEdited") {
        updatedRows[index][field] = Boolean(value);
      } else {
        updatedRows[index][field] = value as string;
      }
      updatedRows[index].wasEdited = true;
      return updatedRows;
    });
  };

  const removeServiceTypeLine = (index: number) => {
    const row = newRows[index];
    if (row.wasEdited) {
      showErrorToast({
        message: "No puedes quitar una línea que ya fue editada",
      });
      return;
    }
    setNewRows(newRows.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    try {
      if (newRows.length === 0) {
        showErrorToast({ message: "No hay tipos de servicio para guardar" });
        return;
      }

      for (let i = 0; i < newRows.length; i++) {
        const row = newRows[i];
        if (!row.code || !row.name) {
          showErrorToast({ message: `Completa todos los campos` });
          return;
        }
      }

      const codes = newRows.map((r) => r.code.trim().toLowerCase());
      const duplicates = codes.filter(
        (item, index) => codes.indexOf(item) !== index
      );
      if (duplicates.length > 0) {
        showErrorToast({ message: "Hay códigos duplicados en las líneas" });
        return;
      }

      setLoading(true);

      for (const row of newRows) {
        await apiMutual.RegisterServiceType(row.code, row.name);
      }

      setNewRows([]);
      await fetchServiceTypes();
      showSuccessToast({
        title: "Tipos guardados",
        message: "Los tipos de servicio se registraron correctamente",
      });
    } catch (err: any) {
      let errorMessage = "Error interno al guardar los tipos de servicio";
      if (err?.response?.data) {
        errorMessage =
          err.response.data.message ||
          err.response.data.mensaje ||
          err.response.data.errorDetails ||
          errorMessage;
      } else if (err?.message) {
        errorMessage = err.message;
      }
      showErrorToast({
        title: "Error del servidor.",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleState = async (id: number, newStatus: boolean) => {
    try {
      setLoading(true);
      await apiMutual.ServiceTypeState(id, newStatus);
      await fetchServiceTypes();
      showSuccessToast({ message: "Estado actualizado correctamente" });
    } catch (err: any) {
      showErrorToast({
        message:
          err.message || "Error al cambiar el estado del tipo de servicio",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async (index: number) => {
    try {
      const serviceType = paginated[index];

      if (!editedRow.name?.trim() || !editedRow.code?.trim()) {
        showErrorToast({
          message: "El nombre y código no pueden estar vacíos",
        });
        return;
      }

      setLoading(true);
      await apiMutual.UpdateServiceType(serviceType.id, {
        name: editedRow.name ?? serviceType.name,
        code: editedRow.code ?? serviceType.code,
      });

      await fetchServiceTypes();
      setEditIndex(null);
      setEditedRow({});
      showSuccessToast({
        message: "Tipo de servicio actualizado correctamente",
      });
    } catch (err: any) {
      showErrorToast({
        message: err.message || "Error al actualizar el tipo de servicio",
      });
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
              <div className="text-lg text-gray-600">
                Cargando tipos de servicio...
              </div>
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
            Tipos de Servicio
          </h1>

          <div className="flex-1 w-full">
            <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o código..."
                    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  <select
                    value={estadoFiltro}
                    onChange={(e) => {
                      setEstadoFiltro(
                        e.target.value as "Todos" | "Activo" | "Inactivo"
                      );
                      setPage(1);
                    }}
                    className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Activo">Activos</option>
                    <option value="Inactivo">Inactivos</option>
                  </select>
                </div>
                <button
                  onClick={handleAddRow}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-semibold shadow transition w-full md:w-auto"
                  disabled={loading}
                >
                  + Agregar Tipo
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
                  {paginated.length === 0 && newRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center py-8 text-gray-400"
                      >
                        {search.trim() || estadoFiltro !== "Todos"
                          ? "No se encontraron resultados con los filtros aplicados"
                          : 'No hay tipos de servicio registrados. Haz clic en "Agregar Tipo" para comenzar.'}
                      </td>
                    </tr>
                  ) : (
                    <>
                      {paginated.map((type, index) => (
                        <tr
                          key={type.id}
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {editIndex === index ? (
                              <input
                                type="text"
                                value={editedRow.name ?? type.name}
                                onChange={(e) =>
                                  setEditedRow({
                                    ...editedRow,
                                    name: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                              />
                            ) : (
                              type.name
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {editIndex === index ? (
                              <select
                                value={editedRow.code ?? type.code}
                                onChange={(e) =>
                                  setEditedRow({
                                    ...editedRow,
                                    code: e.target.value,
                                  })
                                }
                                className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                                disabled={loading}
                              >
                                <option value="">
                                  Seleccione un código...
                                </option>
                                <option value="Servicios">Servicios</option>
                                <option value="Productos">Productos</option>
                                <option value="Otros">Otros</option>
                              </select>
                            ) : (
                              type.code
                            )}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                type.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {type.active ? "Activo" : "Inactivo"}
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
                                      setEditedRow(type);
                                    }}
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full transition text-xs font-medium"
                                    disabled={loading}
                                  >
                                    Editar
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleToggleState(type.id, !type.active)
                                    }
                                    className={`${
                                      type.active
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-green-500 hover:bg-green-600"
                                    } text-white px-6 py-2 rounded-full transition text-xs font-medium`}
                                    disabled={loading}
                                  >
                                    {type.active ? "Desactivar" : "Activar"}
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}

                      {newRows.map((row, idx) => (
                        <tr
                          key={`new-${idx}`}
                          className="bg-blue-50 hover:bg-blue-100"
                        >
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={row.name}
                              onChange={(e) =>
                                handleNewRowChange(idx, "name", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Nombre del tipo"
                              disabled={loading}
                              maxLength={255}
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <select
                              value={row.code}
                              onChange={(e) =>
                                handleNewRowChange(idx, "code", e.target.value)
                              }
                              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                              disabled={loading}
                            >
                              <option value="">Seleccione un código...</option>
                              <option value="Servicios">Servicios</option>
                              <option value="Productos">Productos</option>
                              <option value="Otros">Otros</option>
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
                                onClick={() => removeServiceTypeLine(idx)}
                                className={`bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition text-xs font-medium ${
                                  row.wasEdited
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                disabled={loading || row.wasEdited}
                                title={
                                  row.wasEdited
                                    ? "No puedes quitar una línea que ya fue editada"
                                    : ""
                                }
                              >
                                Quitar
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>

              {/* Controles de paginación */}
              {filtered.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
                  <div className="flex justify-center items-center gap-4 flex-1">
                    <button
                      className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
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
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      aria-label="Siguiente"
                    >
                      <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                    </button>
                  </div>
                  <span className="text-gray-500 text-sm md:ml-4 md:w-auto w-full text-center md:text-right">
                    {filtered.length} tipo(s) de servicio encontrado(s)
                  </span>
                </div>
              )}

              {/* Botones de acción para nuevos tipos */}
              {newRows.length > 0 && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
                  <div className="flex justify-center items-center gap-4 flex-1"></div>
                  <div className="flex gap-2 md:w-auto w-full">
                    <button
                      onClick={() => setNewRows([])}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full transition duration-200 ease-in-out flex-1 md:flex-initial"
                      disabled={loading}
                    >
                      Limpiar Todo
                    </button>
                    <button
                      onClick={handleUpdate}
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

export default ServiceTypeList;
