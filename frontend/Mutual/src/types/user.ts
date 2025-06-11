export interface User {
  id: number;
  username: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
