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
        <h2 className="text-center">Menu [Rol]</h2>
        <a
          href=" "
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          <span className="material-icons"></span>
          INICIO
        </a>
        {/* Asociados */}
        <a
          href=" "
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700  transition font-medium"
        >
          <span className="material-icons"></span>
          ASOCIADOS
        </a>
        {/* Proveedores */}
        <a
          href=" "
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700  transition font-medium"
        >
          <span className="material-icons"></span>
          PROVEEDORES
        </a>
        {/* Cobros y Morosidad */}
        <a
          href=" "
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700  transition font-medium"
        >
          <span className="material-icons"></span>
          COBROS Y MOROSIDAD
        </a>
        {/* Préstamos */}
        <a
          href=" "
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700  transition font-medium"
        >
          <span className="material-icons"></span>
          PRÉSTAMOS
        </a>
        {/* Reportes y Normativas */}
        <a
          href=" "
          className="flex items-center gap-3 py-3 px-4 rounded-lg hover:bg-blue-700  transition font-medium"
        >
          <span className="material-icons"> </span>
          REPORTES Y NORMATIVAS
        </a>
      </nav>
    </aside>
  );
};

export default Sidebar;
