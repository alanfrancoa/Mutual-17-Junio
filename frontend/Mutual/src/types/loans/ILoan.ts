export interface ILoanDetails {
  id: number;
  status: "Aprobado" | "Rechazado" | "Pendiente" | "Finalizado";
  originalAmount: number;
  termMonths: number;
  associateName: string;
  associateDni: string;
  loanType: string;
  applicationDate: string;
  interestRate: number;
  installments: IInstallmentInfo[];
}

export interface IInstallmentInfo {
  id: number; 
  installmentNumber: number;
  dueDate: string;
  amount: number;
  collected: "Pagado" | "Pendiente";
}
