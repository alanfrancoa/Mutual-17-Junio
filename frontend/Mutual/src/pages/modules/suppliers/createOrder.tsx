import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../dashboard/components/Sidebar';

type OrderType = 'compra' | 'servicio';
type OrderStatus = 'Borrador' | 'Aprobado' | 'Recibido';

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

interface PurchaseOrderProps {
  onBack?: () => void;
}

const CreateOrder: React.FC<PurchaseOrderProps> = ({ onBack }) => {
  const [orderType, setOrderType] = useState<OrderType>('compra');
  const [orderId, setOrderId] = useState<number | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierSuggestions, setSupplierSuggestions] = useState<Supplier[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [fechaEmision, setFechaEmision] = useState<string>('');
  const [fechaEntrega, setFechaEntrega] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [status, setStatus] = useState<OrderStatus>('Borrador');
  const [lines, setLines] = useState<OrderLine[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleSupplierSearch = (value: string) => {
    setSupplierSearch(value);
    if (value.length > 2) {
      setTimeout(() => {
        setSupplierSuggestions([
          { persona_id: 1, nombre_razon_social: 'Proveedor Ejemplo 1', dni_cuit: '20-12345678-9' },
          { persona_id: 2, nombre_razon_social: 'Proveedor Ejemplo 2', dni_cuit: '23-98765432-1' },
          { persona_id: 3, nombre_razon_social: 'Proveedor Ejemplo 3', dni_cuit: '27-45678912-3' },
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
    const newLine: OrderLine = {
      descripcion: '',
      precio_unitario: 0,
      cantidad: 1,
      subtotal: 0,
    };
    setLines([...lines, newLine]);
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
    
    if (field === 'precio_unitario' || field === 'cantidad') {
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
    if (!orderId) {
      setOrderId(Math.floor(Math.random() * 1000) + 1);
    }
    alert('Orden guardada correctamente');
  };

  const handleApprove = () => {
    setStatus('Aprobado');
    alert('Orden aprobada correctamente');
  };

  const isEditable = status === 'Borrador';

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar fija a la izquierda */}
      <Sidebar />

      {/* Contenido principal desplazado a la derecha */}
      <div className="flex-1" style={{ marginLeft: '18rem' /* w-72 = 288px */ }}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {orderId ? `Orden de ${orderType} #${orderId}` : `Nueva Orden de ${orderType}`}
            </h1>
            <div className="flex space-x-2">
              {status === 'Borrador' && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Guardar
                </button>
              )}
              {isAdmin && status === 'Borrador' && (
                <button
                  onClick={handleApprove}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                  Aprobar
                </button>
              )}
              <button
                onClick={onBack}
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
                  onChange={(e) => setOrderType(e.target.value as OrderType)}
                  disabled={!isEditable}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="compra">Orden de compra</option>
                  <option value="servicio">Orden de servicio</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <div className="p-2 bg-gray-100 rounded">
                  <span className={`font-medium ${
                    status === 'Borrador' ? 'text-yellow-600' : 
                    status === 'Aprobado' ? 'text-green-600' : 'text-blue-600'
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
                  onChange={(e) => handleSupplierSearch(e.target.value)}
                  disabled={!isEditable}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Buscar proveedor..."
                />
                {showSuggestions && supplierSuggestions.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
                    {supplierSuggestions.map((supplier) => (
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
                  onChange={(e) => setFechaEmision(e.target.value)}
                  disabled={!isEditable}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Entrega Aprox.</label>
                <input
                  type="date"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                  disabled={!isEditable}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
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
                            onChange={(e) => updateLine(index, 'descripcion', e.target.value)}
                            disabled={!isEditable}
                            className="p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 w-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.precio_unitario}
                            onChange={(e) => updateLine(index, 'precio_unitario', parseFloat(e.target.value))}
                            disabled={!isEditable}
                            className="p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 w-full"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            min="1"
                            value={line.cantidad}
                            onChange={(e) => updateLine(index, 'cantidad', parseInt(e.target.value))}
                            disabled={!isEditable}
                            className="p-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 w-full"
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

export default CreateOrder;