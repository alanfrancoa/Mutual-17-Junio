import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

import Suppliers from "./pages/modules/suppliers/Suppliers";
import CreateSupplier from "./pages/modules/suppliers/createSupplier";
import CreateOrder from "./pages/modules/suppliers/createOrder";
import EditSupplier from "./pages/modules/suppliers/editSuppliers";
import DeleteSupplier from "./pages/modules/suppliers/editSuppliers";
import Asociados from "./pages/modules/members/Members";
import CreateMember from "./pages/modules/members/createMember";
import EditMember from "./pages/modules/members/editMember";
import DeleteMember from "./pages/modules/members/deleteMember";
import ReadMember from "./pages/modules/members/readMember";
import UsersTable from "./pages/modules/users/users";
import CreateUser from "./pages/modules/users/createUser";
import EditUser from "./pages/modules/users/editUser";
import ReadUser from "./pages/modules/users/readUser";
import DeleteUser from "./pages/modules/users/deleteUser";
import ReactivateUser from "./pages/modules/users/reactivateUser";

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
        <Route path="/proveedores/nuevo" element={<CreateSupplier />} />      
        <Route path="/proveedores/editar" element={<EditSupplier />} />
        <Route path="/proveedores/eliminar" element={<DeleteSupplier />} />
        {/*<Route path="/proveedores/detalle" element={<ReadSupplier />} />*/}
        <Route path="/proveedores/nueva-orden" element={<CreateOrder />} />

        {/* Seccion asociados */}
        <Route path="/asociados" element={<Asociados />} />
        <Route path="/asociados/crear" element={<CreateMember />} />
        <Route path="/asociados/editar/:id" element={<EditMember />} />
        <Route path="/asociados/eliminar/:id" element={<DeleteMember />} />
        <Route path="/asociados/detalle/:id" element={<ReadMember />} />

        {/* seccion usuarios */}
        <Route path="/usuarios" element={<UsersTable />} />
        <Route path="/usuarios/crear" element={<CreateUser />} />
        <Route path="/usuarios/editar/:id" element={<EditUser />} />
        <Route path="/usuarios/eliminar/:id" element={<DeleteUser />} />
        <Route path="/usuarios/reactivar/:id" element={<ReactivateUser />} />
        <Route path="/usuarios/detalle/:id" element={<ReadUser />} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
