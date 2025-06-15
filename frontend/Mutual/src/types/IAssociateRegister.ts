export interface IAssociateRegister {
  DNI: string;
  LegalName: string;
  Address: string;
  City: string;
  Province: string;
  Phone?: string; 
  Email?: string; 
  CivilStatus?: string; 
  CBU: string;
  Gender?: string; 
  Organization: string;
  AffiliationDate?: string; 
  WorkAddress: string;
  BirthDate?: string; 
  Active?: boolean; 
}