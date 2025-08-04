import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import useAppToast from "../../../hooks/useAppToast"; 

interface Supplier {
    id: number;
    legalName: string;
}

interface ServiceType {
    id: number;
    name: string;
}

const InvoiceCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const { showSuccessToast, showErrorToast, showWarningToast } = useAppToast(); 
    
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
    const [form, setForm] = useState({
        SupplierId: "",
        InvoiceNumber: "",
        IssueDate: "",
        DueDate: "",
        Total: "",
        ServiceTypeId: "",
        Description: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Carga proveedores activos
                const suppliersData = await apiMutual.GetAllSuppliers();
                const activeSuppliers = suppliersData.filter((supplier: any) => supplier.active === true);
                setSuppliers(activeSuppliers);

                // Carga tipos de servicio activos
                const serviceTypesData = await apiMutual.GetServiceTypes();
                const activeServiceTypes = serviceTypesData.filter((serviceType: any) => serviceType.active === true);
                setServiceTypes(activeServiceTypes);
            } catch (error: any) {
                console.error("Error al cargar datos:", error);

                setSuppliers([]);
                setServiceTypes([]);
                
                showErrorToast({
                    title: "Error de carga",
                    message: error.message || "Error al cargar proveedores y tipos de servicio"
                });
            }
        };

        loadData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (!form.SupplierId || !form.InvoiceNumber || !form.IssueDate || !form.DueDate || !form.Total || !form.ServiceTypeId) {
            showWarningToast({
                title: "Campos incompletos",
                message: "Completa todos los campos obligatorios"
            });
            setLoading(false);
            return;
        }

        const issueDate = new Date(form.IssueDate);
        const dueDate = new Date(form.DueDate);
        
        if (dueDate < issueDate) {
            showWarningToast({
                title: "Fechas inválidas",
                message: "La fecha de vencimiento no puede ser anterior a la fecha de emisión"
            });
            setLoading(false);
            return;
        }

        if (Number(form.Total) <= 0) {
            showWarningToast({
                title: "Total inválido",
                message: "El total debe ser mayor a 0"
            });
            setLoading(false);
            return;
        }

        try {
            await apiMutual.RegisterInvoice({
                invoiceNumber: form.InvoiceNumber,
                issueDate: form.IssueDate,
                dueDate: form.DueDate,
                total: Number(form.Total),
                serviceTypeId: Number(form.ServiceTypeId),
                description: form.Description,
                supplierId: Number(form.SupplierId),
            });
            
            showSuccessToast({
                title: "¡Factura registrada!",
                message: "La factura fue registrada correctamente"
            });
            
            setTimeout(() => navigate("/proveedores/facturas"), 1500);
        } catch (err: any) {
            console.error("Error completo al registrar factura:", err);
            console.error("Error response data:", err.response?.data);
            
            let errorMessage = "Error desconocido al registrar factura";
            let errorTitle = "Error al registrar factura";

            if (err.response) {
                const status = err.response.status;
                const data = err.response.data;

                switch (status) {
                    case 400:
                        errorTitle = "Datos inválidos";
                        //backend devuelve { message: "El proveedor especificado no existe." }
                        errorMessage = data?.message || "Los datos enviados no son válidos";
                        break;
                    case 401:
                        errorTitle = "No autorizado";
                        errorMessage = data?.message || "No tienes permisos para realizar esta acción";
                        break;
                    case 409:
                        errorTitle = "Factura duplicada";
                        //backend devuelve { message: "Ya existe una factura con ese número para este proveedor." }
                        errorMessage = data?.message || "Ya existe una factura con estos datos";
                        break;
                    case 422:
                        errorTitle = "Datos incorrectos";
                        errorMessage = data?.message || "Los datos no cumplen con los requisitos";
                        break;
                    case 500:
                        errorTitle = "Error del servidor";
                        //backend puede devolver errorDetails e innerExceptionDetails
                        errorMessage = data?.message || "Error interno del servidor. Intente nuevamente";
                        break;
                    default:
                        errorTitle = `Error ${status}`;
                        errorMessage = data?.message || `Error del servidor (${status})`;
                }
            } else if (err.request) {
                errorTitle = "Error de conexión";
                errorMessage = "No se pudo conectar con el servidor";
            } else {
                errorTitle = "Error de aplicación";
                errorMessage = err.message || "Error inesperado";
            }

            showErrorToast({
                title: errorTitle,
                message: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Sidebar />
            <Header hasNotifications={true} loans={[]} />
            <main className="flex flex-col items-center py-8 flex-1 ml-0 md:ml-64 lg:ml-72">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
                    <h2 className="text-2xl font-bold text-blue-900 mb-6">Cargar Nueva Factura</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Proveedor *</label>
                            <select
                                name="SupplierId"
                                value={form.SupplierId}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50"
                            >
                                <option value="">Seleccione...</option> 
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>{s.legalName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">N° Factura *</label>
                            <input
                                type="text"
                                name="InvoiceNumber"
                                value={form.InvoiceNumber}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50" 
                                placeholder="Ejemplo: 001-001-00000123"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Fecha Emisión *</label>
                                <input
                                    type="date"
                                    name="IssueDate"
                                    value={form.IssueDate}
                                    onChange={handleChange}
                                    required
                                    disabled={loading} 
                                    className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50" 
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Fecha Vencimiento *</label>
                                <input
                                    type="date"
                                    name="DueDate"
                                    value={form.DueDate}
                                    onChange={handleChange}
                                    required
                                    disabled={loading}
                                    className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total *</label>
                            <input
                                type="number"
                                name="Total"
                                value={form.Total}
                                onChange={handleChange}
                                required
                                min={0}
                                step="0.01"
                                disabled={loading}
                                className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50" 
                                placeholder="0.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de Servicio *</label>
                            <select
                                name="ServiceTypeId"
                                value={form.ServiceTypeId}
                                onChange={handleChange}
                                required
                                disabled={loading}
                                className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50"
                            >
                                <option value="">Seleccione...</option>
                                {serviceTypes.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <textarea
                                name="Description"
                                value={form.Description}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full border border-gray-300 rounded px-3 py-2 disabled:opacity-50"
                                rows={2}
                                placeholder="Descripción adicional (opcional)"
                            />
                        </div>
                                                
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/proveedores/facturas")}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition disabled:opacity-50" 
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-50" 
                                disabled={loading}
                            >
                                {loading ? "Guardando..." : "Guardar"}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default InvoiceCreatePage;