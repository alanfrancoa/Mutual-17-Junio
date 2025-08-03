import React, { useEffect, useState } from "react";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { IServiceType } from "../../../types/IServiceType";

interface NewServiceType {
  code: string;
  name: string;
  active?: boolean;
  wasEdited?: boolean;
}

const ServiceTypeList: React.FC = () => {
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [newRows, setNewRows] = useState<NewServiceType[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editedRow, setEditedRow] = useState<Partial<IServiceType>>({});

  useEffect(() => {
    fetchServiceTypes();
  }, []);

  const fetchServiceTypes = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiMutual.GetServiceTypes();
      // Validar que data sea un array
      if (Array.isArray(data)) {
        setServiceTypes(data);
      } else {
        setServiceTypes([]);
        setError("Formato de datos incorrecto");
      }
    } catch (err: any) {
      setServiceTypes([]);
      setError(err.message || "Error al cargar los tipos de servicio");
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = () => {
    setNewRows([...newRows, { code: "", name: "", active: true, wasEdited: false }]);
  };

  const handleNewRowChange = (
    index: number,
    field: keyof NewServiceType,
    value: string | boolean
  ) => {
    setNewRows(prevRows => {
      const updatedRows = [...prevRows];
      if (field === "active" || field === "wasEdited") {
        updatedRows[index][field] = Boolean(value);
      } else {
        updatedRows[index][field] = value as string;
      }
      updatedRows[index].wasEdited = true;
      return updatedRows;
    });
  };

  const handleUpdate = async () => {
    setError("");
    setSuccess("");
    let anyError = false;
    for (const row of newRows) {
      if (!row.code || !row.name) {
        setError("Completa todos los campos de los nuevos tipos de servicio.");
        anyError = true;
        break;
      }
      try {
        await apiMutual.RegisterServiceType(row.code, row.name);
      } catch (err: any) {
        setError(err.message || "Error al agregar un tipo de servicio");
        anyError = true;
        break;
      }
    }
    if (!anyError) {
      setSuccess("Tipos de servicio agregados correctamente");
      setNewRows([]);
      fetchServiceTypes();
    }
  };

  const handleToggleState = async (id: number, newStatus: boolean) => {
    try {
      setError("");
      setSuccess("");

      await apiMutual.ServiceTypeState(id, newStatus);

      setSuccess("Estado del tipo de servicio actualizado correctamente");
      await fetchServiceTypes();
    } catch (err: any) {
      setError(err.message || "Error al cambiar el estado del tipo de servicio");
    }
  };

  const handleSaveEdit = async (index: number) => {
    try {
      setError("");
      setSuccess("");
      const serviceType = serviceTypes[index];

      if (!editedRow.name?.trim() || !editedRow.code?.trim()) {
        setError("El nombre y código no pueden estar vacíos");
        return;
      }

      await apiMutual.UpdateServiceType(serviceType.id, {
        name: editedRow.name ?? serviceType.name,
        code: editedRow.code ?? serviceType.code,
      });

      await fetchServiceTypes();

      setEditIndex(null);
      setEditedRow({});
      setSuccess("Tipo de servicio actualizado correctamente");
    } catch (err: any) {
      setError(err.message || "Error al actualizar el tipo de servicio");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} loans={[]} />
        <div className="flex flex-col items-center py-8">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Agregar/Desactivar tipos de servicio</h2>
            {success && <div className="text-green-600 mb-2">{success}</div>}
            {error && <div className="text-red-600 mb-2">{error}</div>}
            <table className="min-w-full divide-y divide-gray-200 mb-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Nombre</th>
                  <th className="px-4 py-2 text-left">Código</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {serviceTypes.map((type, index) => (
                  <tr key={`type-${type.id}`}>
                    <td className="px-4 py-2">
                      {editIndex === index ? (
                        <input
                          type="text"
                          value={editedRow.name ?? type.name}
                          onChange={e =>
                            setEditedRow({ ...editedRow, name: e.target.value })
                          }
                          className="border px-2 py-1 rounded w-full"
                        />
                      ) : (
                        type.name
                      )}
                    </td>
                    <td className="px-4 py-2">
                      {editIndex === index ? (
                        <select
                          value={editedRow.code ?? type.code}
                          onChange={e =>
                            setEditedRow({ ...editedRow, code: e.target.value })
                          }
                          required
                          className="border px-2 py-1 rounded w-full"
                        >
                          <option value="">Seleccione un código...</option>
                          <option value="Servicios">Servicios</option>
                          <option value="Productos">Productos</option>
                          <option value="Otros">Otros</option>
                        </select>
                      ) : (
                        type.code
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <span className={type.active ? "text-green-600" : "text-red-600"}>
                        {type.active ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      {editIndex === index ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(index)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => {
                              setEditIndex(null);
                              setEditedRow({});
                            }}
                            className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                          >
                            Cancelar
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditIndex(index);
                              setEditedRow(type);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleState(type.id, !type.active)}
                            className={`${type.active
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-green-600 hover:bg-green-700"
                              } text-white px-3 py-1 rounded text-sm`}
                          >
                            {type.active ? "Desactivar" : "Activar"}
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {newRows.map((row, idx) => (
                  <tr key={`new-${idx}`}>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.name}
                        onChange={e => handleNewRowChange(idx, "name", e.target.value)}
                        placeholder="Nombre"
                        required
                        maxLength={255}
                        className="border px-2 py-1 rounded w-full"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={row.code}
                        onChange={e => handleNewRowChange(idx, "code", e.target.value)}
                        required
                        className="border px-2 py-1 rounded w-full"
                      >
                        <option value="">Seleccione un código...</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Productos">Productos</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </td>
                    <td className="px-4 py-2">Nuevo</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setNewRows(newRows.filter((_, i) => i !== idx))}
                        className={`bg-gray-400 text-white px-3 py-1 rounded text-sm ${row.wasEdited ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={row.wasEdited}
                        title={row.wasEdited ? "No puedes quitar una línea que ya fue editada" : ""}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddRow}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                + Agregar línea
              </button>
              {newRows.length > 0 && (
                <button
                  type="button"
                  onClick={handleUpdate}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                >
                  Guardar
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTypeList;