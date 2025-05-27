export interface IApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
  request?: any;
}