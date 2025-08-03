import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";

import {
  HomeIcon,
  UsersIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const Sidebar: React.FC = () => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isSuppliersOpen, setIsSuppliersOpen] = useState(false);
  const navigate = useNavigate();

  const toggleAdminMenu = () => {
    setIsAdminMenuOpen(!isAdminMenuOpen);
  };

  const toggleSuppliersMenu = () => {
    setIsSuppliersOpen(!isSuppliersOpen);
  };
  const userRole = sessionStorage.getItem("userRole");

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-72 shadow-2xl text-white flex flex-col z-50"
      style={{ backgroundColor: "rgb(10,27,61)" }}
    >
      <div className="flex flex-row items-center justify-start h-20 px-4">
        <img
          src="/assets/logo-mutual.png"
          alt="Logo Mutual"
          className="h-16 w-16 object-contain"
        />
        <h2 className="ml-4 text-lg font-bold">Mutual 17 de Junio</h2>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <a
          href="/dashboard"
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <HomeIcon className="h-5 w-5" />
          Inicio
        </a>
        {/* vista segun roles consultor, gestor y admin sidebar */}
        {userRole === "Consultor" ? (
          <>
            <a
              href="/periodos"
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <ChartBarIcon className="h-5 w-5" /> Reportes Y Periodos
            </a>
          </>
        ) : (
          <>
            <a
              href="/asociados"
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <UsersIcon className="h-5 w-5" />
              Asociados
            </a>

            <div className="relative">
              <button
                onClick={toggleSuppliersMenu}
                className="flex items-center justify-between w-full gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <div className="flex items-center gap-3">
                  <Cog6ToothIcon className="h-5 w-5" />
                  Proveedores
                </div>
                <ChevronDownIcon
                  className={`h-5 w-5 transition-transform duration-300 ${
                    isSuppliersOpen ? "rotate-0" : "-rotate-90"
                  }`}
                />
              </button>
              {isSuppliersOpen && (
                <div className="pl-8 pt-2 pb-1 space-y-1">
                  <a
                    href="/proveedores"
                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    <UserGroupIcon className="h-4 w-4" />
                    Proveedores
                  </a>
                  <a
                    href="/proveedores/servicios"
                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    <ClipboardDocumentListIcon className="h-4 w-4" /> Servicios
                  </a>
                  <a
                    href="/proveedores/facturas"
                    className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    <ClipboardDocumentListIcon className="h-4 w-4" /> Facturas
                  </a>
                </div>
              )}
            </div>

            <a
              href="/cobros"
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <CreditCardIcon className="h-5 w-5" />
              Cobros y Morosidad
            </a>
            <a
              href="/prestamos"
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <BanknotesIcon className="h-5 w-5" />
              Prestamos
            </a>
            <a
              href="/periodos"
              className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <ChartBarIcon className="h-5 w-5" /> Reportes Y Periodos
            </a>

            {/* Solo Administrador: Acceso Administrador */}
            {userRole === "Administrador" && (
              <div className="relative">
                <button
                  onClick={toggleAdminMenu}
                  className="flex items-center justify-between w-full gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <div className="flex items-center gap-3">
                    <Cog6ToothIcon className="h-5 w-5" />
                    Acceso Administrador
                  </div>
                  <ChevronDownIcon
                    className={`h-5 w-5 transition-transform duration-300 ${
                      isAdminMenuOpen ? "rotate-0" : "-rotate-90"
                    }`}
                  />
                </button>
                {isAdminMenuOpen && (
                  <div className="pl-8 pt-2 pb-1 space-y-1">
                    <a
                      href="/usuarios"
                      className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      <UserGroupIcon className="h-4 w-4" />
                      Usuarios
                    </a>
                    <a
                      href="/auditoria"
                      className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                    >
                      <ClipboardDocumentListIcon className="h-4 w-4" />{" "}
                      Auditorías
                    </a>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </nav>
      <div className="px-4 pb-6">
        <button
          title="Cerrar sesión"
          onClick={() => {
            sessionStorage.clear();
            navigate("/auth/login");
          }}
          className="w-full flex items-center gap-3 py-3 px-4 rounded-lg bg-blue-800 hover:bg-blue-900 transition font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
