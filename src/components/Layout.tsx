import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useUser } from '../context/UserContext';

function Layout() {
  const { user } = useUser();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role={user?.role} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header userName={user?.name} role={user?.role} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;