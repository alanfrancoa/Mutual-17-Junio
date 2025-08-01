import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";

const DeleteUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const data = await apiMutual.GetUserById(Number(id));
        setUsuario(data);
      } catch (error) {
        alert("Error al obtener el usuario");
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      alert("El ID de usuario no está disponible para la baja.");
      return;
    }

    /* ----------------------- Validacion operacion eliminacion + msj del BE ----------------------- */

    try {
      const result = await apiMutual.DeleteUser(Number(id));

      // Verificamos si la respuesta exitosa tiene un mensaje y lo mostramos.
      if (result && result.message) {
        alert(result.message);

        // Si el usuario ya estaba inactivo según el backend, no navegamos.
        if (result.message.includes("ya se encuentra inactivo")) {
          return;
        }
      } else {
        alert("Usuario dado de baja correctamente.");
      }
      // Navegamos solo si la baja fue exitosa
      navigate("/usuarios");
    } catch (error: any) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert(
          error?.message ||
            "Ocurrió un error inesperado al dar de baja el usuario."
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
     <Header hasNotifications={true} loans={[]}  />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            Baja de Usuario
          </h2>
        </div>
        <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
          {loading || !usuario ? (
            <div className="text-center text-gray-500 py-8">Cargando...</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de usuario
                </label>
                <input
                  type="text"
                  value={usuario.username}
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
                  value={usuario.role}
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
                  value={usuario.status}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              {usuario.status === "Inactivo" && (
                <div className="text-red-600 font-semibold">
                  El usuario ya está inactivo y no puede darse de baja
                  nuevamente.
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/usuarios")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Dar de Baja
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
