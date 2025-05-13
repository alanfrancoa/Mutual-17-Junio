import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* Rutas privadas */}
        
            <Route path="/dashboard" element={<Dashboard />} />
            {/*Poner aca demas rutas que necesiten auth, modulos,etc. */}
        
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
       
      </Routes>
    </Router>
  );
};

export default AppRouter;
