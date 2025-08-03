export interface IPaymentCreate {
  invoiceId: number;
  paymentDate: string;
  amount: number;
  methodId: number;
  receiptNumber: string;
  notes?: string;
}

export interface IPaymentList {
  id: number;
  invoiceId: number;
  invoiceNumber: string;
  supplierName: string;
  paymentDate: string;
  amount: number;
  paymentMethod: string;
  receiptNumber: string;
  status: string;
}

export interface IPaymentMethod {
  id: number;
  name: string;
  code: string;
  active: boolean;
}