import { BarChart3, School, Users, TrendingUp } from 'lucide-react';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';

function DirectorDashboard() {
  // Sample school name
  const schoolName = "École A";
  
  // Sample data for statistics
  const stats = {
    totalStudents: 520,
    studentIncrease: 5.2,
    avgScore: 76.3,
    scoreIncrease: 2.8,
    successRate: 85.4,
    successIncrease: 3.5,
  };

  // Sample data for class performance chart
  const classPerformance = {
    labels: ['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale'],
    datasets: [
      {
        label: 'Moyenne par classe',
        data: [82, 75, 68, 78, 70, 75, 86],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  };

  // Sample data for performance trend
  const performanceTrend = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Moyenne annuelle',
        data: [70, 72, 71, 74, 76.3],
        borderColor: 'rgba(16, 185, 129, 0.8)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      },
      {
        label: 'Taux de réussite (%)',
        data: [78, 80, 79, 82, 85.4],
        borderColor: 'rgba(59, 130, 246, 0.8)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord - {schoolName}</h1>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mt-2 md:mt-0">
          Année scolaire 2023-2024
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Nombre d'élèves" 
          value={stats.totalStudents} 
          icon={<Users size={24} />} 
          trend={{ value: stats.studentIncrease, isPositive: true }}
        />
        <StatCard 
          title="Moyenne générale" 
          value={stats.avgScore} 
          icon={<BarChart3 size={24} />} 
          trend={{ value: stats.scoreIncrease, isPositive: true }}
        />
        <StatCard 
          title="Taux de réussite" 
          value={`${stats.successRate}%`} 
          icon={<TrendingUp size={24} />} 
          trend={{ value: stats.successIncrease, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Performance par classe">
          <BarChart 
            title="Moyenne par classe" 
            labels={classPerformance.labels} 
            datasets={classPerformance.datasets}
          />
        </Card>
        
        <Card title="Tendance de performance">
          <LineChart 
            title="Évolution sur 5 ans" 
            labels={performanceTrend.labels} 
            datasets={performanceTrend.datasets}
          />
        </Card>
      </div>
      
      <Card title="Meilleures performances par option">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Option</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meilleure moyenne</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taux de réussite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tendance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Math-Info</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">92</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">94%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+3.2%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Biochimie</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">88</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">90%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+1.5%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Littérature</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">86</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">82%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-0.8%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sciences Sociales</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">84</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">85%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+2.1%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Art</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">90</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">88%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+4.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default DirectorDashboard;