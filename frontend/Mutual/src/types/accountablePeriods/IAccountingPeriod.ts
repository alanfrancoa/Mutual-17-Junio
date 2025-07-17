export interface IAccountingPeriod {
  id: number;
  code: string;
  type: "Mensual" | "Trimestral";
  startDate: string; 
  endDate: string;   
  status: "Abierto" | "Cerrado";
}