import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Proveedores from "./pages/modules/suppliers/Suppliers";
import Asociados from "./pages/modules/members/Members";
import CreateMember from "./pages/modules/members/createMember";
import EditMember from "./pages/modules/members/editMember";
import DeleteMember from "./pages/modules/members/deleteMember";
import ReadMember from "./pages/modules/members/readMember";


const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />

        {/* Rutas privadas */}
        
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/proveedores" element={<Proveedores />} />
            <Route path="/asociados" element={<Asociados />} />
            <Route path="/asociados/crear" element={<CreateMember />} />
            <Route path="/asociados/editar" element={<EditMember />} />
            <Route path="/asociados/eliminar" element={<DeleteMember/>} />
            <Route path="/asociados/detalle" element={<ReadMember/>} />

            <Route path="/proveedores/ordenes/nueva" element={<Proveedores showOrderForm={true} />} />

        
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
       
      </Routes>
    </Router>
  );
};

export default AppRouter;
