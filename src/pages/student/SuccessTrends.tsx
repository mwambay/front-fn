import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import LineChart from '../../components/LineChart';
import BarChart from '../../components/BarChart';
import { SchoolService, SchoolData } from '../../api/School.service';
import { AnneeService, AnneeData } from '../../api/Annee.service';
import { CalculationService } from '../../api/Calculation.service';
import { OptionService, OptionData } from '../../api/Option.service';
import { ClasseService, ClasseData } from '../../api/Classe.service';

function SuccessTrends() {
  const [loading, setLoading] = useState(true);
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [years, setYears] = useState<AnneeData[]>([]);
  const [options, setOptions] = useState<OptionData[]>([]);
  const [classes, setClasses] = useState<ClasseData[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<number>(0);
  const [selectedYears, setSelectedYears] = useState<string[]>(['3', '5']);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  
  // États pour stocker les données des graphiques
  const [trend3Years, setTrend3Years] = useState<any>(null);
  const [trend5Years, setTrend5Years] = useState<any>(null);
  const [optionTrends, setOptionTrends] = useState<any>(null);
  const [schoolName, setSchoolName] = useState<string>('');
  const [loadingOptions, setLoadingOptions] = useState(false);

  // Chargement initial des données
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Récupération des écoles
        const schoolsList = await SchoolService.getAllSchools();
        setSchools(schoolsList);
        
        // Récupération des années
        const yearsList = await AnneeService.getAllAnnees();
        setYears(yearsList.sort((a, b) => parseInt(b.libelle) - parseInt(a.libelle)));
        
        // Récupération des options et classes
        const optionsList = await OptionService.getAllOptions();
        setOptions(optionsList);
        
        const classesList = await ClasseService.getAllClasses();
        setClasses(classesList);
        
        // Sélectionner la première école par défaut
        if (schoolsList.length > 0) {
          setSelectedSchool(schoolsList[0].id);
          setSchoolName(schoolsList[0].nom);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données initiales:', error);
        setLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  // Chargement des données de tendances lorsque l'école change
  useEffect(() => {
    if (!selectedSchool) return;
    
    const loadTrendData = async () => {
      try {
        setLoading(true);
        
        // Récupération du nom de l'école
        const schoolData = schools.find(s => s.id === selectedSchool);
        if (schoolData) {
          setSchoolName(schoolData.nom);
        }
        
        // Récupération des données pour les 3 dernières années
        if (years.length >= 3) {
          const last3Years = years.slice(0, 3);
          const labels = last3Years.map(y => y.libelle);
          
          const successRateData = [];
          const averageData = [];
          
          for (const year of last3Years) {
            const successRate = await CalculationService.getTauxReussite(selectedSchool, year.id, selectedClass || undefined);
            const average = await CalculationService.getMoyenneGenerale(selectedSchool, year.id, selectedClass || undefined);
            
            successRateData.push(successRate);
            averageData.push(average);
          }
          
          setTrend3Years({
            labels,
            datasets: [
              {
                label: 'Taux de réussite (%)',
                data: successRateData,
                borderColor: 'rgba(59, 130, 246, 0.8)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              },
              {
                label: 'Moyenne générale',
                data: averageData,
                borderColor: 'rgba(16, 185, 129, 0.8)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
              },
            ],
          });
        }
        
        // Récupération des données pour les 5 dernières années
        if (years.length >= 5) {
          const last5Years = years.slice(0, 5);
          const labels = last5Years.map(y => y.libelle);
          
          const successRateData = [];
          const averageData = [];
          
          for (const year of last5Years) {
            const successRate = await CalculationService.getTauxReussite(selectedSchool, year.id, selectedClass || undefined);
            const average = await CalculationService.getMoyenneGenerale(selectedSchool, year.id, selectedClass || undefined);
            
            successRateData.push(successRate);
            averageData.push(average);
          }
          
          setTrend5Years({
            labels,
            datasets: [
              {
                label: 'Taux de réussite (%)',
                data: successRateData,
                borderColor: 'rgba(59, 130, 246, 0.8)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
              },
              {
                label: 'Moyenne générale',
                data: averageData,
                borderColor: 'rgba(16, 185, 129, 0.8)',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
              },
            ],
          });
        }
        
        // Chargement des données par option
        await loadOptionData();
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des données de tendances:', error);
        setLoading(false);
      }
    };
    
    loadTrendData();
  }, [selectedSchool, years, selectedClass]);

  // Fonction pour charger les données par option
  const loadOptionData = async () => {
    try {
      setLoadingOptions(true);
      
      // Sélectionner la première et la dernière année disponible pour la comparaison
      if (years.length >= 2) {
        const oldestYear = years[years.length - 1];
        const newestYear = years[0];
        
        const labels = [];
        const oldYearData = [];
        const newYearData = [];
        
        // Récupérer les données pour chaque option
        for (const option of options.slice(0, 5)) { // Limiter à 5 options pour la lisibilité
          labels.push(option.nom);
          
          const oldSuccessRate = await CalculationService.getTauxReussite(
            selectedSchool, 
            oldestYear.id, 
            selectedClass || undefined,
            option.id
          );
          
          const newSuccessRate = await CalculationService.getTauxReussite(
            selectedSchool, 
            newestYear.id, 
            selectedClass || undefined,
            option.id
          );
          
          oldYearData.push(oldSuccessRate);
          newYearData.push(newSuccessRate);
        }
        
        setOptionTrends({
          labels,
          datasets: [
            {
              label: oldestYear.libelle,
              data: oldYearData,
              backgroundColor: 'rgba(209, 213, 219, 0.6)',
            },
            {
              label: newestYear.libelle,
              data: newYearData,
              backgroundColor: 'rgba(59, 130, 246, 0.6)',
            },
          ]
        });
      }
      
      setLoadingOptions(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données par option:', error);
      setLoadingOptions(false);
    }
  };

  const handleYearToggle = (year: string) => {
    if (selectedYears.includes(year)) {
      setSelectedYears(selectedYears.filter(y => y !== year));
    } else {
      setSelectedYears([...selectedYears, year]);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tendances de réussite</h1>
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              École
            </label>
            <select
              value={selectedSchool || ''}
              onChange={(e) => setSelectedSchool(parseInt(e.target.value))}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              {schools.length === 0 && <option value="">Chargement...</option>}
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.nom}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe (optionnel)
            </label>
            <select
              value={selectedClass || ''}
              onChange={(e) => setSelectedClass(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={loading}
            >
              <option value="">Toutes les classes</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id}>
                  {classe.nom}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Période
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => handleYearToggle('3')}
                className={`flex-1 px-4 py-2 rounded-md text-sm ${
                  selectedYears.includes('3')
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
                disabled={loading}
              >
                3 dernières années
              </button>
              <button
                onClick={() => handleYearToggle('5')}
                className={`flex-1 px-4 py-2 rounded-md text-sm ${
                  selectedYears.includes('5')
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-800 border border-gray-300'
                }`}
                disabled={loading}
              >
                5 dernières années
              </button>
            </div>
          </div>
        </div>
      </Card>
      
      {loading && (
        <Card>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">Chargement des données...</span>
          </div>
        </Card>
      )}
      
      {!loading && selectedYears.includes('3') && trend3Years && (
        <Card title={`${schoolName} - Tendance sur 3 ans`}>
          <LineChart 
            title="Évolution sur 3 ans" 
            labels={trend3Years.labels} 
            datasets={trend3Years.datasets}
          />
        </Card>
      )}
      
      {!loading && selectedYears.includes('5') && trend5Years && (
        <Card title={`${schoolName} - Tendance sur 5 ans`}>
          <LineChart 
            title="Évolution sur 5 ans" 
            labels={trend5Years.labels} 
            datasets={trend5Years.datasets}
          />
        </Card>
      )}
      
      {!loading && (
        <Card title="Évolution par option">
          <p className="text-gray-600 mb-4">
            Comparaison des performances par option entre {years[years.length - 1]?.libelle || '2020'} et {years[0]?.libelle || '2024'} pour {schoolName}.
            {selectedClass && classes.find(c => c.id === selectedClass) && ` Classe sélectionnée: ${classes.find(c => c.id === selectedClass)?.nom}.`}
          </p>
          
          {loadingOptions ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Chargement des options...</span>
            </div>
          ) : optionTrends ? (
            <BarChart 
              title={`Comparaison ${years[years.length - 1]?.libelle || '2020'} vs ${years[0]?.libelle || '2024'}`}
              labels={optionTrends.labels}
              datasets={optionTrends.datasets}
            />
          ) : (
            <p className="text-center text-gray-500 py-6">Aucune donnée disponible pour les options</p>
          )}
        </Card>
      )}
      
      {!loading && (
        <Card title="Analyse des tendances">
          <div className="space-y-4 text-gray-600">
            <p>
              L'analyse des tendances de réussite pour {schoolName} montre une évolution des performances au cours des dernières années.
              {selectedClass && classes.find(c => c.id === selectedClass) && ` Pour la classe ${classes.find(c => c.id === selectedClass)?.nom}.`}
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Points forts</h3>
              <ul className="list-disc pl-5 space-y-1 text-blue-700">
                {trend5Years && (
                  <li>
                    {trend5Years.datasets[0].data[trend5Years.datasets[0].data.length - 1] > trend5Years.datasets[0].data[0] 
                      ? `Augmentation du taux de réussite (${Math.round(trend5Years.datasets[0].data[trend5Years.datasets[0].data.length - 1] - trend5Years.datasets[0].data[0])}% sur ${trend5Years.labels.length} ans)` 
                      : 'Stabilité du taux de réussite sur la période'}
                  </li>
                )}
                {optionTrends && optionTrends.datasets[1].data.some((val: number, idx: number) => val > optionTrends.datasets[0].data[idx]) && (
                  <li>
                    Progression notable en options: {optionTrends.labels
                      .filter((_, idx: number) => optionTrends.datasets[1].data[idx] > optionTrends.datasets[0].data[idx])
                      .join(', ')}
                  </li>
                )}
                <li>Résultats constants malgré les changements de programmes</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg">
              <h3 className="font-medium text-amber-800 mb-2">Points d'amélioration</h3>
              <ul className="list-disc pl-5 space-y-1 text-amber-700">
                {optionTrends && optionTrends.datasets[1].data.some((val: number, idx: number) => val < optionTrends.datasets[0].data[idx]) && (
                  <li>
                    Progression plus lente dans les options: {optionTrends.labels
                      .filter((_, idx: number) => optionTrends.datasets[1].data[idx] < optionTrends.datasets[0].data[idx])
                      .join(', ')}
                  </li>
                )}
                {trend5Years && trend5Years.datasets[0].data.some((val: number, i: number, arr: number[]) => i > 0 && Math.abs(val - arr[i-1]) < 1) && (
                  <li>Période de stagnation observée sur certaines années</li>
                )}
                {optionTrends && (
                  <li>
                    Écarts de performance entre les différentes options (jusqu'à
                    {optionTrends.datasets[1].data.length > 0 
                      ? ` ${Math.round(Math.max(...optionTrends.datasets[1].data) - Math.min(...optionTrends.datasets[1].data))}% `
                      : ' '}
                    de différence)
                  </li>
                )}
              </ul>
            </div>
            
            <p className="italic">
              Ces tendances peuvent vous aider à identifier les options où l'école excelle particulièrement et à évaluer la constance des résultats dans le temps.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

export default SuccessTrends;