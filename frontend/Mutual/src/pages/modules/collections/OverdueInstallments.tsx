import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

interface OverdueInstallment {
    id: number;
    installmentNumber: number;
    dueDate: string;
    amount: number;
    daysOverdue: number;
    associate: string; 
    loanType: string;
    collected: string;
}

const OverdueInstallments: React.FC = () => {
    const navigate = useNavigate();
    const [installments, setInstallments] = useState<OverdueInstallment[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [filters, setFilters] = useState({
        associate: "",
        loanType: "",
        amountMin: "",
        amountMax: "",
        daysMin: "",
        daysMax: "",
    });
    const { showErrorToast } = useAppToast();

    useEffect(() => {
        const userRole = sessionStorage.getItem("userRole");
        if (userRole !== "Administrador" && userRole !== "Gestor" && userRole !== "Consultor") {
            navigate("/dashboard");
            return;
        }
    }, [navigate]);

    useEffect(() => {
        const fetchOverdue = async () => {
            setLoading(true);
            try {
                const data = await apiMutual.GetOverdueInstallments("Expirado");
                // Validar que data sea un array
                if (Array.isArray(data)) {
                    setInstallments(data);
                } else {
                    setInstallments([]);
                    showErrorToast({ message: "Formato de datos incorrecto" });
                }
            } catch (err: any) {
                setInstallments([]);
                showErrorToast({ message: err.message || "Error al cargar cuotas vencidas" });
            } finally {
                setLoading(false);
            }
        };
        fetchOverdue();
    }, []); // ✅ Quité showErrorToast de las dependencias

    // Filtra antes de paginar
    const filteredInstallments = installments.filter(i =>
        (!filters.associate || i.associate.toLowerCase().includes(filters.associate.toLowerCase())) &&
        (!filters.loanType || i.loanType.toLowerCase().includes(filters.loanType.toLowerCase())) &&
        (!filters.amountMin || i.amount >= Number(filters.amountMin)) &&
        (!filters.amountMax || i.amount <= Number(filters.amountMax)) &&
        (!filters.daysMin || i.daysOverdue >= Number(filters.daysMin)) &&
        (!filters.daysMax || i.daysOverdue <= Number(filters.daysMax))
    );

    // Calcula los elementos a mostrar en la página actual
    const paginatedInstallments = filteredInstallments.slice((page - 1) * pageSize, page * pageSize);
    const totalPages = Math.ceil(filteredInstallments.length / pageSize);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex">
                <Sidebar />
                <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
                    <Header hasNotifications={true} loans={[]} />
                    <div className="flex flex-col items-center justify-center py-8 flex-1">
                        <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8 text-center">
                            <div className="text-lg text-gray-600">Cargando cuotas vencidas...</div>
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
                        Cuotas Vencidas
                    </h1>

                    <div className="flex-1 w-full">
                        <div className="overflow-x-auto rounded-lg shadow bg-white p-4">
                            {/* Filtros y búsqueda organizados */}
                            <div className="mb-4">
                                <div className="flex flex-col md:flex-row gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Nombre asociado"
                                        value={filters.associate}
                                        onChange={e => { setPage(1); setFilters(f => ({ ...f, associate: e.target.value })); }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Tipo préstamo"
                                        value={filters.loanType}
                                        onChange={e => { setPage(1); setFilters(f => ({ ...f, loanType: e.target.value })); }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <input
                                        type="number"
                                        placeholder="Monto mínimo"
                                        value={filters.amountMin}
                                        onChange={e => { setPage(1); setFilters(f => ({ ...f, amountMin: e.target.value })); }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Monto máximo"
                                        value={filters.amountMax}
                                        onChange={e => { setPage(1); setFilters(f => ({ ...f, amountMax: e.target.value })); }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Días vencidos mínimo"
                                        value={filters.daysMin}
                                        onChange={e => { setPage(1); setFilters(f => ({ ...f, daysMin: e.target.value })); }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Días vencidos máximo"
                                        value={filters.daysMax}
                                        onChange={e => { setPage(1); setFilters(f => ({ ...f, daysMax: e.target.value })); }}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Asociado
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Tipo Préstamo
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            N° Cuota
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Vencimiento
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Monto
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Días Vencidos
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                            Estado
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {paginatedInstallments.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-gray-400">
                                                No hay cuotas vencidas.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedInstallments.map((installment, index) => (
                                            <tr key={installment.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {installment.associate}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {installment.loanType}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {installment.installmentNumber}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {installment.dueDate}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    ${installment.amount.toLocaleString()}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
                                                        {installment.daysOverdue} días
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                                        {installment.collected}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            {/* Información adicional */}
                            {filteredInstallments.length > 0 && (
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
                                    <div className="flex justify-center items-center gap-4 flex-1">
                                        <span className="text-gray-700 font-medium">
                                            {filteredInstallments.length} cuota(s) vencida(s) encontrada(s)
                                        </span>
                                    </div>
                                    <span className="text-gray-500 text-sm md:w-auto w-full text-center md:text-right">
                                        Total: ${filteredInstallments.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                                    </span>
                                </div>
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
                                <span className="text-gray-500 text-sm md:w-auto w-full text-center md:text-right">
                                    {filteredInstallments.length} cuota(s) vencida(s) encontrada(s)
                                </span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OverdueInstallments;