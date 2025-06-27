export interface ILoanList {
  associateDni: string;
  legalName: string;
  amount:number;
  status:string;
  applicationDate:string;
  termMonths: number;
  id?:number;
} 