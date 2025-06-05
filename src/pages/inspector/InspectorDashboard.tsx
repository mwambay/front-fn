import { TrendingUp, BarChart3, School, Users } from 'lucide-react';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';

function InspectorDashboard() {
  // Sample data for statistics
  const stats = {
    totalSchools: 120,
    inspectedSchools: 85,
    inspectionRate: 70.8,
    avgPerformance: 72.5,
    performanceTrend: 3.2,
  };

  // Sample data for bar chart
  const schoolPerformance = {
    labels: ['École A', 'École B', 'École C', 'École D', 'École E'],
    datasets: [
      {
        label: 'Taux de réussite (%)',
        data: [86, 72, 65, 94, 78],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  };

  // Sample data for line chart
  const performanceTrend = {
    labels: ['2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Performance moyenne',
        data: [65, 68, 70, 69, 72.5],
        borderColor: 'rgba(16, 185, 129, 0.8)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
      },
    ],
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tableau de bord inspecteur</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Écoles supervisées" 
          value={stats.totalSchools} 
          icon={<School size={24} />} 
        />
        <StatCard 
          title="Écoles inspectées" 
          value={stats.inspectedSchools} 
          icon={<Users size={24} />} 
        />
        <StatCard 
          title="Taux d'inspection" 
          value={`${stats.inspectionRate}%`} 
          icon={<BarChart3 size={24} />} 
        />
        <StatCard 
          title="Performance moyenne" 
          value={`${stats.avgPerformance}%`} 
          icon={<TrendingUp size={24} />} 
          trend={{ value: stats.performanceTrend, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Performance des écoles">
          <BarChart 
            title="Taux de réussite par école" 
            labels={schoolPerformance.labels} 
            datasets={schoolPerformance.datasets}
          />
        </Card>
        
        <Card title="Tendance de performance">
          <LineChart 
            title="Évolution de la performance" 
            labels={performanceTrend.labels} 
            datasets={performanceTrend.datasets}
          />
        </Card>
      </div>
      
      <Card title="Écoles récemment inspectées">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">École</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">École A</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10 Juin 2024</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">86%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Excellent
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">École B</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5 Juin 2024</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">72%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Bon
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">École C</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">1 Juin 2024</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">65%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Moyen
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export default InspectorDashboard;