import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

import Suppliers from "./pages/modules/suppliers/Suppliers";
import NewSupplier from "./pages/modules/suppliers/NewSupplier";
import Asociados from "./pages/modules/members/Members";
import CreateMember from "./pages/modules/members/createMember";
import EditMember from "./pages/modules/members/editMember";
import DeleteMember from "./pages/modules/members/deleteMember";
import ReadMember from "./pages/modules/members/readMember";
import UsersTable from "./pages/modules/user/users";
import CreateUser from "./pages/modules/user/createUser";
import EditUser from "./pages/modules/user/editUser";
import ReadUser from "./pages/modules/user/readUser";
import DeleteUser from "./pages/modules/user/deleteUser";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/auth/login" element={<Login />} />

        {/* Rutas privadas */}

        <Route path="/dashboard" element={<Dashboard />} />

        {/* seccion provedores */}
        <Route path="/proveedores" element={<Suppliers />} />
        <Route path="/proveedores/ordenes/nueva" element={<Suppliers showOrderForm={true} />} />
        <Route path="/proveedores/nuevo" element={<NewSupplier />} />
        {/*<Route path="/proveedores/editar" element={<NewSupplier />} />
        <Route path="/proveedores/eliminar" element={<NewSupplier />} />
        <Route path="/proveedores/detalle" element={<NewSupplier />} />*/}

        {/* Seccion asociados */}
        <Route path="/asociados" element={<Asociados />} />
        <Route path="/asociados/crear" element={<CreateMember />} />
        <Route path="/asociados/editar" element={<EditMember />} />
        <Route path="/asociados/eliminar" element={<DeleteMember />} />
        <Route path="/asociados/detalle" element={<ReadMember />} />

        {/* seccion usuarios */}
        <Route path="/usuarios" element={<UsersTable />} />
        <Route path="/usuarios/crear" element={<CreateUser />} />
        <Route path="/usuarios/editar" element={<EditUser />} />
        <Route path="/usuarios/eliminar" element={<DeleteUser />} />
        <Route path="/usuarios/detalle" element={<ReadUser />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
