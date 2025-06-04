import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";

const usuarioSeleccionado = [{ id: "1", nombre: "anabela1" }];

const DeleteUser: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fechaEgreso: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    alert("Usuario dado de baja correctamente");
    navigate("/usuarios");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        {/* Título form baja usuario */}
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            Baja de Usuario
          </h2>
        </div>
        <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de usuario
              </label>
              <input
                type="text"
                value={usuarioSeleccionado[0].nombre}
                disabled
                className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de egreso <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fechaEgreso"
                value={form.fechaEgreso}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
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
        </div>
      </div>
    </div>
  );
};

export default DeleteUser;
