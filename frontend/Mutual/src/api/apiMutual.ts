import Fetcher from "../helper/fetcher";
import { AuditLog } from "../types/auditLog";
import { IAssociateRegister } from "../types/associates/IAssociateRegister";
import { ILoginData } from "../types/loginData";
import { IAssociateList } from "../types/associates/IAssociateList";
import { ILoginResponse } from "../types/loginResponse";
import { User } from "../types/user";
import {
  IRelativeList,
  IRelativeRegister,
  IRelativeUpdate,
} from "../types/associates/IRelative";
import { ISupplierList } from "../types/ISupplierList";
import { ISupplierRegister } from "../types/ISupplierRegister";
import { IServiceRegister } from "../types/IServiceRegister";
import { IServiceType } from "../types/IServiceType";
import {
  ICollection,
  ICollectionMethod,
  ICollectionDetail,
} from "../types/ICollection";
import {
  IOverdueInstallment
} from "../types/IInstallment";
import { ILoanTypesList } from "../types/loans/ILoanTypesList";
import { ILoanList } from "../types/loans/ILoanList";
import { ILoanCreate } from "../types/loans/ILoanCreate";
import { ICreateLoanTypes } from "../types/loans/ILoanTypes";
import { ILoanUpdate } from "../types/loans/ILoanUpdate";
import { IInstallmentInfo, ILoanDetails } from "../types/loans/ILoan";
import { IAccountingPeriodResponse } from "../types/accountablePeriods/IAccountingPeriodResponse";
import { ICreateAccountingPeriod } from "../types/accountablePeriods/ICreateAccountingPeriod";
import {
  IAccountingPeriod,
  PeriodType,
} from "../types/accountablePeriods/IAccountingPeriod";
import { IAccountingPeriodList } from "../types/accountablePeriods/IAccountingPeriodList";

/* -----------------------Llamadas API----------------------- */

