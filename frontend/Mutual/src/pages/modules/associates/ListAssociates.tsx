import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Sidebar from "../../dashboard/components/Sidebar";

interface Asociado {
  dni: string;
  nombreCompleto: string;
  estado: string;
  organismo: string;
  direccion: string;
  fechaNacimiento: string;
  categoria: string;
  email: string;
}

const asociadosFuerzaAerea: Asociado[] = [
  {
    dni: "12345678",
    nombreCompleto: "Juan Pérez",
    estado: "Activo",
    organismo: "Fuerza Aérea",
    direccion: "Av. Siempre Viva 123, CABA",
    fechaNacimiento: "1985-04-12",
    categoria: "Oficial",
    email: "juan.perez@faa.gob.ar",
  },
  {
    dni: "23456789",
    nombreCompleto: "María Gómez",
    estado: "Inactivo",
    organismo: "Fuerza Aérea",
    direccion: "Calle Falsa 456, Córdoba",
    fechaNacimiento: "1990-09-23",
    categoria: "Suboficial",
    email: "maria.gomez@faa.gob.ar",
  },
  {
    dni: "34567890",
    nombreCompleto: "Carlos López",
    estado: "Activo",
    organismo: "Fuerza Aérea",
    direccion: "Ruta 8 Km 45, El Palomar",
    fechaNacimiento: "1978-01-30",
    categoria: "Civil",
    email: "carlos.lopez@faa.gob.ar",
  },
  {
    dni: "45678901",
    nombreCompleto: "Ana Martínez",
    estado: "Activo",
    organismo: "Fuerza Aérea Argentina",
    direccion: "San Martín 789, Mendoza",
    fechaNacimiento: "1982-07-15",
    categoria: "Oficial",
    email: "ana.martinez@faa.gob.ar",
  },
  {
    dni: "56789012",
    nombreCompleto: "Luis Fernández",
    estado: "Activo",
    organismo: "Fuerza Aérea Argentina",
    direccion: "Belgrano 321, Rosario",
    fechaNacimiento: "1988-11-05",
    categoria: "Suboficial",
    email: "luis.fernandez@faa.gob.ar",
  },
  {
    dni: "67890123",
    nombreCompleto: "Patricia Díaz",
    estado: "Inactivo",
    organismo: "Fuerza Aérea Argentina",
    direccion: "Mitre 654, Salta",
    fechaNacimiento: "1993-03-18",
    categoria: "Civil",
    email: "patricia.diaz@faa.gob.ar",
  },
  {
    dni: "78901234",
    nombreCompleto: "Ricardo Torres",
    estado: "Activo",
    organismo: "Fuerza Aérea Argentina",
    direccion: "Av. Libertador 1001, CABA",
    fechaNacimiento: "1975-12-01",
    categoria: "Oficial",
    email: "ricardo.torres@faa.gob.ar",
  },
  {
    dni: "89012345",
    nombreCompleto: "Sofía Romero",
    estado: "Activo",
    organismo: "Fuerza Aérea Argentina",
    direccion: "Sarmiento 222, Córdoba",
    fechaNacimiento: "1987-06-22",
    categoria: "Suboficial",
    email: "sofia.romero@faa.gob.ar",
  },
  {
    dni: "90123456",
    nombreCompleto: "Martín Castro",
    estado: "Inactivo",
    organismo: "Fuerza Aérea Argentina",
    direccion: "Av. Rivadavia 333, Buenos Aires",
    fechaNacimiento: "1991-10-10",
    categoria: "Civil",
    email: "martin.castro@faa.gob.ar",
  },
  {
    dni: "11223344",
    nombreCompleto: "Gabriela Ruiz",
    estado: "Activo",
    organismo: "Fuerza Aérea Argentina",
    direccion: "Av. San Juan 444, Tucumán",
    fechaNacimiento: "1983-02-14",
    categoria: "Oficial",
    email: "gabriela.ruiz@faa.gob.ar",
  },
  {
    dni: "22334455",
    nombreCompleto: "Jorge Benítez",
    estado: "Activo",
    organismo: "Fuerza Aérea Argentina",
    direccion: "Calle 9 555, La Plata",
    fechaNacimiento: "1979-08-09",
    categoria: "Suboficial",
    email: "jorge.benitez@faa.gob.ar",
  },
  {
    dni: "33445566",
    nombreCompleto: "Lucía Herrera",
    estado: "Inactivo",
    organismo: "Fuerza Aérea Argentina",
    direccion: "Av. Colón 888, Mar del Plata",
    fechaNacimiento: "1995-05-27",
    categoria: "Civil",
    email: "lucia.herrera@faa.gob.ar",
  },
];

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

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [estadoFiltro, setEstadoFiltro] = useState<
    "Todos" | "Activo" | "Inactivo"
  >("Todos"); // Nuevo estado

  // Filtrado por búsqueda y estado
  const filtered = asociadosFuerzaAerea.filter(
    (a) =>
      (estadoFiltro === "Todos" || a.estado === estadoFiltro) &&
      (a.dni.includes(search) ||
        a.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
        a.organismo.toLowerCase().includes(search.toLowerCase()) ||
        a.categoria.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase()))
  );

  // Paginación
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar fija a la izquierda */}
      <Sidebar />

      {/* Contenido principal desplazado a la derecha */}
      <div
        className="flex-1 flex flex-col"
        style={{ marginLeft: "18rem" /* w-72 = 288px */ }}
      >
        {/* Header */}
        <Header hasNotifications={hasNotifications} />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Asociados</h1>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4"></div>
          <div className="flex-1 w-full">
            <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
              {/* Buscador, filtro y botón agregar asociado */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Buscar por DNI, nombre, organismo, categoría o email..."
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
                  onClick={() => navigate("/asociados/crear")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold shadow transition w-full md:w-auto"
                >
                  + Agregar Asociado
                </button>
              </div>
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      DNI
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Nombre Completo
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
                      Categoría
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
                      <td
                        colSpan={9}
                        className="text-center py-8 text-gray-400"
                      >
                        No hay asociados registrados
                      </td>
                    </tr>
                  ) : (
                    paginated.map((asociado, idx) => (
                      <tr
                        key={asociado.dni}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-4 border-b whitespace-nowrap">
                          {asociado.dni}
                        </td>
                        <td className="px-4 py-4 border-b whitespace-nowrap">
                          {asociado.nombreCompleto}
                        </td>
                        <td className="px-4 py-4 border-b whitespace-nowrap">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                            ${
                              asociado.estado === "Activo"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {asociado.estado}
                          </span>
                        </td>
                        <td className="px-4 py-4 border-b whitespace-nowrap">
                          {asociado.organismo}
                        </td>
                        <td className="px-4 py-4 border-b whitespace-nowrap">
                          {asociado.direccion}
                        </td>
                        <td className="px-4 py-4 border-b whitespace-nowrap">
                          {new Date(
                            asociado.fechaNacimiento
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 border-b whitespace-nowrap">
                          {asociado.categoria}
                        </td>
                        <td className="px-4 py-4 border-b whitespace-nowrap">
                          {asociado.email}
                        </td>
                        <td className="px-4 py-4 border-b text-right space-x-2 whitespace-nowrap">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                            onClick={() => navigate(`/asociados/editar/id`)}
                          >
                            Editar
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                            onClick={() => navigate(`/asociados/eliminar/id`)}
                          >
                            Eliminar
                          </button>
                          <button
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-1 rounded transition text-xs font-medium"
                            onClick={() => navigate(`/asociados/detalle/id`)}
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
                  {filtered.length} asociado(s) encontrado(s)
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