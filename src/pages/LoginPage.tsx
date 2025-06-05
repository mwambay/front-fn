import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { School } from 'lucide-react';
import { useUser } from '../context/UserContext';

// Mock user data
const MOCK_USERS = [
  { id: '1', name: 'Admin User', email: 'admin@example.com', password: 'a', role: 'admin' },
  { id: '2', name: 'Inspector User', email: 'inspector@example.com', password: 'a', role: 'inspector' },
  { id: '3', name: 'Director User', email: 'director@example.com', password: 'a', role: 'director' },
  { id: '4', name: 'Parent User', email: 'parent@example.com', password: 'a', role: 'parent' },
  { id: '5', name: 'Student User', email: 'student@example.com', password: 'a', role: 'student' },
];

interface LoginPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

function LoginPage({ setIsAuthenticated }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Remove password from user object
        const { password, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        navigate(`/${user.role}`);
      } else {
        setError('Invalid email or password');
      }
      
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <School size={48} className="text-blue-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          School Performance System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to access your dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo credentials</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
              {MOCK_USERS.map((user) => (
                <div key={user.id} className="px-3 py-2 bg-gray-50 rounded text-gray-700">
                  <p><span className="font-medium">{user.role}</span>: {user.email} / {user.password}</p>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;