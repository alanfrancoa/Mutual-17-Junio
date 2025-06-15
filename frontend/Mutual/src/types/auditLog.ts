export interface AuditLog {
  id: number;
  description: string| null;
  entityType: string;
  createdBy: number;
  created_At: string;
  modified_By: number| null;
  modified_At: string| null;
  deleted_By: number| null;
  deleted_At: string| null;
}
