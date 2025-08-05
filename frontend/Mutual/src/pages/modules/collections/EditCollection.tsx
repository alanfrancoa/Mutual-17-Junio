import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ICollectionDetail, ICollectionMethod } from "../../../types/ICollection";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

const EditCollection: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [collection, setCollection] = useState<ICollectionDetail | null>(null);
    const [methods, setMethods] = useState<ICollectionMethod[]>([]);
    const [form, setForm] = useState({
        methodId: "",
        observations: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { showSuccessToast, showErrorToast } = useAppToast();

    useEffect(() => {
        const userRole = sessionStorage.getItem("userRole");
        if (userRole !== "Administrador" && userRole !== "Gestor") {
            navigate("/dashboard");
            return;
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [detail, meths] = await Promise.all([
                    apiMutual.GetCollectionById(Number(id)),
                    apiMutual.GetCollectionMethods(),
                ]);
                setCollection(detail);
                setMethods(meths.filter(m => m.isActive));
                setForm({
                    methodId: meths.find(m => m.name === detail.method)?.id?.toString() || "",
                    observations: "",
                });
            } catch (err: any) {
                showErrorToast({ message: err.message || "Error al cargar el cobro" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, showErrorToast]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.methodId) {
            showErrorToast({ message: "Seleccione un método de cobro" });
            return;
        }

        setSaving(true);

        try {
            await apiMutual.UpdateCollection(Number(id), {
                methodId: Number(form.methodId),
                observations: form.observations.trim(),
            });
            showSuccessToast({ 
                title: "Cobro actualizado",
                message: "El cobro se ha actualizado correctamente" 
            });
            setTimeout(() => navigate("/cobros"), 1500);
        } catch (err: any) {
            showErrorToast({ message: err.message || "Error al actualizar el cobro" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <Sidebar />
                <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
                    <Header hasNotifications={true} loans={[]} />
                    <div className="flex flex-col items-center justify-center py-8 flex-1">
                        <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 text-center">
                            <div className="text-lg text-gray-600">Cargando información del cobro...</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                    {/* Botón volver */}
                    <div className="flex justify-start mb-4">
                        <button
                            onClick={() => navigate("/cobros")}
                            className="text-gray-600 hover:text-gray-800 flex items-center"
                            aria-label="Volver a Cobros"
                        >
                            <ChevronLeftIcon className="h-5 w-5" />
                            <span className="ml-1">Volver</span>
                        </button>
                    </div>
                    
                    {/* Título */}
                    <h1 className="text-2xl font-bold text-blue-900 mb-4">
                        Editar Cobro
                    </h1>

                    <div className="flex justify-center">
                        <div className="w-full max-w-2xl">
                            <div className="overflow-x-auto rounded-lg shadow bg-white p-6">
                                {/* Información del cobro */}
                                {collection && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Información del Cobro</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">Comprobante:</span>
                                                <span className="ml-2 text-gray-900">{collection.receiptNumber}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Asociado:</span>
                                                <span className="ml-2 text-gray-900">{collection.associate.name}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Monto:</span>
                                                <span className="ml-2 text-gray-900">${collection.amount.toLocaleString()}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Fecha:</span>
                                                <span className="ml-2 text-gray-900">{collection.collectionDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Formulario */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Campo método de cobro */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Método de cobro *
                                        </label>
                                        <select
                                            name="methodId"
                                            value={form.methodId}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            disabled={saving}
                                        >
                                            <option value="">Seleccione un método...</option>
                                            {methods.map(m => (
                                                <option key={m.id} value={m.id}>
                                                    {m.name} ({m.code})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Campo observaciones */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Observaciones
                                        </label>
                                        <textarea
                                            name="observations"
                                            value={form.observations}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            maxLength={255}
                                            rows={4}
                                            disabled={saving}
                                            placeholder="Observaciones adicionales (opcional)"
                                        />
                                        <div className="mt-1 text-right">
                                            <small className="text-gray-500">{form.observations.length}/255 caracteres</small>
                                        </div>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => navigate("/cobros")}
                                            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full font-semibold shadow transition duration-200 ease-in-out w-full md:w-auto"
                                            disabled={saving}
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold shadow transition duration-200 ease-in-out disabled:opacity-50 w-full md:w-auto"
                                            disabled={saving}
                                        >
                                            {saving ? "Guardando..." : "Actualizar Cobro"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditCollection;