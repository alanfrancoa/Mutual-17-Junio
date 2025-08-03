import toast from "react-hot-toast";
import React from "react";
import {
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { ToastConfig } from "../types/IToastConfig";



// Colores y datos para el contenido de los toast
const toastTypeStyles = {
  success: {
    borderColor: "#22c55e",
    icon: (
      <CheckCircleIcon
        style={{ color: "#22c55e", width: 32, height: 32 }}
      />
    ),
    titleColor: "#22c55e",
  },
  error: {
    borderColor: "#ef4444",
    icon: <XCircleIcon style={{ color: "#ef4444", width: 32, height: 32 }} />,
    titleColor: "#ef4444",
  },
  info: {
    borderColor: "#3b82f6",
    icon: (
      <InformationCircleIcon
        style={{ color: "#3b82f6", width: 32, height: 32 }}
      />
    ),
    titleColor: "#3b82f6",
  },
  warning: {
    borderColor: "#facc15",
    icon: (
      <ExclamationCircleIcon
        style={{ color: "#facc15", width: 32, height: 32 }}
      />
    ),
    titleColor: "#facc15",
  },
};

const baseStyle: React.CSSProperties = {
  background: "#fff",
  color: "#222",
  fontSize: "1rem",
  padding: "18px 28px",
  minWidth: "350px",
  borderRadius: "0px",
  fontWeight: "normal",
  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
};

function ToastContent({
  icon,
  title,
  titleColor,
  message,
}: {
  icon: React.ReactNode;
  title?: string;
  titleColor?: string;
  message: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "18px",
        minHeight: "40px",
      }}
    >
      <span
        style={{
          background: "#fff",
          borderRadius: "50%",
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        }}
      >
        {icon}
      </span>
      <div>
        {title && (
          <div
            style={{
              fontWeight: "bold",
              color: titleColor,
              fontSize: "1.1rem",
              marginBottom: 2,
            }}
          >
            {title}
          </div>
        )}
        <span style={{ fontSize: "1rem", color: "#222" }}>{message}</span>
      </div>
    </div>
  );
}

const useAppToast = () => {
  const showSuccessToast = ({ title, message, options }: ToastConfig) => {
    toast(
      <ToastContent
        icon={toastTypeStyles.success.icon}
        title={title}
        titleColor={toastTypeStyles.success.titleColor}
        message={message}
      />,
      {
        ...options,
        style: {
          ...baseStyle,
          borderLeft: `8px solid ${toastTypeStyles.success.borderColor}`,
          ...(options?.style || {}),
        },
      }
    );
  };

  const showErrorToast = ({ title, message, options }: ToastConfig) => {
    toast(
      <ToastContent
        icon={toastTypeStyles.error.icon}
        title={title}
        titleColor={toastTypeStyles.error.titleColor}
        message={message}
      />,
      {
        ...options,
        style: {
          ...baseStyle,
          borderLeft: `8px solid ${toastTypeStyles.error.borderColor}`,
          ...(options?.style || {}),
        },
      }
    );
  };

  const showInfoToast = ({ title, message, options }: ToastConfig) => {
    toast(
      <ToastContent
        icon={toastTypeStyles.info.icon}
        title={title}
        titleColor={toastTypeStyles.info.titleColor}
        message={message}
      />,
      {
        ...options,
        style: {
          ...baseStyle,
          borderLeft: `8px solid ${toastTypeStyles.info.borderColor}`,
          ...(options?.style || {}),
        },
      }
    );
  };

  const showWarningToast = ({ title, message, options }: ToastConfig) => {
    toast(
      <ToastContent
        icon={toastTypeStyles.warning.icon}
        title={title}
        titleColor={toastTypeStyles.warning.titleColor}
        message={message}
      />,
      {
        ...options,
        style: {
          ...baseStyle,
          borderLeft: `8px solid ${toastTypeStyles.warning.borderColor}`,
          ...(options?.style || {}),
        },
      }
    );
  };

  return {
    showSuccessToast,
    showErrorToast,
    showInfoToast,
    showWarningToast,
  };
};

export default useAppToast;
