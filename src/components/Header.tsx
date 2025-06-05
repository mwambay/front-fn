import { Bell, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userName?: string;
  role?: string;
}

function Header({ userName = 'User', role = 'user' }: HeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    // In a real app, we would clear auth tokens, etc.
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-6 h-16">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 capitalize">
            {role} Dashboard
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
            <Bell size={20} />
          </button>
          <div className="relative">
            <button 
              className="flex items-center space-x-2 focus:outline-none"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="text-gray-700">{userName}</span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button 
                  className="flex items-center px-4 py-2 text-sm text-gray-700 w-full hover:bg-gray-100" 
                  onClick={logout}
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;