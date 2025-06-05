import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import { MapPin, Search } from 'lucide-react';
import { OptionService, OptionData } from '../../api/Option.service';
import { CalculationService, SchoolRankingData } from '../../api/Calculation.service';
import { AnneeService, AnneeData } from '../../api/Annee.service';
import { GeminiService } from '../../api/Gemini.service';
interface SchoolData {
  id: string;
  name: string;
  location: string;
  average: number;
  successRate: number;
  mainOption: string;
  otherOptions: string[];
  rank: number;
}

function SearchByOption() {
  const [options, setOptions] = useState<OptionData[]>([]);
  const [locations, setLocations] = useState<string[]>(['Toutes les villes']);
  const [years, setYears] = useState<AnneeData[]>([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('Toutes les villes');
  const [selectedYear, setSelectedYear] = useState('');
  const [searchResults, setSearchResults] = useState<SchoolData[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [iaSummary, setIaSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  // Charger options, années et villes au montage
  useEffect(() => {
    OptionService.getAllOptions().then(setOptions);
    AnneeService.getAllAnnees().then(setYears);
    // Récupérer toutes les villes disponibles via CalculationService
    CalculationService.getSchoolRankings(years[0]?.id || 1).then((schools) => {
      const villes = Array.from(new Set(schools.map((s: SchoolRankingData) => s.ville)));
      setLocations(['Toutes les villes', ...villes]);
    });
  }, [years.length]);


  const generateIaSummary = async () => {
    setIsSummaryLoading(true);
    try {
      const details = searchResults.map(s =>
        `- ${s.name} (${s.location}) : moyenne ${s.average?.toFixed(2)}, taux de réussite ${s.successRate?.toFixed(1)}%`
      ).join('\n');

      const prompt = `
  Voici les résultats de la recherche d'écoles pour l'option "${options.find(o => String(o.id) === selectedOption)?.nom || ''}"${selectedLocation && selectedLocation !== 'Toutes les villes' ? ` à ${selectedLocation}` : ''}${selectedYear ? ` pour l'année ${years.find(y => String(y.id) === selectedYear)?.libelle}` : ''}.

  Nombre d'écoles trouvées : ${searchResults.length}.

  Détails :
  ${details}

  Fais un résumé en 2-3 phrases sur la performance générale, la diversité, et propose une recommandation personnalisée pour un élève qui cherche la meilleure école selon ces résultats.
  Utilise un ton positif, moderne et dynamique.
      `;

      const response = await GeminiService.getSummary(prompt);
      setIaSummary(typeof response === 'string' ? response : JSON.stringify(response));
    } catch (e) {
      setIaSummary("Résumé IA indisponible pour le moment.");
    }
    setIsSummaryLoading(false);
  };
  const handleSearch = async () => {
    if (!selectedOption || !selectedYear) return;
    // Récupérer le classement filtré par option et ville
    const optionObj = options.find(opt => String(opt.id) === selectedOption);
    const rankings: SchoolRankingData[] = await CalculationService.getSchoolRankings(
      Number(selectedYear),
      selectedLocation !== 'Toutes les villes' ? selectedLocation : undefined,
      undefined,
      Number(selectedOption)
    );
    // Adapter les données pour le tableau
    const results: SchoolData[] = rankings.map((school) => ({
      id: String(school.id),
      name: school.nom,
      location: school.ville,
      average: school.moyenne,
      successRate: school.tauxReussite,
      mainOption: school.optionPrincipale,
      otherOptions: [], // À remplir si dispo dans l'API
      rank: school.rang,
    }));
    setSearchResults(results);
    setHasSearched(true);
  };

  // Colonnes du tableau
  const columns = [
    { key: 'name', header: 'École' },
    { 
      key: 'location', 
      header: 'Localisation',
      render: (value: string) => (
        <span className="flex items-center">
          <MapPin size={16} className="mr-1 text-gray-400" />
          {value}
        </span>
      )
    },
    { key: 'average', header: 'Moyenne' },
    { key: 'successRate', header: 'Taux de réussite (%)' },
    { 
      key: 'mainOption', 
      header: 'Option principale',
      render: (value: string) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-300`}
        >
          {value}
        </span>
      )
    },
    { key: 'rank', header: 'Classement' },
  ];

  useEffect(() => {
    if (searchResults.length > 0) {
      generateIaSummary();
    } else {
      setIaSummary('');
    }
    // eslint-disable-next-line
  }, [searchResults]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Rechercher une école par option</h1>
      
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filière / Option
            </label>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sélectionnez une option</option>
              {options.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.nom}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Localisation
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Année scolaire
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
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={!selectedOption || !selectedYear}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Search size={18} className="inline mr-2" />
              Rechercher
            </button>
          </div>
        </div>
      </Card>

      {(isSummaryLoading || iaSummary) && (
        <div className="relative my-6 animate__animated animate__fadeInUp">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-l-4 border-blue-400 rounded-xl shadow-lg px-6 py-4 flex items-center gap-4 overflow-hidden">
            <span className="font-semibold text-blue-700 mb-1 flex items-center gap-2">
              Résumé IA
              {isSummaryLoading && <span className="animate-spin ml-2"><Search size={18} /></span>}
            </span>
            <div className="text-gray-700 text-base animate__animated animate__fadeIn">
              {isSummaryLoading ? "Génération du résumé en cours..." : iaSummary}
            </div>
          </div>
        </div>
      )}

      {hasSearched && (
        <Card title="Résultats de recherche">
          {searchResults.length > 0 ? (
            <>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-600">
                  {searchResults.length} école(s) trouvée(s) avec l'option {options.find(o => String(o.id) === selectedOption)?.nom}
                  {selectedLocation && selectedLocation !== 'Toutes les villes' ? ` à ${selectedLocation}` : ''}
                </p>
              </div>
              
              <DataTable
                columns={columns}
                data={searchResults}
                pagination={false}
              />
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Aucun résultat trouvé</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Aucune école ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
              </p>
            </div>
          )}
        </Card>
      )}

      {/* ...section d'informations sur les options... */}
      <Card title="Informations sur les options">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Math-Info</h3>
            <p className="text-blue-700 mb-2">
              Option axée sur les mathématiques, l'informatique et les sciences exactes.
            </p>
            <p className="text-sm text-blue-600">
              Débouchés : ingénierie, programmation, finance, recherche scientifique.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Biochimie</h3>
            <p className="text-green-700 mb-2">
              Option centrée sur la biologie, la chimie et les sciences de la vie.
            </p>
            <p className="text-sm text-green-600">
              Débouchés : médecine, pharmacie, agronomie, recherche biologique.
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-800 mb-2">Littérature</h3>
            <p className="text-purple-700 mb-2">
              Option focalisée sur les langues, la littérature et la philosophie.
            </p>
            <p className="text-sm text-purple-600">
              Débouchés : journalisme, édition, enseignement, communication.
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">Sciences Sociales</h3>
            <p className="text-yellow-700 mb-2">
              Option orientée vers l'histoire, la géographie, l'économie et la sociologie.
            </p>
            <p className="text-sm text-yellow-600">
              Débouchés : droit, économie, sciences politiques, travail social.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default SearchByOption;