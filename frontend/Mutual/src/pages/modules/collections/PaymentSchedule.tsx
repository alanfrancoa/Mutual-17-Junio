import React, { useEffect, useState } from "react";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { IAssociateList } from "../../../types/associates/IAssociateList";

const PaymentSchedule: React.FC = () => {
    const [associates, setAssociates] = useState<IAssociateList[]>([]);
    const [loans, setLoans] = useState<any[]>([]);
    const [installments, setInstallments] = useState<any[]>([]);
    const [filteredInstallments, setFilteredInstallments] = useState<any[]>([]);
    const [selectedAssociate, setSelectedAssociate] = useState("");
    const [selectedLoan, setSelectedLoan] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    //Muestra todos los asociados
    useEffect(() => {
        const fetchAssociates = async () => {
            try {
                const data = await apiMutual.GetAllAssociates();
                setAssociates(data.filter(a => a.active));
            } catch {
                setError("Error al cargar asociados");
            }
        };
        fetchAssociates();
    }, []);

    // Cargar préstamos del asociado seleccionado
    useEffect(() => {
        if (!selectedAssociate) {
            setLoans([]);
            setInstallments([]);
            setFilteredInstallments([]);
            setSelectedLoan("");
            return;
        }

        const fetchLoans = async () => {
            setLoading(true);
            try {
                const allLoans = await apiMutual.GetLoans();
                const associateLoans = allLoans.filter((l: any) => l.personId === Number(selectedAssociate));
                setLoans(associateLoans);

                if (associateLoans.length > 0) {
                    setSelectedLoan(associateLoans[0]?.id?.toString() ?? "");
                } else {
                    setSelectedLoan("");
                    setInstallments([]);
                    setFilteredInstallments([]);
                }
            } catch {
                setError("Error al cargar préstamos del asociado");
                setLoans([]);
            } finally {
                setLoading(false);
            }
        };
        fetchLoans();
    }, [selectedAssociate]);

    // Cargar cronograma del préstamo seleccionado
    useEffect(() => {
        if (!selectedLoan) {
            setInstallments([]);
            setFilteredInstallments([]);
            return;
        }

        const fetchInstallments = async () => {
            setLoading(true);
            try {
                const data = await apiMutual.GetLoanInstallments(Number(selectedLoan));
                setInstallments(data);
                setFilteredInstallments(data); // Inicialmente mostrar todas
            } catch {
                setError("Error al cargar cronograma de pagos");
                setInstallments([]);
                setFilteredInstallments([]);
            } finally {
                setLoading(false);
            }
        };
        fetchInstallments();
    }, [selectedLoan]);

    // Filtrar cuotas por rango de fechas
    useEffect(() => {
        if (!installments.length) {
            setFilteredInstallments([]);
            return;
        }

        let filtered = [...installments];

        if (dateFrom) {
            filtered = filtered.filter(installment => {
                const dueDate = new Date(installment.dueDate);
                const fromDate = new Date(dateFrom);
                return dueDate >= fromDate;
            });
        }

        if (dateTo) {
            filtered = filtered.filter(installment => {
                const dueDate = new Date(installment.dueDate);
                const toDate = new Date(dateTo);
                return dueDate <= toDate;
            });
        }

        setFilteredInstallments(filtered);
    }, [installments, dateFrom, dateTo]);

    const clearFilters = () => {
        setDateFrom("");
        setDateTo("");
    };

    const getStatusBadge = (collected: boolean, dueDate: string) => {
        if (collected) {
            return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Pagada</span>;
        }

        const today = new Date();
        const due = new Date(dueDate);

        if (due < today) {
            return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Vencida</span>;
        }

        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pendiente</span>;
    };

    const calculateDaysInfo = (collected: boolean, dueDate: string) => {
        if (collected) {
            return { text: "Pagada", className: "text-green-600 font-medium" };
        }

        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return {
                text: `Vencida (${Math.abs(diffDays)} días)`,
                className: "text-red-600 font-medium"
            };
        } else if (diffDays === 0) {
            return { text: "Vence hoy", className: "text-orange-600 font-medium" };
        } else {
            return { text: `${diffDays} días`, className: "text-gray-600" };
        }
    };

    const selectedAssociateData = associates.find(a => a.id === Number(selectedAssociate));
    const selectedLoanData = loans.find(l => l.id === Number(selectedLoan));

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar />
            <div className="flex-1" style={{ marginLeft: "18rem" }}>
                <Header hasNotifications={true} />
                <div className="p-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-2xl font-bold mb-6">Cronograma de Pagos por Usuario</h2>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/* Dropdown de Asociados */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Seleccionar Asociado
                                </label>
                                <select
                                    value={selectedAssociate}
                                    onChange={(e) => setSelectedAssociate(e.target.value)}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">-- Seleccione un asociado --</option>
                                    {associates.map(associate => (
                                        <option key={associate.id} value={associate.id}>
                                            {associate.id} - {associate.legalName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Selector de Préstamo */}
                            {selectedAssociate && loans.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Préstamo
                                    </label>
                                    <select
                                        value={selectedLoan}
                                        onChange={(e) => setSelectedLoan(e.target.value)}
                                        className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">Seleccione un préstamo...</option>
                                        {loans.map(loan => (
                                            <option key={loan.id} value={loan.id}>
                                                Préstamo #{loan.id} - ${loan.amount} ({loan.status})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>

                        {/* Filtros de fecha */}
                        {selectedLoan && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <h3 className="font-medium text-gray-700 mb-3">Filtros por Fecha de Vencimiento</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Desde
                                        </label>
                                        <input
                                            type="date"
                                            value={dateFrom}
                                            onChange={(e) => setDateFrom(e.target.value)}
                                            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hasta
                                        </label>
                                        <input
                                            type="date"
                                            value={dateTo}
                                            onChange={(e) => setDateTo(e.target.value)}
                                            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <button
                                            onClick={clearFilters}
                                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                                        >
                                            Limpiar Filtros
                                        </button>
                                    </div>
                                </div>
                                {(dateFrom || dateTo) && (
                                    <div className="mt-2 text-sm text-gray-600">
                                        Mostrando {filteredInstallments.length} de {installments.length} cuotas
                                        {dateFrom && ` desde ${new Date(dateFrom).toLocaleDateString('es-AR')}`}
                                        {dateTo && ` hasta ${new Date(dateTo).toLocaleDateString('es-AR')}`}
                                    </div>
                                )}
                            </div>
                        )}

                        {selectedAssociateData && selectedLoanData && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">Información del Asociado</h3>
                                        <p><span className="font-medium">ID:</span> {selectedAssociateData.id}</p>
                                        <p><span className="font-medium">Nombre:</span> {selectedAssociateData.legalName}</p>
                                        <p><span className="font-medium">DNI:</span> {selectedAssociateData.dni}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-700 mb-2">Información del Préstamo</h3>
                                        <p><span className="font-medium">Préstamo #:</span> {selectedLoanData.id}</p>
                                        <p><span className="font-medium">Monto:</span> ${selectedLoanData.amount}</p>
                                        <p><span className="font-medium">Estado:</span> {selectedLoanData.status}</p>
                                        <p><span className="font-medium">Total cuotas:</span> {installments.length}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mensaje si no hay préstamos */}
                        {selectedAssociate && loans.length === 0 && !loading && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <div className="text-yellow-600 mr-2">⚠️</div>
                                    <p className="text-yellow-800">
                                        El asociado seleccionado no tiene préstamos registrados.
                                    </p>
                                </div>
                            </div>
                        )}

                        {loading && (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="mt-2 text-gray-600">Cargando cronograma...</p>
                            </div>
                        )}

                        {!loading && filteredInstallments.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto border-collapse border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Cuota #</th>
                                            <th className="border border-gray-300 px-4 py-3 text-left font-medium text-gray-700">Fecha Vencimiento</th>
                                            <th className="border border-gray-300 px-4 py-3 text-right font-medium text-gray-700">Monto</th>
                                            <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-700">Estado</th>
                                            <th className="border border-gray-300 px-4 py-3 text-center font-medium text-gray-700">Días</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInstallments.map((installment, index) => {
                                            const daysInfo = calculateDaysInfo(installment.collected, installment.dueDate);

                                            return (
                                                <tr key={installment.id} className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}`}>
                                                    <td className="border border-gray-300 px-4 py-3 font-medium">
                                                        {installment.installmentNumber}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3">
                                                        {new Date(installment.dueDate).toLocaleDateString('es-AR')}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3 text-right font-medium">
                                                        ${installment.amount}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                                        {getStatusBadge(installment.collected, installment.dueDate)}
                                                    </td>
                                                    <td className="border border-gray-300 px-4 py-3 text-center">
                                                        <span className={daysInfo.className}>
                                                            {daysInfo.text}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {!loading && filteredInstallments.length > 0 && (
                            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-green-800">Cuotas Pagadas</h4>
                                    <p className="text-2xl font-bold text-green-600">
                                        {filteredInstallments.filter(i => i.collected).length}
                                    </p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-red-800">Cuotas Vencidas</h4>
                                    <p className="text-2xl font-bold text-red-600">
                                        {filteredInstallments.filter(i => !i.collected && new Date(i.dueDate) < new Date()).length}
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-yellow-800">Cuotas Pendientes</h4>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {filteredInstallments.filter(i => !i.collected && new Date(i.dueDate) >= new Date()).length}
                                    </p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-blue-800">Cuotas Mostradas</h4>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {filteredInstallments.length}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/*no hay cuotas*/}
                        {!loading && selectedLoan && filteredInstallments.length === 0 && installments.length > 0 && (
                            <div className="text-center py-8">
                                <div className="text-gray-500 text-lg mb-2">📅 No hay cuotas en el rango seleccionado</div>
                                <p className="text-gray-400">Ajuste los filtros de fecha para ver más resultados</p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Mostrar todas las cuotas
                                </button>
                            </div>
                        )}

                        {!selectedAssociate && (
                            <div className="text-center py-12">
                                <div className="text-gray-500 text-lg mb-2">
                                    📋 Visualización de Cronogramas de Pago
                                </div>
                                <p className="text-gray-400">
                                    Seleccione un asociado de la lista para ver el cronograma de pagos
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSchedule;