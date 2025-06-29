import toast, { ToastOptions } from 'react-hot-toast';

interface ToastConfig {
  message: string;
  options?: ToastOptions;
}

const useAppToast = () => {
  const showSuccessToast = ({ message, options }: ToastConfig) => {
    toast.success(message, {
      ...options,
      // opciones de estilo pendientes
      
    });
  };

  const showErrorToast = ({ message, options }: ToastConfig) => {
    toast.error(message, {
      ...options,
      // opciones de estilo pendientes
      
    });
  };

  //opcion generica
  const showDefaultToast = ({ message, options }: ToastConfig) => {
    toast(message, options);
  };

  //  Para promesas(pendiente)
  
  // const showPromiseToast = <T>(
  //   promise: Promise<T>,
  //   messages: {
  //     loading: string;
  //     success: string | ((data: T) => string);
  //     error: string | ((error: any) => string);
  //   },
  //   options?: ToastOptions
  // ) => {
  //   toast.promise(promise, messages, options);
  // };

  return {
    showSuccessToast,
    showErrorToast,
    showDefaultToast,
    // showPromiseToast,
  };
};

export default useAppToast;