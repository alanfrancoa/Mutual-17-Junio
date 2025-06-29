export interface ILoanCreate {
  associateDni: string;
  associateName: string;
  applicationDate: string;
  loanTypeId: number;
  amount: number;
  termMonths: number;
}
