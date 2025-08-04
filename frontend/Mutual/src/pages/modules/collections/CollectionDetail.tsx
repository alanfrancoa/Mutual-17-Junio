import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { apiMutual } from "../../../api/apiMutual";
import { ICollectionDetail } from "../../../types/ICollection";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const CollectionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<ICollectionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiMutual.GetCollectionActiveById(Number(id));
        setCollection(data);
      } catch (err: any) {
        setError(err.message || "Error al obtener el detalle del cobro");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div className="p-8">Cargando...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!collection) return <div className="p-8">No se encontró el cobro.</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} loans={[]} />

        <main className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow p-8">
            <div className="flex justify-start mb-6">
            </div>

            <h1 className="text-2xl font-bold text-blue-900 mb-8 text-center">
              Detalle de Cobro
            </h1>

            <form className="space-y-5">
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  Monto de la cuota
                </label>
                <input
                  type="text"
                  value={collection.amount}
                  readOnly
                  disabled
                  className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  Fecha de cobro
                </label>
                <input
                  type="text"
                  value={
                    collection.collectionDate
                      ? new Date(collection.collectionDate).toLocaleDateString()
                      : ""
                  }
                  readOnly
                  disabled
                  className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  Método de cobro
                </label>
                <input
                  type="text"
                  value={collection.method || ""}
                  readOnly
                  disabled
                  className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-base font-semibold text-gray-800 mb-1">
                  N° de comprobante
                </label>
                <input
                  type="text"
                  value={collection.receiptNumber || ""}
                  readOnly
                  disabled
                  className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 text-gray-700"
                />
              </div>
            </form>

            <Link
              to={"/prestamos"}
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full text-center mt-8"
            >
              Volver
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CollectionDetail;