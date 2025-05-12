import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./features/auth/auth/Login";
import Dashboard from "./features/auth/auth/dashboard/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <div className="bg-blue-500 text-white p-4 text-center">
          Maquetado Login Mutual 17 de Junio
        </div>
        <Routes>
          {/* Ruta para el Login */}
          <Route path="/" element={<Login />} />
          {/* Ruta para el Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;