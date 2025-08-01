import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ICollection } from "../../../types/ICollection";
import AnnulCollectionModal from "./AnnulCollectionModal";

const Collections: React.FC = () => {
    const [collections, setCollections] = useState<ICollection[]>([]);
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
    const [showAnnulModal, setShowAnnulModal] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState<ICollection | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollections();
        // eslint-disable-next-line
    }, [filters, page]);

    const fetchCollections = async () => {
        setLoading(true);
        setError("");
        try {
            // Construir query params
            const params = new URLSearchParams();
            if (filters.associate) params.append("associateId", filters.associate);
            if (filters.dateFrom) params.append("startDate", filters.dateFrom);
            if (filters.dateTo) params.append("endDate", filters.dateTo);
            if (filters.status) params.append("status", filters.status);
            params.append("page", page.toString());
            params.append("pageSize", pageSize.toString());

            // Llamada al backend usando fetch (puedes adaptar a tu helper)
            const token = sessionStorage.getItem("token") || "";
            const response = await fetch(
                `https://localhost:7256/api/collections?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) throw new Error("Error al cargar los cobros");
            const data = await response.json();

            // Filtro por monto en frontend (el backend no lo soporta directamente)
            let items: ICollection[] = data.items;
            if (filters.amountMin)
                items = items.filter(c => c.amount >= Number(filters.amountMin));
            if (filters.amountMax)
                items = items.filter(c => c.amount <= Number(filters.amountMax));

            setCollections(items);
            setTotalItems(data.totalItems);
        } catch (err: any) {
            setError(err.message || "Error al cargar los cobros");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1" style={{ marginLeft: "18rem" }}>
     <Header hasNotifications={true} loans={[]}  />
                <div className="flex flex-col items-center py-8">
                    <div className="w-full max-w-6xl bg-white rounded-lg shadow p-8">
                        <h2 className="text-2xl font-bold mb-6">Gestión de Cobros</h2>
                        <div className="flex flex-wrap gap-4 mb-4">
                            <input
                                type="text"
                                placeholder="ID o nombre de asociado"
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
                                <option value="Activo">Activo</option>
                                <option value="Cancelado">Cancelado</option>
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
                        <div className="mb-4 flex gap-2">

                            <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                                onClick={() => navigate("/collections/payment-methods")}
                            >
                                Métodos de Cobro
                            </button>
                            <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                                onClick={() => navigate("/collections/overdue-installments")}
                            >
                                Cobros atrasados
                            </button>
                            <button
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                                onClick={() => navigate("/collections/payment-schedule")}
                            >
                                Cronograma de cobros
                            </button>
                        </div>
                        {error && <div className="text-red-600 mb-4">{error}</div>}
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
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">Cargando...</td>
                                    </tr>
                                ) : collections.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-4">No hay cobros para mostrar.</td>
                                    </tr>
                                ) : (
                                    collections.map((c, idx) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-2">{c.associate}</td>
                                            <td className="px-4 py-2">{c.collectionDate}</td>
                                            <td className="px-4 py-2">{c.amount}</td>
                                            <td className="px-4 py-2">
                                                <span className={
                                                    c.status === "Activo" ? "text-green-600" :
                                                        c.status === "Cancelado" ? "text-red-600" :
                                                            "text-yellow-600"
                                                }>
                                                    {c.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 flex gap-2">
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
                                                {c.status === "Activo" && (
                                                    <button
                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                        onClick={() => {
                                                            setSelectedCollection(c);
                                                            setShowAnnulModal(true);
                                                        }}
                                                    >
                                                        Anular
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                        {/* Paginación */}
                        <div className="flex justify-between items-center mt-4">
                            <span>
                                Página {page} de {Math.ceil(totalItems / pageSize)}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Anterior
                                </button>
                                <button
                                    disabled={page * pageSize >= totalItems}
                                    onClick={() => setPage(page + 1)}
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showAnnulModal && selectedCollection && (
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
