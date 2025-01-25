import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import MenuManagement from './pages/MenuManagement';
import InventoryManagement from './pages/InventoryManagement';
import OrderManagement from './pages/OrderManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Navigate to="/menu" replace />} />
          <Route path="menu" element={<MenuManagement />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="orders" element={<OrderManagement />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;