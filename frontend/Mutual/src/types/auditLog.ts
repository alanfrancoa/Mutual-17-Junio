export interface UserAuditReference {
  id: number;
  username: string;
}
export interface AuditLog {
  id: number;
  description: string| null;
  entityType: string;
  createdByUser: UserAuditReference | null;
  created_At: string;
  modified_By: number| null;
  modified_At: string| null;
  deleted_By: number| null;
  deleted_At: string| null;
}
