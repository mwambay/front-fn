import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import { ResultatService, ResultatData } from '../../api/Resultat.service';
import { SchoolService, SchoolData } from '../../api/School.service';
import { ClasseService, ClasseData } from '../../api/Classe.service';
import { OptionService, OptionData } from '../../api/Option.service';
import { AnneeService, AnneeData } from '../../api/Annee.service';

function CorrectData() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResult, setSelectedResult] = useState<ResultatData | null>(null);
  const [editedAverage, setEditedAverage] = useState('');
  const [editedGender, setEditedGender] = useState('');
  const [comment, setComment] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [results, setResults] = useState<ResultatData[]>([]);
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [classes, setClasses] = useState<ClasseData[]>([]);
  const [options, setOptions] = useState<OptionData[]>([]);
  const [annees, setAnnees] = useState<AnneeData[]>([]);

  // Filtres pour le tri
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    // Charger toutes les données nécessaires
    ResultatService.getAllResultats().then(setResults);
    SchoolService.getAllSchools().then(setSchools);
    ClasseService.getAllClasses().then(setClasses);
    OptionService.getAllOptions().then(setOptions);
    AnneeService.getAllAnnees().then(setAnnees);
  }, []);

  // Helpers pour afficher les labels au lieu des IDs
  const getSchoolName = (id: number) => schools.find(e => e.id === id)?.nom || '';
  const getClassName = (id: number) => classes.find(c => c.id === id)?.nom || '';
  const getOptionName = (id: number) => options.find(o => o.id === id)?.nom || '';
  const getAnneeLabel = (id: number) => annees.find(a => a.id === id)?.libelle || '';

  // Filtrage dynamique des options selon l'école sélectionnée
  const filteredOptions = selectedSchool
    ? options.filter(o => o.ecoleId === Number(selectedSchool) || !o.ecoleId)
    : [];

  // Filtrage des résultats selon les filtres sélectionnés et la recherche
  const filteredResults = results.filter(result => {
    const schoolId = typeof result.ecole === 'object' ? (result.ecole as any).id : Number(result.ecole);
    const classId = typeof result.classe === 'object' ? (result.classe as any).id : Number(result.classe);
    const optionId = typeof result.option === 'object' ? (result.option as any).id : Number(result.option);

    let match = true;
    if (selectedSchool && schoolId !== Number(selectedSchool)) match = false;
    if (selectedClass && classId !== Number(selectedClass)) match = false;
    if (selectedOption && optionId !== Number(selectedOption)) match = false;

    // Recherche texte sur école ou classe
    const schoolName = getSchoolName(schoolId).toLowerCase();
    const className = getClassName(classId).toLowerCase();
    if (
      searchTerm &&
      !schoolName.includes(searchTerm.toLowerCase()) &&
      !className.includes(searchTerm.toLowerCase())
    ) {
      match = false;
    }
    return match;
  });

  const columns = [
    { key: 'school', header: 'École', render: (_: any, item: ResultatData) => getSchoolName(typeof item.ecole === 'object' ? (item.ecole as any).id : Number(item.ecole)) },
    { key: 'class', header: 'Classe', render: (_: any, item: ResultatData) => getClassName(typeof item.classe === 'object' ? (item.classe as any).id : Number(item.classe)) },
    { key: 'option', header: 'Option', render: (_: any, item: ResultatData) => getOptionName(typeof item.option === 'object' ? (item.option as any).id : Number(item.option)) },
    { key: 'year', header: 'Année', render: (_: any, item: ResultatData) => getAnneeLabel(typeof item.annee === 'object' ? (item.annee as any).id : Number(item.annee)) },
    { key: 'genre', header: 'Genre', render: (v: string, item: ResultatData) => item.genre },
    { key: 'moyenne', header: 'Moyenne', render: (v: number, item: ResultatData) => item.moyenne },
    {
      key: 'mention',
      header: 'Statut',
      render: (value: string, item: ResultatData) => (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            item.mention === 'Réussi' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {item.mention}
        </span>
      )
    },
    {
      key: 'id',
      header: 'Action',
      render: (_: string, item: ResultatData) => (
        <button
          onClick={() => handleEdit(item)}
          className="text-blue-600 hover:text-blue-900"
        >
          Modifier
        </button>
      )
    }
  ];

  const handleEdit = (result: ResultatData) => {
    setSelectedResult(result);
    setEditedAverage(result.moyenne.toString());
    setEditedGender(result.genre);
    setComment('');
  };

  const handleSave = () => {
    setShowConfirmation(true);
  };

  const confirmSave = async () => {
    if (!selectedResult) return;
    try {
      await ResultatService.updateResultat(selectedResult.id, {
        moyenne: Number(editedAverage),
        genre: editedGender,
        mention: Number(editedAverage) >= 50 ? 'Réussi' : 'Échec'
        // Vous pouvez aussi envoyer le commentaire si le backend le gère
      });
      // Rafraîchir la liste
      const updated = await ResultatService.getAllResultats();
      setResults(updated);
      alert("Modifications enregistrées avec succès");
    } catch (e) {
      alert("Erreur lors de la modification");
    }
    setSelectedResult(null);
    setShowConfirmation(false);
  };

  const cancelEdit = () => {
    setSelectedResult(null);
    setShowConfirmation(false);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Corriger des données</h1>
      
      {/* Vue hiérarchique avec chargement progressif */}
      <Card className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Navigation hiérarchique</h2>
        
        {/* Étape 1: Sélection École */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-blue-700 mb-3">Sélectionner une école</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map(school => (
              <div
                key={school.id}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedSchool === school.id.toString()
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedSchool(school.id.toString());
                  setSelectedOption('');
                  setSelectedClass('');
                  // Charger les options de cette école
                  OptionService.getAllOptions().then(allOptions => {
                    const schoolOptions = allOptions.filter(opt => opt.ecoleId === school.id);
                    setOptions(schoolOptions);
                  });
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-800">{school.nom}</h4>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {school.ville}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{school.commune}</p>
                <p className="text-xs text-gray-500 mt-1">{school.type_ecole}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Étape 2: Sélection Option (visible seulement si école sélectionnée) */}
        {selectedSchool && (
          <div className="mb-6 animate-fade-in">
            <h3 className="text-lg font-medium text-green-700 mb-3">Sélectionner une option</h3>
            {options.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {options.map(option => (
                  <div
                    key={option.id}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      selectedOption === option.id.toString()
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedOption(option.id.toString());
                      setSelectedClass('');
                      // Charger les classes de cette école et option
                      ClasseService.getAllClasses().then(allClasses => {
                        const schoolClasses = allClasses.filter(cls => 
                          cls.ecoleId === Number(selectedSchool) && cls.optionId === option.id
                        );
                        setClasses(schoolClasses);
                      });
                    }}
                  >
                    <h4 className="font-medium text-gray-800">{option.nom}</h4>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucune option disponible pour cette école</p>
            )}
          </div>
        )}

        {/* Étape 3: Sélection Classe (visible seulement si option sélectionnée) */}
        {selectedOption && (
          <div className="mb-6 animate-fade-in">
            <h3 className="text-lg font-medium text-purple-700 mb-3">Sélectionner une classe</h3>
            {classes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {classes.map(classe => (
                  <div
                    key={classe.id}
                    className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      selectedClass === classe.id.toString()
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedClass(classe.id.toString());
                      // Charger les résultats pour cette combinaison
                      ResultatService.getAllResultats().then(allResults => {
                        const filteredResults = allResults.filter(result => {
                          const schoolId = typeof result.ecole === 'object' ? (result.ecole as any).id : Number(result.ecole);
                          const classId = typeof result.classe === 'object' ? (result.classe as any).id : Number(result.classe);
                          const optionId = typeof result.option === 'object' ? (result.option as any).id : Number(result.option);
                          
                          return schoolId === Number(selectedSchool) && 
                                 classId === classe.id && 
                                 optionId === Number(selectedOption);
                        });
                        setResults(filteredResults);
                      });
                    }}
                  >
                    <h4 className="font-medium text-gray-800">{classe.nom}</h4>
                    <p className="text-xs text-gray-500">{classe.niveau}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Aucune classe disponible pour cette option</p>
            )}
          </div>
        )}

        {/* Étape 4: Liste des élèves (visible seulement si classe sélectionnée) */}
        {selectedClass && filteredResults.length > 0 && (
          <div className="animate-fade-in">
            <h3 className="text-lg font-medium text-indigo-700 mb-3">
              Élèves de la classe ({filteredResults.length} résultats)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredResults.map(result => (
                <div
                  key={result.id}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleEdit(result)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        result.genre === 'M' ? 'bg-blue-400' : 'bg-pink-400'
                      }`}></span>
                      <span className="font-medium">{result.genre}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      result.moyenne >= 50 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.moyenne}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {result.mention}
                  </div>
                  <button className="mt-2 w-full text-xs bg-blue-100 text-blue-700 py-1 rounded hover:bg-blue-200 transition-colors">
                    Modifier
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message si aucune donnée */}
        {selectedClass && filteredResults.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 italic">Aucun élève trouvé pour cette sélection</p>
          </div>
        )}
      </Card>
      
      {selectedResult && (
        <Card title="Modifier les données">
          {/* ...modale de modification inchangée... */}
          {/* ...voir code précédent pour la partie édition... */}
        </Card>
      )}
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirmer la modification</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir modifier ces données ? Cette action sera enregistrée dans l'historique.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CorrectData;

/* Ajoute cette animation CSS dans ton fichier global */
<style jsx>{`
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`}</style>