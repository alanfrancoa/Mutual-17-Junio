export interface IServiceRegister {
    supplierId: string;
    serviceType: string;
    description: string;
    monthlyCost: number;
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