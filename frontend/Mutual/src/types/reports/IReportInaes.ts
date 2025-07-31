export interface InaesReport {
  id: number;
  code: string;
  period?: string;
  type?: string;
  generationDate?: string;
  approvedLoans?: number;
  totalCollectionsAmount?: number;
  totalPaymentsAmount?: number;
  activeServices?: number;
  
}