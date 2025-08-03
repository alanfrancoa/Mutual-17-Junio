import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";
import { apiMutual } from "../../../api/apiMutual";
import { IAssociateList } from "../../../types/associates/IAssociateList";
import { IRelativeList } from "../../../types/associates/IRelative";
import AssociateRelativesTable from "./relatives/associatesRelativeTable";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import useAppToast from "../../../hooks/useAppToast";

const ReadAssociate: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const associateId = id ? parseInt(id, 10) : null;

  const [associate, setAssociate] = useState<IAssociateList | null>(null);
  const [relatives, setRelatives] = useState<IRelativeList[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingRelatives, setLoadingRelatives] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [relativeError, setRelativeError] = useState<string | null>(null);
  const { showErrorToast, showSuccessToast, showInfoToast, showWarningToast } =
    useAppToast();

  const mapGender = (genderCode?: string) => {
    switch (genderCode) {
      case "M":
        return "Masculino";
      case "F":
        return "Femenino";
      default:
        return "No especificado";
    }
  };

  const mapActiveStatus = (isActive: boolean) => {
    return isActive ? "Activo" : "Inactivo";
  };

  const fetchRelatives = useCallback(async () => {
    if (associateId === null) {
      setRelativeError(
        "ID de asociado no proporcionado para cargar familiares."
      );
      showErrorToast({
        title: "Error",
        message: "ID de asociado no proporcionado para cargar familiares.",
      });
      return;
    }
    setLoadingRelatives(true);
    setRelativeError(null);
    try {
      const data = await apiMutual.GetRelativesByAssociateId(associateId);
      setRelatives(data);
    } catch (err: any) {
      console.error("Error al cargar familiares:", err);
      const msg =
        err.response?.data?.mensaje || "No se pudieron cargar los familiares.";
      setRelativeError(msg);
      showErrorToast({
        title: "Error",
        message: msg,
      });
    } finally {
      setLoadingRelatives(false);
    }
  }, [associateId]);

  // Cargar detalles del asociado y los familiares
  useEffect(() => {
    const fetchAssociateAndRelatives = async () => {
      if (associateId === null) {
        setError("ID de asociado no proporcionado.");
        showErrorToast({
          title: "Error",
          message: "ID de asociado no proporcionado.",
        });
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        // Cargar datos del asociado
        const associateData = await apiMutual.GetAssociateById(associateId);
        setAssociate(associateData);

        // Cargar familiares
        await fetchRelatives();
      } catch (err: any) {
        console.error(
          "Error al cargar detalles del asociado o familiares:",
          err
        );
        const msg =
          err.response?.data?.mensaje ||
          "No se pudo cargar la información del asociado o sus familiares.";
        setError(msg);
        showErrorToast({
          title: "Error",
          message: msg,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAssociateAndRelatives();
  }, [associateId, fetchRelatives]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} loans={[]} />

        <div className="flex flex-col items-start py-8 flex-1 px-4 sm:px-6 lg:px-8 w-full max-w-5xl mx-auto">
          <div className="flex justify-start mb-6 w-full">
            <button
              onClick={() => navigate("/asociados")}
              className="text-gray-600 hover:text-gray-800 flex items-center"
              aria-label="Volver a Usuarios"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="ml-1">Volver</span>
            </button>
          </div>
          <h2 className="text-2xl font-bold text-left mb-6 text-blue-900 w-full">
            Datos del Asociado
          </h2>
          <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                Cargando datos del asociado...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : associate ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Apellido y Nombre Legal
                    </label>
                    <input
                      type="text"
                      value={associate.legalName}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      N° Documento (DNI)
                    </label>
                    <input
                      type="text"
                      value={associate.dni}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado Civil
                    </label>
                    <input
                      type="text"
                      value={associate.civilStatus || "No especificado"}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Género
                    </label>
                    <input
                      type="text"
                      value={mapGender(associate.gender)}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="text"
                      value={
                        associate.birthDate
                          ? new Date(associate.birthDate).toLocaleDateString()
                          : "N/A"
                      }
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Afiliación
                    </label>
                    <input
                      type="text"
                      value={
                        associate.affiliationDate
                          ? new Date(
                              associate.affiliationDate
                            ).toLocaleDateString()
                          : "N/A"
                      }
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <input
                      type="text"
                      value={mapActiveStatus(associate.active)}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Organismo
                    </label>
                    <input
                      type="text"
                      value={associate.organization}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    <input
                      type="text"
                      value={associate.address}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección Laboral
                    </label>
                    <input
                      type="text"
                      value={associate.workAddress}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={associate.city}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Provincia
                    </label>
                    <input
                      type="text"
                      value={associate.province}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={associate.phone || "N/A"}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={associate.email || "N/A"}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CBU
                    </label>
                    <input
                      type="text"
                      value={associate.cbu}
                      disabled
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    />
                  </div>
                </div>

                {/* tabla de familiares asociados */}
                <AssociateRelativesTable
                  associateId={associateId}
                  relatives={relatives}
                  loadingRelatives={loadingRelatives}
                  relativeError={relativeError}
                  onRelativesUpdated={fetchRelatives}
                />

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/asociados")}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-full"
                  >
                    Volver
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadAssociate;
