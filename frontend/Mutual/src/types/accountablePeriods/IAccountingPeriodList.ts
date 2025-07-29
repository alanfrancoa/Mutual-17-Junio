export interface IAccountingPeriodList {
  id: number;
  code: string;
  startDate: string;
  endDate: string;
  periodType: string; 
  status: "Abierto" | "Cerrado";
}