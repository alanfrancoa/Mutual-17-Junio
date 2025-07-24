import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";

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
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        // Cargar proveedores y tipos de servicio
        apiMutual.GetAllSuppliers().then(setSuppliers);
        apiMutual.GetServiceTypes().then(setServiceTypes);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);
        try {
            await apiMutual.RegisterInvoice({
                invoiceNumber: form.InvoiceNumber,
                issueDate: form.IssueDate,
                dueDate: form.DueDate,
                total: Number(form.Total),
                serviceTypeId: Number(form.ServiceTypeId),
                description: form.Description,
                supplierId: Number(form.SupplierId), // Make sure to include this if required
            });
            setSuccess("Factura registrada correctamente.");
            setTimeout(() => navigate("/proveedores/facturas"), 1200);
        } catch (err: any) {
            setError(err?.response?.data?.mesagge || err?.message || "Error al registrar la factura.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            <Sidebar />
            <Header hasNotifications={true} />
            <main className="flex flex-col items-center py-8 flex-1 ml-0 md:ml-64 lg:ml-72">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow p-8">
                    <h2 className="text-2xl font-bold text-blue-900 mb-6">Cargar Nueva Factura</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Proveedor</label>
                            <select
                                name="SupplierId"
                                value={form.SupplierId}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            >
                                <option value="">Seleccione...</option>
                                {suppliers.map((s) => (
                                    <option key={s.id} value={s.id}>{s.legalName}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">N° Factura</label>
                            <input
                                type="text"
                                name="InvoiceNumber"
                                value={form.InvoiceNumber}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Fecha Emisión</label>
                                <input
                                    type="date"
                                    name="IssueDate"
                                    value={form.IssueDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700">Fecha Vencimiento</label>
                                <input
                                    type="date"
                                    name="DueDate"
                                    value={form.DueDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 rounded px-3 py-2"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Total</label>
                            <input
                                type="number"
                                name="Total"
                                value={form.Total}
                                onChange={handleChange}
                                required
                                min={0}
                                step="0.01"
                                className="w-full border border-gray-300 rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tipo de Servicio</label>
                            <select
                                name="ServiceTypeId"
                                value={form.ServiceTypeId}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-2"
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
                                className="w-full border border-gray-300 rounded px-3 py-2"
                                rows={2}
                            />
                        </div>
                        {error && <div className="text-red-500 text-center">{error}</div>}
                        {success && <div className="text-green-600 text-center">{success}</div>}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/proveedores/facturas")}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
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