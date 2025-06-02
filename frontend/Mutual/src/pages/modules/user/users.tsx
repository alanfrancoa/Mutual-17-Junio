import React, { useState, useEffect } from "react";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import { apiMutual } from "../../../api/apiMutual"; // Asegúrate de tener este import
import { User } from "../../../types/user";

const PAGE_SIZE = 8;

const UsersTable: React.FC = () => {
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<
    "Todos" | "Activo" | "Inactivo"
  >("Todos");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Fetch usuarios desde la API
  useEffect(() => {
    const fetchUsuarios = async () => {
      setLoading(true);
      try {
        const data = await apiMutual.ObtenerUsuarios();
        setUsuarios(data);
      } catch (error) {
        alert("Error al obtener usuarios");
      }
      setLoading(false);
    };
    fetchUsuarios();
  }, []);

  // Filtrado por busqeuda y estado
  const filtered = usuarios.filter(
    (u) =>
      (estadoFiltro === "Todos" ||
        (estadoFiltro === "Activo" && u.active) ||
        (estadoFiltro === "Inactivo" && !u.active)) &&
      ((u.username?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (u.role?.toLowerCase() || "").includes(search.toLowerCase()))
  );

  // Paginacion
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header />
        <main className="flex-1 p-6 bg-gray-100">
          <div className="w-full max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Usuarios</h1>
            <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Buscar por usuario o rol..."
                    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                  />
                  <select
                    name="estadoFiltro"
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold shadow transition w-full md:w-auto"
                  onClick={() => (window.location.href = "/usuarios/crear")}
                >
                  + Agregar Usuario
                </button>
              </div>
              {loading ? (
                <div className="text-center py-8 text-gray-400">
                  Cargando usuarios...
                </div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Rol
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-8 text-gray-400"
                        >
                          No hay usuarios registrados
                        </td>
                      </tr>
                    ) : (
                      paginated.map((user, idx) => (
                        <tr
                          key={user.username}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-4 py-4 border-b whitespace-nowrap">
                            {user.username}
                          </td>
                          <td className="px-4 py-4 border-b whitespace-nowrap">
                            {user.role}
                          </td>
                          <td>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                user.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {user.active ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td>
                            {user.createdAt &&
                              new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          
                          <td className="px-4 py-4 border-b text-right space-x-2 whitespace-nowrap">
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                              onClick={() =>
                                (window.location.href = `/usuarios/editar/${user.id}`)
                              }
                            >
                              Editar
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                              onClick={() =>
                                (window.location.href = `/usuarios/eliminar/${user.id}`)
                              }
                            >
                              Eliminar
                            </button>
                            <button
                              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                              onClick={() =>
                               (window.location.href = `/usuarios/detalle/${user.id}`)
                              }
                            >
                              Ver
                            </button>
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
                  {filtered.length} usuario(s) encontrado(s)
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsersTable;
