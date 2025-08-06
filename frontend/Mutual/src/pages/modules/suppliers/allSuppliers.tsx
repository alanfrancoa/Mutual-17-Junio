import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { ISupplierList } from "../../../types/ISupplierList";
import useAppToast from "../../../hooks/useAppToast";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import SupplierStatusModal from "../../../components/ui/auth/supplierStatusModal";

const AllSuppliers: React.FC = () => {
  const navigate = useNavigate();
  const toast = useAppToast();
  const [search, setSearch] = useState("");
  const [suppliers, setSuppliers] = useState<ISupplierList[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [estadoFiltro, setEstadoFiltro] = useState<
    "Todos" | "Activo" | "Inactivo"
  >("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] =
    useState<ISupplierList | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const data = await apiMutual.GetAllSuppliers();

        // caso lista vacia
        if (!data || data.length === 0) {
          setSuppliers([]);
          toast.showInfoToast({
            title: "Sin proveedores",
            message: "No hay proveedores registrados en el sistema.",
          });
          return;
        }

        const mapped = data.map((s: any) => ({
          id: s.id,
          cuit: s.cuit ?? "",
          legalName: s.legalName ?? "",
          address: s.address ?? "",
          phone: s.phone ?? "",
          email: s.email ?? "",
          active: s.active,
        }));

        setSuppliers(mapped);
      } catch (err: any) {
        setSuppliers([]);

        // Manejar error de conexión
        if (!err.response) {
          toast.showErrorToast({
            title: "Error de conexión",
            message:
              "No se pudo establecer conexión con el servidor. Por favor, verifica tu conexión a internet.",
            options: {
              duration: 5000,
            },
          });
          console.error("Error de conexión:", err);
          return;
        }

        // Manejar error 500 específicamente
        if (err.response?.status === 500) {
          const errorResponse = err.response?.data;
          const errorMessage =
            errorResponse?.message ||
            "Ocurrió un error interno en el servidor.";
          const innerException = errorResponse?.innerExceptionDetails || "";

          // Construir mensaje detallado para error 500
          let detailedMessage = errorMessage;
          if (innerException)
            detailedMessage += `\nError interno: ${innerException}`;

          toast.showErrorToast({
            title: "Error del servidor",
            message: detailedMessage,
            options: {
              duration: 6000,
            },
          });

          console.error("Error 500:", {
            message: errorMessage,
          });
          return;
        }

        // Manejar otros errores HTTP (400, 401, 403, etc.)
        const errorResponse = err.response?.data;
        const errorMessage =
          errorResponse?.message ||
          errorResponse?.errorDetails ||
          err.message ||
          "Ocurrió un error al intentar listar a los proveedores.";

        toast.showErrorToast({
          title: `Error ${err.response?.status || "desconocido"}`,
          message: errorMessage,
          options: {
            duration: 4000,
          },
        });

        console.error("Error en la petición:", {
          status: err.response?.status,
          message: errorMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  const handleToggleStatus = async (
    supplierId: number,
    currentStatus: boolean
  ) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (supplier) {
      setSelectedSupplier(supplier);
      setIsModalOpen(true);
      setModalError(null);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (!selectedSupplier) return;

    setIsProcessing(true);
    setModalError(null);

    try {
      await apiMutual.ChangeSupplierStatus(
        selectedSupplier.id,
        !selectedSupplier.active
      );

      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === selectedSupplier.id ? { ...s, active: !s.active } : s
        )
      );

      toast.showSuccessToast({
        title: "Estado actualizado",
        message: `Proveedor ${
          !selectedSupplier.active ? "activado" : "desactivado"
        } correctamente`,
      });

      setIsModalOpen(false);
      setSelectedSupplier(null);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.mensaje ||
        (typeof error.response?.data === "string"
          ? error.response.data
          : null) ||
        error.message ||
        "Error desconocido";

      setModalError(errorMessage);
      toast.showErrorToast({
        title: "Error del servidor",
        message: errorMessage,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredSuppliers = suppliers.filter(
    (s) =>
      (estadoFiltro === "Todos" ||
        (estadoFiltro === "Activo" ? s.active : !s.active)) &&
      (s.legalName.toLowerCase().includes(search.toLowerCase()) ||
        s.cuit.includes(search) ||
        (s.address && s.address.toLowerCase().includes(search.toLowerCase())) ||
        (s.phone && s.phone.includes(search)) ||
        (s.email && s.email.toLowerCase().includes(search.toLowerCase())))
  );

  // Calcular la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredSuppliers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar fija a la izquierda */}
      <Sidebar />

      {/* Contenido principal desplazado a la derecha */}
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        {/* Header */}
        <Header hasNotifications={true} loans={[]} />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-blue-900 mb-4">Proveedores</h1>

          <div className="flex-1 w-full">
            <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
              {/* Buscador y botón agregar proveedor */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                <div className="flex gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="Buscar por nombre, CUIT, teléfono o email"
                    className="w-full md:w-72 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <select
                    name="estadoFiltro"
                    value={estadoFiltro}
                    onChange={(e) =>
                      setEstadoFiltro(
                        e.target.value as "Todos" | "Activo" | "Inactivo"
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Activo">Activos</option>
                    <option value="Inactivo">Inactivos</option>
                  </select>
                </div>
                <button
                  onClick={() => navigate("/proveedores/crear")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-semibold shadow transition w-full md:w-auto"
                >
                  + Nuevo Proveedor
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Cargando proveedores...
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Nombre/Razón Social
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        CUIT
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Teléfono
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Email
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
                    {currentItems.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-8 text-gray-400"
                        >
                          No hay proveedores registrados. Haz clic en "Agregar
                          Proveedor" para comenzar.
                        </td>
                      </tr>
                    ) : (
                      currentItems.map((s, idx) => (
                        <tr
                          key={s.id}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {s.id}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {s.legalName}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {s.cuit}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {s.phone}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                            {s.email}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                s.active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {s.active ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                            <div className="space-x-2 flex justify-end">
                              <button
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-full transition text-xs font-medium"
                                onClick={() =>
                                  navigate(`/proveedores/editar/${s.id}`)
                                }
                              >
                                Editar
                              </button>
                              <button
                                className={`${
                                  s.active
                                    ? "bg-red-500 hover:bg-red-600"
                                    : "bg-green-500 hover:bg-green-600"
                                } text-white px-6 py-2 rounded-full transition text-xs font-medium w-24`}
                                onClick={() =>
                                  handleToggleStatus(s.id, s.active)
                                }
                              >
                                {s.active ? "Desactivar" : "Reactivar"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              )}

              {/* Paginacion */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
                <div className="flex justify-center items-center gap-4 flex-1">
                  <button
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Anterior"
                  >
                    <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                  </button>
                  <span className="text-gray-700">
                    Página {currentPage} de {totalPages}
                  </span>
                  <button
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                    onClick={() =>
                      paginate(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    aria-label="Siguiente"
                  >
                    <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                  </button>
                </div>
                <span className="text-gray-500 text-sm md:ml-4 md:w-auto w-full text-center md:text-right">
                  {filteredSuppliers.length} proveedor(es) encontrado(s)
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
      {/* Modal de confirmación */}
      {selectedSupplier && (
        <SupplierStatusModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSupplier(null);
            setModalError(null);
          }}
          onConfirm={handleConfirmStatusChange}
          supplierName={selectedSupplier.legalName}
          action={selectedSupplier.active ? "deactivate" : "reactivate"}
          modalError={modalError}
          isLoading={isProcessing}
        />
      )}
    </div>
  );
};

export default AllSuppliers;
