import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import Header from "../../../dashboard/components/Header";
import Sidebar from "../../../dashboard/components/Sidebar";
import CloseAccountingPeriod from "./closeAccountingPeriod";
import CreateAccountingPeriodForm from "./createAccountingPeriod";
import GenerateReportForm from "../reports-inaes/listReportGeneration";
import { apiMutual } from "../../../../api/apiMutual";
import { IAccountingPeriodList } from "../../../../types/accountablePeriods/IAccountingPeriodList";

// Paginacion
const PAGE_SIZE = 5;

const AccountingPeriods: React.FC = () => {
  const navigate = useNavigate();

  const [accountingPeriods, setAccountingPeriods] = useState<
    IAccountingPeriodList[]
  >([]);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("Todos");
  const [page, setPage] = useState<number>(1);
  const [filteredAndSearchedPeriods, setFilteredAndSearchedPeriods] = useState<
    IAccountingPeriodList[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState<boolean>(false);
  const userRole = sessionStorage.getItem("userRole");

  const fetchAccountingPeriods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let closedFilter: boolean | undefined = undefined;
      if (statusFilter === "Abierto") {
        closedFilter = false;
      } else if (statusFilter === "Cerrado") {
        closedFilter = true;
      }

      const data = await apiMutual.GetAccountingPeriods(closedFilter);
      setAccountingPeriods(data);
    } catch (err: any) {
      console.error("Error al cargar períodos contables:", err);
      const errorMessage =
        err.data?.message ||
        err.message ||
        "Error al cargar los períodos contables.";
      setError(errorMessage);
      setAccountingPeriods([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchAccountingPeriods();
  }, [fetchAccountingPeriods]);

  useEffect(() => {
    let currentFiltered = accountingPeriods;

    if (statusFilter !== "Todos") {
      currentFiltered = currentFiltered.filter(
        (period) => period.status === statusFilter
      );
    }

    if (search) {
      const lowerCaseSearch = search.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (period) =>
          period.code.toLowerCase().includes(lowerCaseSearch) ||
          period.periodType.toLowerCase().includes(lowerCaseSearch) ||
          (period.status ? "cerrado" : "abierto").includes(lowerCaseSearch)
      );
    }

    setFilteredAndSearchedPeriods(currentFiltered);
    setPage(1);
  }, [search, statusFilter, accountingPeriods]);

  const totalPages = Math.ceil(filteredAndSearchedPeriods.length / PAGE_SIZE);
  const paginatedPeriods = filteredAndSearchedPeriods.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleViewReport = (period: IAccountingPeriodList) => {
    navigate(`/periodos/detalle/${period.id}`);
  };

  const handlePeriodSuccessfullyClosed = (closedPeriodId: number) => {
    setAccountingPeriods((prev) =>
      prev.map((p) =>
        p.id === closedPeriodId ? { ...p, status: "Cerrado" } : p
      )
    );
  };

  const handleCreateNewPeriodClick = () => {
    setShowCreateForm(true);
  };

  const handleNewPeriodSuccess = (newPeriod: IAccountingPeriodList) => {
    setAccountingPeriods((prev) => [...prev, newPeriod]);
    setShowCreateForm(false);
    toast.success(
      `Nuevo período ${newPeriod.code} creado y añadido a la lista.`
    );
  };

  const handleCreateFormCancel = () => {
    setShowCreateForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications />

        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Períodos Contables
          </h1>
          <div className="flex-1 w-full">
            {showCreateForm ? (
              <div className="flex flex-col items-center py-8">
                <div className="w-full max-w-xl">
                  <div className="flex justify-start mb-6">
                    <button
                      onClick={handleCreateFormCancel}
                      className="text-gray-600 hover:text-gray-800 flex items-center"
                      aria-label="Volver a la lista de períodos"
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                      <span className="ml-1">Volver a la lista</span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-6">
                    Crear Nuevo Período Contable
                  </h2>
                </div>
                <CreateAccountingPeriodForm
                  onSuccess={handleNewPeriodSuccess}
                  onCancel={handleCreateFormCancel}
                />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                    <div className="flex gap-2 w-full md:w-auto flex-wrap">
                      <input
                        type="text"
                        placeholder="Buscar por código o tipo"
                        className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <select
                        name="statusFilter"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Todos">Todos los Estados</option>
                        <option value="Abierto">Abierto</option>
                        <option value="Cerrado">Cerrado</option>
                      </select>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                      {userRole === "Administrador" && (
                        <button
                          onClick={handleCreateNewPeriodClick}
                          className="bg-teal-500 hover:bg-teal-600 text-white px-5 py-2 rounded font-semibold shadow transition flex items-center gap-2"
                        >
                          Nuevo Período
                        </button>
                      )}
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center py-8 text-gray-500">
                      Cargando períodos contables...
                    </div>
                  ) : error ? (
                    <div className="text-center py-8 text-red-600">{error}</div>
                  ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Codigo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Tipo
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Fecha Inicio
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                            Fecha Fin
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
                        {paginatedPeriods.length === 0 && !loading && !error ? (
                          <tr>
                            <td
                              colSpan={8}
                              className="text-center py-8 text-gray-400"
                            >
                              No hay períodos contables registrados para
                              mostrar.
                            </td>
                          </tr>
                        ) : (
                          paginatedPeriods.map((period, idx) => (
                            <tr
                              key={period.id}
                              className={
                                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                {period.code}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                {period.periodType}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                {new Date(
                                  period.startDate
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                {new Date(period.endDate).toLocaleDateString()}
                              </td>

                              <td className="px-4 py-4 whitespace-nowrap">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    period.status === "Cerrado"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-green-100 text-green-800"
                                  }`}
                                >
                                  {period.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                                <div className="space-x-2 flex justify-end">
                                  <button
                                    onClick={() => handleViewReport(period)}
                                    className="bg-green-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                                  >
                                    Reporte Financiero
                                  </button>
                                  <button
                                    onClick={() => handleViewReport(period)}
                                    className="bg-orange-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                                  >
                                    Reporte Morosidad
                                  </button>
                                  <button
                                    onClick={() => handleViewReport(period)}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                                  >
                                    Reporte Prestamos
                                  </button>
                                  <button
                                    onClick={() => handleViewReport(period)}
                                    className="bg-yellow-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                                  >
                                    Ver Periodo
                                  </button>

                                  {period.status === "Abierto" && (
                                    <CloseAccountingPeriod
                                      periodId={period.id}
                                      periodCode={period.code}
                                      onPeriodClosedSuccess={
                                        handlePeriodSuccessfullyClosed
                                      }
                                      isPeriodAlreadyClosed={false}
                                    />
                                  )}
                                  {/* Si el periodo es cerrado, mostrar boton deshabilitado  */}
                                  {period.status === "Cerrado" && (
                                    <button
                                      disabled
                                      className="bg-gray-400 text-white px-4 py-1 rounded text-xs font-medium opacity-50 cursor-not-allowed"
                                    >
                                      Período Cerrado
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  )}

                  {/* Paginacion */}
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
                      {filteredAndSearchedPeriods.length} período(s)
                      encontrado(s)
                    </span>
                  </div>
                </div>
                <GenerateReportForm
                  closedPeriods={accountingPeriods.filter(
                    (p) => p.status === "Cerrado"
                  )}
                />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountingPeriods;
