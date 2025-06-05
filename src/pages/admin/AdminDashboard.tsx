import { BarChart3, School, Users } from 'lucide-react';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';

function AdminDashboard() {
  // Sample data for statistics
  const schoolData = {
    schools: 120,
    newSchools: 5,
    students: 45000,
    studentIncrease: 3.2,
    users: 350,
    userIncrease: 8.5,
  };

  // Sample data for bar chart
  const performanceData = {
    labels: ['Math', 'Science', 'Literature', 'History', 'Geography', 'Art'],
    datasets: [
      {
        label: 'Average Score',
        data: [76, 82, 68, 74, 65, 88],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  };

  // Sample data for line chart
  const trendData = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Success Rate',
        data: [65, 70, 68, 72, 75],
        borderColor: 'rgba(16, 185, 129, 0.8)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      },
      {
        label: 'Failure Rate',
        data: [35, 30, 32, 28, 25],
        borderColor: 'rgba(239, 68, 68, 0.8)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Administrator Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Schools" 
          value={schoolData.schools} 
          icon={<School size={24} />} 
          trend={{ value: schoolData.newSchools, isPositive: true }}
        />
        <StatCard 
          title="Total Students" 
          value={schoolData.students.toLocaleString()} 
          icon={<Users size={24} />} 
          trend={{ value: schoolData.studentIncrease, isPositive: true }}
        />
        <StatCard 
          title="System Users" 
          value={schoolData.users} 
          icon={<BarChart3 size={24} />} 
          trend={{ value: schoolData.userIncrease, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Subject Performance">
          <BarChart 
            title="Average Score by Subject" 
            labels={performanceData.labels} 
            datasets={performanceData.datasets}
          />
        </Card>
        
        <Card title="Success/Failure Trends">
          <LineChart 
            title="5-Year Success Rate Trend" 
            labels={trendData.labels} 
            datasets={trendData.datasets}
          />
        </Card>
      </div>
      
      <Card title="Recent Activities">
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-full text-blue-600 mr-3">
              <Users size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">New user registered</p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-2 bg-green-100 rounded-full text-green-600 mr-3">
              <School size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">New school results uploaded</p>
              <p className="text-xs text-gray-500">Yesterday</p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="p-2 bg-amber-100 rounded-full text-amber-600 mr-3">
              <BarChart3 size={16} />
            </div>
            <div>
              <p className="text-sm font-medium">Data correction requested</p>
              <p className="text-xs text-gray-500">2 days ago</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default AdminDashboard;