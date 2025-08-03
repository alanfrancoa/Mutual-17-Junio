import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

const roles = ["Admin", "Gestor", "Consultor"];

const EditUser: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState({
    user: "",
    Newpassword: "",
    role: "",
  });
  const [loading, setLoading] = useState(true);
  const { showSuccessToast, showErrorToast } = useAppToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const data = await apiMutual.GetUserById(Number(id));
        setForm({
          user: data.username,
          Newpassword: "",
          role: data.role,
        });
      } catch (error) {
        showErrorToast({ message: "Error al obtener el usuario" });
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //VALIDACIONES

    // nombre de usuario minimo 6 letras
    if (form.user.length < 6) {
      showErrorToast({
        message: "El nombre de usuario debe tener mínimo 6 letras.",
      });
      return;
    }

    // nueva pass tenga min 8 caracteres
    if (form.Newpassword && form.Newpassword.length < 8) {
      showErrorToast({
        message: "La contraseña debe tener al menos 8 caracteres.",
      });
      return;
    }

    // new pass que contenga letras y al menos un numero o simbolo
    if (
      form.Newpassword &&
      !/(?=.*[A-Za-z])(?=.*[\d\W]).{8,}/.test(form.Newpassword)
    ) {
      showErrorToast({
        message:
          "La contraseña debe contener letras y al menos un número o símbolo.",
      });
      return;
    }
    const passwordToSend = form.Newpassword === "" ? null : form.Newpassword;
    try {
      await apiMutual.EditUser(
        Number(id),
        form.user,
        passwordToSend as string | null,

        form.role
      );
      showSuccessToast({ message: "Usuario actualizado correctamente" });
      navigate("/usuarios");
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        "Error de sistema al actualizar usuario";
      showErrorToast({ message: errorMsg });
    }
  };

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
              Editar Usuario
            </h2>
          </div>
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
            {loading ? (
              <div className="text-center text-gray-500 py-8">Cargando...</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de usuario
                  </label>
                  <input
                    type="text"
                    name="user"
                    value={form.user}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    name="Newpassword"
                    value={form.Newpassword}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Nueva contraseña"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rol
                  </label>
                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    {roles.map((rol) => (
                      <option key={rol} value={rol}>
                        {rol}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/usuarios")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2  font-semibold rounded-full"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
