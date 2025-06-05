import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import BarChart from '../../components/BarChart';
import DataTable from '../../components/DataTable';
import { MapPin } from 'lucide-react';
import { CalculationService, SchoolRankingData } from '../../api/Calculation.service';
import { AnneeService, AnneeData } from '../../api/Annee.service';

const cityCommunes: Record<string, string[]> = {
  'Lubumbashi': ['Lubumbashi', 'Kampemba', 'Kenya', 'Kamalondo', 'Rwashi', 'Annexe'],
  'Likasi': ['Likasi', 'Kikula', 'Shituru', 'Panda'],
  'Kolwezi': ['Dilala', 'Manika', 'Kanina'],
  'Fungurume': ['Fungurume Centre'],
  'Kambove': ['Kambove Centre']
};

function CompareArea() {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [annees, setAnnees] = useState<AnneeData[]>([]);

  const [schools, setSchools] = useState<SchoolRankingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const cities = Object.keys(cityCommunes);
  const communes = selectedCity ? cityCommunes[selectedCity] : [];

  // Récupérer les années scolaires au chargement
  useEffect(() => {
    AnneeService.getAllAnnees().then(data => {
      setAnnees(data);
      if (data.length > 0) setSelectedYear(data[data.length - 1].id); // année la plus récente par défaut
    });
  }, []);

  // Chargement des écoles selon la ville/commune/année sélectionnée
  useEffect(() => {
    const fetchSchools = async () => {
      if (!selectedCity || !selectedYear) {
        setSchools([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await CalculationService.getSchoolRankings(
          selectedYear,
          selectedCity,
          undefined,
          undefined,
          undefined
        );
        console.log('Fetched schools:', data);
        const filtered = selectedCommune
          ? data.filter(s => s.commune === selectedCommune)
          : data;
        setSchools(filtered);
      } catch (e) {
        setSchools([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchools();
  }, [selectedCity, selectedCommune, selectedYear]);

  // Chart data
  const chartData = {
    labels: schools.map(school => school.nom),
    datasets: [
      {
        label: 'Moyenne générale',
        data: schools.map(school => school.moyenne),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
      {
        label: 'Taux de réussite (%)',
        data: schools.map(school => school.tauxReussite),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
      }
    ],
  };

  // Table columns
  const columns = [
    { key: 'nom', header: 'École' },
    { 
      key: 'ville', 
      header: 'Ville',
      render: (value: string) => (
        <span className="flex items-center">
          <MapPin size={16} className="mr-1 text-gray-400" />
          {value}
        </span>
      )
    },
    { 
      key: 'commune', 
      header: 'Commune',
    },
    { key: 'moyenne', header: 'Moyenne' },
    { key: 'tauxReussite', header: 'Taux de réussite (%)' },
    { 
      key: 'optionPrincipale', 
      header: 'Option principale',
      render: (value: string) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'Math-Info' ? 'bg-blue-100 text-blue-800' : 
            value === 'Biochimie' ? 'bg-green-100 text-green-800' :
            value === 'Littérature' ? 'bg-purple-100 text-purple-800' :
            value === 'Sciences Sociales' ? 'bg-yellow-100 text-yellow-800' :
            'bg-pink-100 text-pink-800'
          }`}
        >
          {value}
        </span>
      )
    },
    { key: 'rang', header: 'Rang' },
  ];

  // Handle city change
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedCommune('');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Comparer les écoles d'une zone</h1>
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année
            </label>
            <select
              value={selectedYear ?? ''}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner une année</option>
              {annees.map(annee => (
                <option key={annee.id} value={annee.id}>{annee.libelle}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionner une ville</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Commune
            </label>
            <select
              value={selectedCommune}
              onChange={(e) => setSelectedCommune(e.target.value)}
              disabled={!selectedCity}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">Toutes les communes</option>
              {communes.map((commune) => (
                <option key={commune} value={commune}>
                  {commune}
                </option>
              ))}
            </select>
          </div>
          
          {/* Rayon désactivé */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rayon de recherche (km)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="20"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="w-12 text-center font-medium">{radius} km</span>
            </div>
          </div> */}
        </div>
      </Card>
      
      <Card title={`Écoles${selectedCity ? ` à ${selectedCity}` : ''}${selectedCommune ? ` - ${selectedCommune}` : ''}`}>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">
            {isLoading
              ? "Chargement des écoles..."
              : `${schools.length} écoles trouvées dans votre zone de recherche.`}
          </p>
        </div>
        
        <BarChart 
          title="Comparaison des performances" 
          labels={chartData.labels} 
          datasets={chartData.datasets}
        />
      </Card>
      
      <Card title="Détails des écoles">
        <DataTable
          columns={columns}
          data={schools}
          pagination={false}
        />
      </Card>
      
      <Card title="Conseils pour le choix d'une école">
        <div className="space-y-4 text-gray-600">
          <p>
            Lors de la comparaison des écoles dans votre zone, tenez compte des facteurs suivants :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>La distance et l'accessibilité depuis votre domicile</li>
            <li>Les options proposées qui correspondent aux intérêts de votre enfant</li>
            <li>Les performances académiques (moyenne, taux de réussite)</li>
            <li>Les infrastructures et ressources disponibles</li>
            <li>L'environnement social et le cadre d'apprentissage</li>
          </ul>
          <p className="italic">
            N'hésitez pas à visiter les écoles qui vous intéressent pour vous faire une meilleure idée de l'ambiance et rencontrer l'équipe pédagogique.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default CompareArea;