export interface ILoanUpdate{
status:'Aprobado' | 'Rechazado' | 'Pendiente'| 'Finalizado';
reason: string;
}