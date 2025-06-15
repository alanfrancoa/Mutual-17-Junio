import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { IAssociateList } from "../../../types/IAssociateList";

const DeleteAssociate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const associateId = id ? parseInt(id, 10) : null;

  const [associate, setAssociate] = useState<IAssociateList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  
  useEffect(() => {
    const fetchAssociateDetails = async () => {
      if (associateId === null) {
        alert("Error: ID de asociado no proporcionado.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await apiMutual.GetAssociateById(associateId);
        setAssociate(data);
      } catch (err: any) {
        console.error("Error al cargar detalles del asociado:", err);
        alert(
          err.response?.data?.message ||
            "No se pudo cargar la información del asociado."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssociateDetails();
  }, [associateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    if (associateId === null) {
      alert("ID de asociado no válido para la baja.");
      return;
    }

    if (associate && associate.active === false) {
      alert("El asociado ya está inactivo y no puede darse de baja nuevamente.");
      return;
    }

    setSubmitting(true); 

    try {
     
      const result = await apiMutual.ChangeAssociateStatus(associateId, false);

      if (result && result.mensaje) {
        alert(result.mensaje);

        if (result.mensaje.includes("ya se encuentra inactivo")) {
          setSubmitting(false);
          return;
        }
      } else {
        alert("Asociado dado de baja correctamente.");
      }

      setTimeout(() => {
        navigate("/asociados");
      }, 1000);
    } catch (error: any) {
      console.error("Error al dar de baja al asociado:", error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        alert(error.response.data.message);
      } else {
        alert(
          error?.message ||
            "Ocurrió un error inesperado al dar de baja el asociado."
        );
      }
    } finally {
      setSubmitting(false); 
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold mb-6 text-blue-900">
            Baja de Asociado
          </h2>
        </div>
        <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Cargando...</div>
          ) : !associate ? (
            <div className="text-center py-8 text-red-600">
              No se pudo cargar el asociado o ID no válido.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de Asociado
                </label>
                <input
                  type="text"
                  value={associate.legalName}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DNI
                </label>
                <input
                  type="text"
                  value={associate.dni}
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
                  value={associate.organization}
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
                  value={associate.active ? "Activo" : "Inactivo"}
                  disabled
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                />
              </div>

              {associate.active === false && (
                <div className="text-red-600 font-semibold p-3 bg-red-50 rounded-md">
                  El asociado ya está inactivo y no puede darse de baja
                  nuevamente.
                </div>
              )}

            
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/asociados")}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition duration-200 ease-in-out"
                  disabled={submitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition duration-200 ease-in-out disabled:opacity-50"
                  disabled={submitting || associate.active === false}
                >
                  {submitting ? "Procesando..." : "Confirmar Baja"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteAssociate;