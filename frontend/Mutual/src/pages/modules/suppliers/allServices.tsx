import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { ServiceList } from "../../../types/IServiceList";
import useAppToast from "../../../hooks/useAppToast";

type UserRole = "Administrador" | "Gestor" | "Consultor";
const PAGE_SIZE = 10;

const AllServicesPage: React.FC = () => {
  const navigate = useNavigate();
  const userRole = (sessionStorage.getItem("userRole") ||
    "Consultor") as UserRole;
  const { showSuccessToast, showErrorToast, showWarningToast } = useAppToast();
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<ServiceList[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalService, setModalService] = useState<ServiceList | null>(null);
  const [modalAction, setModalAction] = useState<
    "activar" | "desactivar" | null
  >(null);

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
        } else if (data && typeof data === "object" && "mensaje" in data) {
          setServices([]);
        } else {
          setServices([]);
        }
      } catch (error: any) {
        setServices([]);
        let errorMessage = "Error interno al cargar los servicios.";
        if (error?.response?.data) {
          errorMessage =
            error.response.data.message ||
            error.response.data.mensaje ||
            error.response.data.errorDetails ||
            errorMessage;
        } else if (error?.message) {
          errorMessage = error.message;
        }
        showErrorToast({
          title: "Error del servidor.",
          message: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(
    (service) =>
      (service.Id?.toString() || "").includes(search) ||
      (service.Supplier || "").toLowerCase().includes(search.toLowerCase()) ||
      (service.Active ? "activo" : "inactivo").includes(search.toLowerCase())
  );

  const handleEditClick = (service: ServiceList) => {
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      showWarningToast({
        title: "Acceso denegado",
        message:
          'Solo usuarios con rol "Administrador" o "Gestor" pueden editar un servicio.',
      });
      return;
    }
    navigate(`/proveedores/servicios/editar/${service.Id}`);
  };

  const handleToggleStatus = (service: ServiceList) => {
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      showWarningToast({
        title: "Acceso denegado",
        message:
          'Solo usuarios con rol "Administrador" o "Gestor" pueden cambiar el estado.',
      });
      return;
    }
    setModalService(service);
    setModalAction(service.Active ? "desactivar" : "activar");
    setModalOpen(true);
  };

  const confirmToggleStatus = async () => {
    if (!modalService || !modalAction) return;
    try {
      await apiMutual.UpdateServiceStatus(modalService.Id);
      showSuccessToast({
        title: "Estado actualizado",
        message: `Servicio ${
          modalAction === "desactivar" ? "desactivado" : "activado"
        } correctamente`,
      });
      setServices((prevServices) =>
        prevServices.map((s) =>
          s.Id === modalService.Id ? { ...s, Active: !s.Active } : s
        )
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.mensaje ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message ||
        "Error desconocido";
      showErrorToast({
        title: `Error al ${modalAction} servicio`,
        message: errorMessage,
      });
    } finally {
      setModalOpen(false);
      setModalService(null);
      setModalAction(null);
    }
  };

  // Paginación
  const totalPages = Math.ceil(filteredServices.length / PAGE_SIZE);
  const paginatedServices = filteredServices.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />

      {/* Contenido principal desplazado a la derecha */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        {/* Header */}
        <Header hasNotifications={true} loans={[]} />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">Servicios</h1>

          <div className="flex-1 w-full">
            <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
              {/* Buscador y botón principal */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Buscar por ID, proveedor o estado"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/proveedores/servicios/crear/")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow transition"
                  >
                    + Nuevo Servicio
                  </button>
                  <button
                    onClick={() => navigate("/proveedores/metodos-pago")}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-semibold shadow transition"
                  >
                    Medios de pago
                  </button>
                  <button
                    onClick={() => navigate("/proveedores/tipos-servicio")}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-semibold shadow transition"
                  >
                    Tipos de servicio
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Cargando servicios...
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Proveedor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Costo Mensual
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedServices.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="text-center py-8 text-gray-400"
                        >
                          No se encontraron servicios que coincidan con la
                          búsqueda.
                        </td>
                      </tr>
                    ) : (
                      paginatedServices.map((service, idx) => (
                        <tr
                          key={service.Id || idx}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {service.Id || "N/A"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {service.Supplier || "Sin proveedor"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {service.Description || "Sin descripción"}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            ${(service.MonthlyCost || 0).toLocaleString()}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                service.Active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {service.Active ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                            <div className="space-x-2 flex justify-end">
                              {(userRole === "Administrador" ||
                                userRole === "Gestor") && (
                                <button
                                  onClick={() => handleEditClick(service)}
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full transition text-xs font-medium"
                                >
                                  Editar
                                </button>
                              )}
                              {(userRole === "Administrador" ||
                                userRole === "Gestor") && (
                                <button
                                  onClick={() => handleToggleStatus(service)}
                                  className={`px-6 py-2 rounded-full transition text-xs font-medium text-white ${
                                    service.Active
                                      ? "bg-red-500 hover:bg-red-600"
                                      : "bg-green-500 hover:bg-green-600"
                                  }`}
                                >
                                  {service.Active ? "Desactivar" : "Activar"}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* Paginación */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
                <div className="flex justify-center items-center gap-4 flex-1">
                  <button
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    aria-label="Anterior"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                  </button>
                  <span className="text-gray-700">
                    Página {page} de {totalPages}
                  </span>
                  <button
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    aria-label="Siguiente"
                  >
                    <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
                <span className="text-gray-500 text-sm md:ml-4 md:w-auto w-full text-center md:text-right">
                  {filteredServices.length} servicio(s) encontrado(s)
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {modalOpen && modalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Confirmar acción</h2>
            <p className="mb-6">
              ¿Está seguro que desea {modalAction} el servicio "
              <b>{modalService.Description}</b>"?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 text-white rounded-full bg-gray-500 hover:bg-gray-400"
                onClick={() => {
                  setModalOpen(false);
                  setModalService(null);
                  setModalAction(null);
                }}
              >
                Cancelar
              </button>
              <button
                className={`px-4 py-2 rounded-full text-white ${
                  modalAction === "desactivar"
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
                onClick={confirmToggleStatus}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllServicesPage;
