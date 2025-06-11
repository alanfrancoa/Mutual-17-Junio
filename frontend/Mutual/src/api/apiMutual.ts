import Fetcher from "../helper/fetcher";
import { ILoginData } from "../types/loginData";

import { ILoginResponse } from "../types/loginResponse";
import { User } from "../types/user";
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
};
