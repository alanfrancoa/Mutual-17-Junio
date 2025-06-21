export interface ISupplierRegister {
  CUIT: string;
  LegalName: string;
  Address: string;
  Phone: string;
  Email: string;
}

export interface ISupplierUpdate {
  id: number;
  CUIT: string;
  LegalName: string;
  Address: string;
  Phone: string;
  Email: string;
  Active: boolean;
}