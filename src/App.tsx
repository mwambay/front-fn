import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import RegisterResults from './pages/admin/RegisterResults';
import CorrectData from './pages/admin/CorrectData';
import ManageUsers from './pages/admin/ManageUsers';
import ManageSchools from './pages/admin/ManageSchools';
import ManageOptions from './pages/admin/ManageOptions';
import ManageClasses from './pages/admin/ManageClasses';
import ManageYears from './pages/admin/ManageYears';
import InspectorDashboard from './pages/inspector/InspectorDashboard';
import ViewPerformance from './pages/inspector/ViewPerformance';
import CompareSchools from './pages/inspector/CompareSchools';
import ExportReport from './pages/inspector/ExportReport';
import DirectorDashboard from './pages/director/DirectorDashboard';
import DirectorStats from './pages/director/DirectorStats';
import DirectorCompare from './pages/director/DirectorCompare';
import DirectorReport from './pages/director/DirectorReport';
import ParentDashboard from './pages/parent/ParentDashboard';
import SchoolRankings from './pages/parent/SchoolRankings';
import CompareArea from './pages/parent/CompareArea';
import StudentDashboard from './pages/student/StudentDashboard';
import SearchByOption from './pages/student/SearchByOption';
import SuccessTrends from './pages/student/SuccessTrends';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <UserProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<LoginPage setIsAuthenticated={setIsAuthenticated} />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role="admin">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="register-results" element={<RegisterResults />} />
          <Route path="correct-data" element={<CorrectData />} />
          <Route path="manage-users" element={<ManageUsers />} />
          <Route path="manage-schools" element={<ManageSchools />} />
          <Route path="manage-options" element={<ManageOptions />} />
          <Route path="manage-classes" element={<ManageClasses />} />
          <Route path="manage-years" element={<ManageYears />} />
        </Route>

        {/* Inspector Routes */}
        <Route 
          path="/inspector" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role="inspector">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<InspectorDashboard />} />
          <Route path="view-performance" element={<ViewPerformance />} />
          <Route path="compare-schools" element={<CompareSchools />} />
          <Route path="export-report" element={<ExportReport />} />
        </Route>

        {/* Director Routes */}
        <Route 
          path="/director" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role="director">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DirectorDashboard />} />
          <Route path="statistics" element={<DirectorStats />} />
          <Route path="compare" element={<DirectorCompare />} />
          <Route path="report" element={<DirectorReport />} />
        </Route>

        {/* Parent Routes */}
        <Route 
          path="/parent" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role="parent">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ParentDashboard />} />
          <Route path="rankings" element={<SchoolRankings />} />
          <Route path="compare-area" element={<CompareArea />} />
        </Route>

        {/* Student Routes */}
        <Route 
          path="/student" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} role="student">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentDashboard />} />
          <Route path="search-option" element={<SearchByOption />} />
          <Route path="success-trends" element={<SuccessTrends />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;