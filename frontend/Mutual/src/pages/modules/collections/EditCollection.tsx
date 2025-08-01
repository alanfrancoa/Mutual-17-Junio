import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ICollectionDetail, ICollectionMethod } from "../../../types/ICollection";

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
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
            setError("");
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
            } catch {
                setError("Error al cargar el cobro");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.methodId) {
            setError("Seleccione un método de cobro");
            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await apiMutual.UpdateCollection(Number(id), {
                methodId: Number(form.methodId),
                observations: form.observations.trim(),
            });
            setSuccess("Cobro actualizado correctamente");
            setTimeout(() => navigate("/collections"), 1500);
        } catch (err: any) {
            setError(err.message || "Error al actualizar el cobro");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <Sidebar />
                <div className="flex-1" style={{ marginLeft: "18rem" }}>
     <Header hasNotifications={true} loans={[]}  />
                    <div className="flex justify-center items-center h-64">
                        <div className="text-lg">Cargando...</div>
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
                        <h2 className="text-2xl font-bold mb-6">Editar Cobro</h2>

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

                        {collection && (
                            <div className="mb-6 p-4 bg-gray-50 rounded">
                                <h3 className="font-semibold mb-2">Información del Cobro</h3>
                                <p><strong>Comprobante:</strong> {collection.receiptNumber}</p>
                                <p><strong>Asociado:</strong> {collection.associate.name}</p>
                                <p><strong>Monto:</strong> ${collection.amount}</p>
                                <p><strong>Fecha:</strong> {collection.collectionDate}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Método de cobro *</label>
                                <select
                                    name="methodId"
                                    value={form.methodId}
                                    onChange={handleChange}
                                    required
                                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
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

                            <div>
                                <label className="block text-sm font-medium mb-1">Observaciones</label>
                                <textarea
                                    name="observations"
                                    value={form.observations}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                                    maxLength={255}
                                    rows={3}
                                    disabled={saving}
                                    placeholder="Observaciones adicionales (opcional)"
                                />
                                <small className="text-gray-500">{form.observations.length}/255 caracteres</small>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <button
                                    type="button"
                                    onClick={() => navigate("/collections")}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                                    disabled={saving}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors disabled:bg-blue-400"
                                    disabled={saving}
                                >
                                    {saving ? "Guardando..." : "Actualizar Cobro"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCollection;