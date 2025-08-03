import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { User } from "../../../types/user";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

const ReadUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showErrorToast } = useAppToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const data = await apiMutual.GetUserById(Number(id));
        setUser(data);
      } catch (error) {
      showErrorToast({ message: "Error de sistema al obtener el usuario" });
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  return (
   <div className="min-h-screen bg-gray-100 flex">
      
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} loans={[]} />
        <div className="flex flex-col items-center py-8 flex-1">
          <div className="w-full max-w-xl">
            <div className="flex justify-start mb-6">
              <button
                onClick={() => navigate("/usuarios")}
                className="text-gray-600 hover:text-gray-800 flex items-center"
                aria-label="Volver a Usuarios"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="ml-1">Volver</span>
              </button>
            </div>
          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            Detalles del Usuario
          </h2>
        </div>
        <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Cargando...</div>
          ) : user ? (
            <form className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  value={user.username}
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
                  value={user.role}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <input
                  type="text"
                  value={user.status}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de creación
                </label>
                <input
                  type="text"
                  value={user.createdAt ? new Date(user.createdAt).toLocaleString() : ""}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Última actualización
                </label>
                <input
                  type="text"
                  value={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : ""}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              {user.deletedAt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha de baja
                  </label>
                  <input
                    type="text"
                    value={new Date(user.deletedAt).toLocaleString()}
                    disabled
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  />
                </div>
              )}
              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/usuarios")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold"
                >
                  Volver
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center text-red-500 py-8">
              Usuario no encontrado
            </div>
          )}
        </div>
      </div>
    </div>
     </div>
  );
};

export default ReadUser;