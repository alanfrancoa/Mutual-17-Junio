export interface IServiceRegister {
    ServiceTypeId: number;     
    SupplierId: number;        
    Description: string;
    MonthlyCost: number;
}

export interface IServiceUpdate {
    id: number;
    ServiceTypeId: number; 
    SupplierId: number; 
    Description: string; 
    date: string;
    amount: number;
    active: boolean;
}