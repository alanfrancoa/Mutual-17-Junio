import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";

const empleados = [
  { id: "1", nombre: "Juan Pérez" },
  { id: "2", nombre: "María Gómez" },
  // ...agrega más empleados si lo deseas
];

const tiposBaja = ["Renuncia", "Despido", "Jubilación", "Fallecimiento"];
const motivosSalida = ["Personal", "Desempeño", "Reestructuración", "Otro"];

const DeleteAssociate: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    empleado: "",
    tipoBaja: "",
    fechaCalculo: "antiguedad",
    motivoSalida: "",
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
    navigate("/asociados");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
          <h2 className="text-lg font-bold mb-6 text-gray-800 tracking-wide">
            Motivo de Baja
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Selecciona al Empleado <span className="text-red-500">*</span>
              </label>
              <select
                name="empleado"
                value={form.empleado}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Seleccionar</option>
                {empleados.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de baja <span className="text-red-500">*</span>
              </label>
              <select
                name="tipoBaja"
                value={form.tipoBaja}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Seleccionar</option>
                {tiposBaja.map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            <div></div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo de salida <span className="text-red-500">*</span>
              </label>
              <select
                name="motivoSalida"
                value={form.motivoSalida}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Seleccionar</option>
                {motivosSalida.map((motivo) => (
                  <option key={motivo} value={motivo}>
                    {motivo}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Último día de baja <span className="text-red-500">*</span>
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
                onClick={() => navigate("/asociados")}
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

export default DeleteAssociate;
