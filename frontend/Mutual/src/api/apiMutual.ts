import Fetcher from "../helper/fetcher";
import { AuditLog } from "../types/auditLog";
import { IAssociateRegister } from "../types/IAssociateRegister";
import { ILoginData } from "../types/loginData";
import { IAssociateList } from "../../src/types/IAssociateList";
import { ILoginResponse } from "../types/loginResponse";
import { User } from "../types/user";
import { IRelativeList, IRelativeRegister, IRelativeUpdate } from "../types/IRelative";
import { ISupplierList } from "../types/ISupplierList";
import { ISupplierRegister, ISupplierUpdate} from "../types/ISupplierRegister";
import { IServiceRegister } from "../types/IServiceRegister";
import { IServiceType } from "../types/IServiceType";
import { ILoanTypesList } from "../types/ILoanTypesList";
import { ILoanList } from "../types/ILoanList";
import { ILoanCreate } from "../types/ILoanCreate";
import { ICreateLoanTypes } from "../types/ILoanTypes";


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
    const url = `https://localhost:7256/api/associates/${id}/status`;
    const response = await Fetcher.patch(url, newStatus, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
      },
    });
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
      throw new Error(data?.mensaje || "No se pudieron obtener los proveedores");
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
  RegisterServiceType: async (code: string, name: string): Promise<{ mensaje: string }> => {
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
      throw new Error(data?.mensaje || "No se pudo registrar el tipo de servicio");
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
    throw new Error(data?.mensaje || "No se pudieron obtener los tipos de servicio");
  }
  return response.data as IServiceType[];
},

  /* ----------------------- Cambiar estado del tipo de servicio ----------------------- */
  ServiceTypeState: async (id: number, newStatus: boolean): Promise<{ mensaje: string }> => {
    const url = `https://localhost:7256/api/services-type/${id}/status`;
    const response = await Fetcher.patch(
      url,
      JSON.stringify(newStatus),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token") || ""}`,
        },
      }
    );
    if (response.status && response.status >= 400) {
      const data = response.data as { mensaje?: string };
      throw new Error(data?.mensaje || "No se pudo cambiar el estado del tipo de servicio");
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
        "Authorization": `Bearer ${sessionStorage.getItem("token") || ""}`,
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
    throw new Error(data?.mensaje || "No se pudieron obtener los métodos de pago");
  }
  return response.data;
  },

  /* ----------------------- Estado metodo de pago ----------------------- */
PaymentMethodState: async (id: number) => {
  const url = `https://localhost:7256/api/payment-method/${id}/status`;
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${sessionStorage.getItem("token") || ""}`,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.mensaje || "No se pudo activar el método de pago");
  }
  return true;
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
  /* ----------------------- 3. Crear prestamo para asociado ----------------------- */

  CreateLoan: async (
    loanData: ILoanCreate
  ): Promise<{ message: string }> => {
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
    return response.data as { message: string }; },


  /* ----------------------- 4. Listar prestamos ----------------------- */
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


};