import React from 'react';
import { Menu, ChefHat, Package, Users, ClipboardList } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/menu', icon: Menu, label: 'Menu Management' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { path: '/staff', icon: Users, label: 'Staff Schedule' },
    { path: '/orders', icon: ClipboardList, label: 'Orders' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-4">
      <div className="flex items-center gap-2 mb-8">
        <ChefHat className="w-8 h-8" />
        <h1 className="text-xl font-bold">Cafeteria Planner</h1>
      </div>
      <nav>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2 p-3 rounded-lg mb-2 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;