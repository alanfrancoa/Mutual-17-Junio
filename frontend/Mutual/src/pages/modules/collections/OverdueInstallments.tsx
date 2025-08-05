import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
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
                            {/* Filtros y búsqueda - espacio para futuras funcionalidades */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-2">
                                <div className="flex gap-2 w-full md:w-auto">
                                    {/* Espacio para futuras funcionalidades de filtros */}
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    {/* Espacio para futuras funcionalidades de acciones */}
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
                                    {installments.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="text-center py-8 text-gray-400">
                                                No hay cuotas vencidas.
                                            </td>
                                        </tr>
                                    ) : (
                                        installments.map((installment, index) => (
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
                            {installments.length > 0 && (
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 gap-2">
                                    <div className="flex justify-center items-center gap-4 flex-1">
                                        <span className="text-gray-700 font-medium">
                                            {installments.length} cuota(s) vencida(s) encontrada(s)
                                        </span>
                                    </div>
                                    <span className="text-gray-500 text-sm md:w-auto w-full text-center md:text-right">
                                        Total: ${installments.reduce((sum, i) => sum + i.amount, 0).toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OverdueInstallments;