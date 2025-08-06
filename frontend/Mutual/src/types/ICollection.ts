export interface ICollection {
  id: number;
  receiptNumber: string;
  amount: number;
  collectionDate: string;
  status: string;
  associate: string;
  method: string;
}

export interface ICollectionsResponse {
  items: ICollection[];
  totalItems: number;
  page: number;
  pageSize: number;
}

type UpdateCollectionPayload = {
  methodId: number;
  observations: string;
};

// Para el detalle de cobranza
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
    dni: string;
  };
  installment: {
    number: number;
    dueDate: string;
    loanId: number;
  };
  observations?: string;
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