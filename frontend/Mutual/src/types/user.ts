export interface User {
  id: number;
  username: string;
  role: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}
