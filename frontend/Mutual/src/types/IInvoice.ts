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

export interface IEditInvoice {
  supplierId: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  total: number;
  serviceTypeId: number;
  description: string;
}