/* -----------------------Mod. AUTH login usuarios---------------------- */
export const apiMutual = {
  Login: async (username: string, password: string): Promise<string> => {
    const url = `https://localhost:7256/api/login`;

    const response = await Fetcher.post(
      url,
      {
        Username: username,
        PasswordHash: password,
      } as ILoginData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      }
    );
    const { token } = response.data as ILoginResponse;
    sessionStorage.setItem("token", token);

    //axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    return token;
  },
  /* -----------------------Modulo usuarios---------------------- */

  /* ----------------------- 1. Crear Usuarios ----------------------- */

  CreateUser: async (
    user: string,
    password: string,
    confirmPassword: string,
    role: string
  ): Promise<any> => {
    const url = `https://localhost:7256/api/users`;
    const response = await Fetcher.post(
      url,
      {
        Username: user,
        PasswordHash: password,
        ConfirmPassword: confirmPassword,
        Role: role,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
      }
    );
    return response.data;
  },

  /* ----------------------- 2. Listar Usuarios ----------------------- */
  GetUsers: async (): Promise<User[]> => {
    const url = `https://localhost:7256/api/users`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as User[];
  },

  /* ----------------------- 3. Detalle Usuarios ----------------------- */

  GetUserById: async (id: number): Promise<User> => {
    const url = `https://localhost:7256/api/users/${id}`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as User;
  },

  /* ----------------------- 4. Baja Usuarios ----------------------- */

  DeleteUser: async (id: number): Promise<any> => {
    const url = `https://localhost:7256/api/users/${id}/state`;
    const response = await Fetcher.put(
      url,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
      }
    );
    return response.data;
  },

  /* ----------------------- 5. Reactivar alta Usuarios ----------------------- */

  ReactivateUser: async (id: number): Promise<void> => {
    const url = `https://localhost:7256/api/users/${id}/reactivate`;
    await Fetcher.put(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
  },
  /* ----------------------- 6. Actualizar Usuarios ----------------------- */

  EditUser: async (
    id: number,
    user: string,
    Newpassword: string | null,
    role: string
  ): Promise<any> => {
    const url = `https://localhost:7256/api/users/${id}`;
    const response = await Fetcher.put(
      url,
      {
        id: id,
        Username: user,
        NewPassword: Newpassword,
        Role: role,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
      }
    );
    return response.data;
  },

  /* -----------------------Modulo Auditoria---------------------- */

  /* ----------------------- 1. Listar registros de auditoria ----------------------- */
  GetAuditLogs: async (): Promise<AuditLog[]> => {
    const url = `https://localhost:7256/api/audits-logs`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });

    return response.data as AuditLog[];
  },

  /* ----------------------- 2. Filtrar registros de auditoria por entidad ----------------------- */
  GetAuditLogsByEntityType: async (entityType: string): Promise<AuditLog[]> => {
    const url = `https://localhost:7256/api/audits-logs/${entityType}`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });

    return response.data as AuditLog[];
  },

  /* ----------------------- Modulo Asociados ---------------------- */

  /* ----------------------- 1. Registrar Asociado ----------------------- */
  RegisterAssociate: async (
    associateData: IAssociateRegister
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/associates`;
    const response = await Fetcher.post(url, associateData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as { mensaje: string };
  },

  /* ----------------------- 2. Obtener lista de Asociados ----------------------- */
  GetAllAssociates: async (): Promise<IAssociateList[]> => {
    const url = `https://localhost:7256/api/associates`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as IAssociateList[];
  },

  /* ----------------------- 3. Obtener Asociado por ID ----------------------- */
  GetAssociateById: async (id: number): Promise<IAssociateList> => {
    const url = `https://localhost:7256/api/associates/${id}`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as IAssociateList;
  },

  /* ----------------------- 4. Obtener Asociado por DNI ----------------------- */
  GetAssociateByDni: async (dni: string): Promise<IAssociateList> => {
    const url = `https://localhost:7256/api/associates/dni/${dni}`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as IAssociateList;
  },

  /* ----------------------- 5. Actualizar Asociado ----------------------- */
  UpdateAssociate: async (
    id: number,
    associateData: IAssociateRegister
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/associates/${id}`;
    const response = await Fetcher.put(url, associateData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as { mensaje: string };
  },

  /* ----------------------- 6. Cambiar Estado del Asociado (Activo/Inactivo) ----------------------- */
  ChangeAssociateStatus: async (
    id: number,
    newStatus: boolean
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/associates/${id}/state`;
    console.log(url);
    console.log(newStatus);

    const response = await Fetcher.patch(url, newStatus, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    console.log(response);
    return response.data as { mensaje: string };
  },

  /* ----------------------- MODULO ASOCIADOS FAMILIARES ----------------------- */

  /* ----------------------- 1. Crear familiar del Asociado ----------------------- */
  CreateRelativeAssociate: async (
    associateId: number,
    relativeData: IRelativeRegister
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/asociate/${associateId}/relative`;
    const response = await Fetcher.post(url, relativeData);
    return response.data as { mensaje: string };
  },

  /* ----------------------- 2. Obtener familiar del Asociado/ tabla familiares ----------------------- */
  GetRelativesByAssociateId: async (
    associateId: number
  ): Promise<IRelativeList[]> => {
    const url = `https://localhost:7256/api/asociate/${associateId}/relative`;
    const response = await Fetcher.get(url);
    return response.data as IRelativeList[];
  },

  /* ----------------------- 3. Actualizar familiar del Asociado ----------------------- */
  UpdateRelative: async (
    relativeId: number,
    relativeData: IRelativeUpdate
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/relative/${relativeId}`;
    const response = await Fetcher.put(url, relativeData);
    return response.data as { mensaje: string };
  },

  /* ----------------------- 3. Baja-reactivar familiar del Asociado ----------------------- */
  ChangeRelativeStatus: async (
    relativeId: number,
    newStatus: boolean
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/relative/${relativeId}/status`;
    const response = await Fetcher.patch(url, newStatus, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as { mensaje: string };
  },

  /* -----------------------Modulo proveedores---------------------- */
  /* ----------------------- 1. Registrar Proveedor ----------------------- */
  RegisterSupplier: async (
    supplierData: ISupplierRegister
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/suppliers`;
    const response = await Fetcher.post(url, supplierData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      // Si Fetcher devuelve un status de error
      const data = response.data as { mensaje?: string };
      throw new Error(data?.mensaje || "No se pudo registrar el proveedor");
    }
    return response.data as { mensaje: string };
  },
  /* ----------------------- 2. Obtener lista de Proveedores ----------------------- */
  GetAllSuppliers: async (): Promise<any[]> => {
    const url = "https://localhost:7256/api/suppliers";
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const data = response.data as { mensaje?: string };
      throw new Error(
        data?.mensaje || "No se pudieron obtener los proveedores"
      );
    }
    return response.data as any[];
  },
  /* ----------------------- 3. Obtener Proveedor por ID ----------------------- */

  GetSupplierById: async (id: number): Promise<ISupplierList> => {
    const url = `https://localhost:7256/api/suppliers/${id}`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as ISupplierList;
  },

  /* ----------------------- 4. Editar Proveedor ----------------------- */

  UpdateSupplier: async (
    supplierId: number,
    supplierData: ISupplierRegister
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/suppliers/${supplierId}`;
    const response = await Fetcher.put(url, supplierData);
    return response.data as { mensaje: string };
  },

  /* ----------------------- 5. Cambiar Estado del Proveedor (Activo/Inactivo) ----------------------- */
  ChangeSupplierStatus: async (
    supplierId: number,
    newStatus: boolean
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/suppliers/${supplierId}/status`;
    const response = await Fetcher.patch(url, JSON.stringify(newStatus), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as { mensaje: string };
  },
  /* ----------------------- Crear tipos de servicio ----------------------- */

  /* ----------------------- Crear tipo de servicio ----------------------- */
  RegisterServiceType: async (
    code: string,
    name: string
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/services-type`;
    const response = await Fetcher.post(
      url,
      { Code: code, Name: name },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
      }
    );
    if (response.status && response.status >= 400) {
      const data = response.data as { mensaje?: string };
      throw new Error(
        data?.mensaje || "No se pudo registrar el tipo de servicio"
      );
    }
    return response.data as { mensaje: string };
  },
  /* ----------------------- Obtener tipos de servicio ----------------------- */

  GetServiceTypes: async (): Promise<IServiceType[]> => {
    const url = "https://localhost:7256/api/services-type";
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const data = response.data as { mensaje?: string };
      throw new Error(
        data?.mensaje || "No se pudieron obtener los tipos de servicio"
      );
    }
    return response.data as IServiceType[];
  },

  /* ----------------------- Cambiar estado del tipo de servicio ----------------------- */
  ServiceTypeState: async (
    id: number,
    newStatus: boolean
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/services-type/${id}/status`;
    const response = await Fetcher.patch(url, JSON.stringify(newStatus), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const data = response.data as { mensaje?: string };
      throw new Error(
        data?.mensaje || "No se pudo cambiar el estado del tipo de servicio"
      );
    }
    return response.data as { mensaje: string };
  },

  /* ----------------------- Crear servicio ----------------------- */
  RegisterService: async (
    serviceDataData: IServiceRegister
  ): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/service`;
    const response = await Fetcher.post(url, serviceDataData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      // Si Fetcher devuelve un status de error
      const data = response.data as { mensaje?: string };
      throw new Error(data?.mensaje || "No se pudo registrar el servicio");
    }
    return response.data as { mensaje: string };
  },

  /* ----------------------- Metodos de pago ----------------------- */
  /* ----------------------- Crear metodo de pago ----------------------- */
  RegisterPaymentMethod: async (code: string, name: string) => {
    const response = await fetch("https://localhost:7256/api/payment-method", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({ Code: code, Name: name }),
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || "No se pudo agregar el método de pago");
    }
    return true;
  },
  /* ----------------------- Listar metodos de pago ----------------------- */
  GetPaymentMethods: async () => {
    const url = "https://localhost:7256/api/payment-method";
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const data = response.data as { mensaje?: string };
      throw new Error(
        data?.mensaje || "No se pudieron obtener los métodos de pago"
      );
    }
    return response.data;
  },

  /* ----------------------- Estado metodo de pago ----------------------- */
  PaymentMethodState: async (id: number) => {
    const url = `https://localhost:7256/api/payment-method/${id}/status`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.mensaje || "No se pudo activar el método de pago");
    }
    return true;
  },

  /* ----------------------- Registrar factura ----------------------- */
  RegisterInvoice: async (invoiceData: {
    supplierId: number;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    total: number;
    serviceTypeId: number;
    description: string;
  }): Promise<{ mesagge: string }> => {
    const url = `https://localhost:7256/api/invoices`;
    const response = await Fetcher.post(url, invoiceData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const data = response.data as { mesagge?: string };
      throw new Error(data?.mesagge || "No se pudo registrar la factura");
    }
    return response.data as { mesagge: string };
  },

  /* ----------------------- Obtener listado de facturas ----------------------- */
  GetInvoices: async (): Promise<any[]> => {
    const url = `https://localhost:7256/api/invoices`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const data = response.data as { mesagge?: string };
      throw new Error(data?.mesagge || "No se pudieron obtener las facturas");
    }
    return response.data as any[];
  },

  /* -----------------------  Cambiar estado de factura ----------------------- */
  UpdateInvoiceStatus: async (id: number, newStatus: boolean) => {
    const response = await fetch(`/api/invoices/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        // Si usas JWT:
        Authorization: `Bearer ${sessionStorage.getItem("jwtToken")}`,
      },
      body: JSON.stringify(newStatus),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.mensaje || "Error al actualizar estado.");
    }
    return response.json();
  },

  /* -----------------------------Modulo cobros---------------------- */

  /* ----------------------- Registrar cobro ----------------------- */
  RegisterCollection: async (data: {
    installmentId: number;
    amount: number;
    methodId: number;
    receiptNumber: string;
    collectionDate: string;
    observations?: string;
  }): Promise<{ message: string }> => {
    const url = `https://localhost:7256/api/collections`;
    const response = await Fetcher.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const resData = response.data as { message?: string };
      throw new Error(resData?.message || "No se pudo registrar el cobro");
    }
    return response.data as { message: string };
  },

  /* ----------------------- Obtener listado de cobros ----------------------- */
  GetCollections: async (): Promise<ICollection[]> => {
    const url = `https://localhost:7256/api/collections`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const data = response.data as { mensaje?: string };
      throw new Error(
        data?.mensaje || "No se pudo obtener el listado de cobros"
      );
    }
    return response.data as ICollection[];
  },

  /* ----------------------- Obtener listado de cobros x id ----------------------- */
  GetCollectionById: async (id: number): Promise<ICollectionDetail> => {
    const url = `https://localhost:7256/api/collections/${id}`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const data = response.data as { message?: string };
      throw new Error(data?.message || "No se pudo obtener el cobro");
    }
    return response.data as ICollectionDetail;
  },

  /* ----------------------- Actualizar cobro ----------------------- */

  UpdateCollection: async (id: number, data: { methodId: number; observations: string }) => {
    const url = `https://localhost:7256/api/collections/${id}`;
    const response = await Fetcher.put(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const resData = response.data as { message?: string };
      throw new Error(resData?.message || "Error al actualizar el cobro");
    }
    return response.data as { message: string };
  },

  /* ----------------------- Anular cobro ----------------------- */
  AnnullCollection: async (
    collectionId: number,
    cancellationReason: string
  ): Promise<{ message: string }> => {
    const url = `https://localhost:7256/api/collections/${collectionId}/cancel`;
    const response = await Fetcher.patch(
      url,
      { cancellationReason },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
      }
    );
    if (response.status && response.status >= 400) {
      const resData = response.data as { message?: string };
      throw new Error(resData?.message || "No se pudo anular el cobro");
    }
    return response.data as { message: string };
  },
  GetOverdueInstallments: async (estado?: string): Promise<IOverdueInstallment[]> => {
    let url = `https://localhost:7256/api/installments/pending`;

    // Agregar parámetro de query si se proporciona
    if (estado) {
      url += `?estado=${encodeURIComponent(estado)}`;
    }

    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });

    if (response.status && response.status >= 400) {
      const data = response.data as { message?: string };
      throw new Error(data?.message || "No se pudieron obtener las cuotas vencidas");
    }

    return response.data as IOverdueInstallment[];
  },
  /* -----------------------------Modulo prestamos---------------------- */
  /* ----------------------- 1. Crear tipo de prestamo ----------------------- */
  CreateLoanType: async (
    loanTypeData: ICreateLoanTypes
  ): Promise<{ message: string }> => {
    const url = `https://localhost:7256/api/loan-types`;
    const response = await Fetcher.post(url, loanTypeData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const data = response.data as { message?: string };
      throw new Error(data?.message || "No se pudo crear el tipo de préstamo");
    }
    return response.data as { message: string };
  },

  GetCollectionMethods: async (): Promise<ICollectionMethod[]> => {
    const url = `https://localhost:7256/api/collection-method`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });

    if (response.status && response.status >= 400) {
      const data = response.data as { message?: string };
      throw new Error(
        data?.message || "No se pudieron obtener los métodos de cobro"
      );
    }
    return response.data as ICollectionMethod[];
  },

  /* ----------------------- 2. Listar tipo de prestamo ----------------------- */
  GetLoanTypes: async (): Promise<ILoanTypesList[]> => {
    const url = `https://localhost:7256/api/loan-types`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as ILoanTypesList[];
  },

  /* ----------------------- 3. Desactivar tipo de prestamo ----------------------- */
  DeactivateLoanType: async (id: number): Promise<{ message: string }> => {
    const url = `https://localhost:7256/api/loan-types/${id}/state`;

    const response = await Fetcher.put(
      url,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
      }
    );
    return response.data as { message: string };
  },

  /* ----------------------- 4. Crear prestamo para asociado ----------------------- */

  CreateLoan: async (loanData: ILoanCreate): Promise<{ message: string }> => {
    const url = `https://localhost:7256/api/loans`;
    const response = await Fetcher.post(url, loanData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    if (response.status && response.status >= 400) {
      const data = response.data as { message?: string };
      throw new Error(data?.message || "No se pudo crear el tipo de préstamo");
    }
    return response.data as { message: string };
  },

  /* ----------------------- 5. Listar prestamos ----------------------- */
  GetLoans: async (): Promise<ILoanList[]> => {
    const url = `https://localhost:7256/api/loans`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as ILoanList[];
  },

  /* ----------------------- 6. Aprobar/rechazar prestamo ----------------------- */
  UpdateLoan: async (loanId: number, data: ILoanUpdate) => {
    const url = `https://localhost:7256/api/loans/${loanId}/status`;
    const response = await Fetcher.patch(url, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as ILoanUpdate;
  },

  /* ----------------------- 7. Obtener prestamo-detalle----------------------- */

  GetLoanById: async (loanId: number): Promise<ILoanDetails> => {
    const url = `https://localhost:7256/api/loans/${loanId}`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as ILoanDetails;
  },

  /* ----------------------- 8 Obtener cuotas de un préstamo por ID ----------------------- */
  GetLoanInstallments: async (loanId: number): Promise<IInstallmentInfo[]> => {
    const url = `https://localhost:7256/api/loans/${loanId}/installments`;
    const response = await Fetcher.get(url, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
    return response.data as IInstallmentInfo[];
  },
  /* -----------------------------Modulo Periodos y Reportes---------------------- */

  /* ----------------------- 1. Crear periodo contable ----------------------- */
  CreateAccountingPeriod: async (
    code: string,
    periodType: PeriodType
  ): Promise<IAccountingPeriodResponse> => {
    const url = `https://localhost:7256/accounting-periods`;

    const response = await Fetcher.post(
      url,
      {
        Code: code,
        PeriodType: periodType,
      } as ICreateAccountingPeriod,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
      }
    );

    if (response.status && response.status >= 400) {
      const error = new Error("Error al crear el período contable.");
      (error as any).response = response;
      throw error;
    }

    return response.data as IAccountingPeriodResponse;
  },

  /* ----------------------- 2. Obtener listado periodos contables ----------------------- */
  GetAccountingPeriods: async (
    closed?: boolean
  ): Promise<IAccountingPeriodList[]> => {
    let url = `https://localhost:7256/accounting-periods`;
    if (typeof closed === "boolean") {
      url += `?closed=${closed}`;
    }
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });

    if (Array.isArray(response.data)) {
      return response.data as IAccountingPeriodList[];
    }

    if (response.data && Array.isArray(response.data)) {
      return response.data as IAccountingPeriodList[];
    }

    return [];
  },

  /* ----------------------- 3. Cerrar periodo contable ----------------------- */

  CloseAccountingPeriod: async (
    id: number
  ): Promise<IAccountingPeriodResponse> => {
    try {
      const response = await Fetcher.patch(
        `https://localhost:7256/accounting-periods/${id}/close`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
          },
        }
      );
      return response.data as IAccountingPeriodResponse;
    } catch (error: any) {
      throw error.response?.data as IAccountingPeriodResponse;
    }
  },
  /* ----------------------- 4. Ver detalle periodo contable ----------------------- */

  GetAccountingPeriodById: async (
    id: number
  ): Promise<IAccountingPeriodList> => {
    const url = `https://localhost:7256/accounting-periods/${id}`;
    const response = await Fetcher.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });

    if (response.status && response.status >= 400) {
      const data = response.data as { message?: string };
      throw new Error(
        data?.message || "No se pudo obtener el período contable"
      );
    }

    return response.data as IAccountingPeriodList;
  },
};
