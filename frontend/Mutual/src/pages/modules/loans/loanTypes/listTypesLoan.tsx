import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Datos de ejemplo
const initialTypes = [
  {
    id: 1,
    nombre: "Ayudas económicas",
    tasa: 10.5,
    montoMaximo: 100000,
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Electrodomésticos",
    tasa: 5,
    montoMaximo: 50000,
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Electrodomésticos A",
    tasa: 6,
    montoMaximo: 60000,
    estado: "Activo",
  },
  {
    id: 4,
    nombre: "Electrodomésticos B",
    tasa: 4,
    montoMaximo: 40000,
    estado: "Activo",
  },
  {
    id: 5,
    nombre: "Electrodomésticos C",
    tasa: 5,
    montoMaximo: 50000,
    estado: "Activo",
  },
  {
    id: 6,
    nombre: "Ayudas economicas B",
    tasa: 6,
    montoMaximo: 60000,
    estado: "Activo",
  },
  {
    id: 7,
    nombre: "Electrodomésticos D",
    tasa: 7,
    montoMaximo: 70000,
    estado: "Activo",
  },
  {
    id: 8,
    nombre: "Electrodomésticos E",
    tasa: 8,
    montoMaximo: 80000,
    estado: "Activo",
  },
 
];

const PAGE_SIZE = 5;

const ListTypesLoan: React.FC = () => {
  const [types, setTypes] = useState(initialTypes);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const handleDeactivate = (id: number) => {
    setTypes((prev) =>
      prev.map((tipo) =>
        tipo.id === id ? { ...tipo, estado: "Inactivo" } : tipo
      )
    );
  };

  const totalPages = Math.ceil(types.length / PAGE_SIZE);
  const paginatedTypes = types.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Tipos de Préstamos
          </h1>
          <div className="flex-1 w-full">
            <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div />
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => navigate("/prestamos/tipo/crear")}
                    className="bg-teal-500 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold shadow transition flex items-center gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v7.5m2.25-6.466a9.016 9.016 0 0 0-3.461-.203c-.536.072-.974.478-1.021 1.017a4.559 4.559 0 0 0-.018.402c0 .464.336.844.775.994l2.95 1.012c.44.15.775.53.775.994 0 .136-.006.27-.018.402-.047.539-.485.945-1.021 1.017a9.077 9.077 0 0 1-3.461-.203M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      />
                    </svg>
                    Crear nuevo Tipo
                  </button>
                </div>
              </div>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Nombre de Préstamo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Tasa de Interés (%)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Monto Máximo
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Acción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTypes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-8 text-gray-400"
                      >
                        No hay tipos de préstamos para mostrar.
                      </td>
                    </tr>
                  ) : (
                    paginatedTypes.map((tipo, idx) => (
                      <tr
                        key={tipo.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {tipo.nombre}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          {tipo.tasa}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          ${tipo.montoMaximo.toLocaleString()}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              tipo.estado === "Activo"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {tipo.estado}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition text-xs font-medium disabled:opacity-50"
                            onClick={() => handleDeactivate(tipo.id)}
                            disabled={tipo.estado !== "Activo"}
                          >
                            Desactivar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Paginación */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
                <div className="flex justify-center items-center gap-4 flex-1">
                  <button
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Anterior"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5 text-gray-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                      />
                    </svg>
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="h-5 w-5 text-gray-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
                <span className="text-gray-500 text-sm md:ml-4 md:w-auto w-full text-center md:text-right">
                  {types.length} tipo(s) de préstamo encontrado(s)
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ListTypesLoan;
