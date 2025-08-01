import React, { useEffect, useState } from "react";
import { ILoanList } from "../../../types/loans/ILoanList";
import { XMarkIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import { apiMutual } from "../../../api/apiMutual";

interface Notification {
  id: number;
  title: string;
  message: string;
}

interface NotificationListProps {
  loans: ILoanList[];
}

const NotificationList: React.FC<NotificationListProps> = ({ loans }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visible, setVisible] = useState(true);
 // const [pendingLoans, setPendingLoans] = useState<ILoanList[]>([]);
  const userRole = sessionStorage.getItem("userRole") || "";

  useEffect(() => {
    GetPendingLoans();
  }, []);

  const GetPendingLoans = async () => {
    const response = await apiMutual.GetLoans();
    let pending = response.filter((loan) => loan.status === "Pendiente");
    //setPendingLoans(pending);

    if (userRole !== "Administrador" || pending.length < 0) {
      setNotifications([]);
      return;
    }

    setNotifications([
      {
        id: 1,
        title: "Préstamos Pendientes",
        message: `Hay ${pending.length} préstamo(s) pendiente(s) de aprobación.`,
      },
    ]);
  };

  if (!visible) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-50 border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b font-bold text-gray-700 bg-blue-300">
        <span className="flex items-center">
          <InformationCircleIcon className="h-5 w-5 text-blue-700 mr-2" />
          Notificaciones
        </span>
        <button onClick={() => setVisible(false)}>
          <XMarkIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
        </button>
      </div>
      {notifications.length === 0 ? (
        <div className="p-4 text-gray-500 text-sm">No hay notificaciones.</div>
      ) : (
        // {loans.length > 0 && (

        // )}
        <ul>
          {notifications.map((n) => (
            <li
              key={n.id}
              className="p-4 border-b last:border-b-0 hover:bg-gray-50"
            >
              <div className="font-semibold text-black">{n.title}</div>

              <div className="text-sm text-black">{n.message}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
