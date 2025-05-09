import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Iniciar Sesión
        </h1>
        <form className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Usuario</label>
            <input
              type="text"
              placeholder="tu.usuario@ejemplo.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-4">
          ¿Olvidaste tu contraseña?{' '}
          <a href=" " className="text-blue-600 hover:underline"> Recuperar </a>
          
        </p>
      </div>
    </div>
  );
};

export default Login;
