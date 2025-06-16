import React, { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";

interface Supplier {
  Id: number;
  CUIT: string;
  LegalName: string;
  Address: string;
  Phone: string;
  Email: string;
  Active: boolean;
}

const AllSuppliers: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llama al backend para obtener los proveedores
    const fetchSuppliers = async () => {
      try {
        const response = await fetch("/api/suppliers");
        if (response.ok) {
          const data = await response.json();
          setSuppliers(data);
        } else {
          setSuppliers([]);
        }
      } catch {
        setSuppliers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSuppliers();
  }, []);

  // Filtro por nombre, cuit, teléfono o email
  const filteredSuppliers = suppliers.filter(
    (s) =>
     s.LegalName.toLowerCase().includes(search.toLowerCase()) ||
        s.CUIT.includes(search) ||
        (s.Address && s.Address.toLowerCase().includes(search.toLowerCase())) ||
        (s.Phone && s.Phone.includes(search)) ||
        (s.Email && s.Email.toLowerCase().includes(search.toLowerCase()))
    );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Proveedores</h2>
            <button
              onClick={() => navigate("/proveedores/nuevo")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Nuevo Proveedor
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por nombre, CUIT, teléfono o email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Nombre/Razón Social</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">CUIT</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
               <tbody className="bg-white divide-y divide-gray-200">
                {filteredSuppliers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No se encontraron proveedores.
                    </td>
                  </tr>
                ) : (
                  filteredSuppliers.map((s) => (
                    <tr key={s.Id}>
                      <td className="px-4 py-2">{s.Id}</td>
                      <td className="px-4 py-2">{s.LegalName}</td>
                      <td className="px-4 py-2">{s.CUIT}</td>
                      <td className="px-4 py-2">{s.Address}</td>
                      <td className="px-4 py-2">{s.Phone}</td>
                      <td className="px-4 py-2">{s.Email}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => navigate(`/proveedores/ver/${s.Id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm ml-2"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => navigate(`/proveedores/editar/${s.Id}`)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => navigate(`/proveedores/desactivar/${s.Id}`)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Desactivar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllSuppliers;