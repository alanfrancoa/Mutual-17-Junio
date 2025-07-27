import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";

type UserRole = "administrador" | "gestor" | "consultante";
const userRole = (sessionStorage.getItem("userRole") || "consultante") as UserRole;

interface AllServices {
  Id: number;
  Description: string;
  MonthlyCost: number;
  Active: boolean;
  Supplier: string;
  ServiceType: string; 
}

const AllServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<AllServices[]>([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("/api/services");
        if (response.ok) {
          const data = await response.json();
          const mapped = data  //Mappea los datos para mostrar proveedor y service type
            .filter((s: any) => s.Active)
            .map((s: any) => ({
              Id: s.Id,
              Description: s.Description ?? "",
              MonthlyCost: s.MonthlyCost ?? 0,
              Active: s.Active,
              Supplier: s.Suppliers?.LegalName ?? "Sin proveedor",
              ServiceType: s.ServiceType?.Name ?? "Sin tipo",
            }));
          setServices(mapped);
        } else {
          setServices([]);
        }
      } catch {
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Filtros
  const filteredServices = services.filter((service) =>
    service.Id.toString().includes(search) || service.Supplier.toLowerCase().includes(search.toLowerCase()) ||
    service.ServiceType.toLowerCase().includes(search.toLowerCase()) || service.Description.toLowerCase().includes(search.toLowerCase())
  );
  // Mensaje según el estado y rol
 const handleEditClick = (service: AllServices) => {
    if (userRole !== "administrador") {
      alert('Solo un usuario con rol "Administrador" puede editar un servicio.');
      return;
    }
    navigate(`/suppliers/services/edit/${service.Id}`); //SI PASA PERMISO
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
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
              placeholder="Buscar por ID, proveedor, tipo o descripción"
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Costo Mensual</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No se encontraron servicios.
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service) => (
                    <tr key={service.Id}>
                      <td className="px-4 py-2">{service.Id}</td>
                      <td className="px-4 py-2">{service.Supplier}</td>
                      <td className="px-4 py-2">{service.ServiceType}</td>
                      <td className="px-4 py-2">{service.Description}</td>
                      <td className="px-4 py-2">${service.MonthlyCost?.toLocaleString()}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => navigate(`/suppliers/services/view/${service.Id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Ver
                        </button>
                        {userRole === "administrador" && (
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