import React from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

interface DashboardProps {
  userName?: string;
  userRole?: 'administrador' | 'gestor' | 'consultante';
  hasNotifications?: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({
  userName = 'Fernando',
  userRole = 'administrador',
  hasNotifications = true
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header 
        userName={userName} 
        userRole={userRole}
        hasNotifications={hasNotifications} 
      />
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {/* Proveedores */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">PROVEEDORES</h3>
                <button className="mt-2 px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 transition">
                  Ingresar
                </button>
              </div>
            </div>

            {/* Cobros y Morosidad */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">COBROS Y MOROSIDAD</h3>
                <button className="mt-2 px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 transition">
                  Ingresar
                </button>
              </div>
            </div>

            {/* Asociados */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">ASOCIADOS</h3>
                <button className="mt-2 px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 transition">
                  Ingresar
                </button>
              </div>
            </div>

            {/* Inventario */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">INVENTARIO</h3>
                <button className="mt-2 px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 transition">
                  Ingresar
                </button>
              </div>
            </div>

            {/* Préstamos */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">PRÉSTAMOS</h3>
                <button className="mt-2 px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 transition">
                  Ingresar
                </button>
              </div>
            </div>

            {/* Reportes y Normativas */}
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="flex flex-col items-center">
                <div className="text-gray-800 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-center">REPORTES Y NORMATIVAS</h3>
                <button className="mt-2 px-4 py-2 bg-blue-200 text-blue-800 rounded-md hover:bg-blue-300 transition">
                  Ingresar
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Sidebar with navigation icons (visible only on larger screens) */}
        <Sidebar userRole={userRole} />
      </div>
    </div>
  );
};

export default Dashboard;