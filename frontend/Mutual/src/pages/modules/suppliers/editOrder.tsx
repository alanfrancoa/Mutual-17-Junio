import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../dashboard/components/Header";
import Sidebar from "../../dashboard/components/Sidebar";

type OrderType = "compra" | "servicio";
type OrderStatus = "Borrador" | "Aprobado" | "Recibido";

interface Supplier {
  persona_id: number;
  nombre_razon_social: string;
  dni_cuit: string;
}

interface OrderLine {
  id?: number;
  descripcion: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
}

const EditOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  //Estados
  const [orderType, setOrderType] = useState<OrderType>("compra"); //Guarda el tipo de orden: "compra" o "servicio"
  const [orderId, setOrderId] = useState<number | null>(null); //Guarda el ID de la orden que se está editando. Es null hasta que se carga la orden
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null); //Guarda el proveedor seleccionado para la orden.
  const [supplierSearch, setSupplierSearch] = useState(""); //Guarda el texto de búsqueda del proveedor.
  const [supplierSuggestions, setSupplierSuggestions] = useState<Supplier[]>([]); //Guarda las sugerencias de proveedores.
  const [showSuggestions, setShowSuggestions] = useState(false); //Controla la visibilidad de las sugerencias.
  const [fechaEmision, setFechaEmision] = useState<string>(""); //Guarda la fecha de emisión de la orden.
  const [fechaEntrega, setFechaEntrega] = useState<string>(""); //Guarda la fecha de entrega de la orden.
  const [total, setTotal] = useState<number>(0); //Guarda el total de la orden.
  const [status, setStatus] = useState<OrderStatus>("Borrador"); //Guarda el estado de la orden.
  const [lines, setLines] = useState<OrderLine[]>([]); //Guarda las líneas de la orden.
  const [isAdmin, setIsAdmin] = useState(false); //Controla si el usuario es admin.

  //carga de datos de la orden
  useEffect(() => {
    const fetchOrder = async () => { //pide los datos de la orden al backend
      try {
        const response = await fetch(`/api/orders/${id}`); //CHEQUEAR URL DEL BACKEND
        if (!response.ok) throw new Error("No se pudo obtener la orden");
        const data = await response.json();

     //CHEQUEAR CAMPOS
        setOrderId(data.id);
        setOrderType(data.type);
        setSelectedSupplier({
          persona_id: data.supplier.persona_id,
          nombre_razon_social: data.supplier.nombre_razon_social,
          dni_cuit: data.supplier.dni_cuit,
        });
        setSupplierSearch(`${data.supplier.nombre_razon_social} (${data.supplier.dni_cuit})`);
        setFechaEmision(data.fechaEmision);
        setFechaEntrega(data.fechaEntrega);
        setStatus(data.status);
        setLines(data.lines);
        setTotal(data.total);
        setIsAdmin(sessionStorage.getItem("userRole") === "administrador");
      } catch (error) {
        alert("Error al cargar la orden");
        navigate("/proveedores/ordenes");
      }
    };

    if (id) fetchOrder();
  }, [id, navigate]);

  // Funciones de edición
  const handleSupplierSearch = (value: string) => {
    setSupplierSearch(value);
    if (value.length > 2) {
      setTimeout(() => {
        setSupplierSuggestions([
          { persona_id: 1, nombre_razon_social: "Proveedor Ejemplo 1", dni_cuit: "20-12345678-9" },
          { persona_id: 2, nombre_razon_social: "Proveedor Ejemplo 2", dni_cuit: "23-98765432-1" },
        ]);
        setShowSuggestions(true);
      }, 500);
    } else {
      setSupplierSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSupplierSearch(`${supplier.nombre_razon_social} (${supplier.dni_cuit})`);
    setShowSuggestions(false);
  };

  const addLine = () => {
    setLines([...lines, { descripcion: "", precio_unitario: 0, cantidad: 1, subtotal: 0 }]);
  };

  const removeLine = (index: number) => {
    const newLines = [...lines];
    newLines.splice(index, 1);
    setLines(newLines);
    calculateTotal(newLines);
  };

  const updateLine = (index: number, field: keyof OrderLine, value: any) => {
    const newLines = [...lines];
    newLines[index] = { ...newLines[index], [field]: value };
    if (field === "precio_unitario" || field === "cantidad") {
      newLines[index].subtotal = newLines[index].precio_unitario * newLines[index].cantidad;
    }
    setLines(newLines);
    calculateTotal(newLines);
  };

  const calculateTotal = (linesToCalculate: OrderLine[]) => {
    const newTotal = linesToCalculate.reduce((sum, line) => sum + line.subtotal, 0);
    setTotal(newTotal);
  };

  const handleSave = () => {
    // Aquí deberías hacer una petición PUT/PATCH a tu backend para guardar los cambios
    alert("Orden actualizada correctamente");
    navigate("/proveedores/ordenes"); // Ajusta la ruta según tu app
  };

  const handleApprove = () => {
    setStatus("Aprobado");
    alert("Orden aprobada correctamente");
  };

  const isEditable = status === "Borrador";

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      <div className="flex-1" style={{ marginLeft: "18rem" }}>
        <Header hasNotifications={true} />
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Editar Orden #{orderId}
            </h1>
            <div className="flex space-x-2">
              {isEditable && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Guardar Cambios
                </button>
              )}
              {isAdmin && isEditable && (
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Aprobar
                </button>
              )}
              <button
                onClick={() => navigate("/proveedores/ordenes")}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Volver
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Orden</label>
                <select
                  value={orderType}
                  onChange={e => setOrderType(e.target.value as OrderType)}
                  disabled={!isEditable}
                  className="w-full p-2 border border-gray-300 rounded"
                >
                  <option value="compra">Orden de compra</option>
                  <option value="servicio">Orden de servicio</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <div className="p-2 bg-gray-100 rounded">
                  <span className={`font-medium ${
                    status === "Borrador" ? "text-yellow-600" :
                    status === "Aprobado" ? "text-green-600" : "text-blue-600"
                  }`}>
                    {status}
                  </span>
                </div>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Proveedor</label>
                <input
                  type="text"
                  value={supplierSearch}
                  onChange={e => handleSupplierSearch(e.target.value)}
                  disabled={!isEditable}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Buscar proveedor..."
                />
                {showSuggestions && supplierSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                    {supplierSuggestions.map(supplier => (
                      <li
                        key={supplier.persona_id}
                        className="p-2 hover:bg-blue-50 cursor-pointer"
                        onClick={() => selectSupplier(supplier)}
                      >
                        <div className="font-medium">{supplier.nombre_razon_social}</div>
                        <div className="text-sm text-gray-600">{supplier.dni_cuit}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Pedido</label>
                <input
                  type="date"
                  value={fechaEmision}
                  onChange={e => setFechaEmision(e.target.value)}
                  disabled={!isEditable}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrega Aprox.</label>
                <input
                  type="date"
                  value={fechaEntrega}
                  onChange={e => setFechaEntrega(e.target.value)}
                  disabled={!isEditable}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <div className="p-2 bg-gray-100 rounded">
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Líneas</h2>
              {isEditable && (
                <button
                  onClick={addLine}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center"
                >
                  <span className="mr-1">+</span> Agregar Línea
                </button>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto/Servicio</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lines.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No hay líneas agregadas
                      </td>
                    </tr>
                  ) : (
                    lines.map((line, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="text"
                            value={line.descripcion}
                            onChange={e => updateLine(index, "descripcion", e.target.value)}
                            disabled={!isEditable}
                            className="p-1 border border-gray-300 rounded w-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.precio_unitario}
                            onChange={e => updateLine(index, "precio_unitario", parseFloat(e.target.value))}
                            disabled={!isEditable}
                            className="p-1 border border-gray-300 rounded w-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="1"
                            value={line.cantidad}
                            onChange={e => updateLine(index, "cantidad", parseInt(e.target.value))}
                            disabled={!isEditable}
                            className="p-1 border border-gray-300 rounded w-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${line.subtotal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {isEditable && (
                            <button
                              onClick={() => removeLine(index)}
                              className="text-red-600 hover:text-red-900"
                            >
                              -
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
    </div>
  );
};

export default EditOrder;