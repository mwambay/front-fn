import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';
import DataTable from '../../components/DataTable';
import { CalculationService } from '../../api/Calculation.service';
import { AnneeService, AnneeData } from '../../api/Annee.service';
import { SchoolService, SchoolData } from '../../api/School.service';
import { ClasseService, ClasseData } from '../../api/Classe.service';

function ViewPerformance() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [classes, setClasses] = useState<ClasseData[]>([]);
  const [years, setYears] = useState<AnneeData[]>([]);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [avgScore, setAvgScore] = useState('0');
  const [successRate, setSuccessRate] = useState('0');
  const [genderData, setGenderData] = useState<any>({
    labels: ['Moyenne par genre'],
    datasets: [
      { label: 'Garçons', data: [0], backgroundColor: 'rgba(59, 130, 246, 0.6)' },
      { label: 'Filles', data: [0], backgroundColor: 'rgba(236, 72, 153, 0.6)' }
    ]
  });
  const [filteredData, setFilteredData] = useState<any[]>([]);

  // Charger écoles, classes, années au montage
  useEffect(() => {
    SchoolService.getAllSchools().then(setSchools);
    ClasseService.getAllClasses().then(setClasses);
    AnneeService.getAllAnnees().then(setYears);
  }, []);

  // Charger les stats et données élèves à chaque changement de filtre
  useEffect(() => {
    const fetchStats = async () => {
      if (!selectedYear) return;
      const anneeId = Number(selectedYear);
      const ecoleId = selectedSchool ? Number(selectedSchool) : undefined;
      const classeId = selectedClass ? Number(selectedClass) : undefined;
      let genre: string | undefined = undefined;
      if (filterBy === 'male') genre = 'M';
      if (filterBy === 'female') genre = 'F';

      // Moyenne générale et taux de réussite
      if (ecoleId && anneeId) {
        const moyenne = await CalculationService.getMoyenneGenerale(ecoleId, anneeId, classeId);
        setAvgScore(Number(moyenne).toFixed(1));
        const taux = await CalculationService.getTauxReussite(ecoleId, anneeId, classeId);
        setSuccessRate(Number(taux).toFixed(1));
      } else {
        setAvgScore('0');
        setSuccessRate('0');
      }

      // Diagramme de genre
      if (ecoleId && anneeId) {
        const garcon = await CalculationService.getMoyenneGenerale(ecoleId, anneeId, classeId, undefined, 'M');
        const fille = await CalculationService.getMoyenneGenerale(ecoleId, anneeId, classeId, undefined, 'F');
        setGenderData({
          labels: ['Moyenne par genre'],
          datasets: [
            { label: 'Garçons', data: [garcon], backgroundColor: 'rgba(59, 130, 246, 0.6)' },
            { label: 'Filles', data: [fille], backgroundColor: 'rgba(236, 72, 153, 0.6)' }
          ]
        });
      } else {
        setGenderData({
          labels: ['Moyenne par genre'],
          datasets: [
            { label: 'Garçons', data: [0], backgroundColor: 'rgba(59, 130, 246, 0.6)' },
            { label: 'Filles', data: [0], backgroundColor: 'rgba(236, 72, 153, 0.6)' }
          ]
        });
      }

      // Table des élèves
      const allResults = await import('../../api/Resultat.service').then(m => m.ResultatService.getAllResultats());
      const filtered = allResults.filter((res: any) => {
        const matchEcole = ecoleId ? (typeof res.ecole === 'object' ? res.ecole.id === ecoleId : res.ecole === ecoleId) : true;
        const matchClasse = classeId ? (typeof res.classe === 'object' ? res.classe.id === classeId : res.classe === classeId) : true;
        const matchAnnee = anneeId ? (typeof res.annee === 'object' ? res.annee.id === anneeId : res.annee === anneeId) : true;
        const matchGenre = genre ? res.genre === genre : true;
        return matchEcole && matchClasse && matchAnnee && matchGenre;
      }).map((res: any) => ({
        id: res.id,
        gender: res.genre === 'M' ? 'Garçon' : 'Fille',
        average: res.moyenne,
        status: res.moyenne >= 50 ? 'Réussi' : 'Échoué'
      }));
      setFilteredData(filtered);
    };
    fetchStats();
  }, [selectedSchool, selectedClass, selectedYear, filterBy]);

  // Colonnes de la table
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'gender', header: 'Genre' },
    { key: 'average', header: 'Moyenne' },
    { 
      key: 'status', 
      header: 'Statut',
      render: (value: string) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'Réussi' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {value}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Visualiser les performances</h1>
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.nom}
                </option>
              ))}
            </select>
          </div>
          
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
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrer par
            </label>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Tous les élèves</option>
              <option value="male">Garçons uniquement</option>
              <option value="female">Filles uniquement</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Moyenne générale</h3>
            <p className="text-3xl font-bold text-blue-600">{avgScore}</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Taux de réussite</h3>
            <p className="text-3xl font-bold text-green-600">{successRate}%</p>
          </div>
        </div>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Comparaison par genre">
          <BarChart 
            title="Moyenne par genre" 
            labels={genderData.labels} 
            datasets={genderData.datasets}
          />
        </Card>
        
        <Card title="Tendance de performance">
          <LineChart 
            title="Évolution sur 5 ans" 
            labels={['2019', '2020', '2021', '2022', '2023']} 
            datasets={[
              {
                label: 'Moyenne générale',
                data: [75, 78, 80, 82, 85],
                borderColor: 'rgba(59, 130, 246, 1)',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
              }
            ]}
          />
        </Card>
      </div>
      
      <Card title="Données des élèves">
        <DataTable
          columns={columns}
          data={filteredData}
        />
      </Card>
    </div>
  );
}

export default ViewPerformance;