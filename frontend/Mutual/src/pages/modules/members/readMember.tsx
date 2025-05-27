import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";

const provincias = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

const datos = {
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
  nacionalidad: "Argentina",
  familiares: "Carlos Perez, Ana Gómez",
  observaciones: "Sin observaciones",
};

const ReadMember: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            Datos del Asociado
          </h2>
          <form className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido y Nombre
                </label>
                <input
                  type="text"
                  value={datos.apellidoNombre}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Documento
                </label>
                <input
                  type="text"
                  value={datos.tipoDocumento}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N° Documento
                </label>
                <input
                  type="text"
                  value={datos.dni}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extranjero
                </label>
                <input
                  type="text"
                  value={datos.extranjero}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado Civil
                </label>
                <input
                  type="text"
                  value={datos.estadoCivil}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sexo
                </label>
                <input
                  type="text"
                  value={datos.sexo}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  value={datos.fechaNacimiento}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Ingreso
                </label>
                <input
                  type="date"
                  value={datos.fechaIngreso}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <input
                  type="text"
                  value={datos.categoria}
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
                  value={datos.estado}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organismo
                </label>
                <input
                  type="text"
                  value={datos.organismo}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  value={datos.direccion}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección Laboral (Piso y Letra)
                </label>
                <input
                  type="text"
                  value={datos.direccionLaboral}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Localidad
                </label>
                <input
                  type="text"
                  value={datos.localidad}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia
                </label>
                <input
                  type="text"
                  value={datos.provincia}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  value={datos.telefono}
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
                  CBU
                </label>
                <input
                  type="text"
                  value={datos.cbu}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CUIL
                </label>
                <input
                  type="text"
                  value={datos.cuil}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              {/* Campos adicionales solo lectura */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nacionalidad
                </label>
                <input
                  type="text"
                  value={datos.nacionalidad}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Familiares asociados
                </label>
                <input
                  type="text"
                  value={datos.familiares}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>

              <div className="md:col-span-2 lg:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observaciones
                </label>
                <textarea
                  value={datos.observaciones}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate("/asociados")}
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

export default ReadMember;
