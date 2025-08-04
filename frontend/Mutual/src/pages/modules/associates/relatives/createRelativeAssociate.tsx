import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IRelativeRegister } from "../../../../types/associates/IRelative";
import { IAssociateList } from "../../../../types/associates/IAssociateList";
import { apiMutual } from "../../../../api/apiMutual";
import Header from "../../../dashboard/components/Header";
import Sidebar from "../../../dashboard/components/Sidebar";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../../hooks/useAppToast";

// Opciones de parentesco
const relationshipsOptions = [
  "Seleccione una opcion",
  "Hijo/a",
  "Padre/Madre",
  "Hermano/a",
  "Nieto/a",
  "Abuelo/a",
  "Esposo/a",
  "Conyuge",
];

const CreateAssociateRelative: React.FC = () => {
  const navigate = useNavigate();
  const { associateId } = useParams<{ associateId: string }>(); // Captura el ID del asociado de la URL
  const parsedAssociateId = associateId ? parseInt(associateId, 10) : null;

  const [form, setForm] = useState<IRelativeRegister>({
    dni: "",
    legalName: "",
    phone: "",
    relation: relationshipsOptions[0],
  });

  const [loadingAssociate, setLoadingAssociate] = useState<boolean>(true);
  const [parentAssociate, setParentAssociate] = useState<IAssociateList | null>(
    null
  );
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { showErrorToast, showSuccessToast, showInfoToast, showWarningToast } =
    useAppToast();

  useEffect(() => {
    const fetchParentAssociate = async () => {
      if (parsedAssociateId === null) {
        showErrorToast({
          title: "Error",
          message: "ID del asociado principal no proporcionado en la URL.",
        });
        setLoadingAssociate(false);
        return;
      }
      try {
        const data = await apiMutual.GetAssociateById(parsedAssociateId);
        setParentAssociate(data);
      } catch (error: any) {
        console.error("Error al cargar el asociado principal:", error);
        showErrorToast({
          title: "Error",
          message:
            error.response?.data?.mensaje ||
            "Error al cargar la información del asociado principal.",
        });
      } finally {
        setLoadingAssociate(false);
      }
    };
    fetchParentAssociate();
  }, [parsedAssociateId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!form.dni || form.dni.length < 8) {
      return "El DNI debe tener al menos 8 caracteres.";
    }
    if (!form.legalName || !form.legalName.match(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)) {
      return "El nombre es obligatorio y solo puede contener letras y espacios.";
    }
    if (
      !form.phone ||
      form.phone.length < 8 ||
      form.phone.length > 20 ||
      !form.phone.match(/^[0-9\-\.\s]+$/)
    ) {
      return "El teléfono debe tener entre 8 y 20 caracteres y solo puede contener números, guiones y puntos.";
    }
    if (!form.relation || form.relation === relationshipsOptions[0]) {
      return "La relación de parentesco es obligatoria.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showErrorToast({
        title: "Validación",
        message: validationError,
      });
      return;
    }

    if (parsedAssociateId === null) {
      showErrorToast({
        title: "Error",
        message: "ID del asociado principal no válido.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiMutual.CreateRelativeAssociate(
        parsedAssociateId,
        form
      );

      showSuccessToast({
        title: "Creacion exitosa",
        message:
          response.mensaje || "Familiar del asociado creado correctamente.",
      });
      navigate(`/asociados/detalle/${parsedAssociateId}`);
    } catch (error: any) {
      console.error("Error al crear familiar del asociado:", error);
      showErrorToast({
        title: "Error",
        message:
          error.response?.data?.mensaje ||
          "Ocurrió un error al crear el familiar.",
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
                onClick={() =>
                  navigate(`/asociados/detalle/${parsedAssociateId}`)
                }
                className="text-gray-600 hover:text-gray-800 flex items-center"
                aria-label="Volver a Asociados"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="ml-1">Volver</span>
              </button>
            </div>
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
              Nuevo Familiar de Asociado
            </h2>
          </div>
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {loadingAssociate ? (
                <p className="text-center text-gray-500">
                  Cargando asociado principal...
                </p>
              ) : parentAssociate ? (
                <p className="text-lg text-gray-700 mb-4">
                  Para:{" "}
                  <span className="font-semibold">
                    {parentAssociate.legalName} (DNI: {parentAssociate.dni})
                  </span>
                </p>
              ) : (
                <p className="text-lg text-red-600 mb-4">
                  No se pudo cargar el asociado principal.
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DNI del Familiar
                </label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo del Familiar
                </label>
                <input
                  type="text"
                  name="legalName"
                  value={form.legalName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono del Familiar
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parentesco
                </label>
                <select
                  name="relation"
                  value={form.relation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  {relationshipsOptions.map((rel) => (
                    <option key={rel} value={rel}>
                      {rel}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/asociados`)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? "Guardando..." : "Guardar Familiar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAssociateRelative;
