export type PeriodType = "Mensual" | "Trimestral" ;

export interface IAccountingPeriod {
  id: number;
  code: string;
  type: PeriodType;
  startDate: string; 
  endDate: string;   
  status: "Abierto" | "Cerrado";
}