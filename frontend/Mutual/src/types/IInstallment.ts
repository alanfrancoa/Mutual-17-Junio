export interface IInstallment {
  id: number;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  collected: "Pagado" | "Pendiente";
}

export interface IOverdueInstallment {
  id: number;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  daysOverdue: number;
  associate: string;
  loanType: string;
  collected: string;
}

