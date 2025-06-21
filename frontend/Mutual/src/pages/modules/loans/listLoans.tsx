import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Sidebar from "../../dashboard/components/Sidebar";
import Modal from "../../../components/modal";

export const initialLoans = [
  {
    id: 1,
    associateDni: "30123456",
    associateLegalName: "Juan Pérez",
    amount: 15000.0,
    interestRate: 10.5,
    loanDate: "2024-01-15T00:00:00Z",
    dueDate: "2025-01-15T00:00:00Z",
    category: "Ayudas",
    status: "Finalizado",
    active: true,
    installments: { current: 12, total: 12 },
  },
  {
    id: 2,
    associateDni: "25678901",
    associateLegalName: "María García",
    amount: 22000.0,
    interestRate: 12.0,
    loanDate: "2024-02-20T00:00:00Z",
    dueDate: "2025-02-20T00:00:00Z",
    status: "Vigente",
    category: "Electrodomesticos",
    active: true,
    installments: { current: 5, total: 6 },
  },
  {
    id: 3,
    associateDni: "35987654",
    associateLegalName: "Carlos López",
    amount: 8000.0,
    interestRate: 9.0,
    loanDate: "2023-11-01T00:00:00Z",
    dueDate: "2024-11-01T00:00:00Z",
    status: "Rechazado",
    category: "Electrodomesticos",
    active: false,
    installments: { current: 0, total: 6 },
  },
  {
    id: 4,
    associateDni: "40567890",
    associateLegalName: "Ana Rodríguez",
    amount: 5000.0,
    interestRate: 11.5,
    loanDate: "2024-03-10T00:00:00Z",
    dueDate: "2025-03-10T00:00:00Z",
    status: "Aprobado",
    category: "Ayudas",
    active: true,
    installments: { current: 1, total: 3 },
  },
  {
    id: 5,
    associateDni: "33445566",
    associateLegalName: "Pedro Martínez",
    amount: 30000.0,
    interestRate: 10.0,
    loanDate: "2024-04-05T00:00:00Z",
    dueDate: "2025-04-05T00:00:00Z",
    status: "Pendiente",
    category: "Ayudas",
    active: true,
    installments: { current: 3, total: 6 },
  },
  {
    id: 6,
    associateDni: "28765432",
    associateLegalName: "Laura Fernández",
    amount: 12000.0,
    interestRate: 10.8,
    loanDate: "2023-10-25T00:00:00Z",
    dueDate: "2024-10-25T00:00:00Z",
    status: "Rechazado",
    category: "Ayudas",
    active: false,
    installments: { current: 0, total: 0 },
  },
  {
    id: 7,
    associateDni: "37112233",
    associateLegalName: "Miguel Torres",
    amount: 9500.0,
    interestRate: 9.8,
    loanDate: "2024-05-18T00:00:00Z",
    dueDate: "2025-05-18T00:00:00Z",
    status: "Aprobado",
    active: true,
    category: "Ayudas",
    installments: { current: 1, total: 6 },
  },
  {
    id: 8,
    associateDni: "31889900",
    associateLegalName: "Sofía Gómez",
    amount: 18000.0,
    interestRate: 11.0,
    loanDate: "2024-06-01T00:00:00Z",
    dueDate: "2025-06-01T00:00:00Z",
    status: "Pendiente",
    active: true,
    category: "Electrodomesticos",
    installments: { current: 0, total: 0},
  },
  {
    id: 9,
    associateDni: "39001122",
    associateLegalName: "Diego Ruiz",
    amount: 7000.0,
    interestRate: 10.2,
    loanDate: "2024-01-01T00:00:00Z",
    dueDate: "2025-01-01T00:00:00Z",
    status: "Aprobado",
    active: true,
    category: "Electrodomesticos",
    installments: { current: 5, total: 12 },
  },
  {
    id: 10,
    associateDni: "27654321",
    associateLegalName: "Valeria Díaz",
    amount: 25000.0,
    interestRate: 12.5,
    loanDate: "2024-02-01T00:00:00Z",
    dueDate: "2025-02-01T00:00:00Z",
    status: "Aprobado",
    active: true,
    category: "Electrodomesticos",
    installments: { current: 5, total: 12 },
  },
  {
    id: 11,
    associateDni: "34987654",
    associateLegalName: "Francisco Núñez",
    amount: 10000.0,
    interestRate: 9.5,
    loanDate: "2024-03-01T00:00:00Z",
    dueDate: "2025-03-01T00:00:00Z",
    status: "Pendiente",
    active: true,
    category: "Ayudas",
    installments: { current: 0, total: 0 },
  },
];

// Paginacion
const PAGE_SIZE = 5;

interface DashboardProps {
  userName?: string;
  userRole?: string;
  hasNotifications?: boolean;
}

