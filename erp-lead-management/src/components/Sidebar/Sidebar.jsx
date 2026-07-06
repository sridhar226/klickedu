import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, X } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Leads', path: '/leads', icon: <Users size={20} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white w-64 shadow-lg transform transition-transform duration-300 ease-in-out z-30 md:translate-x-0 md:static md:inset-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b md:hidden">
          <span className="font-bold text-xl text-primary">ERP Lead System</span>
          <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="py-4 overflow-y-auto h-full">
          <ul className="space-y-2 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                  onClick={() => {
                    if (window.innerWidth < 768) {
                      toggleSidebar();
                    }
                  }}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
