import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email) {
      setError("El correo electrónico es obligatorio");
      return;
    }

    try {
      // tu llamada real a la API:
      // await forgotPasswordApi(email);
      setMessage(
        "Si existe una cuenta con ese correo, recibirás un enlace para restablecer la contraseña."
      );
      setEmail("");
    } catch {
      setError("Ocurrió un error al intentar recuperar la contraseña.");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Imagen a la izquierda */}
      <div className="w-1/2 hidden lg:block">
        <img
          src="/assets/plane-mutual.png"
          alt="plane"
          className="object-cover w-full h-full rounded-l-lg"
        />
      </div>

      {/* Formulario a la derecha */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-[#0a1b3d] px-8 py-12 text-white">
        {/* Logo */}
        <img
          src="/assets/logo-mutual.png"
          alt="Logo Mutual"
          className="w-24 mb-6"
        />

        <h1 className="text-3xl font-bold mb-2">Recupero de contraseña</h1>
        <p className="text-sm mb-8">portal mutual 17 de Junio</p>

        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 text-black">
          {message && (
            <div className="text-green-600 mb-4 text-sm">{message}</div>
          )}
          {error && (
            <div className="text-red-500 mb-4 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@ejemplo.com"
                className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-full font-semibold transition"
            >
              Enviar enlace de recuperación
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <a
              href="/auth/login"
              className="text-blue-600 hover:underline"
            >
              Volver al login
            </a>
          </div>
        </div>

        {/* Terms / Policy */}
        <div className="mt-8 text-xs text-gray-400 text-center">
          <a href="/terms" className="underline mr-4">
            Terms of Use
          </a>
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          <p className="mt-2">
            Todos los derechos reservados © 2025 Mutual 17 de Junio
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
