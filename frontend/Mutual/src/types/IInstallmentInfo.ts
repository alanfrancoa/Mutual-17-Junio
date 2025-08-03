export interface IInstallmentInfo {
  id: number;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  collected: string;
  loanId?: number;
  associateId?: number;
}