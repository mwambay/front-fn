import { useState } from 'react';
import Card from '../../components/Card';
import { Download, FileText } from 'lucide-react';

function ExportReport() {
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>(['average', 'success_rate']);
  
  // Sample data
  const schools = ['Toutes', 'École A', 'École B', 'École C', 'École D', 'École E'];
  const years = ['2024', '2023', '2022', '2021', '2020'];
  const zones = ['Toutes', 'Zone Nord', 'Zone Sud', 'Zone Est', 'Zone Ouest', 'Zone Centrale'];
  
  const indicators = [
    { id: 'average', label: 'Moyenne générale' },
    { id: 'success_rate', label: 'Taux de réussite' },
    { id: 'gender_distribution', label: 'Répartition par genre' },
    { id: 'top_performers', label: 'Meilleurs élèves' },
    { id: 'class_distribution', label: 'Répartition par classe' },
    { id: 'comparative_ranking', label: 'Classement comparatif' }
  ];

  const handleIndicatorToggle = (id: string) => {
    if (selectedIndicators.includes(id)) {
      setSelectedIndicators(selectedIndicators.filter(indicator => indicator !== id));
    } else {
      setSelectedIndicators([...selectedIndicators, id]);
    }
  };

  const handleExport = (format: string) => {
    // In a real app, this would trigger an API call to generate and download the report
    alert(`Rapport exporté en ${format} pour ${selectedSchool || 'toutes les écoles'}, année ${selectedYear}, zone ${selectedZone || 'toutes'}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Exporter un rapport</h1>
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              École
            </label>
            <select
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les écoles</option>
              {schools.filter(s => s !== 'Toutes').map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Zone
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les zones</option>
              {zones.filter(z => z !== 'Toutes').map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Indicateurs à inclure
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {indicators.map((indicator) => (
              <div key={indicator.id} className="flex items-center">
                <input
                  id={indicator.id}
                  type="checkbox"
                  checked={selectedIndicators.includes(indicator.id)}
                  onChange={() => handleIndicatorToggle(indicator.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={indicator.id} className="ml-2 block text-sm text-gray-700">
                  {indicator.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <button
            onClick={() => handleExport('PDF')}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FileText size={20} className="mr-2" />
            Télécharger en PDF
          </button>
          
          <button
            onClick={() => handleExport('Excel')}
            className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <Download size={20} className="mr-2" />
            Télécharger en Excel
          </button>
        </div>
      </Card>
      
      <Card title="Aperçu du rapport">
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedSchool || 'Toutes les écoles'} - Rapport de performance {selectedYear}
            </h2>
            <p className="text-gray-500">
              {selectedZone || 'Toutes les zones'} | Généré le {new Date().toLocaleDateString()}
            </p>
          </div>
          
          <div className="space-y-4">
            {selectedIndicators.includes('average') && (
              <div className="p-3 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Moyenne générale</h3>
                <div className="h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                  [Graphique moyenne générale]
                </div>
              </div>
            )}
            
            {selectedIndicators.includes('success_rate') && (
              <div className="p-3 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Taux de réussite</h3>
                <div className="h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                  [Graphique taux de réussite]
                </div>
              </div>
            )}
            
            {selectedIndicators.includes('gender_distribution') && (
              <div className="p-3 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Répartition par genre</h3>
                <div className="h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                  [Graphique répartition par genre]
                </div>
              </div>
            )}
            
            {selectedIndicators.includes('comparative_ranking') && (
              <div className="p-3 bg-gray-50 rounded-md">
                <h3 className="font-medium mb-2">Classement comparatif</h3>
                <div className="h-20 bg-gray-200 rounded flex items-center justify-center text-gray-400">
                  [Tableau de classement]
                </div>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-500 text-center">
          Ceci est un aperçu simplifié. Le rapport téléchargé contiendra des données réelles et des graphiques détaillés.
        </p>
      </Card>
    </div>
  );
}

export default ExportReport;