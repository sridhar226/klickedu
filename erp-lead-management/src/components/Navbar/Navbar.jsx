import React from 'react';
import { Menu, User, Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm border-b z-10 sticky top-0 h-16">
      <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none md:hidden"
          >
            <Menu size={24} />
          </button>
          <div className="ml-4 md:ml-0 font-bold text-xl text-primary hidden md:block">
            ERP Lead System
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-400 hover:text-gray-500">
            <Bell size={20} />
          </button>
          <div className="relative flex items-center space-x-2 border-l pl-4 border-gray-200">
            <div className="bg-primary/10 p-1.5 rounded-full text-primary">
              <User size={20} />
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin User</span>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 ml-2" title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
