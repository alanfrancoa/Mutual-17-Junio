import axios from 'axios';

interface LoginData {
  Username: string;
  PasswordHash: string;
}

interface LoginResponse {
  token: string;
}

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
  request?: any;
}

export const AuthService = {
  async login(username: string, password: string): Promise<string> {
    try {
      const response = await axios.post<LoginResponse>(
        `${process.env.REACT_APP_API_URL || 'https://localhost:7256/api'}/User/login`,
        
        {
          Username: username,
          PasswordHash: password
        } as LoginData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { token } = response.data;
      sessionStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return token;
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response) {
        throw new Error(err.response.data?.message || 'Credenciales incorrectas');
      } else if (err.request) {
        throw new Error('No se pudo conectar al servidor');
      }
      throw new Error('Error desconocido durante el login');
    }
  },

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