import Fetcher from "../helper/fetcher";
import { AuditLog } from "../types/auditLog";
import { IAssociateRegister } from "../types/IAssociateRegister";
import { ILoginData } from "../types/loginData";
import { IAssociateList } from "../../src/types/IAssociateList";
import { ILoginResponse } from "../types/loginResponse";
import { User } from "../types/user";
import { IRelativeList, IRelativeRegister, IRelativeUpdate } from "../types/IRelative";
import { ISupplierRegister } from "../types/ISupplierRegister";

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
};