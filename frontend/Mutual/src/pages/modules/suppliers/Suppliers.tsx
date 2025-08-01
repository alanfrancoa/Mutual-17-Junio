import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../dashboard/components/Header';
import CreateService from './createService';

const SuppliersSidebar: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => (
  <nav className="h-full flex flex-col p-4 bg-white">
    <h2 className="text-lg font-bold mb-6">Menú</h2>
    <ul className="space-y-4">
      <li>
        <button onClick={() => navigate('/suppliers')} className="text-blue-700 hover:underline text-left w-full">
          Proveedores
        </button>
      </li>
      <li>
        <button onClick={() => navigate('/suppliers/services/new')} className="text-blue-700 hover:underline text-left w-full">
          Nuevo Servicio
        </button>
      </li>
      <li>
        <button onClick={() => navigate('/suppliers/service-types')} className="text-blue-700 hover:underline text-left w-full">
          Tipos de servicio
        </button>
      </li>
    </ul>
  </nav>
);

interface DashboardProps {
  userName?: string;
  userRole?: "administrador" | "gestor" | "consultante";
  hasNotifications?: boolean;
  showServiceForm?: boolean;
}

const Suppliers: React.FC<DashboardProps> = ({
  hasNotifications = true,
  showServiceForm = false,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = window.location.pathname;
  const showCreateService = pathname.includes('/suppliers/services') || showServiceForm;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
     <Header hasNotifications={true} loans={[]}  />

      <button
        className="md:hidden absolute top-4 left-4 z-20"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Abrir menú"
      >
        <svg className="h-8 w-8 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex flex-1">
        <div
          className={`
            fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            transition-transform duration-200 ease-in-out
            md:static md:translate-x-0 md:w-64
          `}
        >
          <SuppliersSidebar navigate={navigate} />
        </div>
        
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-0 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 p-6">
          {showCreateService ? (
            <CreateService onBack={() => navigate('/suppliers')} />
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">Proveedores</h1>
              <button 
                onClick={() => navigate('/suppliers/services/new')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mb-4"
              >
                Crear Nuevo Servicio
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Suppliers;