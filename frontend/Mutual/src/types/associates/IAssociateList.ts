export interface IAssociateList {
  id: number; 
  dni: string; 
  legalName: string; 
  birthDate?: string;
  address: string;
  city: string;
  province: string;
  phone?: string;
  email: string;
  civilStatus?: string;
  gender?: string;
  organization: string;
  affiliationDate?: string;
  cbu: string;
  workAddress: string;
  active: boolean;
}