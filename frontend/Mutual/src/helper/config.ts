//guardado de datos generales de la aplicacion y api//
export const AppConfig = {
  apiUrl: window.API_URL,
};

export const ROLES = {
  ADMINISTRADOR: "Administrador",
  GESTOR: "Gestor",
  CONSULTOR: "Consultor",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
