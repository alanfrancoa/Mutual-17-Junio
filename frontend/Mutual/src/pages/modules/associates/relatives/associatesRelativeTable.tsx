import React from "react";
import { useNavigate } from "react-router-dom";
import { IRelativeList } from "../../../../types/IRelative";
import DeleteAndReactivateRelative from "./deleteAndReactivateRelative";


interface AssociateRelativesTableProps {
  associateId: number | null;
  relatives: IRelativeList[];
  loadingRelatives: boolean;
  relativeError: string | null;
  onRelativesUpdated: () => Promise<void>; // Callback para recargar los familiares
}

const AssociateRelativesTable: React.FC<AssociateRelativesTableProps> = ({
  associateId,
  relatives,
  loadingRelatives,
  relativeError,
  onRelativesUpdated,
}) => {
  const navigate = useNavigate();

  const mapActiveStatus = (isActive: boolean) => {
    return isActive ? "Activo" : "Inactivo";
  };

  const handleCreateRelative = () => {
    if (associateId) {
      navigate(`/asociados/crear/familiar/${associateId}`);
    }
  };
  const handleEditRelative = (relativeId: number) => {
    if (associateId) {
      navigate(`/asociados/${associateId}/familiar/editar/${relativeId}`);
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-900">
          Familiares Registrados
        </h3>
        {associateId && (
          <button
            onClick={handleCreateRelative}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition duration-200 ease-in-out"
          >
            + Añadir Familiar
          </button>
        )}
      </div>

      {loadingRelatives ? (
        <div className="text-center py-4 text-gray-500">
          Cargando familiares...
        </div>
      ) : relativeError ? (
        <div className="text-center py-4 text-red-600">{relativeError}</div>
      ) : relatives.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No hay familiares registrados para este asociado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DNI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre Legal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parentesco
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {relatives.map((relative) => (
                <tr key={relative.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {relative.dni}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {relative.legalName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {relative.relation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {relative.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        relative.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {mapActiveStatus(relative.active)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEditRelative(relative.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Editar
                    </button>
                    <DeleteAndReactivateRelative
                      relativeId={relative.id}
                      currentStatus={relative.active}
                      onStatusChanged={onRelativesUpdated} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssociateRelativesTable;
