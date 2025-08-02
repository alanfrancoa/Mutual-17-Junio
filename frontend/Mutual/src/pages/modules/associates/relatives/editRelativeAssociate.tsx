import React, { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  IRelativeList,
  IRelativeUpdate,
} from "../../../../types/associates/IRelative";
import { apiMutual } from "../../../../api/apiMutual";
import Sidebar from "../../../dashboard/components/Sidebar";
import Header from "../../../dashboard/components/Header";

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
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

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
            // revision 'phone' para BE
            phone: relativeToEdit.phone || "",
            relation: relativeToEdit.relation,
            active: relativeToEdit.active,
          });
        } else {
          setError("Familiar no encontrado para el ID proporcionado.");
        }
      } catch (err: any) {
        console.error("Error al cargar los datos del familiar:", err);
        setError(
          err.response?.data?.mensaje ||
            "Error al cargar la información del familiar."
        );
      } finally {
        setLoading(false);
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (parsedRelativeId === null) {
      alert("Error: ID del familiar no disponible para la actualización.");
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
      alert(response.mensaje || "Familiar actualizado correctamente.");
      navigate(`/asociados/detalle/${parsedAssociateId}`);
    } catch (err: any) {
      console.error("Error al actualizar familiar:", err);
      alert(err.response?.data?.mensaje || "Error al actualizar el familiar.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} loans={[]} />
        <div className="flex flex-col items-center py-8 flex-1 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">
              Editar Familiar
            </h2>

            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando datos del familiar...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    Nombre Legal
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
                    Teléfono (opcional)
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
                    className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    required
                  >
                    {relationOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="active"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Activo
                  </label>
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/asociados/detalle/${parsedAssociateId}`)
                    }
                    className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRelativeAssociate;
