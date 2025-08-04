import axios from 'axios';

// interface LoginData {
//   Username: string;
//   PasswordHash: string;
// }

// interface LoginResponse {
//   token: string;
// }

// interface ApiError {
//   message?: string;
//   response?: {
//     data?: {
//       message?: string;
//     };
//   };
//   request?: any;
// }
 export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return Date.now() / 1000 > payload.exp;
  } catch {
    return true;
  }
}

export const AuthService = {

  // async login(username: string, password: string): Promise<string> {
  //   try {
  //     const response = await axios.post<LoginResponse>(
  //       `${AppConfig.apiUrl}/User/login`,
        
  //       {
  //         Username: username,
  //         PasswordHash: password
  //       } as LoginData,
  //       {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );

  //     const { token } = response.data;
  //     sessionStorage.setItem('token', token);
  //     axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  //     return token;
  //   } catch (error: unknown) {
  //     const err = error as ApiError;
  //     if (err.response) {
  //       throw new Error(err.response.data?.message || 'Credenciales incorrectas');
  //     } else if (err.request) {
  //       throw new Error('No se pudo conectar al servidor');
  //     }
  //     throw new Error('Error desconocido durante el login');
  //   }
  // },




  logout(): void {
    sessionStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  },

  getToken(): string | null {
    return sessionStorage.getItem('token');
  },

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }
};