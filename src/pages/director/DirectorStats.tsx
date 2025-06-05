import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import BarChart from '../../components/BarChart';
import LineChart from '../../components/LineChart';
import DataTable from '../../components/DataTable';
import { ClasseService, ClasseData } from '../../api/Classe.service';
import { OptionService, OptionData } from '../../api/Option.service';
import { AnneeService, AnneeData } from '../../api/Annee.service';
import { ResultatService, ResultatData } from '../../api/Resultat.service';
import { CalculationService } from '../../api/Calculation.service';

function DirectorStats() {
  const [classes, setClasses] = useState<ClasseData[]>([]);
  const [options, setOptions] = useState<OptionData[]>([]);
  const [annees, setAnnees] = useState<AnneeData[]>([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedAnnee, setSelectedAnnee] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [studentData, setStudentData] = useState<ResultatData[]>([]);
  const [schoolName, setSchoolName] = useState('Mon École');

  // Charger les données de référence
  useEffect(() => {
    ClasseService.getAllClasses().then(setClasses);
    OptionService.getAllOptions().then(setOptions);
    AnneeService.getAllAnnees().then(setAnnees);
    // Charger le nom de l'école si besoin via SchoolService.getSchoolById(...)
  }, []);

  // Charger les résultats élèves selon les filtres
  useEffect(() => {
    const fetchData = async () => {
      let allResults = await ResultatService.getAllResultats();
      // Filtrage par classe, option, année, genre
      if (selectedClass) {
        allResults = allResults.filter(r =>
          typeof r.classe === 'object'
            ? r.classe.id === Number(selectedClass)
            : r.classe === Number(selectedClass)
        );
      }
      if (selectedOption) {
        allResults = allResults.filter(r =>
          typeof r.option === 'object'
            ? r.option.id === Number(selectedOption)
            : r.option === Number(selectedOption)
        );
      }
      if (selectedAnnee) {
        allResults = allResults.filter(r =>
          typeof r.annee === 'object'
            ? r.annee.id === Number(selectedAnnee)
            : r.annee === Number(selectedAnnee)
        );
      }
      if (filterBy === 'male') {
        allResults = allResults.filter(r => r.genre === 'M');
      }
      if (filterBy === 'female') {
        allResults = allResults.filter(r => r.genre === 'F');
      }
      setStudentData(allResults);
    };
    fetchData();
  }, [selectedClass, selectedOption, selectedAnnee, filterBy]);

  // Calculs statistiques
  const avgScore =
    studentData.length > 0
      ? (
          studentData.reduce((sum, student) => sum + (student.moyenne || 0), 0) /
          studentData.length
        ).toFixed(1)
      : '0';

  const successRate =
    studentData.length > 0
      ? (
          (studentData.filter(student => student.moyenne >= 50).length / studentData.length) *
          100
        ).toFixed(1)
      : '0';

  // Préparer les labels/options pour les selects
  const classOptions = [{ id: '', nom: 'Toutes les classes' }, ...classes];
  const optionOptions = [{ id: '', nom: 'Toutes les options' }, ...options];
  const anneeOptions = [{ id: '', libelle: 'Toutes les années' }, ...annees];

  // Préparer les données pour les graphiques (exemple simple, à adapter selon vos besoins)
  const optionLabels = options.map(o => o.nom);
  const optionPerformance = {
    labels: optionLabels,
    datasets: [
      {
        label: 'Moyenne par option',
        data: optionLabels.map(opt =>
          (() => {
            const optStudents = studentData.filter(
              s =>
                (typeof s.option === 'object'
                  ? s.option.nom === opt
                  : options.find(o => o.id === s.option)?.nom === opt)
            );
            return optStudents.length > 0
              ? optStudents.reduce((sum, s) => sum + (s.moyenne || 0), 0) / optStudents.length
              : 0;
          })()
        ),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  };

  const genderData = {
    labels: ['Moyenne par genre'],
    datasets: [
      {
        label: 'Garçons',
        data: [
          (() => {
            const boys = studentData.filter(s => s.genre === 'M');
            return boys.length > 0
              ? boys.reduce((sum, s) => sum + (s.moyenne || 0), 0) / boys.length
              : 0;
          })(),
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
      {
        label: 'Filles',
        data: [
          (() => {
            const girls = studentData.filter(s => s.genre === 'F');
            return girls.length > 0
              ? girls.reduce((sum, s) => sum + (s.moyenne || 0), 0) / girls.length
              : 0;
          })(),
        ],
        backgroundColor: 'rgba(236, 72, 153, 0.6)',
      },
    ],
  };

  // Colonnes du tableau
  const columns = [
    { key: 'id', header: 'ID' },
    { key: 'genre', header: 'Genre' },
    {
      key: 'classe',
      header: 'Classe',
      render: (value: any) =>
        typeof value === 'object' && value?.nom ? value.nom : value,
    },
    {
      key: 'option',
      header: 'Option',
      render: (value: any) =>
        typeof value === 'object' && value?.nom ? value.nom : value,
    },
    { key: 'moyenne', header: 'Moyenne' },
    {
      key: 'status',
      header: 'Statut',
      render: (_: any, row: ResultatData) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.moyenne >= 50
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {row.moyenne >= 50 ? 'Réussi' : 'Échec'}
        </span>
      ),
    },
  ];

  const exportData = () => {
    alert('Données exportées avec succès');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Statistiques - {schoolName}</h1>
        <button
          onClick={exportData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-2 md:mt-0"
        >
          Exporter les données
        </button>
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Classe
            </label>
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {classOptions.map(cls => (
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
              onChange={e => setSelectedOption(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {optionOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année scolaire
            </label>
            <select
              value={selectedAnnee}
              onChange={e => setSelectedAnnee(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {anneeOptions.map(annee => (
                <option key={annee.id} value={annee.id}>
                  {annee.libelle}
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
              onChange={e => setFilterBy(e.target.value)}
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
        <Card title="Performance par option">
          <BarChart
            title="Moyenne par option"
            labels={optionPerformance.labels}
            datasets={optionPerformance.datasets}
          />
        </Card>

        <Card title="Comparaison par genre">
          <BarChart
            title="Moyenne par genre"
            labels={genderData.labels}
            datasets={genderData.datasets}
          />
        </Card>
      </div>

      <Card title="Données des élèves">
        <DataTable columns={columns} data={studentData} />
      </Card>
    </div>
  );
}

export default DirectorStats;