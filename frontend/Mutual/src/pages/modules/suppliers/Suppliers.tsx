import React, { useState } from 'react';
import Header from '../../dashboard/components/Header';

// Sidebar específico para Proveedores
const SuppliersSidebar: React.FC = () => (
  <nav className="h-full flex flex-col p-4 bg-white">
    <h2 className="text-lg font-bold mb-6">Menú</h2>
    <ul className="space-y-4">
      <li>
        <a href=" " className="text-blue-700 hover:underline">Proveedores</a>
      </li>
      <li>
        <a href=" " className="text-blue-700 hover:underline">Cobros y Morosidad</a>
      </li>
      <li>
        <a href=" " className="text-blue-700 hover:underline">Asociados</a>
      </li>
      <li>
        <a href=" " className="text-blue-700 hover:underline">Inventario</a>
      </li>
      <li>
        <a href=" " className="text-blue-700 hover:underline">Prestamos</a>
      </li>
      <li>
        <a href=" " className="text-blue-700 hover:underline">Reportes y normativas</a>
      </li>
    </ul>
  </nav>
);

interface DashboardProps {
  userName?: string;
  userRole?: "administrador" | "gestor" | "consultante";
  hasNotifications?: boolean;
}

const Proveedores: React.FC<DashboardProps> = ({
  userName = "Fernando",
  userRole = "administrador",
  hasNotifications = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <Header
        userName={userName}
        userRole={userRole}
        hasNotifications={hasNotifications}
      />

      {/* Botón hamburguesa solo en mobile */}
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
        {/* Sidebar nuevo */}
        <div
          className={`
            fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            transition-transform duration-200 ease-in-out
            md:static md:translate-x-0 md:w-64
          `}
        >
          <SuppliersSidebar />
        </div>
        {/* Overlay para cerrar el sidebar en mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-0 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Contenido principal */}
        <div className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Proveedores</h1>
          {/* Más contenido aquí */}
        </div>
      </div>
    </div>
  );
};

export default Proveedores;