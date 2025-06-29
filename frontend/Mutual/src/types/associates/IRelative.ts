// I para datos que se envian al crear un familiar- RelativeRegister 
export interface IRelativeRegister {
  dni: string;
  legalName: string;
  phone?: string | null; 
  relation: string;
}

// I para datos que se obtienen al listar familiares-RelativeList 
export interface IRelativeList {
  id: number;
  dni: string;
  legalName: string;
  phone: string | null; 
  relation: string;
  referencePersonId: number | null; 
  active: boolean;
}

// I para los datos que se envían al actualizar un familiar-RelativeUpdate 
export interface IRelativeUpdate {
  dni: string;
  legalName: string;
  phone: string; // Revisar en BE required string Phone
  relation: string;
  active: boolean;
}
