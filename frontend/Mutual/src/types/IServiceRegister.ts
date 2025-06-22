export interface IServiceRegister {
    supplierId: string;
    legalName: string;
    address: string;
    phone: string;
    email: string;
}

export interface IServiceUpdate {
    id: number;
    supplierId: string;
    serviceType: string;
    description: string;
    date: string;
    amount: number;
    active: boolean;
}