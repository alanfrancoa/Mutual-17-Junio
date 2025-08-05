import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { IAssociateRegister } from "../../../types/associates/IAssociateRegister";
import { apiMutual } from "../../../api/apiMutual";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

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
    AffiliationDate: new Date().toISOString().split("T")[0],
    WorkAddress: "",
    BirthDate: "",
    Active: true,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { showSuccessToast, showErrorToast } = useAppToast();
  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validaciones específicas
  if (!form.LegalName) {
    showErrorToast({ message: "El nombre legal es obligatorio." });
    setLoading(false);
    return;
  }
  if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(form.LegalName)) {
    showErrorToast({ message: "El nombre legal solo puede contener letras y espacios." });
    setLoading(false);
    return;
  }
  if (!form.DNI || form.DNI.length < 8) {
    showErrorToast({ message: "El DNI debe tener al menos 8 caracteres." });
    setLoading(false);
    return;
  }
  if (!form.Gender || form.Gender === "Seleccione una opcion") {
    showErrorToast({ message: "El género es obligatorio." });
    setLoading(false);
    return;
  }
  if (!form.Province || form.Province === "Seleccione una opcion") {
    showErrorToast({ message: "La provincia es obligatoria." });
    setLoading(false);
    return;
  }
  if (!form.CivilStatus || form.CivilStatus === "Seleccione una opcion") {
    showErrorToast({ message: "El estado civil es obligatorio." });
    setLoading(false);
    return;
  }
  if (
  !form.CBU ||
  !/^\d{22}$/.test(form.CBU)
) {
  showErrorToast({ message: "El CBU debe tener exactamente 22 dígitos numéricos." });
  setLoading(false);
  return;
}
   if (!form.BirthDate) {
    showErrorToast({ message: "La fecha de nacimiento es obligatoria." });
    setLoading(false);
    return;
  }
  // Validación de fecha de nacimiento (no mayor a 120 años)
  const birthDate = new Date(form.BirthDate);
  const today = new Date();
  const maxAgeDate = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  if (birthDate < maxAgeDate) {
    showErrorToast({ message: "La fecha de nacimiento no puede corresponder a una persona mayor a 120 años." });
    setLoading(false);
    return;
  }
    // Validación de todos los campos obligatorios
    if (
      !form.LegalName ||
      !form.DNI ||
      form.CivilStatus === "Seleccione una opcion" ||
      form.Gender === "Seleccione una opcion" ||
      form.Province === "Seleccione una opcion" ||
      !form.BirthDate ||
      !form.Organization ||
      !form.Address ||
      !form.WorkAddress ||
      !form.City ||
      !form.Phone ||
      !form.Email ||
      !form.CBU
    ) {
      showErrorToast({ message: "Por favor, complete todos los campos." });
      setLoading(false);
      return;
    }

    if (form.CBU.length < 22) {
      showErrorToast({ message: "El CBU debe tener al menos 22 caracteres." });
      setLoading(false);
      return;
    }

    if (form.Phone.length < 8) {
      showErrorToast({
        message: "El teléfono debe tener al menos 8 caracteres.",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await apiMutual.RegisterAssociate(form);
      showSuccessToast({
        title: "Asociado creado",
        message:
          response.mensaje || "El asociado fue registrado correctamente.",
      });

      setTimeout(() => {
        navigate("/asociados");
      }, 2000);
    } catch (error: any) {
      let errorMessage = "Error interno al registrar el asociado.";
      if (error?.response?.data) {
        errorMessage = error.response.data.message ||
          error.response.data.mensaje ||
          error.response.data.errorDetails ||
          errorMessage;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      showErrorToast({
        title: "Error del servidor.",
        message: errorMessage,
      });
    } finally {
      setLoading(false);
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
                onClick={() => navigate("/asociados/detalle/:id")}
                ///asociados/crear/familiar/:associateId
                className="text-gray-600 hover:text-gray-800 flex items-center"
                aria-label="Volver a Usuarios"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="ml-1">Volver</span>
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
              Nuevo Asociado
            </h2>
          </div>
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
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
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/asociados")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full transition duration-200 ease-in-out"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold transition duration-200 ease-in-out disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssociate;
