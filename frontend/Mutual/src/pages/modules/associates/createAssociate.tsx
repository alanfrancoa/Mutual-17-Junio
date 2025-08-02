import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { IAssociateRegister } from "../../../types/associates/IAssociateRegister";
import { apiMutual } from "../../../api/apiMutual";

// Arrays de opciones para los selects
const estadoCivilOpciones = [
  { label: "Seleccione una opcion", value: "seleccione una opcion" },
  { label: "Soltero/a", value: "Soltero/a" },
  { label: "Casado/a", value: "Casado/a" },
  { label: "Divorciado/a", value: "Divorciado/a" },
  { label: "Viudo/a", value: "Viudo/a" },
];

const generosOpciones = [
  { label: "Seleccione una opcion", value: "seleccione una opcion" },
  { label: "Masculino", value: "M" },
  { label: "Femenino", value: "F" },
  { label: "Otro", value: "X" },
];

const provincias = [
  "Seleccione una opcion",
  "Ciudad Autonoma de Buenos Aires",
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

const CreateAssociate: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<IAssociateRegister>({
    DNI: "",
    LegalName: "",
    Address: "",
    City: "",
    Province: "",
    Phone: "",
    Email: "",
    CivilStatus: "",
    CBU: "",
    Gender: "",
    Organization: "",
    AffiliationDate: new Date().toISOString().split("T")[0], // Establece la fecha afiliacion por defecto a la actual
    WorkAddress: "",
    BirthDate: "",
    Active: true,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await apiMutual.RegisterAssociate(form);
      setMessage({ type: "success", text: response.mensaje });

      setTimeout(() => {
        navigate("/asociados");
      }, 2000);
    } catch (error: any) {
      console.error("Error al registrar asociado:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Ocurrió un error al registrar el asociado.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar fija a la izquierda */}
      <Sidebar />

      {/* Header */}
      <Header hasNotifications={true} loans={[]} />
      <div className="flex flex-col items-center py-8 flex-1 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            Nuevo Asociado
          </h2>
          {message && (
            <div
              className={`p-3 rounded-md mb-4 text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
              role="alert"
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido y Nombre Legal
                </label>
                <input
                  type="text"
                  name="LegalName"
                  value={form.LegalName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N° Documento (DNI)
                </label>
                <input
                  type="text"
                  name="DNI"
                  value={form.DNI}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado Civil
                </label>
                <select
                  name="CivilStatus"
                  value={form.CivilStatus}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {estadoCivilOpciones.map((ec) => (
                    <option key={ec.value} value={ec.value}>
                      {ec.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Género
                </label>
                <select
                  name="Gender"
                  value={form.Gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {generosOpciones.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  name="BirthDate"
                  value={form.BirthDate || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organismo
                </label>
                <input
                  type="text"
                  name="Organization"
                  value={form.Organization}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <input
                  type="text"
                  name="Address"
                  value={form.Address}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección Laboral
                </label>
                <input
                  type="text"
                  name="WorkAddress"
                  value={form.WorkAddress}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="City"
                  value={form.City}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provincia
                </label>
                <select
                  name="Province"
                  value={form.Province}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {provincias.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="Phone"
                  value={form.Phone || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="Email"
                  value={form.Email || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CBU
                </label>
                <input
                  type="text"
                  name="CBU"
                  value={form.CBU}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => navigate("/asociados")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition duration-200 ease-in-out"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition duration-200 ease-in-out disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssociate;
