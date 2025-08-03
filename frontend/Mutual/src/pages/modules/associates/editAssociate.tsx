import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { IAssociateList } from "../../../types/associates/IAssociateList";
import { IAssociateRegister } from "../../../types/associates/IAssociateRegister";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

const estadoCivilOpciones = [
  { label: "Soltero/a", value: "Soltero/a" },
  { label: "Casado/a", value: "Casado/a" },
  { label: "Divorciado/a", value: "Divorciado/a" },
  { label: "Viudo/a", value: "Viudo/a" },
];

const generosOpciones = [
  { label: "Masculino", value: "M" },
  { label: "Femenino", value: "F" },
  { label: "Otro", value: "X" },
];

const provincias = [
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

const EditAssociate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const associateId = id ? parseInt(id, 10) : null;

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
    AffiliationDate: "",
    WorkAddress: "",
    BirthDate: "",
    Active: true,
  });

  const [loadingInitialData, setLoadingInitialData] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { showSuccessToast, showErrorToast } = useAppToast();

  useEffect(() => {
    const fetchAssociateDetails = async () => {
      if (associateId === null) {
        showErrorToast({
          title: "Error",
          message: "ID de asociado no válido para actualizar.",
        });
        return;
      }
      try {
        setLoadingInitialData(true);
        const data: IAssociateList = await apiMutual.GetAssociateById(
          associateId
        );
        setForm({
          DNI: data.dni,
          LegalName: data.legalName,
          Address: data.address,
          City: data.city,
          Province: data.province,
          Phone: data.phone || "",
          Email: data.email || "",
          CivilStatus: data.civilStatus || "",
          CBU: data.cbu,
          Gender: data.gender || "",
          Organization: data.organization,
          AffiliationDate: data.affiliationDate
            ? new Date(data.affiliationDate).toISOString().split("T")[0]
            : "",
          WorkAddress: data.workAddress,
          BirthDate: data.birthDate
            ? new Date(data.birthDate).toISOString().split("T")[0]
            : "",
          Active: data.active,
        });
      } catch (err: any) {
        console.error("Error al cargar detalles del asociado:", err);
        setError(
          err.response?.data?.message ||
            "No se pudo cargar la información del asociado para edición."
        );
      } finally {
        setLoadingInitialData(false);
      }
    };

    fetchAssociateDetails();
  }, [associateId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Validaciones avanzadas
  const validateForm = () => {
    if (!form.LegalName.match(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)) {
      return "El nombre legal solo puede contener letras y espacios.";
    }
    if (!form.DNI || form.DNI.length < 8) {
      return "El DNI debe tener al menos 8 caracteres.";
    }
    if (!form.CBU.match(/^\d{22}$/)) {
      return "El CBU debe tener exactamente 22 dígitos.";
    }
    if (!form.Gender) {
      return "El género es obligatorio.";
    }
    if (!form.Province) {
      return "La provincia es obligatoria.";
    }
    if (!form.CivilStatus) {
      return "El estado civil es obligatorio.";
    }
    if (form.BirthDate) {
      const birth = new Date(form.BirthDate);
      const today = new Date();
      const age = today.getFullYear() - birth.getFullYear();
      if (age > 120) {
        return "La fecha de nacimiento no puede ser mayor a 120 años.";
      }
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (associateId === null) {
      setMessage({
        type: "error",
        text: "ID de asociado no válido para actualizar.",
      });
      return;
    }

    const validationError = validateForm();
    if (validationError) {
      showErrorToast({
        title: "Validación",
        message: validationError,
      });
      setSubmitting(false);
      return;
    }

    setSubmitting(true);

    setMessage(null);

    try {
      const response = await apiMutual.UpdateAssociate(associateId, form);
      showSuccessToast({
        title: "Cambio exitoso",
        message: response.mensaje || "Asociado actualizado correctamente.",
      });
      setTimeout(() => {
        navigate("/asociados");
      }, 2000);
    } catch (err: any) {
      console.error("Error al actualizar asociado:", err);
      const errorMessage =
        err.response?.data?.message ||
        "Ocurrió un error al actualizar el asociado.";
      showErrorToast({
        title: "Error",
        message: errorMessage,
      });
    } finally {
      setSubmitting(false);
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
                onClick={() => navigate("/asociados")}
                className="text-gray-600 hover:text-gray-800 flex items-center"
                aria-label="Volver a Asociados"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="ml-1">Volver</span>
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
              Editar Asociado
            </h2>
            <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
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

              {loadingInitialData ? (
                <div className="text-center py-8 text-gray-500">
                  Cargando datos del asociado...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-600">{error}</div>
              ) : (
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
                      <option value="">Selecciona una opción</option>
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
                      <option value="">Selecciona una opción</option>
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
                      <option value="">Selecciona una opción</option>
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
                      disabled={submitting}
                    >
                      {submitting ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditAssociate;
