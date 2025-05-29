import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";

const usuarios = [
  { id: "1", nombre: "anabela1" },
  { id: "2", nombre: "juanperez" },
  { id: "3", nombre: "maria2" },
  // ...agrega más usuarios si lo deseas
];

const motivosBaja = ["Renuncia", "Desempeño", "Reestructuración", "Otro"];

const DeleteUser: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    usuario: "",
    motivoBaja: "",
    ultimoDia: "",
    notas: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para dar de baja al usuario
    alert("Usuario dado de baja correctamente");
    navigate("/usuarios");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        {/* Título alineado al formulario, fuera del form */}
        <div className="w-full max-w-lg">
          
          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            Baja de Usuario
          </h2>
        </div>
        <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecciona el Usuario <span className="text-red-500">*</span>
              </label>
              <select
                name="usuario"
                value={form.usuario}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Seleccionar</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de baja <span className="text-red-500">*</span>
              </label>
              <select
                name="motivoBaja"
                value={form.motivoBaja}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Seleccionar</option>
                {motivosBaja.map((motivo) => (
                  <option key={motivo} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Último día activo <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="ultimoDia"
                value={form.ultimoDia}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notas
              </label>
              <textarea
                name="notas"
                value={form.notas}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Escribe un comentario que describa el motivo"
                rows={2}
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
