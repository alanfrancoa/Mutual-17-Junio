import React, { useEffect, useState } from "react";
import { apiMutual } from "../../../api/apiMutual";

interface ICollectionMethod {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}

const PaymentMethodsCollection: React.FC = () => {
  const [methods, setMethods] = useState<ICollectionMethod[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await apiMutual.GetCollectionMethods();
      setMethods(data);
    } catch (err: any) {
      setError(err.message || "Error al cargar los métodos de cobro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Métodos de Cobro</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="min-w-full divide-y divide-gray-200 mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Código</th>
            <th className="px-4 py-2 text-left">Nombre</th>
            <th className="px-4 py-2 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {methods.map((m) => (
            <tr key={m.id}>
              <td className="px-4 py-2">{m.code}</td>
              <td className="px-4 py-2">{m.name}</td>
              <td className="px-4 py-2">
                {m.isActive ? (
                  <span className="text-green-600">Activo</span>
                ) : (
                  <span className="text-red-600">Inactivo</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentMethodsCollection;