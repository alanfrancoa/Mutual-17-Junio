export interface User {
  id: number;
  username: string;
  role: string;
  status: "Activo" | "Inactivo" ;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
