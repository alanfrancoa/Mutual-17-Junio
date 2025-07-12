export interface IInstallment {
  id: number;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  collected: "Pagado" | "Pendiente";
}