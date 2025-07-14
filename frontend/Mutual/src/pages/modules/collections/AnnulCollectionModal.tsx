import React, { useState } from "react";
import { apiMutual } from "../../../api/apiMutual";

interface AnnulCollectionModalProps {
    collection: any;
    onClose: () => void;
    onSuccess: () => void;
}

const AnnulCollectionModal: React.FC<AnnulCollectionModalProps> = ({
    collection,
    onClose,
    onSuccess,
}) => {
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleAnnul = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!reason.trim()) {
            setError("Debes ingresar un motivo de anulación.");
            return;
        }
        setLoading(true);
        try {
            await apiMutual.AnnullCollection(collection.id, reason);
            setSuccess("Cobro anulado correctamente.");
            setTimeout(() => {
                setLoading(false);
                onSuccess();
                onClose();
            }, 1000);
        } catch (err: any) {
            setError(err.message || "Error al anular el cobro.");
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Anular Cobro</h3>
                <p className="mb-2">
                    ¿Estás seguro que deseas anular el cobro <b>#{collection.id}</b>?
                </p>
                <form onSubmit={handleAnnul} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Motivo de anulación *
                        </label>
                        <textarea
                            className="w-full border px-2 py-1 rounded"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            maxLength={255}
                            disabled={loading}
                        />
                    </div>
                    {error && <div className="text-red-600">{error}</div>}
                    {success && <div className="text-green-600">{success}</div>}
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            className="bg-gray-400 text-white px-4 py-2 rounded"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                            disabled={loading}
                        >
                            {loading ? "Anulando..." : "Anular"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AnnulCollectionModal;