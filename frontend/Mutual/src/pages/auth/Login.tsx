import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica de login 
    console.log({ email, password });
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
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Usuario</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="xxxxx@gmail.com"
                className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="xxxxxxxxx"
                className="w-full px-4 py-2 border border-gray-400 rounded focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-full font-semibold transition"
            >
              Iniciar sesión
            </button>
          </form>

            <div className="mt-4 flex flex-col items-center space-y-2">
            <a
              href="/auth/forgot-password"
              className="text-blue-600 hover:underline text-sm"
            >
              ¿Olvidaste tu contraseña?
            </a>
            <button
              type="button"
              onClick={() => (window.location.href = "/dashboard")}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full font-semibold transition"
            >
              Ir al Dashboard
            </button>
            </div>
        </div>

        {/* Footer */}
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

export default Login;
