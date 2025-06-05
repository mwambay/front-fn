import { useEffect, useState } from 'react';
import { TrendingUp, Award, School } from 'lucide-react';
import Card from '../../components/Card';
import StatCard from '../../components/StatCard';
import BarChart from '../../components/BarChart';
import { CalculationService } from '../../api/Calculation.service';
import { AnneeService, AnneeData } from '../../api/Annee.service';

function ParentDashboard() {
  const [stats, setStats] = useState({
    totalSchools: 0,
    topPerformingSchool: '',
    topPerformance: 0,
    topImprovingSchool: '',
    improvementRate: 0,
  });
  const [topSchools, setTopSchools] = useState<{ labels: string[]; datasets: any[] }>({
    labels: [],
    datasets: [
      {
        label: 'Moyenne générale',
        data: [],
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
      },
    ],
  });

  const [annees, setAnnees] = useState<AnneeData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Récupérer les années au chargement et sélectionner la plus récente
  useEffect(() => {
    AnneeService.getAllAnnees().then(data => {
      setAnnees(data);
      if (data.length > 0) setSelectedYear(data[data.length - 1].id); // dernière année (id)
    });
  }, []);

  // Charger les stats et le classement dès qu'une année est sélectionnée
  useEffect(() => {
    if (!selectedYear) return;

    CalculationService.getGlobalStats(selectedYear).then(data => {
      setStats(prev => ({
        ...prev,
        totalSchools: data.nombreEcoles,
      }));
    });

    CalculationService.getSchoolRankings(selectedYear).then(data => {
      if (data.length > 0) {
        const sorted = [...data].sort((a, b) => b.moyenne - a.moyenne).slice(0, 5);
        setTopSchools({
          labels: sorted.map(s => s.nom),
          datasets: [
            {
              label: 'Moyenne générale',
              data: sorted.map(s => s.moyenne),
              backgroundColor: 'rgba(59, 130, 246, 0.6)',
            },
          ],
        });
        setStats(prev => ({
          ...prev,
          topPerformingSchool: sorted[0]?.nom || '',
          topPerformance: sorted[0]?.moyenne || 0,
        }));

        const topImproving = [...data].sort((a, b) => b.tauxReussite - a.tauxReussite)[0];
        setStats(prev => ({
          ...prev,
          topImprovingSchool: topImproving?.nom || '',
          improvementRate: topImproving?.tauxReussite || 0,
        }));
      }
    });
  }, [selectedYear]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tableau de bord parent</h1>

      {/* Sélecteur d'année */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Année scolaire</label>
        <select
          value={selectedYear ?? ''}
          onChange={e => setSelectedYear(Number(e.target.value))}
          className="w-full max-w-xs rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          {annees.map(annee => (
            <option key={annee.id} value={annee.id}>{annee.libelle}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Écoles dans le système" 
          value={stats.totalSchools} 
          icon={<School size={24} />} 
        />
        <StatCard 
          title="École la plus performante" 
          value={stats.topPerformingSchool} 
          icon={<Award size={24} />} 
        />
        <StatCard 
          title="Meilleure progression" 
          value={stats.topImprovingSchool} 
          icon={<TrendingUp size={24} />} 
          trend={{ value: stats.improvementRate, isPositive: true }}
        />
      </div>
      
      <Card title="Meilleures écoles">
        <BarChart 
          title="Top 5 des écoles par performance" 
          labels={topSchools.labels} 
          datasets={topSchools.datasets}
        />
      </Card>
      
      <Card title="Recommandations pour les parents">
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Comment utiliser ce portail</h3>
            <p className="text-blue-700">
              Ce portail vous permet de consulter les performances des écoles, de les comparer et de prendre des décisions éclairées pour l'éducation de vos enfants.
            </p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Choisir une école</h3>
            <p className="text-green-700">
              Utilisez les classements et les comparaisons pour identifier les écoles qui correspondent le mieux aux besoins et aux intérêts de votre enfant.
            </p>
          </div>
          
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-medium text-amber-800 mb-2">Comprendre les indicateurs</h3>
            <p className="text-amber-700">
              La moyenne générale et le taux de réussite sont des indicateurs importants, mais tenez également compte d'autres facteurs comme les options proposées et l'emplacement.
            </p>
          </div>
        </div>
      </Card>
{/*       
      <Card title="Actualités éducatives">
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium mb-1">Réforme du programme scolaire annoncée</h3>
            <p className="text-gray-600 text-sm mb-2">
              Le ministère de l'Éducation a annoncé des changements majeurs dans le programme scolaire qui entreront en vigueur l'année prochaine.
            </p>
            <p className="text-sm text-blue-600">Lire la suite →</p>
          </div>
          
          <div className="border-b border-gray-200 pb-4">
            <h3 className="font-medium mb-1">Journée portes ouvertes dans les écoles</h3>
            <p className="text-gray-600 text-sm mb-2">
              Plusieurs écoles organisent des journées portes ouvertes ce mois-ci. Une excellente occasion de visiter et de poser vos questions.
            </p>
            <p className="text-sm text-blue-600">Voir le calendrier →</p>
          </div>
          
          <div>
            <h3 className="font-medium mb-1">Guide des options scolaires</h3>
            <p className="text-gray-600 text-sm mb-2">
              Nous avons publié un guide complet pour aider les parents à comprendre les différentes options proposées dans les écoles.
            </p>
            <p className="text-sm text-blue-600">Télécharger le guide →</p>
          </div>
        </div>
      </Card> */}
    </div>
  );
}

export default ParentDashboard;