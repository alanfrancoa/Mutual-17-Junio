export interface IAccountingPeriodResponse {
  message: string;
}

// Para manejar las respuestas de error del backend
export interface IErrorResponse {
  message?: string;
  errorDetails?: string;
  innerExceptionDetails?: string;
  errors?: {
    [key: string]: string[]; 
  };
}