const Loans: React.FC<DashboardProps> = ({
  userName = "Fernando",
  userRole = "administrador",
  hasNotifications = true,
}) => {
  const navigate = useNavigate();

  // Cambia mockLoans a estado para poder modificarlo
  const [loans, setLoans] = useState(initialLoans);
  const [search, setSearch] = useState<string>("");
  const [estadoFiltro, setEstadoFiltro] = useState<string>("Todos");
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"aprobar" | "rechazar" | null>(null);
  const [selectedLoan, setSelectedLoan] = useState<any>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [filteredAndSearchedLoans, setFilteredAndSearchedLoans] =
    useState(loans);

  // const simuladas para enmaquetado
  const loading = false;
  const error = null;

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
          loan.associateLegalName.toLowerCase().includes(lowerCaseSearch) ||
          loan.amount.toString().includes(lowerCaseSearch) ||
          loan.category.toLowerCase().includes(lowerCaseSearch)
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

  // Funciones para abrir el modal
  const handleOpenModal = (loan: any, action: "aprobar" | "rechazar") => {
    setSelectedLoan(loan);
    setModalAction(action);
    setModalError(null);
    setShowModal(true);
  };

  // Confirmacion de accion
  const handleConfirm = () => {
    if (!selectedLoan) return;

    // Validaciones
    if (modalAction === "aprobar" && selectedLoan.status === "Aprobado") {
      setModalError("El préstamo ya está aprobado.");
      return;
    }
    if (modalAction === "rechazar" && selectedLoan.status === "Rechazado") {
      setModalError("El préstamo ya está rechazado.");
      return;
    }

    // Actualizar estado del préstamo
    setLoans((prevLoans) =>
      prevLoans.map((loan) =>
        loan.id === selectedLoan.id
          ? {
              ...loan,
              status: modalAction === "aprobar" ? "Aprobado" : "Rechazado",
            }
          : loan
      )
    );

    setShowModal(false);
    setSelectedLoan(null);
    setModalAction(null);
    setModalError(null);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedLoan(null);
    setModalAction(null);
    setModalError(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={hasNotifications} />

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
                    <option value="Rechazado">Vigente</option>
                    <option value="Rechazado">Finalizado</option>
                  </select>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => navigate("/prestamos/solicitar")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold shadow transition flex items-center gap-2"
                  >
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                    </svg>
                    Solicitar Préstamo
                  </button>
                  <button
                    onClick={() => navigate("/prestamos/crear")}
                    className="bg-teal-500 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold shadow transition flex items-center gap-2"
                  >
                    
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v7.5m2.25-6.466a9.016 9.016 0 0 0-3.461-.203c-.536.072-.974.478-1.021 1.017a4.559 4.559 0 0 0-.018.402c0 .464.336.844.775.994l2.95 1.012c.44.15.775.53.775.994 0 .136-.006.27-.018.402-.047.539-.485.945-1.021 1.017a9.077 9.077 0 0 1-3.461-.203M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Crear nuevo Préstamo
                  </button>
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
                        Tasa Interés
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Fecha emisión Préstamo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Categoría
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
                          key={loan.id}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {loan.associateDni}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {loan.associateLegalName}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            ${loan.amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {loan.interestRate.toFixed(2)}%
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
                                  : loan.status === "Vigente"
                                  ? "bg-blue-100 text-blue-800"
                                  : loan.status === "Finalizado"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {loan.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Date(loan.loanDate).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {loan.category}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {loan.installments
                              ? `${loan.installments.current}/${loan.installments.total}`
                              : "-"}
                          </td>
                          <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                            <div className="space-x-2 flex justify-end">
                              {/* acciones rechazo y aprobacion */}
                              <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                                onClick={() =>
                                  handleOpenModal(loan, "rechazar")
                                }
                              >
                                Rechazar
                              </button>
                              <button
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                                onClick={() => handleOpenModal(loan, "aprobar")}
                              >
                                Aprobar
                              </button>
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
          {/* Importacion de modales segun accion */}
          <Modal
            isOpen={showModal}
            title={
              modalAction === "aprobar"
                ? "Aprobar Préstamo"
                : "Rechazar Préstamo"
            }
            message={
              <>
                {modalAction === "aprobar"
                  ? `¿Está seguro de que desea aprobar el préstamo COD: ${selectedLoan?.id}?`
                  : `¿Está seguro de que desea rechazar el préstamo COD: ${selectedLoan?.id}?`}
                {modalError && (
                  <div className="mt-3 text-red-600 font-semibold">
                    {modalError}
                  </div>
                )}
              </>
            }
            confirmText={modalAction === "aprobar" ? "Aprobar" : "Rechazar"}
            cancelText="Cancelar"
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        </main>
      </div>
    </div>
  );
};

export default Loans;
