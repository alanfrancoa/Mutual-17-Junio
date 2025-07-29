import React, { useEffect, useState } from "react";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";

interface OverdueInstallment {
    id: number;
    associateName: string;
    loanId: number;
    loanType: string;
    installmentNumber: number;
    dueDate: string;
    amount: number;
    status: string;
    daysOverdue: number;
    collected?: string;
}

const OverdueInstallments: React.FC = () => {
    const [installments, setInstallments] = useState<OverdueInstallment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOverdue = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = sessionStorage.getItem("token") || "";
                const response = await fetch("https://localhost:7256/api/installments/overdue", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) throw new Error("Error al cargar cuotas vencidas");
                const data = await response.json();
                setInstallments(data);
            } catch (err: any) {
                setError(err.message || "Error al cargar cuotas vencidas");
            } finally {
                setLoading(false);
            }
        };
        fetchOverdue();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1" style={{ marginLeft: "18rem" }}>
                <Header hasNotifications={true} />
                <div className="flex flex-col items-center py-8">
                    <div className="w-full max-w-6xl bg-white rounded-lg shadow p-8">
                        <h2 className="text-2xl font-bold mb-6">Cuotas Vencidas</h2>
                        {error && <div className="text-red-600 mb-4">{error}</div>}
                        <table className="min-w-full divide-y divide-gray-200 mb-4">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left">Asociado</th>
                                    <th className="px-4 py-2 text-left">Tipo Préstamo</th>
                                    <th className="px-4 py-2 text-left">N° Cuota</th>
                                    <th className="px-4 py-2 text-left">Vencimiento</th>
                                    <th className="px-4 py-2 text-left">Monto</th>
                                    <th className="px-4 py-2 text-left">Días Vencidos</th>
                                    <th className="px-4 py-2 text-left">Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4">Cargando...</td>
                                    </tr>
                                ) : installments.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4">No hay cuotas vencidas.</td>
                                    </tr>
                                ) : (
                                    installments.map((i) => (
                                        <tr key={i.id}>
                                            <td className="px-4 py-2">{i.associateName}</td>
                                            <td className="px-4 py-2">{i.loanType}</td>
                                            <td className="px-4 py-2">{i.installmentNumber}</td>
                                            <td className="px-4 py-2">{i.dueDate}</td>
                                            <td className="px-4 py-2">{i.amount}</td>
                                            <td className="px-4 py-2">{i.daysOverdue} días</td>
                                            <td className="px-4 py-2 text-red-600">{i.collected}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverdueInstallments;