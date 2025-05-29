import React, { useState } from "react";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

interface User {
  usuario: string;
  rol: string;
  estado: "Activo" | "Inactivo";
  email: string;
  fechaCreacion: string;
}

const usuariosData: User[] = [
  {
    usuario: "anabela1",
    rol: "Administrador",
    estado: "Activo",
    fechaCreacion: "2024-05-01",
    email: "anabela1@mutual17dejunio.com",
  },
  {
    usuario: "juanperez",
    rol: "Gestor",
    estado: "Activo",
    fechaCreacion: "2024-04-15",
    email: "juanperez@mutual17dejunio.com",
  },
  {
    usuario: "maria2",
    rol: "Gestor",
    estado: "Inactivo",
    fechaCreacion: "2023-12-10",
    email: "maria2@mutual17dejunio.com",
  },
  {
    usuario: "sofia",
    rol: "Consultor",
    estado: "Activo",
    fechaCreacion: "2024-01-20",
    email: "sofia@mutual17dejunio.com",
  },
  {
    usuario: "lucas",
    rol: "Administrador",
    estado: "Inactivo",
    fechaCreacion: "2023-11-05",
    email: "lucas@mutual17dejunio.com",
  },
  {
    usuario: "martin",
    rol: "Gestor",
    estado: "Activo",
    fechaCreacion: "2024-02-14",
    email: "martin@mutual17dejunio.com",
  },
  {
    usuario: "carla",
    rol: "Consultor",
    estado: "Activo",
    fechaCreacion: "2024-03-22",
    email: "carla@mutual17dejunio.com",
  },
  {
    usuario: "roberto",
    rol: "Administrador",
    estado: "Activo",
    fechaCreacion: "2024-04-01",
    email: "roberto@mutual17dejunio.com",
  },
  {
    usuario: "valeria",
    rol: "Gestor",
    estado: "Inactivo",
    fechaCreacion: "2023-10-30",
    email: "valeria@mutual17dejunio.com",
  },
  {
    usuario: "daniel",
    rol: "Consultor",
    estado: "Activo",
    fechaCreacion: "2024-05-10",
    email: "daniel@mutual17dejunio.com",
  },
  {
    usuario: "florencia",
    rol: "Administrador",
    estado: "Activo",
    fechaCreacion: "2024-05-12",
    email: "florencia@mutual17dejunio.com",
  },
  {
    usuario: "pablo",
    rol: "Gestor",
    estado: "Inactivo",
    fechaCreacion: "2023-09-18",
    email: "pablo@mutual17dejunio.com",
  },
];

const PAGE_SIZE = 8;

const UsersTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState<
    "Todos" | "Activo" | "Inactivo"
  >("Todos");
  const [page, setPage] = useState(1);

  // Filtrado por búsqueda y estado
  const filtered = usuariosData.filter(
    (u) =>
      (estadoFiltro === "Todos" || u.estado === estadoFiltro) &&
      (u.usuario.toLowerCase().includes(search.toLowerCase()) ||
        u.rol.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginación
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header />
        <main className="flex-1 p-6 bg-gray-100">
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
                onClick={() => window.location.href = "/usuarios/crear"}
                >
                + Agregar Usuario
                </button>
            </div>
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-400">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  paginated.map((user, idx) => (
                    <tr
                      key={user.usuario}
                      className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-4 border-b whitespace-nowrap">
                        {user.usuario}
                      </td>
                      <td className="px-4 py-4 border-b whitespace-nowrap">
                        {user.rol}
                      </td>
                      <td className="px-4 py-4 border-b whitespace-nowrap">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              user.estado === "Activo"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                        >
                          {user.estado}
                        </span>
                      </td>
                      <td className="px-4 py-4 border-b whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-4 py-4 border-b text-right space-x-2 whitespace-nowrap">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                          onClick={() => window.location.href = "/usuarios/editar"}
                        >
                          Editar
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                          onClick={() => window.location.href = "/usuarios/eliminar"}
                        
                        >
                          Eliminar
                        </button>
                        <button
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                          onClick={() => window.location.href = "/usuarios/detalle"}
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
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
                {filtered.length} usuario(s) encontrado(s)
              </span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsersTable;
