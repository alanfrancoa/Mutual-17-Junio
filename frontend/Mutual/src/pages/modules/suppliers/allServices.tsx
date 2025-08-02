import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { ServiceList } from "../../../types/IServiceList";

type UserRole = "Administrador" | "Gestor" | "Consultor";
const userRole = (sessionStorage.getItem("userRole") || "Consultor") as UserRole;

const AllServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<ServiceList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await apiMutual.GetServices();

        if (Array.isArray(data)) {
          const mapped = data.map((s: any) => ({
            Id: s.id,
            Description: s.description,
            MonthlyCost: s.monthlyCost,
            Active: s.active,
            Supplier: s.proveedor,
          }));
          setServices(mapped);
        } else if (data && typeof data === 'object' && 'mensaje' in data) {
          setServices([]);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Error al cargar servicios:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    (service.Id?.toString() || "").includes(search) ||
    (service.Supplier || "").toLowerCase().includes(search.toLowerCase()) ||
    (service.Description || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (service: ServiceList) => {
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      alert('Solo usuarios con rol "Administrador" o "Gestor" pueden editar un servicio.');
      return;
    }
    navigate(`/proveedores/servicios/editar/${service.Id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} loans={[]} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Servicios</h2>
            <button
              onClick={() => navigate("/proveedores/servicios/crear/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Nuevo Servicio
            </button>
            <button
              onClick={() => navigate("/proveedores/facturas")}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold"
            >
              Facturas
            </button>
            <button
              onClick={() => navigate("/proveedores/metodos-pago")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Medios de pago
            </button>
            <button
              onClick={() => navigate("/proveedores/tipos-servicio")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Tipos de servicio
            </button>
          </div>
          <div className="mb-4 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Buscar por ID, proveedor o descripción"
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Costo Mensual</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4 text-gray-500">
                      {loading ? "Cargando servicios..." : "No se encontraron servicios."}
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service, index) => (
                    <tr key={service.Id || index}>
                      <td className="px-4 py-2">{service.Id || "N/A"}</td>
                      <td className="px-4 py-2">{service.Supplier || "Sin proveedor"}</td>
                      <td className="px-4 py-2">{service.Description || "Sin descripción"}</td>
                      <td className="px-4 py-2">${(service.MonthlyCost || 0).toLocaleString()}</td>
                      <td className="px-4 py-2 flex gap-2">
                        {(userRole === "Administrador" || userRole === "Gestor") && (
                          <button
                            onClick={() => handleEditClick(service)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Editar
                          </button>
                        )}
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

export default AllServicesPage;