import React from "react";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";

interface DashboardProps {
  hasNotifications?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ hasNotifications = true }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-72">
        <Header hasNotifications={hasNotifications} />

        <div className="w-full flex justify-center">
          <div className="bg-blue-100 border border-blue-300 rounded-lg px-8 py-4 my-6 flex items-center shadow">
            <span className="text-xl font-semibold text-blue-900 text-center">
              ¡Bienvenido/a al sistema de gestión!
            </span>
          </div>
        </div>

        {/* Main Content Area */}

        <div className="flex-1 p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">

            {/* Proveedores */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">
                  PROVEEDORES
                </h3>
                <button
                  onClick={() => navigate("/proveedores")}
                  className="mt-2 px-4 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition"
                >
                  Proveedores
                </button>
              </div>
            </div>

            {/* Cobros y Morosidad */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">
                  COBROS Y MOROSIDAD
                </h3>
                <button className="mt-2 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition">
                  Ingresar
                </button>
              </div>
            </div>

            {/* Asociados */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">
                  ASOCIADOS
                </h3>
                <button
                  onClick={() => navigate("/asociados")}
                  className="mt-2 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition">
                  Ingresar
                </button>
              </div>
            </div>

            {/* Inventario */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">
                  INVENTARIO
                </h3>
                <button className="mt-2 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition">
                  Ingresar
                </button>
              </div>
            </div>

            {/* Préstamos */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">
                  PRÉSTAMOS
                </h3>
                <button className="mt-2 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition">
                  Ingresar
                </button>
              </div>
            </div>

            {/* Reportes y Normativas */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">
                  REPORTES Y NORMATIVAS
                </h3>
                <button className="mt-2 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition">
                  Ingresar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
