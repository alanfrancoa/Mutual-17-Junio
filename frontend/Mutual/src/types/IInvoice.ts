export interface IInvoice {
  Id: number;
  Supplier: string;
  InvoiceNumber: string;
  IssueDate: string;
  DueDate: string;
  Total: number;
  TypeService: string;
  Description: string;
  Paid: boolean;
}