import { useState, useEffect, useRef } from 'react';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import { MapPin, School, Filter, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { ClasseService, ClasseData } from '../../api/Classe.service';
import { OptionService, OptionData } from '../../api/Option.service';
import { AnneeService, AnneeData } from '../../api/Annee.service';
import { CalculationService, SchoolRankingData, GlobalStats } from '../../api/Calculation.service';
import { GeminiService, GeminiFilters } from '../../api/Gemini.service'; // <-- Ajout

function SchoolRankings() {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [sortBy, setSortBy] = useState('rang');
  const [isLoading, setIsLoading] = useState(false);

  // Filtres avancés
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');

  // IA recherche naturelle
  const [showSmartSearch, setShowSmartSearch] = useState(false);
  const [smartQuery, setSmartQuery] = useState('');
  const [isSmartLoading, setIsSmartLoading] = useState(false);
  const [smartError, setSmartError] = useState('');

  // Données dynamiques
  const [classes, setClasses] = useState<ClasseData[]>([]);
  const [options, setOptions] = useState<OptionData[]>([]);
  const [years, setYears] = useState<AnneeData[]>([]);
  const [schools, setSchools] = useState<SchoolRankingData[]>([]);
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null);

  // Résumé IA
  const [iaSummary, setIaSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  // Villes
  const cities = ['Toutes', 'Kolwezi', 'Lubumbashi', 'Likasi', 'Fungurume', 'Kambove'];

  // Chargement des données de base
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesData, optionsData, yearsData] = await Promise.all([
          ClasseService.getAllClasses(),
          OptionService.getAllOptions(),
          AnneeService.getAllAnnees()
        ]);
        setClasses(classesData);
        setOptions(optionsData);
        setYears(yearsData);
        if (yearsData.length > 0) {
          const latestYear = yearsData[yearsData.length - 1].id.toString();
          setSelectedYear(latestYear);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données de base:', error);
      }
    };
    fetchData();
  }, []);

  // Chargement des classements et stats selon les filtres
  useEffect(() => {
    const fetchRankingsAndStats = async () => {
      if (!selectedYear) return;
      setIsLoading(true);
      try {
        let rankingsData = await CalculationService.getSchoolRankings(
          Number(selectedYear),
          selectedCity === 'Toutes' || selectedCity === '' ? undefined : selectedCity,
          selectedClass ? Number(selectedClass) : undefined,
          selectedOption ? Number(selectedOption) : undefined,
          selectedGenre ? selectedGenre : undefined
        );

        // Tri
        const sortedData = rankingsData.sort((a, b) => {
          if (sortBy === 'rang') return a.rang - b.rang;
          if (sortBy === 'moyenne') return b.moyenne - a.moyenne;
          if (sortBy === 'tauxReussite') return b.tauxReussite - a.tauxReussite;
          return 0;
        });

        setSchools(sortedData);

        // Statistiques globales
        const stats = await CalculationService.getGlobalStats(Number(selectedYear));
        if (selectedCity && selectedCity !== 'Toutes') {
          if (sortedData.length > 0) {
            const totalEleves = sortedData.reduce((acc, s) => acc + (isNaN(s.nombreEleves) ? 0 : s.nombreEleves || 0), 0);
            const totalEcoles = sortedData.length;
            const moyenneGenerale =
              sortedData.reduce((acc, s) => acc + (isNaN(s.moyenne) ? 0 : s.moyenne), 0) / (totalEcoles || 1);
            const tauxReussiteGlobal =
              sortedData.reduce((acc, s) => acc + (isNaN(s.tauxReussite) ? 0 : s.tauxReussite), 0) / (totalEcoles || 1);

            setGlobalStats({
              moyenneGenerale: isNaN(moyenneGenerale) ? 0 : moyenneGenerale,
              tauxReussiteGlobal: isNaN(tauxReussiteGlobal) ? 0 : tauxReussiteGlobal,
              nombreEcoles: totalEcoles,
              nombreEleves: totalEleves,
            });
          } else {
            setGlobalStats({
              moyenneGenerale: 0,
              tauxReussiteGlobal: 0,
              nombreEcoles: 0,
              nombreEleves: 0,
            });
          }
        } else {
          setGlobalStats(stats);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des classements:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRankingsAndStats();
  }, [selectedCity, selectedClass, selectedOption, selectedYear, sortBy, selectedGenre]);

  // Option activée seulement pour le secondaire
  const isOptionEnabled = selectedClass && ['1ère Secondaire', '2ème Secondaire', '3ème Secondaire', '4ème Secondaire'].includes(
    classes.find(c => c.id.toString() === selectedClass)?.nom || ''
  );

  // Colonnes du tableau
  const columns = [
    {
      key: 'rang',
      header: 'Rang',
      render: (value: number) => (
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-full animate__animated animate__fadeIn ${
            value <= 3 ? 'bg-blue-100 text-blue-800 font-bold' : 'bg-gray-100 text-gray-800'
          }`}
        >
          {value}
        </span>
      )
    },
    { key: 'nom', header: 'École' },
    {
      key: 'ville',
      header: 'Localisation',
      render: (value: string) => (
        <span className="flex items-center animate__animated animate__fadeIn">
          <MapPin size={16} className="mr-1 text-gray-400" />
          {value}
        </span>
      )
    },
    { key: 'moyenne', header: 'Moyenne', render: (value: number) => value.toFixed(2) },
    { key: 'tauxReussite', header: 'Taux de réussite (%)', render: (value: number) => value.toFixed(1) },
    {
      key: 'optionPrincipale',
      header: 'Option principale',
      render: (value: string) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full animate__animated animate__fadeIn ${
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
  ];

  // Remplace la fonction handleSmartSearch par l'appel réel à Gemini
  const [showIaWave, setShowIaWave] = useState(false);
  const iaWaveRef = useRef<HTMLDivElement>(null);
  const handleSmartSearch = async () => {
    setIsSmartLoading(true);
    setSmartError('');
    try {
      const filters: GeminiFilters = await GeminiService.getFilters(smartQuery);
      // Animation IA : vague magique
      setShowIaWave(true);
      setTimeout(() => setShowIaWave(false), 1200);

      // Applique les filtres retournés par Gemini
      setSelectedCity(filters.ville || '');
      setSelectedGenre(filters.genre || '');
      setSelectedYear(
        filters.annee
          ? years.find(y => y.libelle.includes(filters.annee) || y.id.toString() === filters.annee)?.id?.toString() || ''
          : ''
      );
      setSelectedClass(
        filters.classe
          ? classes.find(c => c.nom.toLowerCase().includes(filters.classe.toLowerCase()))?.id?.toString() || ''
          : ''
      );
      setSelectedOption(
        filters.option
          ? options.find(o => o.nom.toLowerCase().includes(filters.option.toLowerCase()))?.id?.toString() || ''
          : ''
      );
      setShowSmartSearch(false);
      setSmartQuery('');
    } catch (e) {
      setSmartError("Erreur lors de l'analyse IA. Veuillez reformuler votre requête.");
    } finally {
      setIsSmartLoading(false);
    }
  };

  const generateIaSummary = async () => {
    setIsSummaryLoading(true);
    try {
      // Prépare la liste détaillée des écoles
      const details = schools.map(s =>
        `- ${s.nom} (${s.ville}) : moyenne ${s.moyenne?.toFixed(2)}, taux de réussite ${s.tauxReussite?.toFixed(1)}%`
      ).join('\n');

      // Prompt enrichi pour Gemini
      const prompt = `
Voici les résultats du classement des écoles selon les filtres :
ville = ${selectedCity || 'toutes'}, 
genre = ${selectedGenre || 'tous'}, 
année = ${years.find(y => y.id.toString() === selectedYear)?.libelle || 'toutes'}, 
classe = ${classes.find(c => c.id.toString() === selectedClass)?.nom || 'toutes'}, 
option = ${options.find(o => o.id.toString() === selectedOption)?.nom || 'toutes'}.

Nombre d'écoles trouvées : ${schools.length}.

Détails :
${details}

Fais un résumé en 2-3 phrases sur la performance générale, la diversité, et propose une recommandation personnalisée pour un parent qui cherche la meilleure école selon ces résultats.
Utilise un ton positif, moderne et dynamique.
    `;

      const response = await GeminiService.getSummary(prompt);
      setIaSummary(typeof response === 'string' ? response : JSON.stringify(response));
    } catch (e) {
      setIaSummary("Résumé IA indisponible pour le moment.");
    }
    setIsSummaryLoading(false);
  };

  // Génération automatique du résumé IA lorsque les résultats changent
  useEffect(() => {
    if (schools.length > 0) {
      generateIaSummary();
    } else {
      setIaSummary('');
    }
    // eslint-disable-next-line
  }, [selectedCity, selectedClass, selectedOption, selectedYear, selectedGenre, schools]);

  return (
    <div className="space-y-6 animate__animated animate__fadeIn relative overflow-hidden">
      {/* Animation vague IA */}
      {showIaWave && (
        <div
          ref={iaWaveRef}
          className="fixed left-0 top-0 w-full h-full pointer-events-none z-50"
          style={{ animation: 'iaWave 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        >
          <div className="w-full h-full bg-gradient-to-b from-blue-500/80 via-purple-500/70 to-transparent blur-2xl opacity-80"
            style={{
              clipPath: 'ellipse(80% 20% at 50% 0%)',
              filter: 'blur(32px)',
              animation: 'iaDistort 1.2s cubic-bezier(0.4,0,0.2,1)'
            }}
          />
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Sparkles className="text-blue-400 animate-bounce" /> Classement des écoles
      </h1>

      {/* Barre IA */}
      <div className="mb-4">
        <button
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded shadow hover:scale-105 transition-transform animate__animated animate__pulse"
          onClick={() => setShowSmartSearch(v => !v)}
        >
          <Sparkles className="mr-2 animate-pulse" /> Recherche intelligente (IA)
        </button>
        {showSmartSearch && (
          <div className="mt-3 animate__animated animate__fadeInDown">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tapez votre requête en langage naturel&nbsp;:
            </label>
            <div className="relative px-2 py-2" >
              <textarea
                value={smartQuery}
                onChange={e => setSmartQuery(e.target.value)}
                rows={2}
                className="w-full rounded-xl border-2 border-blue-400 shadow-lg px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-300 focus:border-purple-500 bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-all duration-300 placeholder:italic placeholder:text-blue-400 text-lg font-medium animate__animated animate__pulse"
                placeholder="Ex : Classement des écoles pour les filles à Kolwezi en 2023"
                style={{
                  boxShadow: '0 0 0 4px #a78bfa33, 0 8px 32px 0 #6366f180',
                  transition: 'box-shadow 0.3s'
                }}
              />
              <Sparkles className="absolute right-3 top-3 text-purple-400 animate-pulse" size={24} />
            </div>
            <div className="flex items-center gap-3 mt-4 relative px-2 py-2">
              <button
                onClick={handleSmartSearch}
                disabled={isSmartLoading || !smartQuery.trim()}
                className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-lg hover:scale-105 transition-transform font-semibold text-lg flex items-center gap-2 relative overflow-hidden"
                style={{
                  boxShadow: '0 4px 24px 0 #6366f180'
                }}
              >
                {isSmartLoading ? (
                  <>
                    <span className="animate-spin inline-block mr-2">
                      <Sparkles size={20} />
                    </span>
                    Analyse...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="animate-pulse" />
                    Générer les filtres
                  </>
                )}
              </button>
              <button
                onClick={() => setShowSmartSearch(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              <b>Exemples :</b> <br />
              - "Classement des écoles pour les garçons à Lubumbashi en 2022"<br />
              - "Voir les écoles où les filles réussissent le mieux à Kolwezi"<br />
              - "Classement 2023 toutes villes"<br />
              <span className="text-blue-500">L'IA va générer et appliquer les filtres automatiquement !</span>
            </div>
            {smartError && <div className="text-red-500 mt-2">{smartError}</div>}
          </div>
        )}
      </div>

      <Card>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 animate__animated animate__fadeIn">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les villes</option>
              {cities.filter(c => c !== 'Toutes').map((city) => (
                <option key={city} value={city}>
                  {city}
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
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedOption('');
              }}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Toutes les classes</option>
              {classes.map((classe) => (
                <option key={classe.id} value={classe.id.toString()}>
                  {classe.nom}
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
              disabled={!isOptionEnabled}
              className={`w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                !isOptionEnabled ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              <option value="">Toutes les options</option>
              {options.map((option) => (
                <option key={option.id} value={option.id.toString()}>
                  {option.nom}
                </option>
              ))}
            </select>
            {!isOptionEnabled && selectedClass && (
              <p className="text-xs text-gray-500 mt-1 animate__animated animate__fadeIn">
                Options disponibles uniquement pour le secondaire
              </p>
            )}
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
                <option key={year.id} value={year.id.toString()}>
                  {year.libelle}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trier par
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="rang">Classement</option>
              <option value="moyenne">Moyenne</option>
              <option value="tauxReussite">Taux de réussite</option>
            </select>
          </div>
        </div>

        {/* Menu déroulant pour autres filtres */}
        <div className="mb-4 animate__animated animate__fadeIn">
          <button
            type="button"
            className="flex items-center text-blue-600 hover:underline focus:outline-none"
            onClick={() => setShowAdvancedFilters(v => !v)}
          >
            <Filter size={18} className="mr-2" />
            Autre filtre
            {showAdvancedFilters ? <ChevronUp size={18} className="ml-1" /> : <ChevronDown size={18} className="ml-1" />}
          </button>
          {showAdvancedFilters && (
            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 animate__animated animate__fadeInDown">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={e => setSelectedGenre(e.target.value)}
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Tous</option>
                  <option value="M">Garçons</option>
                  <option value="F">Filles</option>
                </select>
              </div>
              {/* Tu peux ajouter d'autres filtres ici */}
            </div>
          )}
        </div>
      </Card>

      {/* Résumé IA placé AVANT les résultats */}
      {(isSummaryLoading || iaSummary) && (
        <div className="relative my-6 animate__animated animate__fadeInUp">
          <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-l-4 border-blue-400 rounded-xl shadow-lg px-6 py-4 flex items-center gap-4 overflow-hidden">
            <Sparkles className="text-purple-400 animate-pulse flex-shrink-0" size={32} />
            <div>
              <div className="font-semibold text-blue-700 mb-1 flex items-center gap-2">
                <span>Résumé IA</span>
                {isSummaryLoading && <span className="animate-spin ml-2"><Sparkles size={18} /></span>}
              </div>
              <div className="text-gray-700 text-base animate__animated animate__fadeIn">
                {isSummaryLoading ? "Génération du résumé en cours..." : iaSummary}
              </div>
            </div>
          </div>
        </div>
      )}

      {globalStats && (
        <Card title="Statistiques générales">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate__animated animate__fadeIn">
            <div className="bg-blue-50 p-4 rounded-lg shadow animate__animated animate__fadeIn">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Moyenne générale</h4>
              <p className="text-2xl font-bold text-blue-800">{globalStats.moyenneGenerale.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg shadow animate__animated animate__fadeIn">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Taux de réussite global</h4>
              <p className="text-2xl font-bold text-green-800">{globalStats.tauxReussiteGlobal.toFixed(1)}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg shadow animate__animated animate__fadeIn">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Nombre d'écoles</h4>
              <p className="text-2xl font-bold text-purple-800">{globalStats.nombreEcoles}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg shadow animate__animated animate__fadeIn">
              <h4 className="text-sm font-medium text-gray-500 mb-1">Nombre d'élèves</h4>
              <p className="text-2xl font-bold text-yellow-800">{globalStats.nombreEleves}</p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-center space-x-3 animate__animated animate__fadeIn">
          <Filter size={20} className="text-blue-500 animate-spin-slow" />
          <div>
            <h3 className="font-medium">Résultats filtrés</h3>
            <p className="text-sm text-gray-600">
              Affichage de {schools.length} écoles
              {selectedCity && selectedCity !== 'Toutes' ? ` à ${selectedCity}` : ''}
              {selectedClass ? ` pour la classe de ${classes.find(c => c.id.toString() === selectedClass)?.nom || ''}` : ''}
              {isOptionEnabled && selectedOption ? ` avec l'option ${options.find(o => o.id.toString() === selectedOption)?.nom || ''}` : ''}
              {selectedYear ? ` pour l'année ${years.find(y => y.id.toString() === selectedYear)?.libelle || ''}` : ''}
              {sortBy === 'rang' ? ' triées par classement' :
                sortBy === 'moyenne' ? ' triées par moyenne' :
                  ' triées par taux de réussite'}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12 text-center animate__animated animate__fadeIn">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-2 text-gray-600">Chargement des données...</p>
          </div>
        ) : schools.length > 0 ? (
          <DataTable
            columns={columns}
            data={schools}
          />
        ) : (
          <div className="py-12 text-center text-gray-500 animate__animated animate__fadeIn">
            <School size={48} className="mx-auto mb-4 text-gray-300 animate-bounce" />
            <p>Aucune école ne correspond aux critères sélectionnés.</p>
            <p className="text-sm mt-2">Essayez de modifier vos filtres ou utilisez la <b>Recherche intelligente</b> pour plus de résultats.</p>
          </div>
        )}
      </Card>

      <Card title="Comment est calculé le classement ?">
        <div className="space-y-4 text-gray-600 animate__animated animate__fadeIn">
          <p>
            Le classement des écoles est basé sur plusieurs facteurs, principalement :
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>La moyenne générale des élèves (50% du score)</li>
            <li>Le taux de réussite aux examens (30% du score)</li>
            <li>La progression par rapport aux années précédentes (10% du score)</li>
            <li>La diversité des options proposées (10% du score)</li>
          </ul>
          <p>
            Ce classement est mis à jour chaque année après la publication des résultats d'examens officiels.
          </p>
        </div>
      </Card>

      <style>{`
        .animate__animated { animation-duration: 0.7s; }
        .animate-spin-slow { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes iaWave {
          0% { opacity: 0; transform: translateY(-100%) scaleY(0.7);}
          20% { opacity: 1; }
          60% { opacity: 1; transform: translateY(0) scaleY(1);}
          100% { opacity: 0; transform: translateY(100%) scaleY(1.2);}
        }
        @keyframes iaDistort {
          0% { filter: blur(48px) brightness(1.2);}
          50% { filter: blur(16px) brightness(1.5);}
          100% { filter: blur(64px) brightness(1);}
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate__fadeInUp { animation: fadeInUp 0.7s; }
      `}</style>
    </div>
  );
}

export default SchoolRankings;