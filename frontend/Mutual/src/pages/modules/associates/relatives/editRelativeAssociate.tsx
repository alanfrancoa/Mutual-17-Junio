import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IRelativeList,
  IRelativeUpdate,
} from "../../../../types/associates/IRelative";
import { IAssociateList } from "../../../../types/associates/IAssociateList";
import { apiMutual } from "../../../../api/apiMutual";
import Sidebar from "../../../dashboard/components/Sidebar";
import Header from "../../../dashboard/components/Header";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../../hooks/useAppToast";

const EditRelativeAssociate: React.FC = () => {
  const navigate = useNavigate();
  const { associateId, relativeId } = useParams<{
    associateId: string;
    relativeId: string;
  }>();

  const parsedAssociateId = associateId ? parseInt(associateId, 10) : null;
  const parsedRelativeId = relativeId ? parseInt(relativeId, 10) : null;

  const [formData, setFormData] = useState<IRelativeUpdate>({
    dni: "",
    legalName: "",
    phone: "",
    relation: "",
    active: true,
  });

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el asociado principal
  const [parentAssociate, setParentAssociate] = useState<IAssociateList | null>(
    null
  );
  const [loadingAssociate, setLoadingAssociate] = useState<boolean>(true);
  const { showSuccessToast, showErrorToast } = useAppToast();

  // Opciones para el campo parentesco
  const relationOptions = [
    "Seleccione una opcion",
    "Hijo/a",
    "Padre/Madre",
    "Hermano/a",
    "Nieto/a",
    "Abuelo/a",
    "Esposo/a",
    "Conyuge",
  ];

  useEffect(() => {
    const fetchRelativeData = async () => {
      if (parsedAssociateId === null || parsedRelativeId === null) {
        setError("IDs de asociado o familiar no proporcionados en la URL.");
        showErrorToast({
          title: "Error",
          message: "IDs de asociado o familiar no proporcionados en la URL.",
        });
        setLoading(false);
        setLoadingAssociate(false);
        return;
      }

      try {
        setLoading(true);
        setLoadingAssociate(true);
        setError(null);

        // Cargar familiares
        const relatives = await apiMutual.GetRelativesByAssociateId(
          parsedAssociateId
        );
        const relativeToEdit = relatives.find(
          (rel: IRelativeList) => rel.id === parsedRelativeId
        );

        if (relativeToEdit) {
          setFormData({
            dni: relativeToEdit.dni,
            legalName: relativeToEdit.legalName,
            phone: relativeToEdit.phone || "",
            relation: relativeToEdit.relation,
            active: relativeToEdit.active,
          });
        } else {
          setError("Familiar no encontrado para el ID proporcionado.");
          showErrorToast({
            title: "Error",
            message: "Familiar no encontrado para el ID proporcionado.",
          });
        }

        // Cargar asociado principal
        const associateData = await apiMutual.GetAssociateById(
          parsedAssociateId
        );
        setParentAssociate(associateData);
      } catch (err: any) {
        console.error("Error al cargar los datos:", err);
        const msg =
          err.response?.data?.mensaje ||
          "Error al cargar la información del familiar o asociado principal.";
        setError(msg);
        showErrorToast({
          title: "Error",
          message: msg,
        });
      } finally {
        setLoading(false);
        setLoadingAssociate(false);
      }
    };

    fetchRelativeData();
  }, [parsedAssociateId, parsedRelativeId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Validación antes de enviar
  const validateForm = () => {
    if (!formData.dni || formData.dni.length < 8) {
      return "El DNI debe tener al menos 8 caracteres.";
    }
    if (
      !formData.legalName ||
      !formData.legalName.match(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/)
    ) {
      return "El nombre es obligatorio y solo puede contener letras y espacios.";
    }
    if (
      !formData.phone ||
      formData.phone.length < 8 ||
      formData.phone.length > 20 ||
      !formData.phone.match(/^[0-9\-.\s]+$/)
    ) {
      return "El teléfono debe tener entre 8 y 20 caracteres y solo puede contener números, guiones y puntos.";
    }
    if (!formData.relation || formData.relation === relationOptions[0]) {
      return "La relación de parentesco es obligatoria.";
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      showErrorToast({
        title: "Validación",
        message: validationError,
      });
      return;
    }

    if (parsedRelativeId === null) {
      showErrorToast({
        title: "Error",
        message: "ID del familiar no disponible para la actualización.",
      });
      return;
    }

    try {
      const dataToSend: IRelativeUpdate = {
        dni: formData.dni,
        legalName: formData.legalName,
        phone: formData.phone,
        relation: formData.relation,
        active: formData.active,
      };

      const response = await apiMutual.UpdateRelative(
        parsedRelativeId,
        dataToSend
      );
      showSuccessToast({
        title: "Familiar actualizado",
        message: response.mensaje || "Familiar actualizado correctamente.",
      });
      navigate(`/asociados/detalle/${parsedAssociateId}`);
    } catch (err: any) {
      console.error("Error al actualizar familiar:", err);
      showErrorToast({
        title: "Error",
        message:
          err.response?.data?.mensaje || "Error al actualizar el familiar.",
      });
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
              Editar Familiar
            </h2>
          </div>
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
            {/* Mostrar asociado principal */}
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="dni"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  DNI
                </label>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  maxLength={10}
                />
              </div>

              <div>
                <label
                  htmlFor="legalName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nombre Completo del Familiar
                </label>
                <input
                  type="text"
                  id="legalName"
                  name="legalName"
                  value={formData.legalName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                  maxLength={255}
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Teléfono del Familiar
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  maxLength={20}
                />
              </div>

              <div>
                <label
                  htmlFor="relation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Parentesco
                </label>
                <select
                  id="relation"
                  name="relation"
                  value={formData.relation}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  required
                >
                  {relationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/asociados/detalle/${parsedAssociateId}`)
                  }
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold disabled:opacity-50"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRelativeAssociate;
