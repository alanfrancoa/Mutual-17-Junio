import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";

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
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const userRole = useMemo(
    () =>
      (sessionStorage.getItem("userRole") || "consultante") as
        | "administrador"
        | "gestor"
        | "consultante",
    []
  );

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiMutual.GetInvoices();
      const mappedData = data.map((i: any) => ({
        Id: i.id,
        Supplier: i.supplier ?? "N/A",
        InvoiceNumber: i.invoiceNumber ?? "N/A",
        IssueDate: new Date(i.issueDate).toLocaleDateString(),
        DueDate: new Date(i.dueDate).toLocaleDateString(),
        Total: i.total ?? 0,
        TypeService: i.typeService ?? "N/A",
        Description: i.description ?? "",
        Paid: i.paid,
      }));
      setInvoices(mappedData);
    } catch (err: any) {
      // Mejor manejo del error:
      let msg = "No se encontraron facturas.";
      if (err?.response?.data?.mesagge) msg = err.response.data.mesagge;
      else if (err?.message) msg = err.message;
      setError(msg);
      setInvoices([]);
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
    if (userRole !== "administrador" && userRole !== "gestor") {
      alert("No tiene permisos para realizar esta acción.");
      return;
    }
    try {
      await apiMutual.UpdateInvoiceStatus(invoiceId, !currentStatus);
      fetchInvoices();
    } catch (error: any) {
      setError(
        error.mensaje || "No se pudo actualizar el estado de la factura."
      );
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

          {error && !loading && (
            <div className="text-center text-red-500 py-4">{error}</div>
          )}

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
                ) : filteredInvoices.length === 0 && !error ? (
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
                        {(userRole === "administrador" ||
                          userRole === "gestor") && (
                          <button
                            onClick={() => handleAskTogglePaidStatus(invoice)}
                            className={
                              invoice.Paid
                                ? "text-yellow-600 hover:text-yellow-900"
                                : "text-green-600 hover:text-green-900"
                            }
                            title={
                              invoice.Paid
                                ? "Marcar como Pendiente"
                                : "Marcar como Pagada"
                            }
                          >
                            {invoice.Paid ? "Anular Pago" : "Pagar"}
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
      </main>
      {/* Modal para doble verificación de cambio de estado */}
      {modalOpen && selectedInvoice && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {selectedInvoice.Paid
                ? "¿Anular pago de la factura?"
                : "¿Marcar factura como pagada?"}
            </h3>
            <p className="mb-6 text-gray-600">
              ¿Está seguro que desea{" "}
              {selectedInvoice.Paid ? "anular el pago" : "marcar como pagada"}{" "}
              la factura <b>{selectedInvoice.InvoiceNumber}</b>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancelModal}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmTogglePaidStatus}
                className={
                  selectedInvoice.Paid
                    ? "px-4 py-2 rounded bg-yellow-600 text-white hover:bg-yellow-700"
                    : "px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                }
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

export default InvoicesPage;
