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
import ReadAccountingPeriod from "./pages/modules/reports-periods/accounting-periods/readAccountingPeriod";
import AccountingPeriods from "./pages/modules/reports-periods/accounting-periods/listAccountingPeriods";
import PaymentMethodsCollection from "./pages/modules/collections/paymentMethodsCollection";
import NotFound from "./pages/not-found/page";
import NotAuthorized from "./pages/unauthorized/page";
import ProtectedRoute from "./components/protectedRoutes";
import { Role, ROLES } from "./helper/config";

const AppRouter: React.FC = () => {
  const userName = sessionStorage.getItem("username");
  const userRole = sessionStorage.getItem("userRole");

  return (
    <Router>
      <Routes>
        {/* Rutas publicas */}
        <Route path="/auth/login" element={<Login />} />

        {/* Rutas privadas */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
            >
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* seccion proveedores- ACCESO ADMIN Y GESTOR */}
        <Route
          path="/proveedores"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <AllSuppliers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proveedores/crear"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <CreateSupplier />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proveedores/editar/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <EditSupplier />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proveedores/desactivar/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <DeleteSupplier />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proveedores/tipos-servicio"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <ServiceTypeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proveedores/metodos-pago"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <PaymentMethods />
            </ProtectedRoute>
          }
        />

        {/* Seccion proveedores - servicios- ACCESO ADMIN Y GESTOR */}
        <Route
          path="/proveedores/servicios"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <AllServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proveedores/servicios/crear/"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <CreateService />
            </ProtectedRoute>
          }
        />

        <Route
          path="/proveedores/servicios/editar/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <EditService />
            </ProtectedRoute>
          }
        />

        {/*<Route path="/proveedores/servicios/ver/:id" element={<ReadService />} />*/}
        {/* <Route
          path="/proveedores/servicios/ver/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <ReadService />
            </ProtectedRoute>
          }
        /> */}

        {/* Seccion asociados - ACCESO ADMIN Y GESTOR*/}
        <Route
          path="/asociados"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <Associates />
            </ProtectedRoute>
          }
        />

        <Route
          path="/asociados/crear"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <CreateAssociate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/asociados/editar/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <EditAssociate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/asociados/eliminar/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <DeleteAssociate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/asociados/reactivar/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <ReactivateAssociate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/asociados/detalle/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <ReadAssociate />
            </ProtectedRoute>
          }
        />

        {/* Seccion asociados-familiares GESTOR Y ADMIN */}

        <Route
          path="/asociados/crear/familiar/:associateId"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <CreateAssociateRelative />
            </ProtectedRoute>
          }
        />

        <Route
          path="/asociados/:associateId/familiar/editar/:relativeId"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <EditRelativeAssociate />
            </ProtectedRoute>
          }
        />

        {/* seccion usuarios -- SOLO ACCESO ADMIN*/}
        <Route
          path="/usuarios"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR]}
            >
              <UsersTable />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios/crear"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR]}
            >
              <CreateUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios/editar/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR]}
            >
              <EditUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios/eliminar/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR]}
            >
              <DeleteUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios/reactivar/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR]}
            >
              <ReactivateUser />
            </ProtectedRoute>
          }
        />

        <Route
          path="/usuarios/detalle/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR]}
            >
              <ReadUser />
            </ProtectedRoute>
          }
        />

        {/* seccion auditoria-- SOLO ACCESO ADMIN */}
        <Route
          path="/auditoria"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR]}
            >
              <AuditTable />
            </ProtectedRoute>
          }
        />

        {/* seccion prestamos -- ACCESO ADMIN Y GESTOR*/}
        <Route
          path="/prestamos"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.ADMINISTRADOR, ROLES.GESTOR]}
            >
              <Loans />
            </ProtectedRoute>
          }
        />

        {/* SOLO EL GESTOR PUEDE SOLICITAR PRESTAMOS */}
        <Route
          path="/prestamos/solicitar"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.GESTOR]}
            >
              <RequestLoan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prestamos/detalle/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.GESTOR, ROLES.ADMINISTRADOR]}
            >
              <ReadLoan />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prestamos/tipo/crear"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.GESTOR, ROLES.ADMINISTRADOR]}
            >
              <CreateLoan />
            </ProtectedRoute>
          }
        />

        {/* Rutas de cobros */}
        <Route
          path="/cobros"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.GESTOR, ROLES.ADMINISTRADOR]}
            >
              <Collection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cobros/registrar"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.GESTOR, ROLES.ADMINISTRADOR]}
            >
              <RegisterCollection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/collections/payment-methods"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[ROLES.GESTOR, ROLES.ADMINISTRADOR]}
            >
              <PaymentMethodsCollection />
            </ProtectedRoute>
          }
        />

        {/* seccion reportes y periodos - ACCESO CONSULTOR-ADMIN-GESTOR*/}

        <Route
          path="/periodos"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[
                ROLES.GESTOR,
                ROLES.ADMINISTRADOR,
                ROLES.CONSULTOR,
              ]}
            >
              <AccountingPeriods />
            </ProtectedRoute>
          }
        />

        <Route
          path="/periodos/detalle/:id"
          element={
            <ProtectedRoute
              user={{ username: userName, role: userRole as Role }}
              authorizedRoles={[
                ROLES.GESTOR,
                ROLES.ADMINISTRADOR,
                ROLES.CONSULTOR,
              ]}
            >
              <ReadAccountingPeriod />
            </ProtectedRoute>
          }
        />

        {/* Redirecciónes por defecto */}
        {/* inicio */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        {/* acceso no autorizado */}
        <Route path="/unauthorized" element={<NotAuthorized />} />
        {/* ruta no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
