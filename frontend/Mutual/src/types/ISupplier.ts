export interface ISupplier {
  id: number;
  cuit: string;
  legalName: string;
  address: string;
  phone?: string;
  email?: string;
  active: boolean;
  createdAt: string;
}