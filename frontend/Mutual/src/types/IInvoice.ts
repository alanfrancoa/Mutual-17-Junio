export interface IInvoiceList {
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

export interface IInvoiceCreate {
  supplierId: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  total: number;
  serviceTypeId: number;
  description: string;
}

export interface IInvoiceUpdate {
  supplierId: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  total: number;
  serviceTypeId: number;
  description: string;
}

/** @deprecated Use IInvoiceList instead */
export interface IInvoice extends IInvoiceList {}

/** @deprecated Use IInvoiceUpdate instead */
export interface IEditInvoice extends IInvoiceUpdate {}