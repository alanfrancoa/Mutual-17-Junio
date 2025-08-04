export type PeriodType = "Mensual" | "Trimestral" | "";
export type PeriodStatus = "Abierto" | "Cerrado";

export interface IAccountingPeriod {
  id: number;
  code: string;
  startDate: string; 
  endDate: string; 
  periodType: PeriodType; 
  closed: boolean; 
  auditLogId?: number;
}

// DTO para crear un período contable 
export interface ICreateAccountingPeriodDTO {
  Code: string;
  PeriodType: PeriodType; 
}