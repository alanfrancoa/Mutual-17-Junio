import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { IAssociateList } from "../../../types/associates/IAssociateList";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

const DeleteAssociate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const associateId = id ? parseInt(id, 10) : null;

  const [associate, setAssociate] = useState<IAssociateList | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const { showSuccessToast, showErrorToast } = useAppToast();

  useEffect(() => {
    const fetchAssociateDetails = async () => {
      if (associateId === null) {
        showErrorToast({ message: "Error: ID de asociado no proporcionado." });
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await apiMutual.GetAssociateById(associateId);
        setAssociate(data);
      } catch (err: any) {
        console.error("Error al cargar detalles del asociado:", err);
        showErrorToast({
          title: "Error",
          message:
            err.response?.data?.message ||
            "No se pudo cargar la información del asociado.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssociateDetails();
  }, [associateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (associateId === null) {
      showErrorToast({ message: "ID de asociado no válido para la baja." });
      return;
    }
    if (associate && associate.active === false) {
      showErrorToast({
        message:
          "El asociado ya está inactivo y no puede darse de baja nuevamente.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const result = await apiMutual.ChangeAssociateStatus(associateId, false);

    
      if (result && result.mensaje) {
        showSuccessToast({
          title: "Baja de asociado",
          message: result.mensaje,
        });

        if (result.mensaje.includes("ya se encuentra inactivo")) {
          setSubmitting(false);
          return;
        }
      } else {
        showSuccessToast({
          title: "Baja de asociado",
          message: "Asociado dado de baja correctamente.",
        });
      }

      setTimeout(() => {
        navigate("/asociados");
      }, 1000);
    } catch (error: any) {
      console.error("Error al dar de baja al asociado:", error);
      const errorMsg =
        error.response?.data?.message ||
        error?.message ||
        "Error de sistema al dar de baja el asociado.";
      showErrorToast({
        title: "Error",
        message: errorMsg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
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
              Baja de Asociado
            </h2>
          </div>
          <div className="w-full max-w-xl bg-white rounded-lg shadow p-8">
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
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full transition duration-200 ease-in-out"
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold transition duration-200 ease-in-out disabled:opacity-50"
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
    </div>
  );
};

export default DeleteAssociate;
