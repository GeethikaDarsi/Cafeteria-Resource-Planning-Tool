import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, ChefHat, PlusCircle, X } from 'lucide-react';
import type { Order, MenuItem } from '../types';
import { format } from 'date-fns';

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isAddingOrder, setIsAddingOrder] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Array<{ menuItemId: string; quantity: number }>>([]);
  
  // Sample menu items (in production, this would come from a global state or API)
  const menuItems: MenuItem[] = [
    { id: '1', name: 'Burger', category: 'main', price: 12.99, available: true, ingredients: [] },
    { id: '2', name: 'Fries', category: 'side', price: 4.99, available: true, ingredients: [] },
  ];

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'preparing':
        return <ChefHat className="w-5 h-5 text-blue-500" />;
      case 'ready':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-gray-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleAddOrder = () => {
    if (selectedItems.length > 0) {
      const totalAmount = selectedItems.reduce((total, item) => {
        const menuItem = menuItems.find(m => m.id === item.menuItemId);
        return total + (menuItem?.price || 0) * item.quantity;
      }, 0);

      const newOrder: Order = {
        id: Date.now().toString(),
        items: selectedItems,
        status: 'pending',
        totalAmount,
        timestamp: new Date().toISOString()
      };

      setOrders([newOrder, ...orders]);
      setSelectedItems([]);
      setIsAddingOrder(false);
    }
  };

  const addItemToOrder = (menuItemId: string) => {
    const existingItem = selectedItems.find(item => item.menuItemId === menuItemId);
    if (existingItem) {
      setSelectedItems(selectedItems.map(item =>
        item.menuItemId === menuItemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems([...selectedItems, { menuItemId, quantity: 1 }]);
    }
  };

  const removeItemFromOrder = (menuItemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.menuItemId !== menuItemId));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Order Management</h1>
        <button 
          onClick={() => setIsAddingOrder(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" />
          New Order
        </button>
      </div>

      {isAddingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Order</h2>
              <button onClick={() => setIsAddingOrder(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => addItemToOrder(item.id)}
                    className="p-3 border rounded-lg hover:bg-gray-50 text-left"
                  >
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">${item.price.toFixed(2)}</div>
                  </button>
                ))}
              </div>
              {selectedItems.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Selected Items:</h3>
                  <div className="space-y-2">
                    {selectedItems.map(item => {
                      const menuItem = menuItems.find(m => m.id === item.menuItemId);
                      return (
                        <div key={item.menuItemId} className="flex justify-between items-center">
                          <span>{menuItem?.name} x {item.quantity}</span>
                          <button
                            onClick={() => removeItemFromOrder(item.menuItemId)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <button
                onClick={handleAddOrder}
                disabled={selectedItems.length === 0}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {(['pending', 'preparing', 'ready', 'completed'] as const).map(status => (
          <div key={status} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold capitalize">{status}</h3>
              {getStatusIcon(status)}
            </div>
            <p className="text-2xl font-bold mt-2">
              {orders.filter(order => order.status === status).length}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  #{order.id}
                </td>
                <td className="px-6 py-4">
                  {order.items.map((item, index) => {
                    const menuItem = menuItems.find(m => m.id === item.menuItemId);
                    return (
                      <div key={index} className="text-sm">
                        {item.quantity}x {menuItem?.name}
                      </div>
                    );
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(order.timestamp), 'MMM d, h:mm a')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    className="text-sm border rounded-md"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;