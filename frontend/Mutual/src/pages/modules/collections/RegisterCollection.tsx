import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../dashboard/components/Sidebar";
import Header from "../../dashboard/components/Header";
import { apiMutual } from "../../../api/apiMutual";
import { ICollectionMethod } from "../../../types/ICollection";
import { IInstallmentInfo } from "../../../types/loans/ILoan";

const RegisterCollection: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [installment, setInstallment] = useState<IInstallmentInfo | null>(null);
  const [methods, setMethods] = useState<ICollectionMethod[]>([]);
  const [form, setForm] = useState({
    methodId: "",
    receiptNumber: "",
    date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Cargar datos de la cuota y métodos de cobro
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const installmentData = await apiMutual.GetInstallmentById(Number(id));
          setInstallment(installmentData);
        }
        const methodsData = await apiMutual.GetCollectionMethods();
        setMethods(methodsData.filter(m => m.isActive));
      } catch {
        setError("Error al cargar datos iniciales");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (!installment || !form.methodId || !form.receiptNumber) {
        setError("Completa todos los campos obligatorios.");
        setLoading(false);
        return;
      }

      await apiMutual.RegisterCollection({
        installmentId: installment.id,
        amount: installment.amount,
        methodId: Number(form.methodId),
        receiptNumber: form.receiptNumber.trim(),
        collectionDate: form.date,
      });

      setSuccess("Cobro registrado correctamente");
      setTimeout(() => navigate("/prestamos"), 1500);
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
        <Header hasNotifications={true} loans={[]} />
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
              {/* Campo oculto para el ID de la cuota */}
              <input type="hidden" name="installmentId" value={installment?.id || ""} />

              <div>
                <label className="block text-sm font-medium mb-1">Monto de la cuota</label>
                <input
                  type="text"
                  value={installment ? installment.amount : ""}
                  readOnly
                  className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100"
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
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full border border-gray-300 px-3 py-2 rounded"
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
                  className="w-full border border-gray-300 px-3 py-2 rounded"
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
                  className="w-full border border-gray-300 px-3 py-2 rounded"
                  disabled={loading}
                  placeholder="Ingrese el número del comprobante"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/prestamos")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:bg-green-400"
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