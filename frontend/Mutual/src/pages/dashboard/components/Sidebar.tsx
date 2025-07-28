import React, { useState } from "react";
import { ChevronDownIcon, ShoppingCartIcon } from "@heroicons/react/24/solid"; // Esta es la versión sólida

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
      <div className="flex items-center justify-center h-20 ">
        <img
          src="/assets/logo-mutual.png"
          alt="Logo Mutual"
          className="h-20 w-20 object-contain"
        />
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <h2 className="text-center">MENU M17J</h2>

        <a
          href="/dashboard"
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <HomeIcon className="h-5 w-5" />
          Inicio
        </a>

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
            </div>
          )}
        </div>

        <a
          href=" "
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
                  <ClipboardDocumentListIcon className="h-4 w-4" /> Auditorías
                </a>
              </div>
            )}
          </div>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
