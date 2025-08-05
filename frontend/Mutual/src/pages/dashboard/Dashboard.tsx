import React from "react";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import { UsersIcon, CurrencyDollarIcon, DocumentChartBarIcon, DocumentCurrencyDollarIcon, UserGroupIcon } from "@heroicons/react/24/solid";

interface DashboardProps {
  hasNotifications?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ hasNotifications = true }) => {
  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("userRole");

  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="pl-72">
        <Header hasNotifications={true} loans={[]} />

        <div className="w-full flex justify-center mt-2">
          <div className="relative w-full max-w-7xl rounded-xl shadow-lg overflow-hidden min-h-[180px]">
            <img
              src="/assets/plane-mutual.png"
              alt="plane"
              className="object-cover w-full
               h-full absolute top-0 pointer-events-none"
              style={{ zIndex: 0 }}
            />
            <div className="absolute inset-0 bg-blue-900 bg-opacity-70"></div>
            <div className="relative z-10 flex flex-col items-start justify-center h-full p-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                ¡Bienvenido/a {sessionStorage.getItem("username")}!
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-2">
                Trabaja siempre organizado en el sistema de gestión Mutual 17 de
                Junio.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {(userRole === "Consultor"
              ? [
                  {
                    title: "REPORTES Y PERIODOS CONTABLES",
                    icon: (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-20 w-20 text-blue-600"
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
                    ),
                    button: (
                      <button
                        onClick={() => navigate("/periodos")}
                        className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Ingresar
                      </button>
                    ),
                  },
                ]
              : [
                  {
                    title: "PROVEEDORES",
                    icon: (
                      <UserGroupIcon className="h-20 w-20 text-gray-600" />
                    ),
                    button: (
                      <button
                        onClick={() => navigate("/proveedores")}
                        className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Ingresar
                      </button>
                    ),
                  },
                  {
                    title: "COBROS Y MOROSIDAD",
                    icon: (
                      <CurrencyDollarIcon className="h-20 w-20 text-gray-600" />
                    ),
                    button: (
                      <button
                        onClick={() => navigate("/cobros")}
                        className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Ingresar
                      </button>
                    ),
                  },
                  {
                    title: "ASOCIADOS",
                    icon: (
                      <UsersIcon className="h-20 w-20 text-gray-600" />
                    ),
                    button: (
                      <button
                        onClick={() => navigate("/asociados")}
                        className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Ingresar
                      </button>
                    ),
                  },
                  {
                    title: "PRÉSTAMOS",
                    icon: (
                      <DocumentCurrencyDollarIcon className="h-20 w-20 text-gray-600" />
                    ),
                    button: (
                      <button
                        onClick={() => navigate("/prestamos")}
                        className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Ingresar
                      </button>
                    ),
                  },
                  {
                    title: "REPORTES Y PERIODOS CONTABLES",
                    icon: (
                      <DocumentChartBarIcon className="h-20 w-20 text-gray-600" />
                    ),
                    button: (
                      <button
                        onClick={() => navigate("/periodos")}
                        className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 transition"
                      >
                        Ingresar
                      </button>
                    ),
                  },
                ]
            ).map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center transition-transform hover:-translate-y-2 hover:shadow-xl border border-blue-100"
              >
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-center text-blue-900">
                  {item.title}
                </h3>
                {item.button}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
