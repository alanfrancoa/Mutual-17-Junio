import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";

type UserRole = "administrador" | "gestor" | "consultante";
const userRole = (sessionStorage.getItem("userRole") || "consultante") as UserRole;

interface AllOrders {
  id: number;
  supplier: string;
  date: string;
  total: number;
  type: "compra" | "servicio";
}

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [orders, setOrders] = useState<AllOrders[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Llama al backend para obtener las órdenes
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/services");
        if (response.ok) {
          const data = await response.json();
          // Solo toma las últimas 10 por id descendente
          const sorted = data.sort((a: AllOrders, b: AllOrders) => b.id - a.id).slice(0, 10);
          setOrders(sorted);
        } else {
          setOrders([]);
        }
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filtro por ID, proveedor, fecha, tipo y estado
  const filteredOrders = orders.filter((order) =>
    (order.id.toString().includes(search) ||
      order.supplier.toLowerCase().includes(search.toLowerCase()) ||
      order.date.includes(search)) &&
    (typeFilter ? order.type === typeFilter : true)  );

  // Mensaje según el estado y rol
  const handleEditClick = (order: AllOrders) => {
    if (userRole !== "administrador") {
      alert('Solo un usuario con rol "Administrador" puede editar una orden en estado "Aprobado".');
      return;
    }
    // Pasó el permiso
    navigate(`/suppliers/orders/edit/${order.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Sidebar />
      <Header hasNotifications={true} />
      <div className="flex flex-col items-center py-8 flex-1">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-900">Órdenes de Compra</h2>
            <button
              onClick={() => navigate("/suppliers/allsuppliers")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
            >
              Proveedores
            </button>
          </div>
          <div className="mb-4 flex flex-col md:flex-row gap-2">
            <input
              type="text"
              placeholder="Buscar por ID, proveedor o fecha"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Tipo de Orden</option>
              <option value="compra">Compra</option>
              <option value="servicio">Servicio</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Proveedor</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No se encontraron órdenes.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-4 py-2">{order.id}</td>
                      <td className="px-4 py-2">{order.supplier}</td>
                      <td className="px-4 py-2">{order.date}</td>
                      <td className="px-4 py-2 capitalize">{order.type}</td>
                      <td className="px-4 py-2">${order.total.toLocaleString()}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => navigate(`/suppliers/orders/view/${order.id}`)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Ver
                        </button>
                        {userRole === "administrador" && (
                          <button
                            onClick={() => handleEditClick(order)}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;