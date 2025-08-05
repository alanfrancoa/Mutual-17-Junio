import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiMutual } from "../../../api/apiMutual";
import { ICollectionDetail } from "../../../types/ICollection";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<ICollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { showErrorToast } = useAppToast();

  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const data = await apiMutual.GetCollectionActiveById(Number(id));
        setCollection(data);
      } catch (err: any) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "Error al obtener el detalle del cobro";
        showErrorToast({
          title: "Error",
          message: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
          <Header hasNotifications={true} loans={[]} />
          <div className="flex flex-col items-center justify-center py-8 flex-1">
            <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 text-center">
              <div className="text-lg text-gray-600">
                Cargando detalle del cobro...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
          <Header hasNotifications={true} loans={[]} />
          <div className="flex flex-col items-center justify-center py-8 flex-1">
            <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 text-center">
              <div className="text-lg text-red-600">
                No se encontró el cobro solicitado.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} loans={[]} />
        <div className="flex flex-col items-center py-8 flex-1">
          <div className="w-full max-w-xl">
            <div className="flex justify-start mb-6">
              <button
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-800 flex items-center"
                aria-label="Volver a Prestamo"
              >
                <ChevronLeftIcon className="h-5 w-5" />
                <span className="ml-1">Volver</span>
              </button>
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">
              Detalle de Cobro
            </h2>

            <div className="flex justify-center">
              <div className="w-full max-w-2xl">
                <div className="overflow-x-auto rounded-lg shadow bg-white p-6">
                  {/* Información del cobro */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Información del Cobro
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          ID del Cobro:
                        </span>
                        <span className="ml-2 text-gray-900">
                          #{collection.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detalles del cobro */}
                  <div className="space-y-6">
                    {/* Monto */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Monto del cobro
                      </label>
                      <input
                        type="text"
                        value={`$${collection.amount.toLocaleString()}`}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                    </div>

                    {/* Fecha de cobro */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Fecha de cobro
                      </label>
                      <input
                        type="text"
                        value={
                          collection.collectionDate
                            ? new Date(
                                collection.collectionDate
                              ).toLocaleDateString("es-AR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "No especificada"
                        }
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                    </div>

                    {/* Método de cobro */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Método de cobro
                      </label>
                      <input
                        type="text"
                        value={collection.method || "No especificado"}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                    </div>

                    {/* Número de comprobante */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        N° de comprobante
                      </label>
                      <input
                        type="text"
                        value={collection.receiptNumber || "No especificado"}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      />
                    </div>

                    {/* Información adicional si existe */}
                    {collection.observations && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Observaciones
                        </label>
                        <textarea
                          value={collection.observations}
                          readOnly
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                        />
                      </div>
                    )}
                    {/* Botones de acción */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
                      <button
                        onClick={() => navigate(-1)}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow transition duration-200 ease-in-out w-full md:w-auto"
                      >
                        Cancelar
                      </button>

                      {collection.status === "Activo" && (
                        <button
                          onClick={() =>
                            navigate(`/cobros/editar/${collection.id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow transition duration-200 ease-in-out w-full md:w-auto"
                        >
                          Editar Cobro
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
