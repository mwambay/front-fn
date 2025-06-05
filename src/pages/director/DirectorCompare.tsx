import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';
import DataTable from '../../components/DataTable';
import { SchoolService, SchoolData } from '../../api/School.service';
import { ClasseService, ClasseData } from '../../api/Classe.service';
import { OptionService, OptionData } from '../../api/Option.service';
import { AnneeService, AnneeData } from '../../api/Annee.service';
import { CalculationService, SchoolRankingData } from '../../api/Calculation.service';

function CompareSchools() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [classes, setClasses] = useState<ClasseData[]>([]);
  const [options, setOptions] = useState<OptionData[]>([]);
  const [years, setYears] = useState<AnneeData[]>([]);
  const [selectedSchools, setSelectedSchools] = useState<number[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [comparisonDetails, setComparisonDetails] = useState<any[]>([]);
  const [comparisonData, setComparisonData] = useState<any>({ labels: [], datasets: [] });
  const [trendData, setTrendData] = useState<any>({ labels: [], datasets: [] });

  // Charger les données de référence
  useEffect(() => {
    SchoolService.getAllSchools().then(setSchools);
    ClasseService.getAllClasses().then(setClasses);
    OptionService.getAllOptions().then(setOptions);
    AnneeService.getAllAnnees().then(setYears);
  }, []);

  // Charger les comparaisons à chaque changement de filtre
  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear || selectedSchools.length === 0) {
        setComparisonDetails([]);
        setComparisonData({ labels: [], datasets: [] });
        setTrendData({ labels: [], datasets: [] });
        return;
      }
      const anneeId = Number(selectedYear);
      const classeId = selectedClass ? Number(selectedClass) : undefined;
      const optionId = selectedOption ? Number(selectedOption) : undefined;

      // Récupérer le classement des écoles pour l'année/filtre
      const rankings: SchoolRankingData[] = await CalculationService.getSchoolRankings(
        anneeId,
        undefined,
        classeId,
        optionId
      );

      // Filtrer sur les écoles sélectionnées
      const selectedRankings = rankings.filter(r => selectedSchools.includes(r.id));

      // Préparer les données pour le graphique barres
      setComparisonData({
        labels: selectedRankings.map(r => r.nom),
        datasets: [
          {
            label: 'Moyenne générale',
            data: selectedRankings.map(r => r.moyenne),
            backgroundColor: 'rgba(59, 130, 246, 0.6)',
          },
          {
            label: 'Taux de réussite (%)',
            data: selectedRankings.map(r => r.tauxReussite),
            backgroundColor: 'rgba(16, 185, 129, 0.6)',
          }
        ]
      });

      // Préparer les détails pour la table
      setComparisonDetails(selectedRankings.map(r => ({
        school: r.nom,
        avgScore: r.moyenne,
        successRate: r.tauxReussite,
        topStudent: r.topStudent || '-', // à adapter si dispo dans l'API
        genderBalance: r.genderBalance || '-', // à adapter si dispo dans l'API
        ranking: r.rang
      })));

      // Préparer les données de tendance (évolution sur 5 ans)
      const trendLabels: string[] = [];
      const trendDatasets: any[] = [];
      for (const schoolId of selectedSchools) {
        const school = schools.find(s => s.id === schoolId);
        if (!school) continue;
        const data: number[] = [];
        for (let i = 4; i >= 0; i--) {
          const yearObj = years.find(y => Number(y.id) === anneeId - i);
          if (yearObj) {
            const yearRankings: SchoolRankingData[] = await CalculationService.getSchoolRankings(
              Number(yearObj.id),
              undefined,
              classeId,
              optionId
            );
            const schoolYear = yearRankings.find(r => r.id === schoolId);
            data.push(schoolYear ? schoolYear.moyenne : 0);
            if (trendLabels.length < 5) trendLabels.push(yearObj.libelle);
          }
        }
        trendDatasets.push({
          label: school.nom,
          data,
          borderColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
          backgroundColor: `hsl(${Math.random() * 360}, 70%, 90%)`
        });
      }
      setTrendData({
        labels: trendLabels,
        datasets: trendDatasets
      });
    };
    fetchData();
    // eslint-disable-next-line
  }, [selectedSchools, selectedClass, selectedOption, selectedYear, schools, years]);

  // Colonnes du tableau
  const columns = [
    { key: 'school', header: 'École' },
    { key: 'avgScore', header: 'Moyenne' },
    { key: 'successRate', header: 'Taux de réussite (%)' },
    { key: 'topStudent', header: 'Meilleure note' },
    { key: 'genderBalance', header: 'Répartition genre' },
    { 
      key: 'ranking', 
      header: 'Classement',
      render: (value: number) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 1 ? 'bg-green-100 text-green-800' : 
            value === 2 ? 'bg-blue-100 text-blue-800' : 
            'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      )
    },
  ];

  // Sélectionner/désélectionner une école
  const handleSchoolToggle = (schoolId: number) => {
    if (selectedSchools.includes(schoolId)) {
      setSelectedSchools(selectedSchools.filter(s => s !== schoolId));
    } else if (selectedSchools.length < 3) {
      setSelectedSchools([...selectedSchools, schoolId]);
    }
  };

  const exportData = (format: string) => {
    alert(`Données exportées au format ${format}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Comparer les écoles</h1>
      
      <Card>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sélectionner des écoles à comparer (max 3)
          </label>
          <div className="flex flex-wrap gap-2">
            {schools.map((school) => (
              <button
                key={school.id}
                onClick={() => handleSchoolToggle(school.id)}
                className={`px-4 py-2 rounded-full text-sm ${
                  selectedSchools.includes(school.id)
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
              >
                {school.nom}
              </button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.nom}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Option
            </label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les options</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nom}
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
              <option value="">Toutes les années</option>
              {years.map((year) => (
                <option key={year.id} value={year.id}>
                  {year.libelle}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Comparaison des performances">
          <BarChart 
            title="Moyenne et Taux de réussite" 
            labels={comparisonData.labels} 
            datasets={comparisonData.datasets}
          />
        </Card>
        
        <Card title="Évolution des performances">
          <LineChart 
            title="Tendance sur 5 ans" 
            labels={trendData.labels} 
            datasets={trendData.datasets}
          />
        </Card>
      </div>
      
      <Card title="Comparaison détaillée">
        <DataTable
          columns={columns}
          data={comparisonDetails}
          pagination={false}
        />
        
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => exportData('CSV')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Exporter en CSV
          </button>
          <button
            onClick={() => exportData('PDF')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Exporter en PDF
          </button>
        </div>
      </Card>
    </div>
  );
}

export default CompareSchools;