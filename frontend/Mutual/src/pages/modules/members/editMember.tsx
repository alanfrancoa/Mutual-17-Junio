import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";

const categorias = ["Oficial", "Suboficial", "Civil"];
const estados = ["Activo", "Inactivo"];
const estadoCivil = ["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a"];
const sexos = ["Masculino", "Femenino", "Otro"];
const tipoDocumento = ["DNI", "Pasaporte", "CI", "LE", "LC"];
const extranjero = ["No", "Sí"];
const provincias = [
  "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes",
  "Entre Ríos", "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza",
  "Misiones", "Neuquén", "Río Negro", "Salta", "San Juan", "San Luis",
  "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán"
];

const EditMember: React.FC = () => {
  const navigate = useNavigate();
  // Datos precargados de ejemplo
  const [form, setForm] = useState({
    apellidoNombre: "Juan Pérez",
    tipoDocumento: "DNI",
    dni: "12345678",
    extranjero: "No",
    estadoCivil: "Casado/a",
    sexo: "Masculino",
    fechaNacimiento: "1985-04-12",
    fechaIngreso: "2010-03-01",
    categoria: "Oficial",
    estado: "Activo",
    organismo: "Fuerza Aérea Argentina",
    direccion: "Av. Siempre Viva 123",
    direccionLaboral: "Piso 2 Letra B",
    localidad: "CABA",
    provincia: "Buenos Aires",
    telefono: "1122334455",
    email: "juan.perez@faa.gob.ar",
    cbu: "2850590940090418135201",
    cuil: "20-12345678-3",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para actualizar el asociado
    alert("Asociado actualizado correctamente");
    navigate("/asociados");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header userName="Fernando" userRole="administrador" hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">Editar Asociado</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido y Nombre</label>
                <input
                  type="text"
                  name="apellidoNombre"
                  value={form.apellidoNombre}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                <select
                  name="tipoDocumento"
                  value={form.tipoDocumento}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  {tipoDocumento.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">N° Documento</label>
                <input
                  type="text"
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Extranjero</label>
                <select
                  name="extranjero"
                  value={form.extranjero}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  {extranjero.map((op) => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                <select
                  name="estadoCivil"
                  value={form.estadoCivil}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Seleccionar</option>
                  {estadoCivil.map((ec) => (
                    <option key={ec} value={ec}>{ec}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sexo</label>
                <select
                  name="sexo"
                  value={form.sexo}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Seleccionar</option>
                  {sexos.map((sx) => (
                    <option key={sx} value={sx}>{sx}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Ingreso</label>
                <input
                  type="date"
                  name="fechaIngreso"
                  value={form.fechaIngreso}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  name="categoria"
                  value={form.categoria}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  {categorias.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  name="estado"
                  value={form.estado}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  {estados.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organismo</label>
                <input
                  type="text"
                  name="organismo"
                  value={form.organismo}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección Laboral (Piso y Letra)</label>
                <input
                  type="text"
                  name="direccionLaboral"
                  value={form.direccionLaboral}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Localidad</label>
                <input
                  type="text"
                  name="localidad"
                  value={form.localidad}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provincia</label>
                <select
                  name="provincia"
                  value={form.provincia}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                >
                  <option value="">Seleccionar</option>
                  {provincias.map((prov) => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CBU</label>
                <input
                  type="text"
                  name="cbu"
                  value={form.cbu}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CUIL</label>
                <input
                  type="text"
                  name="cuil"
                  value={form.cuil}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
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
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMember;