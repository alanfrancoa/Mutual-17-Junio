import React from "react";

const Sidebar: React.FC = () => {
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
        {/* Home */}
        <h2 className="text-center">MENU M17J</h2>
        <a
          href="/dashboard"
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <span className="material-icons"></span>
          Inicio
        </a>
        {/* Asociados */}
        <a
          href="/asociados"
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700  transition font-medium"
        >
          <span className="material-icons"></span>
          Asociados
        </a>
        {/* Proveedores */}
        <a
          href="/proveedores"
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700  transition font-medium"
        >
          <span className="material-icons"></span>
          Proveedores
        </a>
        {/* Cobros y Morosidad */}
        <a
          href=" "
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700  transition font-medium"
        >
          <span className="material-icons"></span>
          Cobros y Morosidad
        </a>
        {/* Préstamos */}
        <a
          href=" "
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700  transition font-medium"
        >
          <span className="material-icons"></span>
          Prestamos
        </a>
        {/* Reportes y Normativas */}
        <a
          href=" "
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700  transition font-medium"
        >
          <span className="material-icons"> </span>
          Reportes Y Normativas
        </a>
        <a
          href="/usuarios"
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700  transition font-medium"
        >
          <span className="material-icons"> </span>
          Acceso Administrador
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
