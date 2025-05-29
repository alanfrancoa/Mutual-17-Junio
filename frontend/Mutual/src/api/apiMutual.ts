import { AppConfig } from "../helper/config";
import Fetcher from "../helper/fetcher";
import { ILoginData } from "../types/loginData";

import { ILoginResponse } from "../types/loginResponse";

export const apiMutual = {
  Login: async (username: string, password: string): Promise<string> => {
    // let url = `${AppConfig.apiUrl}/User/login`;
    const url = `https://localhost:7256/api/User/login`;

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
};
