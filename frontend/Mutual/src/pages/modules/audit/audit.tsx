import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { apiMutual } from "../../../api/apiMutual";
import { AuditLog } from "../../../types/auditLog";

const SYSTEM_MODULES = [
  { value: "todos", label: "Todos los módulos" },
  { value: "Usuarios", label: "Usuarios" },
  { value: "Proveedores", label: "Proveedores" },
  { value: "Auditoria", label: "Auditoría" },
  { value: "Prestamos", label: "Préstamos" },
  { value: "Asociados", label: "Asociados" },
];

const ACTION_TYPES = [
  { value: "todos", label: "Todas las acciones" },
  { value: "Creación", label: "Creaciones" },
  { value: "Modificación", label: "Modificaciones" },
  { value: "Eliminación", label: "Eliminaciones" },
  { value: "Consulta", label: "Consultas" },
  { value: "Aprobación", label: "Aprobaciones" },
];

// Opciones de paginación
const DEFAULT_PAGE_SIZE = 10;

const AuditTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string>("todos");
  const [selectedAction, setSelectedAction] = useState<string>("todos");

  const getActionFromDescription = (description: string): string => {
    if (!description) return "Desconocida";
    if (description.includes("creó") || description.includes("Creación"))
      return "Creación";
    if (
      description.includes("actualizó") ||
      description.includes("Actualización") ||
      description.includes("Modificación")
    )
      return "Modificación";
    if (description.includes("eliminó") || description.includes("Eliminación"))
      return "Eliminación";
    if (description.includes("consultó") || description.includes("Consulta"))
      return "Consulta";
    if (
      description.includes("aprobación") ||
      description.includes("Aprobación")
    )
      return "Aprobación";
    return "Desconocida";
  };

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: AuditLog[];
      if (selectedModule === "todos") {
        data = await apiMutual.GetAuditLogs();
      } else {
        data = await apiMutual.GetAuditLogsByEntityType(selectedModule);
      }

      setAuditLogs(data);
    } catch (err) {
      console.error("Error fetching audit logs:", err);
      setError("Error al cargar los registros de auditoría.");
    } finally {
      setLoading(false);
    }
  }, [selectedModule]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const handleFilterChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (value: string) => {
      setter(value);
      setPage(1);
    };

  const filteredAudits = auditLogs.filter((audit) => {
    const auditAction = getActionFromDescription(audit.description ?? "");
    const matchesAction =
      selectedAction === "todos" || auditAction === selectedAction;

    const matchesSearch =
      audit.createdBy.toString().includes(search.toLowerCase()) ||
      audit.description?.toLowerCase().includes(search.toLowerCase()) ||
      new Date(audit.created_At).toLocaleString().includes(search);
    return matchesAction && matchesSearch;
  });

  // Paginación
  const totalPages = Math.ceil(filteredAudits.length / DEFAULT_PAGE_SIZE);
  const paginatedAudits = filteredAudits.slice(
    (page - 1) * DEFAULT_PAGE_SIZE,
    page * DEFAULT_PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar fija a la izquierda */}
      <Sidebar />

      {/* Contenido principal*/}
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        {/* Header */}
        <Header hasNotifications={false} />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Auditoría</h1>

          <div className="flex-1 w-full">
            <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
              {/* Search, filters */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Buscar por usuario, detalle o fecha..."
                    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  {/* Module Filter */}
                  <select
                    className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700"
                    value={selectedModule}
                    onChange={(e) =>
                      handleFilterChange(setSelectedModule)(e.target.value)
                    }
                  >
                    {SYSTEM_MODULES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {/* Action Filter */}
                  <select
                    className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700"
                    value={selectedAction}
                    onChange={(e) =>
                      handleFilterChange(setSelectedAction)(e.target.value)
                    }
                  >
                    {ACTION_TYPES.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Audit table */}
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Cargando registros de auditoría...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Error: {error}
                </div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Fecha/Hora
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Módulo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Acción
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Detalle
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAudits.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-8 text-gray-400"
                        >
                          No hay registros de auditoría con los filtros
                          aplicados
                        </td>
                      </tr>
                    ) : (
                      paginatedAudits.map((audit) => (
                        <tr
                          key={audit.id}
                          className={
                            audit.id % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-4 py-4 border-b whitespace-nowrap">
                            {new Date(audit.created_At).toLocaleString()}{" "}
                          </td>
                          <td className="px-4 py-4 border-b whitespace-nowrap">
                            {audit.createdBy}{" "}
                          </td>
                          <td className="px-4 py-4 border-b whitespace-nowrap">
                            {audit.entityType}{" "}
                          </td>
                          <td className="px-4 py-4 border-b whitespace-nowrap">
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                              getActionFromDescription(audit.description)
                            </span>
                          </td>
                          <td className="px-4 py-4 border-b whitespace-nowrap">
                            {audit.description}{" "}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* Paginacion */}
              {!loading && !error && (
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
                    {filteredAudits.length} registro(s) de auditoría
                    encontrado(s)
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AuditTable;
