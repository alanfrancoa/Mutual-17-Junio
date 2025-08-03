import { ToastOptions } from "react-hot-toast";

export interface ToastConfig {
  title?: string;
  message: string | React.ReactNode;
  options?: ToastOptions;
}