export interface IOverdueInstallment {
  id: number;
  installmentNumber: number;
  dueDate: string; // formato "yyyy-MM-dd"
  amount: number;
  daysOverdue: number;
  associate: string;
  loanType: string;
  collected: string;
}


