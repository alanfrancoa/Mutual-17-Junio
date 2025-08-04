import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { ServiceList } from "../../../types/IServiceList";
import useAppToast from "../../../hooks/useAppToast";

type UserRole = "Administrador" | "Gestor" | "Consultor";
const userRole = (sessionStorage.getItem("userRole") || "Consultor") as UserRole;

const AllServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast, showWarningToast } = useAppToast();
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
      } catch (error: any) {
        console.error("Error al cargar servicios:", error);
        setServices([])
        showErrorToast({
          title: "Error de carga",
          message: error.message || "No se pudieron cargar los servicios"
        });
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter((service) =>
    (service.Id?.toString() || "").includes(search) ||
    (service.Supplier || "").toLowerCase().includes(search.toLowerCase()) ||
    (service.Active ? "activo" : "inactivo").includes(search.toLowerCase())
  );

  const handleEditClick = (service: ServiceList) => {
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      showWarningToast({
        title: "Acceso denegado",
        message: 'Solo usuarios con rol "Administrador" o "Gestor" pueden editar un servicio.'
      });
      return;
    }
    navigate(`/proveedores/servicios/editar/${service.Id}`);
  };

  const handleToggleStatus = async (service: ServiceList) => {
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      showWarningToast({
        title: "Acceso denegado",
        message: 'Solo usuarios con rol "Administrador" o "Gestor" pueden cambiar el estado.'
      });
      return;
    }

    const action = service.Active ? 'desactivar' : 'activar';
    const confirmMessage = `¿Está seguro que desea ${action} el servicio "${service.Description}"?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      await apiMutual.UpdateServiceStatus(service.Id);
      
      showSuccessToast({
        title: "Estado actualizado",
        message: `Servicio ${action === 'desactivar' ? 'desactivado' : 'activado'} correctamente`
      });

      setServices(prevServices =>
        prevServices.map(s =>
          s.Id === service.Id
            ? { ...s, Active: !s.Active }
            : s
        )
      );
    } catch (error: any) {
      console.error("Error al cambiar estado:", error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.mensaje || 
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        error.message || 
        "Error desconocido";

      showErrorToast({
        title: `Error al ${action} servicio`,
        message: errorMessage
      });
    }
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
              placeholder="Buscar por ID, proveedor o estado"
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
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Costo Mensual</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
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
                      <td className="px-4 py-2">${(service.MonthlyCost || 0).toLocaleString()}</td>

                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${service.Active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                          {service.Active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      <td className="px-4 py-2">
                        <div className="flex gap-2 flex-wrap">
                          {(userRole === "Administrador" || userRole === "Gestor") && (
                            <button
                              onClick={() => handleEditClick(service)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                            >
                              Editar
                            </button>
                          )}

                          {(userRole === "Administrador" || userRole === "Gestor") && (
                            <button
                              onClick={() => handleToggleStatus(service)}
                              className={`px-3 py-1 rounded text-sm text-white ${service.Active
                                  ? 'bg-red-500 hover:bg-red-600'
                                  : 'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                              {service.Active ? 'Desactivar' : 'Activar'}
                            </button>
                          )}
                        </div>
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