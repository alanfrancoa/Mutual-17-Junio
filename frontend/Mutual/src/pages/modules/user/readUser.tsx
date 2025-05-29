import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";

const datos = {
  nombre: "anabela1",
  email: "anabela1@mutual17dejunio.com",
  rol: "Consultor",
  fechaCreacion: "2024-05-01",
  ultimaActualizacion: "2024-06-01",
};

const ReadUser: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        {/* Título alineado al formulario, fuera del form */}
        <div className="w-full max-w-xl">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            Detalles del Usuario
          </h2>
        </div>
        <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={datos.nombre}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={datos.email}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <input
                type="text"
                value={datos.rol}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de creación
              </label>
              <input
                type="date"
                value={datos.fechaCreacion}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Última actualización
              </label>
              <input
                type="date"
                value={datos.ultimaActualizacion}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate("/usuarios")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
              >
                Volver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReadUser;