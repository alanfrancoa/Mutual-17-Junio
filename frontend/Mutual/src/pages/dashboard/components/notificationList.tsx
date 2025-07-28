import React from "react";

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
}

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationList: React.FC<NotificationListProps> = ({ notifications }) => (
  <div className="absolute right-0 mt-2 w-80 bg-white rounded shadow-lg z-50 border border-gray-200">
    <div className="p-4 border-b font-bold text-gray-700">Notificaciones</div>
    {notifications.length === 0 ? (
      <div className="p-4 text-gray-500 text-sm">No hay notificaciones.</div>
    ) : (
      <ul>
        {notifications.map((n) => (
          <li key={n.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
            <div className="font-semibold text-black">{n.title}</div>
            <div className="text-xs text-black">{n.date}</div>
            <div className="text-sm text-black">{n.message}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default NotificationList;