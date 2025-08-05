import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiMutual } from "../../api/apiMutual";
import useAppToast from "../../hooks/useAppToast";
import TermsModal from "../../components/ui/auth/modalTermsAndConditions";
import PrivacyModal from "../../components/ui/auth/modalPrivacyPolitics";

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

const getUserAcceptanceKey = (username: string, type: "terms" | "privacy") => {
  return `${username}_${type}_accepted`;
};

const checkUserAcceptance = (username: string, type: "terms" | "privacy") => {
  return localStorage.getItem(getUserAcceptanceKey(username, type)) === "true";
};
const saveUserAcceptance = (username: string, type: "terms" | "privacy") => {
  localStorage.setItem(getUserAcceptanceKey(username, type), "true");
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showForgotPassModal, setShowForgotPassModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const toast = useAppToast();
  const location = useLocation();

  useEffect(() => {
    // estado pasado desde ProtectedRoute
    if (location.state?.tokenExpired) {
      setErrorMessage(
        "Tu sesión ha expirado, por favor inicia sesión nuevamente."
      );
      // Limpiamos el estado despues de mostrar  msj
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await apiMutual.Login(username, password);

      const token = response as string;

      sessionStorage.setItem("token", response);
      sessionStorage.setItem("username", username);

      const payload = parseJwt(response);

      if (payload && payload.role) {
        sessionStorage.setItem("userRole", payload.role);
      }
      if (payload && payload.username) {
        sessionStorage.setItem("username", payload.username);
      }

      navigate("/dashboard");
      window.location.reload();
    } catch (err: any) {
      let errorMsg = "Error desconocido";

      if (
        err.response &&
        err.response.data &&
        (err.response.data.message || err.response.data.mensaje)
      ) {
        errorMsg = err.response.data.message || err.response.data.mensaje;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Imagen izquierda */}
      <div className="w-1/2 hidden lg:block">
        <img
          src="/assets/plane-mutual.png"
          alt="plane"
          className="object-cover w-full h-full rounded-l-lg"
        />
      </div>

      {/* Formulario derecha */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#0a1b3d] px-8 py-12 text-white">
        {/* Logo */}
        <img
          src="/assets/logo-mutual.png"
          alt="Logo Mutual"
          className="w-24 mb-6"
        />

        <h1 className="text-3xl font-bold mb-2">Inicio de sesión</h1>
        <p className="text-sm mb-8">portal mutual 17 de Junio</p>

        {/* Card blanca */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-black">
          {errorMessage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}

          {/* Elimina el div de error */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none"
                required
              />
            </div>

            {/* Checkbox de aceptación */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptTerms"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mr-2"
                required
              />
              <label htmlFor="acceptTerms" className="text-sm">
                Acepto los{" "}
                <button
                  type="button"
                  className="underline text-blue-600 hover:text-blue-800"
                  onClick={() => setShowTermsModal(true)}
                >
                  Términos y Condiciones
                </button>{" "}
                y la{" "}
                <button
                  type="button"
                  className="underline text-blue-600 hover:text-blue-800"
                  onClick={() => setShowPrivacyModal(true)}
                >
                  Política de Privacidad
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !acceptedTerms}
              className={`w-full ${
                loading || !acceptedTerms
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-400 hover:bg-blue-500"
              } text-white py-2 rounded-full font-semibold transition`}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="mt-4 flex flex-col items-center space-y-2">
            <button
              type="button"
              onClick={() => setShowForgotPassModal(true)}
              className="text-blue-600 hover:underline text-sm bg-transparent border-none p-0"
              style={{ background: "none" }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-gray-400 text-center">
          <button
            onClick={() => setShowTermsModal(true)}
            className="underline mr-4 hover:text-gray-300"
          >
            Términos y Condiciones
          </button>
          <button
            onClick={() => setShowPrivacyModal(true)}
            className="underline hover:text-gray-300"
          >
            Política de Privacidad
          </button>
          <p className="mt-2">
            Todos los derechos reservados © 2025 Mutual 17 de Junio
          </p>
        </div>
      </div>

      {/* Modal de contacto admin para reseteo de pass */}
      {showForgotPassModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-4 text-red-700">Advertencia</h3>
            <p className="mb-6 text-gray-700">
              Para recuperar tu contraseña, por favor contacta al administrador
              del sistema o revisa tu correo institucional para instrucciones.
            </p>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
              onClick={() => setShowForgotPassModal(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* importacion de modales */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => {
          saveUserAcceptance(username, "terms");
          setShowTermsModal(false);
        }}
      />

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onAccept={() => {
          saveUserAcceptance(username, "privacy");
          setShowPrivacyModal(false);
        }}
      />
    </div>
  );
};

export default Login;
