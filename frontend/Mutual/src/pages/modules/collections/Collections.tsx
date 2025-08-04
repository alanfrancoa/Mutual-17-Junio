import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
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

            if (filters.associate) {
                if (!isNaN(Number(filters.associate))) {
                    // Si es número, buscar por ID
                    params.append("associateId", filters.associate);
                } else {
                    params.append("associateName", filters.associate);
                }
            }
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

    const totalPages = Math.ceil(totalItems / pageSize);

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
                    <h1 className="text-2xl font-bold text-blue-900 mb-4">Gestión de Cobros</h1>
                    
                    <div className="flex-1 w-full">
                        <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
                            {/* Filtros y botones de navegación */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                                {/* Primera fila de filtros */}
                                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="ID o nombre de asociado"
                                        value={filters.associate}
                                        onChange={e => setFilters({ ...filters, associate: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        value={filters.status}
                                        onChange={e => setFilters({ ...filters, status: e.target.value })}
                                        className="px-3 py-2 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Todos los estados</option>
                                        <option value="Activo">Activo</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </select>
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-semibold shadow transition w-full md:w-auto"
                                        onClick={() => navigate("/collections/payment-methods")}
                                    >
                                        Métodos de Cobro
                                    </button>
                                    <button
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full font-semibold shadow transition w-full md:w-auto"
                                        onClick={() => navigate("/collections/overdue-installments")}
                                    >
                                        Cobros atrasados
                                    </button>
                                </div>
                            </div>

                            {/* Segunda fila: Filtros de monto */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <input
                                    type="number"
                                    placeholder="Monto mínimo"
                                    value={filters.amountMin}
                                    onChange={e => setFilters({ ...filters, amountMin: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Monto máximo"
                                    value={filters.amountMax}
                                    onChange={e => setFilters({ ...filters, amountMax: e.target.value })}
                                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {loading ? (
                                <div className="text-center py-8 text-gray-500">
                                    Cargando cobros...
                                </div>
                            ) : error ? (
                                <div className="text-center py-8 text-red-600">{error}</div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Asociado
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Monto
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
                                        {collections.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-gray-400">
                                                    No hay cobros para mostrar.
                                                </td>
                                            </tr>
                                        ) : (
                                            collections.map((c, idx) => (
                                                <tr key={c.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {c.associate}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {c.collectionDate}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        ${c.amount}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                                c.status === "Activo"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : c.status === "Cancelado"
                                                                    ? "bg-red-100 text-red-800"
                                                                    : "bg-gray-200 text-gray-800"
                                                            }`}
                                                        >
                                                            {c.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                                                        <div className="space-x-2 flex justify-end">
                                                            <button
                                                                className={`bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full transition text-xs font-medium ${
                                                                    c.status === "Cancelado" ? "opacity-50 cursor-not-allowed" : ""
                                                                }`}
                                                                disabled={c.status === "Cancelado"}
                                                                onClick={async () => {
                                                                    if (c.status === "Cancelado") return;
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
                                                                        let fileName = `Cobro_${c.id}.pdf`;
                                                                        const disposition = response.headers.get("Content-Disposition");
                                                                        
                                                                        if (disposition) {
                                                                            let match = disposition.match(/filename\*\s*=\s*UTF-8''"?([^;"\n]+)"?/i);
                                                                            if (match && match[1]) {
                                                                                fileName = decodeURIComponent(match[1]);
                                                                            } else {
                                                                                match = disposition.match(/filename="([^"]+)"/i);
                                                                                if (match && match[1]) {
                                                                                    fileName = match[1];
                                                                                } else {
                                                                                    match = disposition.match(/filename=([^;]+)/i);
                                                                                    if (match && match[1]) {
                                                                                        fileName = match[1].trim();
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                        const url = window.URL.createObjectURL(blob);
                                                                        const link = document.createElement("a");
                                                                        link.href = url;
                                                                        link.download = fileName;
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
                                                                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition text-xs font-medium"
                                                                    onClick={() => {
                                                                        setSelectedCollection(c);
                                                                        setShowAnnulModal(true);
                                                                    }}
                                                                >
                                                                    Anular
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}

                            {/* Paginación */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
                                <div className="flex justify-center items-center gap-4 flex-1">
                                    <button
                                        className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        aria-label="Anterior"
                                    >
                                        <ChevronLeftIcon className="h-5 w-5 text-gray-700" />
                                    </button>
                                    <span className="text-gray-700">
                                        Página {page} de {totalPages}
                                    </span>
                                    <button
                                        className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        aria-label="Siguiente"
                                    >
                                        <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                                    </button>
                                </div>
                                <span className="text-gray-500 text-sm md:ml-4 md:w-auto w-full text-center md:text-right">
                                    {totalItems} cobro(s) encontrado(s)
                                </span>
                            </div>
                        </div>
                    </div>
                </main>
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
