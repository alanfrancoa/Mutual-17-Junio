import React, { useEffect, useState, } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ICollection } from "../../../types/ICollection";
import AnnulCollectionModal from "./AnnulCollectionModal";

const Collections: React.FC = () => {
    // Estado para la tabla de cobros
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [filters, setFilters] = useState({
        associate: "",
        dateFrom: "",
        dateTo: "",
        status: "",
        amountMin: "",
        amountMax: "",
    });
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showAnnulModal, setShowAnnulModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await apiMutual.GetCollections();
            // setCollections(data);
            setCollections([]); // Placeholder
        } catch (err: any) {
            setError(err.message || "Error al cargar los cobros");
        } finally {
            setLoading(false);
        }
    };

    // Filtros avanzados (puedes expandir según tus necesidades)
    const filteredCollections = collections.filter((c) => {
        // Aplica los filtros aquí
        return true;
    });

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1" style={{ marginLeft: "18rem" }}>
                <Header hasNotifications={true} />
                <div className="flex flex-col items-center py-8">
                    <div className="w-full max-w-6xl bg-white rounded-lg shadow p-8">
                        <h2 className="text-2xl font-bold mb-6">Gestión de Cobros</h2>

                        <div className="mb-6">
                            <div className="bg-blue-100 rounded p-4 mb-2">Resumen de cobranzas (placeholder)</div>
                        </div>


                        <div className="flex flex-wrap gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="Buscar asociado"
                                value={filters.associate}
                                onChange={e => setFilters({ ...filters, associate: e.target.value })}
                                className="border px-2 py-1 rounded"
                            />
                            <input
                                type="date"
                                value={filters.dateFrom}
                                onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                                className="border px-2 py-1 rounded"
                            />
                            <input
                                type="date"
                                value={filters.dateTo}
                                onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                                className="border px-2 py-1 rounded"
                            />
                            <select
                                value={filters.status}
                                onChange={e => setFilters({ ...filters, status: e.target.value })}
                                className="border px-2 py-1 rounded"
                            >
                                <option value="">Todos los estados</option>
                                <option value="paid">Pagado</option>
                                <option value="pending">Pendiente</option>
                                <option value="annulled">Anulado</option>
                            </select>
                            <input
                                type="number"
                                placeholder="Monto mínimo"
                                value={filters.amountMin}
                                onChange={e => setFilters({ ...filters, amountMin: e.target.value })}
                                className="border px-2 py-1 rounded"
                            />
                            <input
                                type="number"
                                placeholder="Monto máximo"
                                value={filters.amountMax}
                                onChange={e => setFilters({ ...filters, amountMax: e.target.value })}
                                className="border px-2 py-1 rounded"
                            />
                        </div>

                        {/* Botón para registrar nuevo cobro */}
                        <div className="mb-4">
                            <button
                                onClick={() => navigate("/collections/register")}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                            >
                                + Registrar nuevo cobro
                            </button>
                            <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                                onClick={() => navigate("/collections/payment-methods")}
                            >
                                Métodos de Cobro
                            </button>
                        </div>

                        {/* Tabla de cobros */}
                        <table className="min-w-full divide-y divide-gray-200 mb-4">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Asociado</th>
                                    <th className="px-4 py-2 text-left">Fecha</th>
                                    <th className="px-4 py-2 text-left">Monto</th>
                                    <th className="px-4 py-2 text-left">Estado</th>
                                    <th className="px-4 py-2 text-left">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCollections.map((c, idx) => (
                                    <tr key={idx}>
                                        <td className="px-4 py-2">{c.associateName}</td>
                                        <td className="px-4 py-2">{c.date}</td>
                                        <td className="px-4 py-2">{c.amount}</td>
                                        <td className="px-4 py-2">
                                            <span className={
                                                c.status === "paid" ? "text-green-600" :
                                                    c.status === "pending" ? "text-yellow-600" :
                                                        "text-red-600"
                                            }>
                                                {c.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2 flex gap-2">
                                            {/* Botón para ver/descargar comprobante PDF */}
                                            <button
                                                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
                                                onClick={async () => {
                                                    try {
                                                        const response = await fetch(
                                                            `https://localhost:7256/api/collections/${c.id}/pdf`,
                                                            {
                                                                method: "GET",
                                                                headers: {
                                                                    Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
                                                                },
                                                            }
                                                        );
                                                        if (!response.ok) throw new Error("No se pudo generar el PDF");
                                                        const blob = await response.blob();
                                                        const url = window.URL.createObjectURL(blob);
                                                        const link = document.createElement("a");
                                                        link.href = url;
                                                        link.download = `Cobro_${c.id}.pdf`;
                                                        document.body.appendChild(link);
                                                        link.click();
                                                        link.remove();
                                                        window.URL.revokeObjectURL(url);
                                                    } catch (err) {
                                                        alert("Error al generar el comprobante PDF");
                                                    }
                                                }}
                                            >
                                                Imprimir
                                            </button>
                                            <button
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                onClick={() => {
                                                    setSelectedCollection(c);
                                                    setShowAnnulModal(true);
                                                }}
                                            >
                                                Anular
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-8">
                            <div className="bg-gray-100 rounded p-4">Dashboard de gráficos (placeholder)</div>
                        </div>
                    </div>
                </div>
            </div>

            {showAnnulModal && (
                <AnnulCollectionModal
                    collection={selectedCollection}
                    onClose={() => setShowAnnulModal(false)}
                    onSuccess={fetchCollections}
                />
            )}
        </div>
    );
};

export default Collections;
