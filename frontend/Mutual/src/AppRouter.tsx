import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/dashboard/Dashboard";

import AllServices from "./pages/modules/suppliers/allServices";
import CreateSupplier from "./pages/modules/suppliers/createSupplier";
import CreateService from "./pages/modules/suppliers/createService";
import EditService from "./pages/modules/suppliers/editService";
import EditSupplier from "./pages/modules/suppliers/editSuppliers";
import DeleteSupplier from "./pages/modules/suppliers/deleteSupplier";
import ServiceTypeList from "./pages/modules/suppliers/serviceType";
import PaymentMethods from "./pages/modules/suppliers/paymentMethods";
import UsersTable from "./pages/modules/users/users";
import CreateUser from "./pages/modules/users/createUser";
import EditUser from "./pages/modules/users/editUser";
import ReadUser from "./pages/modules/users/readUser";
import DeleteUser from "./pages/modules/users/deleteUser";
import ReactivateUser from "./pages/modules/users/reactivateUser";
import CreateAssociate from "./pages/modules/associates/createAssociate";
import EditAssociate from "./pages/modules/associates/editAssociate";
import DeleteAssociate from "./pages/modules/associates/deleteAssociate";
import ReadAssociate from "./pages/modules/associates/readAssociate";
import Associates from "./pages/modules/associates/ListAssociates";
import AuditTable from "./pages/modules/audit/audit";
import ReactivateAssociate from "./pages/modules/associates/reactivateAssociate";
import CreateAssociateRelative from "./pages/modules/associates/relatives/createRelativeAssociate";
import EditRelativeAssociate from "./pages/modules/associates/relatives/editRelativeAssociate";
import AllSuppliers from "./pages/modules/suppliers/allSuppliers";
import Loans from "./pages/modules/loans/listLoans";
import RequestLoan from "./pages/modules/loans/requestLoan";
import CreateLoan from "./pages/modules/loans/loanTypes/createLoanType";
import ReadLoan from "./pages/modules/loans/readLoan";
import Collection from "./pages/modules/collections/Collections";
import RegisterCollection from "./pages/modules/collections/RegisterCollection";
import AccountingPeriods from "./pages/modules/reports-periods/listAccountingPeriods";
import ReadAccountingPeriod from "./pages/modules/reports-periods/readAccountingPeriod";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/auth/login" element={<Login />} />

        {/* Rutas privadas */}

        <Route path="/dashboard" element={<Dashboard />} />

        {/* seccion proveedores */}
        <Route path="/proveedores" element={<AllSuppliers />} />
        <Route path="/proveedores/crear" element={<CreateSupplier />} />
        <Route path="/proveedores/editar/:id" element={<EditSupplier />} />
        <Route
          path="/proveedores/desactivar/:id"
          element={<DeleteSupplier />}
        />
        <Route
          path="/proveedores/tipos-servicio"
          element={<ServiceTypeList />}
        />
        <Route path="/proveedores/metodos-pago" element={<PaymentMethods />} />

        {/* Seccion proveedores - servicios */}
        <Route path="/proveedores/servicios" element={<AllServices />} />
        <Route
          path="/proveedores/servicios/crear/"
          element={<CreateService />}
        />
        <Route
          path="/proveedores/servicios/editar/:id"
          element={<EditService />}
        />
        {/*<Route path="/proveedores/servicios/ver/:id" element={<ReadService />} />*/}

        {/* Seccion asociados */}
        <Route path="/asociados" element={<Associates />} />
        <Route path="/asociados/crear" element={<CreateAssociate />} />
        <Route path="/asociados/editar/:id" element={<EditAssociate />} />
        <Route path="/asociados/eliminar/:id" element={<DeleteAssociate />} />
        <Route
          path="/asociados/reactivar/:id"
          element={<ReactivateAssociate />}
        />
        <Route path="/asociados/detalle/:id" element={<ReadAssociate />} />

        {/* Seccion asociados-familiares Gestor */}
        <Route
          path="/asociados/crear/familiar/:associateId"
          element={<CreateAssociateRelative />}
        />
        <Route
          path="/asociados/:associateId/familiar/editar/:relativeId"
          element={<EditRelativeAssociate />}
        />

        {/* seccion usuarios -- ADMIN ONLY*/}
        <Route path="/usuarios" element={<UsersTable />} />
        <Route path="/usuarios/crear" element={<CreateUser />} />
        <Route path="/usuarios/editar/:id" element={<EditUser />} />
        <Route path="/usuarios/eliminar/:id" element={<DeleteUser />} />
        <Route path="/usuarios/reactivar/:id" element={<ReactivateUser />} />
        <Route path="/usuarios/detalle/:id" element={<ReadUser />} />

        {/* seccion auditoria-- ADMIN ONLY */}
        <Route path="/auditoria" element={<AuditTable />} />

        {/* seccion prestamos Admin y Gestor*/}
        <Route path="/prestamos" element={<Loans />} />
        <Route path="/prestamos/solicitar" element={<RequestLoan />} />
        <Route path="/prestamos/detalle/:id" element={<ReadLoan />} />
        <Route path="/prestamos/tipo/crear" element={<CreateLoan />} />

        {/* Rutas de cobros */}
        <Route path="/cobros" element={<Collection />} />
        <Route path="/cobros/registrar" element={<RegisterCollection />} />

        {/* seccion reportes y normativas */}
        <Route path="/periodos" element={<AccountingPeriods />} />
        <Route path="/periodos/detalle/:id" element={<ReadAccountingPeriod />} />



        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
