import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { apiMutual } from "../../../api/apiMutual";
import { AuditLog } from "../../../types/auditLog";
import useAppToast from "../../../hooks/useAppToast";

const SYSTEM_MODULES = [
  { value: "todos", label: "Todos los módulos" },
  { value: "Pagos", label: "Pagos" },
  { value: "Cobros", label: "Cobros" },
  { value: "Préstamos", label: "Préstamos" },
  { value: "Reportes Inaes", label: "Reportes Inaes" },
  { value: "Períodos contables", label: "Períodos contables" },
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
  const { showErrorToast } = useAppToast();

  const MODULE_NAME_MAP: Record<string, string> = {
    LoanModel: "Préstamos",
    InaesReportModel: "Reportes Inaes",
    AccountingPeriodModel: "Períodos contables",
    CollectionModel: "Cobros",
    InvoiceModel: "Facturas",
    PaymentModel: "Pagos",
  };

  const MODULE_NAME_MAP_INVERSE: Record<string, string> = Object.fromEntries(
    Object.entries(MODULE_NAME_MAP).map(([key, value]) => [value, key])
  );

  function getModuleName(entityType: string): string {
    return MODULE_NAME_MAP[entityType] || entityType;
  }

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

      if (!Array.isArray(data)) {
        setAuditLogs([]);
      } else {
        setAuditLogs(data);
      }
    } catch (err) {
      const errorObj = err as any;
      const errorMsg =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        "Error de sistema al listar auditorías  ";
      showErrorToast({
        title: "Error del servidor.",
        message: errorMsg
      });
      setAuditLogs([]);
    } finally {
      setLoading(false);
    }
  }, [selectedModule]);

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handleFilterChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (value: string) => {
      setter(value);
      setPage(1);
    };

  // funcion para tomar valores sin tilde
  const removeDiacritics = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const filteredAudits = auditLogs.filter((audit) => {
    // Filtro por módulo
    let matchesModule: any = true;
    if (selectedModule !== "todos") {
      const expectedEntityType = MODULE_NAME_MAP_INVERSE[selectedModule];
      matchesModule =
        expectedEntityType &&
        audit.entityType
          .trim()
          .toLowerCase()
          .includes(expectedEntityType.trim().toLowerCase());
    }

    // Filtro por búsqueda: usuario, detalle y fecha
    const searchLower = search.toLowerCase();
    const matchesSearch =
      removeDiacritics(audit.description ?? "")
        .toLowerCase()
        .includes(searchLower) ||
      audit.createdByUser?.username?.toLowerCase().includes(searchLower) ||
      new Date(audit.created_At)
        .toLocaleString()
        .toLowerCase()
        .includes(searchLower);

    return matchesModule && matchesSearch;
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
        <Header hasNotifications={true} loans={[]} />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">Auditorías</h1>

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
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedAudits.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-8 text-gray-400"
                        >
                          {search.trim() || selectedModule !== "todos"
                            ? "No hay registros de auditoría con ese criterio de búsqueda"
                            : "No hay registros de auditoría"}
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
                            {new Date(audit.created_At).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 border-b whitespace-nowrap">
                            {audit.createdByUser?.username}
                          </td>
                          <td className="px-4 py-4 border-b whitespace-nowrap">
                            {getModuleName(audit.entityType)}
                          </td>

                          <td className="px-4 py-4 border-b whitespace-nowrap">
                            {audit.description}
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
