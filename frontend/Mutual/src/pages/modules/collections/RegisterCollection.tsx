import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { IAssociateList } from "../../../types/associates/IAssociateList";
import { ICollectionMethod } from "../../../types/ICollection";
import { IInstallmentInfo } from "../../../types/loans/ILoan";

const RegisterCollection: React.FC = () => {
  const navigate = useNavigate();
  const [associates, setAssociates] = useState<IAssociateList[]>([]);
  const [methods, setMethods] = useState<ICollectionMethod[]>([]);
  const [installments, setInstallments] = useState<IInstallmentInfo[]>([]);
  const [loans, setLoans] = useState<any[]>([]);
  const [form, setForm] = useState({
    associateId: "",
    loanId: "",
    installmentId: "",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
    methodId: "",
    receiptNumber: "",
    observations: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Verificar rol del usuario (solo Administrador y Gestor pueden registrar cobros)
  useEffect(() => {
    const userRole = sessionStorage.getItem("userRole");
    if (userRole !== "Administrador" && userRole !== "Gestor") {
      navigate("/dashboard");
      return;
    }
  }, [navigate]);

  // Cargar asociados y métodos de cobro al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assoc, meth] = await Promise.all([
          apiMutual.GetAllAssociates(),
          apiMutual.GetCollectionMethods(),
        ]);
        setAssociates(assoc);
        setMethods(meth.filter(m => m.isActive)); // Solo métodos activos
      } catch {
        setError("Error al cargar datos iniciales");
      }
    };
    fetchData();
  }, []);

  // Cargar préstamos del asociado seleccionado
  useEffect(() => {
    const fetchLoans = async () => {
      setLoans([]);
      setInstallments([]);
      setForm((prev) => ({ ...prev, loanId: "", installmentId: "", amount: "" }));
      if (!form.associateId) return;

      try {
        const allLoans = await apiMutual.GetLoans();
        // Filtrar por personId (campo correcto según tu backend)
        const loansOfAssociate = allLoans.filter((l: any) => l.personId === Number(form.associateId));
        // Solo préstamos activos
        const activeLoans = loansOfAssociate.filter((l: any) => l.status === "Activo");
        setLoans(activeLoans);
      } catch {
        setLoans([]);
        setError("Error al cargar préstamos del asociado");
      }
    };
    fetchLoans();
  }, [form.associateId]);

  // Cargar cuotas pendientes del préstamo seleccionado
  useEffect(() => {
    const fetchInstallments = async () => {
      setInstallments([]);
      setForm((prev) => ({ ...prev, installmentId: "", amount: "" }));
      if (!form.loanId) return;

      try {
        const installmentsList = await apiMutual.GetLoanInstallments(Number(form.loanId));
        // Filtrar solo cuotas no cobradas (campo booleano)
        const pending = installmentsList.filter((i: any) => !i.collected);
        setInstallments(pending);
      } catch {
        setInstallments([]);
        setError("Error al cargar cuotas del préstamo");
      }
    };
    fetchInstallments();
  }, [form.loanId]);

  // Autocompletar monto al seleccionar cuota
  useEffect(() => {
    if (!form.installmentId) {
      setForm((prev) => ({ ...prev, amount: "" }));
      return;
    }
    const selected = installments.find(i => i.installmentNumber === Number(form.installmentId));
    setForm((prev) => ({ ...prev, amount: selected ? String(selected.amount) : "" }));
  }, [form.installmentId, installments]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Validaciones básicas
      if (!form.associateId || !form.installmentId || !form.amount || !form.methodId || !form.receiptNumber) {
        setError("Completa todos los campos obligatorios.");
        setLoading(false);
        return;
      }

      // Validar que el monto sea positivo
      if (Number(form.amount) <= 0) {
        setError("El monto debe ser mayor a cero.");
        setLoading(false);
        return;
      }

      // Validar que la fecha no sea futura
      const today = new Date().toISOString().slice(0, 10);
      if (form.date > today) {
        setError("La fecha de cobro no puede ser futura.");
        setLoading(false);
        return;
      }

      await apiMutual.RegisterCollection({
        installmentId: Number(form.installmentId),
        amount: Number(form.amount),
        methodId: Number(form.methodId),
        receiptNumber: form.receiptNumber.trim(),
        collectionDate: form.date,
        observations: form.observations.trim(),
      });

      setSuccess("Cobro registrado correctamente");
      setTimeout(() => navigate("/collections"), 1500);
    } catch (err: any) {
      setError(err.message || "Error al registrar el cobro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} />
        <div className="flex flex-col items-center py-8">
          <div className="w-full max-w-lg bg-white rounded-lg shadow p-8">
            <h2 className="text-2xl font-bold mb-6">Registrar Cobro</h2>

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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asociado *</label>
                <select
                  name="associateId"
                  value={form.associateId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Seleccione un asociado...</option>
                  {associates.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.legalName} (DNI: {a.dni})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Préstamo *</label>
                <select
                  name="loanId"
                  value={form.loanId || ""}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  disabled={!form.associateId || loading}
                >
                  <option value="">
                    {!form.associateId ? "Primero seleccione un asociado" : "Seleccione un préstamo..."}
                  </option>
                  {loans.map(l => (
                    <option key={l.id} value={l.id}>
                      Préstamo #{l.id} - ${l.amount} - Estado: {l.status}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cuota a cobrar *</label>
                <select
                  name="installmentId"
                  value={form.installmentId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  disabled={!form.loanId || loading}
                >
                  <option value="">
                    {!form.loanId ? "Primero seleccione un préstamo" : "Seleccione una cuota..."}
                  </option>
                  {installments.map(i => (
                    <option key={i.installmentNumber} value={i.installmentNumber}>
                      Cuota #{i.installmentNumber} - Vence: {i.dueDate} - ${i.amount}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Monto *</label>
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  required
                  min={0}
                  step="0.01"
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500 bg-gray-100"
                  disabled
                  placeholder="Se completa automáticamente"
                />
                <small className="text-gray-500">El monto se asigna automáticamente según la cuota seleccionada</small>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Fecha de cobro *</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Método de cobro *</label>
                <select
                  name="methodId"
                  value={form.methodId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  disabled={loading}
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
                <label className="block text-sm font-medium mb-1">N° de comprobante *</label>
                <input
                  type="text"
                  name="receiptNumber"
                  value={form.receiptNumber}
                  onChange={handleChange}
                  required
                  maxLength={255}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-blue-500"
                  disabled={loading}
                  placeholder="Ingrese el número del comprobante"
                />
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
                  disabled={loading}
                  placeholder="Observaciones adicionales (opcional)"
                />
                <small className="text-gray-500">{form.observations.length}/255 caracteres</small>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/collections")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors disabled:bg-green-400"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Registrar Cobro"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterCollection;