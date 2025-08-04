import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import useAppToast from "../../../hooks/useAppToast";

interface Invoice {
  Id: number;
  Supplier: string;
  InvoiceNumber: string;
  IssueDate: string;
  DueDate: string;
  Total: number;
  TypeService: string;
  Description: string;
  Paid: boolean;
}

const InvoicesPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast, showWarningToast } = useAppToast();
  
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [processing, setProcessing] = useState(false); 

  const userRole = useMemo(
    () =>
      (sessionStorage.getItem("userRole") || "Consultor") as
        | "Administrador"
        | "Gestor"
        | "Consultor",
    []
  );

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await apiMutual.GetInvoices();
      const mappedData = data.map((i: any) => ({
        Id: i.id,
        Supplier: i.supplierName ?? "N/A",
        InvoiceNumber: i.invoiceNumber ?? "N/A",
        IssueDate: new Date(i.issueDate).toLocaleDateString(),
        DueDate: new Date(i.dueDate).toLocaleDateString(),
        Total: i.total ?? 0,
        TypeService: i.serviceType ?? "N/A",
        Description: i.description ?? "",
        Paid: i.paid,
      }));
      setInvoices(mappedData);
    } catch (err: any) {
      console.error("Error al cargar facturas:", err);
      setInvoices([]);
      
      showErrorToast({
        title: "Error de carga",
        message: err.response?.data?.message || err.message || "No se pudieron cargar las facturas"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filteredInvoices = useMemo(
    () =>
      invoices.filter(
        (invoice) =>
          invoice.InvoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
          invoice.Supplier.toLowerCase().includes(search.toLowerCase()) ||
          invoice.TypeService.toLowerCase().includes(search.toLowerCase()) ||
          invoice.Description.toLowerCase().includes(search.toLowerCase())
      ),
    [search, invoices]
  );

  const handleTogglePaidStatus = async (
    invoiceId: number,
    currentStatus: boolean
  ) => {
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      showWarningToast({
        title: "Acceso denegado",
        message: "No tiene permisos para realizar esta acción"
      });
      return;
    }

    setProcessing(true);

    try {
      await apiMutual.UpdateInvoiceStatus(invoiceId, !currentStatus);
      
      showSuccessToast({
        title: "Estado actualizado",
        message: `Factura marcada como ${!currentStatus ? 'pagada' : 'pendiente'} correctamente`
      });
      
      await fetchInvoices();
    } catch (error: any) {
      console.error("Error al actualizar estado:", error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.mensaje || 
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        error.message || 
        "No se pudo actualizar el estado de la factura";

      showErrorToast({
        title: "Error al actualizar estado",
        message: errorMessage
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleAskTogglePaidStatus = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setModalOpen(true);
  };

  const handleConfirmTogglePaidStatus = async () => {
    if (selectedInvoice) {
      await handleTogglePaidStatus(selectedInvoice.Id, selectedInvoice.Paid);
      setModalOpen(false);
      setSelectedInvoice(null);
    }
  };

  const handleCancelModal = () => {
    setModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} loans={[]} />
      <main className="flex flex-col items-center py-8 flex-1 ml-0 md:ml-64 lg:ml-72">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">
              Gestión de Facturas
            </h2>
            <button
              onClick={() => navigate("/proveedores/facturas/crear")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Nueva Factura
            </button>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Buscar por N° de factura, proveedor, tipo o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Factura
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Proveedor
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Emisión
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Venc.
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo Servicio
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      Cargando facturas...
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-4 text-gray-500">
                      No se encontraron facturas.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.Id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {invoice.InvoiceNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.Supplier}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.IssueDate}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.DueDate}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        ${invoice.Total.toLocaleString("es-AR")}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.TypeService}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            invoice.Paid
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.Paid ? "Pagada" : "Pendiente"}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium flex gap-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/proveedores/facturas/editar/${invoice.Id}`
                            )
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Ver/Editar Factura"
                        >
                          Ver/Editar
                        </button>
                        
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      
    </div>
  );
};

export default InvoicesPage;
