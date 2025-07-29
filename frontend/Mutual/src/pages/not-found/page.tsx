import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 relative">
      <img
        src="/assets/plane-mutual.png"
        alt="plane"
        className="object-cover w-full h-full rounded-l-lg absolute top-0 left-0 opacity-10 pointer-events-none"
        style={{ zIndex: 0 }}
      />
      <div className="flex flex-col items-center justify-center z-10 relative">
        <img
          src="/assets/logo-mutual.png"
          alt="Logo Mutual"
          className="h-32 w-32 object-contain mb-8"
        />
        <h1 className="text-7xl font-extrabold text-blue-900 mb-4 text-center">ERROR 404</h1>
        <p className="text-2xl text-gray-700 mb-8 text-center font-semibold">Esta página no existe.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-xl font-bold text-xl"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default NotFound;
