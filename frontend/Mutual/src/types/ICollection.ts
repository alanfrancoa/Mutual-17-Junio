export interface ICollection {
  id: number;
  receiptNumber: string;
  amount: number;
  collectionDate: string;
  status: string;
  associate: string; // Nombre del asociado (listado) o associate?: { id: number; name: string; dni: string }; // (detalle)
  method: string;
}

// Para la respuesta paginada del listado:
export interface ICollectionListResponse {
  items: ICollection[];
  totalItems: number;
  page: number;
  pageSize: number;
}

// Para el detalle de cobranza (GET /collections/{id}):
export interface ICollectionDetail {
  id: number;
  receiptNumber: string;
  amount: number;
  collectionDate: string;
  status: string;
  method: string;
  associate: {
    id: number;
    name: string;
    dni: string;};
  installment: {
    number: number;
    dueDate: string;
    loanId: number;
  };
  auditInfo: {
    createdAt: string;
    createdBy: string;
  };
}

export interface ICollectionMethod {
  id: number;
  code: string;
  name: string;
  isActive: boolean;
}