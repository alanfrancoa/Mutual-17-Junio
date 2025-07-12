import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { IAssociateList } from "../../../types/associates/IAssociateList";
import { ICollectionMethod } from "../../../types/ICollection";
import { IInstallment } from "../../../types/IInstallment";
import { ICollection } from "../../../types/ICollection";

const RegisterCollection: React.FC = () => {
  const navigate = useNavigate();
  const [associates, setAssociates] = useState<IAssociateList[]>([]);
  const [methods, setMethods] = useState<ICollectionMethod[]>([]);
  const [installments, setInstallments] = useState<IInstallment[]>([]);
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

  // Cargar asociados y métodos de cobro al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assoc, meth] = await Promise.all([
          apiMutual.GetAllAssociates(),
          apiMutual.GetCollectionMethods(),
        ]);
        setAssociates(assoc);
        setMethods(meth);
      } catch {
        setError("Error al cargar datos iniciales");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchLoans = async () => {
      setLoans([]);
      setInstallments([]);
      setForm((prev) => ({ ...prev, loanId: "", installmentId: "", amount: "" }));
      if (!form.associateId) return;
      try {
        // Si tienes un endpoint específico, úsalo. Si no, filtra GetLoans()
        const allLoans = await apiMutual.GetLoans();
        const loansOfAssociate = allLoans.filter((l: any) => l.associateId === Number(form.associateId));
        setLoans(loansOfAssociate);
      } catch {
        setLoans([]);
      }
    };
    fetchLoans();
    // eslint-disable-next-line
  }, [form.associateId]);

  // Cargar cuotas pendientes del préstamo seleccionado
  useEffect(() => {
    const fetchInstallments = async () => {
      setInstallments([]);
      setForm((prev) => ({ ...prev, installmentId: "", amount: "" }));
      if (!form.loanId) return;
      try {
        const loan = await apiMutual.GetLoanById(Number(form.loanId));
        // Filtra solo cuotas pendientes
        const pending = loan.installments.filter((i: any) => i.collected === "Pendiente");
        setInstallments(
          pending.map((i: any) => ({
            id: i.id,
            installmentNumber: i.installmentNumber,
            dueDate: i.dueDate,
            amount: i.amount,
            collected: i.collected,
          }))
        );
      } catch {
        setInstallments([]);
      }
    };
    fetchInstallments();
    // eslint-disable-next-line
  }, [form.loanId]);

  // Autocompletar monto al seleccionar cuota
  useEffect(() => {
    if (!form.installmentId) {
      setForm((prev) => ({ ...prev, amount: "" }));
      return;
    }
    const selected = installments.find(i => i.id === Number(form.installmentId));
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
      await apiMutual.RegisterCollection({
        installmentId: Number(form.installmentId),
        amount: Number(form.amount),
        methodId: Number(form.methodId),
        receiptNumber: form.receiptNumber,
        collectionDate: form.date,
        observations: form.observations,
      });
      setSuccess("Cobro registrado correctamente");
      setTimeout(() => navigate("/collections"), 1200);
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
            {error && <div className="text-red-600 mb-2">{error}</div>}
            {success && <div className="text-green-600 mb-2">{success}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Asociado *</label>
                <select
                  name="associateId"
                  value={form.associateId}
                  onChange={handleChange}
                  required
                  className="w-full border px-2 py-1 rounded"
                >
                    <option value="">Seleccione un asociado...</option>
                    {associates.map(a => (
                        <option key={a.id} value={a.id}>
                            {a.legalName} ({a.dni})
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
                  className="w-full border px-2 py-1 rounded"
                  disabled={!form.associateId}
                >
                  <option value="">Seleccione un préstamo...</option>
                  {loans.map(l => (
                    <option key={l.id} value={l.id}>
                      Préstamo #{l.id} - Estado: {l.status}
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
                  className="w-full border px-2 py-1 rounded"
                  disabled={!form.loanId}
                >
                  <option value="">Seleccione una cuota...</option>
                  {installments.map(i => (
                    <option key={i.id} value={i.id}>
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
                  className="w-full border px-2 py-1 rounded"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fecha de cobro *</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Método de cobro *</label>
                <select
                  name="methodId"
                  value={form.methodId}
                  onChange={handleChange}
                  required
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="">Seleccione...</option>
                  {methods.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
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
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Observaciones</label>
                <textarea
                  name="observations"
                  value={form.observations}
                  onChange={handleChange}
                  className="w-full border px-2 py-1 rounded"
                  maxLength={255}
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/collections")}
                  className="bg-gray-400 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar"}
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