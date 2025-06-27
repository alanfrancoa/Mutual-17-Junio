export interface ILoan {
  id: number; 
  status: "Finalizado" | "Aprobado" | "Rechazado" | "Pendiente"; 
  originalAmount: number; 
  termMonths: number; 
  associateName: string; 
  associateDni: string; 
  loanType: string; 
  applicationDate: string; 
  interestRate: number; 

}