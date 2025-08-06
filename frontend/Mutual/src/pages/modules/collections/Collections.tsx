import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";
import { ICollection, ICollectionsResponse } from "../../../types/ICollection";
import AnnulCollectionModal from "../../../components/ui/AnnulCollectionModal";

const PAGE_SIZE = 10;

const Collections: React.FC = () => {
    const [collections, setCollections] = useState<ICollection[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalItems, setTotalItems] = useState<number>(0);
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
    const [modalError, setModalError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const { showErrorToast, showSuccessToast } = useAppToast();

    const fetchCollections = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiMutual.GetCollections();

            if (response) {
                setCollections(response.items);
                setTotalItems(response.totalItems);
            } else {
                setCollections([]);
                setTotalItems(0);
            }
        } catch (err: any) {
            const backendMsg = err.response?.data?.message ||
                err.response?.data?.mensaje ||
                "Error al cargar los cobros.";
            setError(backendMsg);

            showErrorToast({
                title: "Error del servidor",
                message: backendMsg,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const getFilteredCollections = () => {
        return collections.filter(collection => {
            let passes = true;

            if (filters.associate) {
                passes = passes && (
                    collection.associate.toLowerCase().includes(filters.associate.toLowerCase()) ||
                    collection.id.toString().includes(filters.associate)
                );
            }

            if (filters.amountMin) {
                passes = passes && collection.amount >= Number(filters.amountMin);
            }
            if (filters.amountMax) {
                passes = passes && collection.amount <= Number(filters.amountMax);
            }

            if (filters.status) {
                passes = passes && collection.status === filters.status;
            }

            return passes;
        });
    };

    const filteredCollections = getFilteredCollections();
    const totalPages = Math.max(1, Math.ceil(filteredCollections.length / PAGE_SIZE));
    const paginatedCollections = filteredCollections.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleAnnulCollection = (collection: ICollection) => {
        setSelectedCollection(collection);
        setShowAnnulModal(true);
        setModalError(null);
    };

    const handleCloseModal = () => {
        setShowAnnulModal(false);
        setSelectedCollection(null);
        setModalError(null);
        setIsProcessing(false);
    };

    const confirmAnnulCollection = async (reason: string) => {
        if (!selectedCollection) return;

        setIsProcessing(true);
        setModalError(null);

        try {
            await apiMutual.AnnullCollection(selectedCollection.id, reason);
            showSuccessToast({
                title: "Cobro anulado",
                message: "El cobro ha sido anulado correctamente",
            });
            
            // Actualizar la lista de cobros
            setCollections((prevCollections) =>
                prevCollections.map((c) =>
                    c.id === selectedCollection.id ? { ...c, status: "Cancelado" } : c
                )
            );
            handleCloseModal();
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data?.mensaje ||
                (typeof error.response?.data === "string"
                    ? error.response.data
                    : null) ||
                error.message ||
                "Error desconocido";
            setModalError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePrintCollection = async (collection: ICollection) => {
        if (collection.status === "Cancelado") return;
        try {
            const blob = await apiMutual.GenerateCollectionPdf(collection.id);

            // Crear enlace de descarga
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Cobro_${collection.id}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err: any) {
            showErrorToast({
                title: "Error",
                message: err.message || "Error al generar el comprobante PDF",
            });
        }
    };

    useEffect(() => {
        setPage(1);
    }, [filters]);

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
                    <h1 className="text-2xl font-bold text-blue-900 mb-4">
                        Gestión de Cobros
                    </h1>

                    <div className="flex-1 w-full">
                        <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
                            {/* Filtros principales */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="ID o nombre de asociado"
                                        value={filters.associate}
                                        onChange={(e) => {
                                            setFilters({ ...filters, associate: e.target.value });
                                            setPage(1);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="date"
                                        value={filters.dateFrom}
                                        onChange={(e) => {
                                            setFilters({ ...filters, dateFrom: e.target.value });
                                            setPage(1);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="date"
                                        value={filters.dateTo}
                                        onChange={(e) => {
                                            setFilters({ ...filters, dateTo: e.target.value });
                                            setPage(1);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <select
                                        value={filters.status}
                                        onChange={(e) => {
                                            setFilters({ ...filters, status: e.target.value });
                                            setPage(1);
                                        }}
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
                                        onClick={() =>
                                            navigate("/collections/overdue-installments")
                                        }
                                    >
                                        Cobros atrasados
                                    </button>
                                </div>
                            </div>

                            {/* Filtros de monto */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                <input
                                    type="number"
                                    placeholder="Monto mínimo"
                                    value={filters.amountMin}
                                    onChange={(e) => {
                                        setFilters({ ...filters, amountMin: e.target.value });
                                        setPage(1);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Monto máximo"
                                    value={filters.amountMax}
                                    onChange={(e) => {
                                        setFilters({ ...filters, amountMax: e.target.value });
                                        setPage(1);
                                    }}
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
                                                ID Cobro
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Asociado
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Monto
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Fecha
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
                                        {paginatedCollections.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="text-center py-8 text-gray-400"
                                                >
                                                    No se encontraron cobros con los filtros aplicados.
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedCollections.map((collection, index) => (
                                                <tr
                                                    key={collection.id}
                                                    className={
                                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                    }
                                                >
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {collection.id}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {collection.associate}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        ${collection.amount.toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                        {new Date(
                                                            collection.collectionDate
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-semibold
                                                            ${collection.status === "Activo"
                                                                    ? "bg-green-100 text-green-800"
                                                                    : collection.status === "Cancelado"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-gray-100 text-gray-800"
                                                                }`}
                                                        >
                                                            {collection.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">
                                                        <div className="space-x-2 flex justify-end">
                                                            <button
                                                                className={`bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-full transition text-xs font-medium ${collection.status === "Cancelado" ? "opacity-50 cursor-not-allowed" : ""
                                                                    }`}
                                                                disabled={collection.status === "Cancelado"}
                                                                onClick={() => handlePrintCollection(collection)}
                                                            >
                                                                Imprimir
                                                            </button>

                                                            <button
                                                                onClick={() => handleAnnulCollection(collection)}
                                                                className={`bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition text-xs font-medium ${collection.status === "Cancelado"
                                                                        ? "opacity-50 cursor-not-allowed"
                                                                        : ""
                                                                    }`}
                                                                disabled={collection.status === "Cancelado"}
                                                            >
                                                                Anular
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}

                            {/* Paginación */}
                            {filteredCollections.length > 0 && (
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
                                    <div className="flex justify-center items-center gap-4 flex-1">
                                        <button
                                            className="p-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center"
                                            onClick={() => handlePageChange(page - 1)}
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
                                            onClick={() => handlePageChange(page + 1)}
                                            disabled={page === totalPages}
                                            aria-label="Siguiente"
                                        >
                                            <ChevronRightIcon className="h-5 w-5 text-gray-700" />
                                        </button>
                                    </div>
                                    <span className="text-gray-500 text-sm md:ml-4 md:w-auto w-full text-center md:text-right">
                                        {filteredCollections.length} cobro(s) encontrado(s)
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <AnnulCollectionModal
                isOpen={showAnnulModal && selectedCollection !== null}
                onClose={handleCloseModal}
                onConfirm={confirmAnnulCollection}
                collectionId={selectedCollection?.id || 0}
                associateName={selectedCollection?.associate || ""}
                modalError={modalError}
                isLoading={isProcessing}
            />
        </div>
    );
};

export default Collections;
