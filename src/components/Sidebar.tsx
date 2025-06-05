import { useNavigate, useLocation } from 'react-router-dom';
import { 
  BarChart2, 
  ClipboardList, 
  FileText, 
  Home, 
  LogOut, 
  School, 
  Settings, 
  TrendingUp, 
  Users,
  BookOpen,
  GraduationCap,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  role?: string;
}

function Sidebar({ role = 'user' }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return [
          { path: '/admin', label: 'Dashboard', icon: <Home size={20} /> },
          { path: '/admin/register-results', label: 'Enregistrer un palmarès', icon: <ClipboardList size={20} /> },
          { path: '/admin/correct-data', label: 'Corriger des données', icon: <FileText size={20} /> },
          { path: '/admin/manage-users', label: 'Gérer les utilisateurs', icon: <Users size={20} /> },
          { path: '/admin/manage-schools', label: 'Gérer les ecoles', icon: <School size={20} /> },
          { path: '/admin/manage-options', label: 'Gérer les options', icon: <BookOpen size={20} /> },
          { path: '/admin/manage-classes', label: 'Gérer les classes', icon: <GraduationCap size={20} /> },
          { path: '/admin/manage-years', label: 'Gérer les années', icon: <Calendar size={20} /> },
        ];
      case 'inspector':
        return [
          { path: '/inspector', label: 'Dashboard', icon: <Home size={20} /> },
          { path: '/inspector/view-performance', label: 'Visualiser les performances', icon: <BarChart2 size={20} /> },
          { path: '/inspector/compare-schools', label: 'Comparer les écoles', icon: <TrendingUp size={20} /> },
          { path: '/inspector/export-report', label: 'Exporter un rapport', icon: <FileText size={20} /> },
        ];
      case 'director':
        return [
          { path: '/director', label: 'Dashboard', icon: <Home size={20} /> },
          { path: '/director/statistics', label: 'Visualiser les statistiques', icon: <BarChart2 size={20} /> },
          { path: '/director/compare', label: 'Comparer les écoles', icon: <TrendingUp size={20} /> },
          { path: '/director/report', label: 'Exporter le rapport', icon: <FileText size={20} /> },
        ];
      case 'parent':
        return [
          { path: '/parent', label: 'Dashboard', icon: <Home size={20} /> },
          { path: '/parent/rankings', label: 'Classement des écoles', icon: <BarChart2 size={20} /> },
          { path: '/parent/compare-area', label: "Comparer les écoles d'une zone", icon: <TrendingUp size={20} /> },
        ];
      case 'student':
        return [
          { path: '/student', label: 'Dashboard', icon: <Home size={20} /> },
          { path: '/student/search-option', label: "Rechercher par option", icon: <School size={20} /> },
          { path: '/student/success-trends', label: 'Tendances de réussite', icon: <TrendingUp size={20} /> },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  
  return (
    <aside className="bg-gradient-to-b from-gray-100 via-gray-200 to-gray-300 text-gray-700 w-64 min-h-screen flex flex-col">
      <div className="p-5 border-b border-gray-300">
        <div className="flex items-center space-x-3">
          <School size={24} className="text-gray-700" />
          <h2 className="text-xl font-semibold text-gray-800">School Performance</h2>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                className={`flex items-center w-full px-4 py-3 text-left transition-colors rounded-lg ${
                  location.pathname === item.path
                    ? 'bg-gray-300/50 text-gray-900 font-medium'
                    : 'text-gray-700 hover:bg-gray-300/30'
                }`}
                onClick={() => navigate(item.path)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-300">
        <button
          className="flex items-center text-gray-700 hover:text-gray-900 w-full px-4 py-2 rounded-lg hover:bg-gray-300/30 transition-colors"
          onClick={() => navigate('/')}
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;