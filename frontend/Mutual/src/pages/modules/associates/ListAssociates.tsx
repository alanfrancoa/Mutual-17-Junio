import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { IAssociateList } from "../../../types/IAssociateList";

// Paginación y búsqueda
const PAGE_SIZE = 10;

interface DashboardProps {
  userName?: string;
  userRole?: string;
  hasNotifications?: boolean;
}

const Associates: React.FC<DashboardProps> = ({
  userName = "Fernando",
  userRole = "administrador",
  hasNotifications = true,
}) => {
  const navigate = useNavigate();
  const [associates, setAssociates] = useState<IAssociateList[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState<
    "Todos" | "Activo" | "Inactivo"
  >("Todos");

  const fetchAssociates = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiMutual.GetAllAssociates();
      setAssociates(data);
    } catch (err: any) {
      console.error("Error fetching associates:", err);
      setError(err.response?.data?.message || "Error al cargar los asociados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssociates();
  }, []); 

  // Filtrado por busqueda y estado
  const filteredAssociates = associates.filter((a) => {
    const lowerCaseSearch = search.toLowerCase();

    const matchesStatus =
      estadoFiltro === "Todos" ||
      (estadoFiltro === "Activo" && a.active) ||
      (estadoFiltro === "Inactivo" && !a.active);

    const matchesSearch =
      // Comprueba si a.campo existe antes de llamar a .includes()
      (a.dni && a.dni.includes(search)) ||
      (a.legalName && a.legalName.toLowerCase().includes(lowerCaseSearch)) ||
      (a.organization &&
        a.organization.toLowerCase().includes(lowerCaseSearch)) ||
      (a.email && a.email.toLowerCase().includes(lowerCaseSearch)) ||
      (a.phone && a.phone.includes(search)) ||
      (a.address && a.address.toLowerCase().includes(lowerCaseSearch)) ||
      (a.city && a.city.toLowerCase().includes(lowerCaseSearch)) ||
      (a.province && a.province.toLowerCase().includes(lowerCaseSearch));

    return matchesStatus && matchesSearch;
  });

  // Paginación
  const totalPages = Math.ceil(filteredAssociates.length / PAGE_SIZE);
  const paginatedAssociates = filteredAssociates.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar fija a la izquierda */}
      <Sidebar />

      {/* Contenido principal desplazado a la derecha */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        {/* Header */}
        <Header hasNotifications={hasNotifications} />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Asociados</h1>
          <div className="flex-1 w-full">
            <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
              {/* Buscador, filtro y botón agregar asociado */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Buscar por DNI, nombre, organismo, email, etc."
                    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  {/* Filtro de estado */}
                  <select
                    name="estadoFiltro"
                    value={estadoFiltro}
                    onChange={(e) => {
                      setEstadoFiltro(
                        e.target.value as "Todos" | "Activo" | "Inactivo"
                      );
                      setPage(1); // Resetear a la primera pagina al cambiar  filtro
                    }}
                    className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Activo">Activos</option>
                    <option value="Inactivo">Inactivos</option>
                  </select>
                </div>
                <button
                  onClick={() => navigate("/asociados/crear")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold shadow transition w-full md:w-auto"
                >
                  + Agregar Asociado
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Cargando asociados...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        DNI
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Nombre Legal
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Organismo
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Dirección
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Fecha Nac.
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedAssociates.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-center py-8 text-gray-400"
                        >
                          No hay asociados registrados que coincidan con la
                          búsqueda.
                        </td>
                      </tr>
                    ) : (
                      paginatedAssociates.map((asociado, idx) => (
                        <tr
                          key={asociado.id}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {asociado.dni}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {asociado.legalName}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                asociado.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {asociado.active ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {asociado.organization}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {asociado.address}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {asociado.birthDate
                              ? new Date(
                                  asociado.birthDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {asociado.email}
                          </td>
                          <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                            <div className="space-x-2 flex justify-end">
                              <button
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                                onClick={() =>
                                  navigate(`/asociados/editar/${asociado.id}`)
                                }
                              >
                                Editar
                              </button>
                              <button
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                                onClick={() =>
                                  navigate(`/asociados/eliminar/${asociado.id}`)
                                }
                              >
                                Dar de baja
                              </button>
                              <button
                                className="bg-blue-500 hover:bg-gray-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                                onClick={() =>
                                  navigate(`/asociados/reactivar/${asociado.id}`)
                                }
                              >
                                Alta
                              </button>

                              <button
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                                onClick={() =>
                                  navigate(`/asociados/detalle/${asociado.id}`)
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

              {/* Paginación centrada debajo de la tabla */}
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
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Siguiente"
                  >
                    <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
                <span className="text-gray-500 text-sm md:ml-4 md:w-auto w-full text-center md:text-right">
                  {filteredAssociates.length} asociado(s) encontrado(s)
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Associates;
