import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationList from "./notificationList";

interface HeaderProps {
  hasNotifications?: boolean;
}

const Header: React.FC<HeaderProps> = ({ hasNotifications }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const mockNotifications = [
    {
      id: 1,
      title: "Prestamos pendientes",
      message: "Usted tiene 8 prestamos pendientes.",
      date: "2025-07-27 10:30",
    },
    {
      id: 2,
      title: "Período contable cerrado",
      message: "El período contable 2025-06 ha sido cerrado.",
      date: "2025-07-26 18:15",
    },
  ];

  
  const userName = sessionStorage.getItem("username");
  const userRole = sessionStorage.getItem("userRole");

  return (
    <header className="bg-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center"></div>

        <div className="flex items-center space-x-4">
          {/* Notification Bell */}
          {userRole === "Administrador" && (
            <div className="relative">
              <button
                className="p-1 rounded-full hover:bg-blue-600 transition"
                onClick={() => setShowNotifications((prev) => !prev)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {hasNotifications && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {showNotifications && (
                <NotificationList notifications={mockNotifications} />
              )}
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center">
            <span className="mr-2"> {userName}</span>
            <span className="bg-green-600 text-xs px-2 py-1 rounded-full">
              {userRole}
            </span>
          </div>

          {/* Logout Button */}
          {/* borrar el usuario de local storage y redireccion al login */}
          <button
            className="p-1 rounded-full hover:bg-blue-600 transition"
            title="Cerrar sesión"
            onClick={() => navigate("/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
