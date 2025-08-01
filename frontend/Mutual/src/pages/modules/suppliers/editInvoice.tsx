import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { IEditInvoice } from "../../../types/IInvoice";
import { ISupplierList } from "../../../types/ISupplierList";
import { IServiceType } from "../../../types/IServiceType";

const EditInvoice: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [suppliers, setSuppliers] = useState<ISupplierList[]>([]);
  const [serviceTypes, setServiceTypes] = useState<IServiceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [invoicePaid, setInvoicePaid] = useState(false);
  const [form, setForm] = useState<IEditInvoice>({
    supplierId: 0,
    invoiceNumber: "",
    issueDate: "",
    dueDate: "",
    total: 0,
    serviceTypeId: 0,
    description: "",
  });

  // Verificar permisos
  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        setError("ID de factura no válido");
        setDataLoading(false);
        return;
      }

      try {
        setDataLoading(true);
        const [invoice, suppliersData, serviceTypesData] = await Promise.all([
          apiMutual.GetInvoiceById(Number(id)),
          apiMutual.GetAllSuppliers(),
          apiMutual.GetServiceTypes(),
        ]);

        // Verificar si la factura está pagada
        setInvoicePaid(invoice.Paid);

        // Cargar datos de la factura
        setForm({
          supplierId: invoice.Proveedor ? 
            suppliersData.find((s: any) => s.legalName === invoice.Proveedor)?.id || 0 : 0,
          invoiceNumber: invoice.InvoiceNumber || "",
          issueDate: new Date(invoice.IssueDate).toISOString().slice(0, 10),
          dueDate: new Date(invoice.DueDate).toISOString().slice(0, 10),
          total: invoice.Total || 0,
          serviceTypeId: invoice.TipoServicio ? 
            serviceTypesData.find((st: IServiceType) => st.name === invoice.TipoServicio)?.id || 0 : 0,
          description: invoice.Description || "",
        });

        // Cargar proveedores y tipos de servicio activos
        setSuppliers(suppliersData.filter((s: any) => s.active));
        setServiceTypes(serviceTypesData.filter((st: IServiceType) => st.active));
      } catch (err: any) {
        setError(err.message || "Error al cargar los datos");
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === "supplierId" || name === "serviceTypeId" || name === "total"
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validaciones
      if (!form.supplierId || !form.serviceTypeId) {
        setError("Debe seleccionar un proveedor y un tipo de servicio");
        setLoading(false);
        return;
      }

      if (!form.invoiceNumber.trim()) {
        setError("El número de factura es obligatorio");
        setLoading(false);
        return;
      }

      if (form.total <= 0) {
        setError("El total debe ser mayor a cero");
        setLoading(false);
        return;
      }

      if (new Date(form.issueDate) > new Date(form.dueDate)) {
        setError("La fecha de vencimiento no puede ser anterior a la fecha de emisión");
        setLoading(false);
        return;
      }

      // Validar que las fechas no sean futuras
      const today = new Date().toISOString().slice(0, 10);
      if (form.issueDate > today) {
        setError("La fecha de emisión no puede ser futura");
        setLoading(false);
        return;
      }

      await apiMutual.UpdateInvoice(Number(id), form);
      setSuccess("Factura actualizada correctamente");
      setTimeout(() => navigate("/proveedores/facturas"), 1500);
    } catch (err: any) {
      // Manejar errores específicos del backend
      if (err.message.includes("No se puede editar una factura que ya ha sido pagada")) {
        setError("No se puede editar una factura que ya ha sido pagada");
      } else if (err.message.includes("Ya existe otra factura con ese número")) {
        setError("Ya existe otra factura con ese número para este proveedor");
      } else if (err.message.includes("No hay un período contable activo")) {
        setError("No hay un período contable activo para actualizar la factura");
      } else {
        setError(err.message || "Error al actualizar la factura");
      }
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
        <div className="flex-1" style={{ marginLeft: "18rem" }}>
               <Header hasNotifications={true} loans={[]}  />

          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-full max-w-lg bg-white rounded-lg shadow p-8 text-center">
              <div className="text-lg text-gray-600">Cargando datos de la factura...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: "18rem" }}>
             <Header hasNotifications={true} loans={[]}  />

        <div className="flex flex-col items-center py-8">
          <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-900">Editar Factura</h2>

            {invoicePaid && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                <strong>Advertencia:</strong> Esta factura ya ha sido pagada y no puede ser editada.
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Número de Factura *</label>
                <input
                  type="text"
                  name="invoiceNumber"
                  value={form.invoiceNumber}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  disabled={loading || invoicePaid}
                  placeholder="Ej: FAC-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Proveedor *</label>
                <select
                  name="supplierId"
                  value={form.supplierId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  disabled={loading || invoicePaid}
                >
                  <option value="">Seleccione un proveedor...</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.legalName} - {supplier.cuit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tipo de Servicio *</label>
                <select
                  name="serviceTypeId"
                  value={form.serviceTypeId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  disabled={loading || invoicePaid}
                >
                  <option value="">Seleccione un tipo de servicio...</option>
                  {serviceTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de Emisión *</label>
                  <input
                    type="date"
                    name="issueDate"
                    value={form.issueDate}
                    onChange={handleChange}
                    required
                    max={new Date().toISOString().slice(0, 10)}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                    disabled={loading || invoicePaid}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Fecha de Vencimiento *</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={form.dueDate}
                    onChange={handleChange}
                    required
                    min={form.issueDate}
                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                    disabled={loading || invoicePaid}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Total *</label>
                <input
                  type="number"
                  name="total"
                  value={form.total}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  disabled={loading || invoicePaid}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  maxLength={500}
                  rows={3}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  disabled={loading || invoicePaid}
                  placeholder="Descripción opcional de la factura"
                />
                <small className="text-gray-500">{form.description.length}/500 caracteres</small>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/proveedores/facturas")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                {!invoicePaid && (
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:bg-blue-400"
                    disabled={loading}
                  >
                    {loading ? "Actualizando..." : "Actualizar Factura"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvoice;
