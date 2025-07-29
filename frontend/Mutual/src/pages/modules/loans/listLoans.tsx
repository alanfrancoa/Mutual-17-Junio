import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Sidebar from "../../dashboard/components/Sidebar";
import ListTypesLoan from "./loanTypes/listTypesLoan";
import { apiMutual } from "../../../api/apiMutual";
import { ILoanList } from "../../../types/loans/ILoanList";
import RejectLoanButton from "./rejectLoan";
import ApproveLoanButton from "../loans/approveLoan";

// Paginacion
const PAGE_SIZE = 5;

const Loans: React.FC = () => {
  const navigate = useNavigate();
  const [loans, setLoans] = useState<ILoanList[]>([]);
  const [search, setSearch] = useState<string>("");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("Todos");
  const [page, setPage] = useState<number>(1);
  const [filteredAndSearchedLoans, setFilteredAndSearchedLoans] = useState<
    ILoanList[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const userRole = sessionStorage.getItem("userRole") || "";

  const fetchLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: ILoanList[] = await apiMutual.GetLoans();
      setLoans(data);
    } catch (err: any) {
      console.error("Error cargando prestamos:", err);
      setError(
        err.response?.data?.message || "Error al cargar los tipos de prestamo."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // useEffect para aplicar los filtrado y busqueda
  useEffect(() => {
    let currentFiltered = loans;

    // filtrar por estado
    if (estadoFiltro !== "Todos") {
      currentFiltered = currentFiltered.filter(
        (loan) => loan.status === estadoFiltro
      );
    }

    // busqueda por texto
    if (search) {
      const lowerCaseSearch = search.toLowerCase();
      currentFiltered = currentFiltered.filter(
        (loan) =>
          loan.associateDni.toLowerCase().includes(lowerCaseSearch) ||
          loan.legalName.toLowerCase().includes(lowerCaseSearch) ||
          loan.amount.toString().includes(lowerCaseSearch)
      );
    }

    setFilteredAndSearchedLoans(currentFiltered);
    setPage(1);
  }, [search, estadoFiltro, loans]);

  // Calculo de paginacion segun filtrado
  const totalPages = Math.ceil(filteredAndSearchedLoans.length / PAGE_SIZE);
  const paginatedLoans = filteredAndSearchedLoans.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications />

        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Préstamos</h1>
          <div className="flex-1 w-full">
            <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex gap-2 w-full md:w-auto flex-wrap">
                  <input
                    type="text"
                    placeholder="Buscar"
                    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {/* Filtrado estado del prestamo */}
                  <select
                    name="estadoFiltro"
                    value={estadoFiltro}
                    onChange={(e) => setEstadoFiltro(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Todos">Todos </option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Finalizado">Finalizado</option>
                  </select>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  {userRole !== "Administrador" && (
                    <button
                      onClick={() => navigate("/prestamos/solicitar")}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold shadow transition flex items-center gap-2"
                    >
                      Solicitar Préstamo
                    </button>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Cargando préstamos...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        DNI Asociado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Nombre Asociado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Monto
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Fecha emisión Préstamo
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Cuotas
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedLoans.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="text-center py-8 text-gray-400"
                        >
                          No hay préstamos registrados para mostrar.
                        </td>
                      </tr>
                    ) : (
                      paginatedLoans.map((loan, idx) => (
                        <tr
                          key={loan.associateDni}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {loan.associateDni}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {loan.legalName}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            ${loan.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                loan.status === "Aprobado"
                                  ? "bg-green-100 text-green-800"
                                  : loan.status === "Pendiente"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : loan.status === "Rechazado"
                                  ? "bg-red-100 text-red-800"
                                  : loan.status === "Finalizado"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {loan.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Date(
                              loan.applicationDate
                            ).toLocaleDateString()}
                          </td>{" "}
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {loan.termMonths ? `${loan.termMonths}` : "-"}
                          </td>
                          <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                            <div className="space-x-2 flex justify-end">
                              {/* acciones rechazo y aprobacion */}
                              <RejectLoanButton
                                loan={loan}
                                onRefreshLoans={fetchLoans}
                              />
                              <ApproveLoanButton
                                loan={loan}
                                onRefreshLoans={fetchLoans}
                              />
                              <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                                onClick={() =>
                                  navigate(`/prestamos/detalle/${loan.id}`)
                                }
                              >
                                Ver
                              </button>
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
                  {filteredAndSearchedLoans.length} préstamo(s) encontrado(s)
                </span>
              </div>
            </div>
          </div>
          <ListTypesLoan />
        </main>
      </div>
    </div>
  );
};

export default Loans;
