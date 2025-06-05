import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { School, Search } from 'lucide-react';
import { SchoolService, SchoolData } from '../../api/School.service';

// --- Ajout de la structure des provinces, villes et communes ---
const PROVINCES: Record<string, Record<string, string[]>> = {
  "Haut-Katanga": {
    "Lubumbashi": ["Lubumbashi", "Kampemba", "Katuba", "Kenya", "Annexe", "Ruashi"],
    "Kasumbalesa": ["Kasumbalesa"],
    "Kipushi": ["Kipushi"],
    "Likasi": ["Likasi", "Panda", "Shituru", "Kikula"]
  },
  "Haut-Lomami": {
    "Kamina": ["Kamina"],
    "Kabongo": ["Kabongo"],
    "Kaniama": ["Kaniama"],
    "Bukama": ["Bukama"]
  },
  "Lualaba": {
    "Kolwezi": ["Dilala", "Manika"],
    "Mutshatsha": ["Mutshatsha"],
    "Fungurume": ["Fungurume"]
  },
  "Tanganyika": {
    "Kalemie": ["Kalemie", "Kituku", "Lukuga"],
    "Kongolo": ["Kongolo"],
    "Manono": ["Manono"],
    "Moba": ["Moba"]
  }
};

function ManageSchools() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<SchoolData, 'id'>>({
    nom: '',
    code_ecole: '',
    province: '',
    ville: '',
    commune: '',
    statut: 'publique',
    type_ecole: 'général',
  });

  // Pour la boîte de dialogue de confirmation
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // --- Gestion dynamique des listes déroulantes ---
  const provinceList = Object.keys(PROVINCES);
  const villeList = formData.province ? Object.keys(PROVINCES[formData.province]) : [];
  const communeList = formData.province && formData.ville
    ? PROVINCES[formData.province][formData.ville] || []
    : [];

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    try {
      const data = await SchoolService.getAllSchools();
      setSchools(data);
    } catch (error) {
      console.error('Erreur lors du chargement des écoles :', error);
    }
  };

  useEffect(() => {
    if (selectedSchool) {
      const { id, ...rest } = selectedSchool;
      setFormData(rest);
    } else {
      setFormData({
        nom: '',
        code_ecole: '',
        province: '',
        ville: '',
        commune: '',
        statut: 'publique',
        type_ecole: 'général',
      });
    }
  }, [selectedSchool, showAddForm]);

  // Remise à zéro des champs dépendants lors du changement de province ou ville
  useEffect(() => {
    setFormData(f => ({
      ...f,
      ville: f.province && villeList.includes(f.ville) ? f.ville : '',
      commune: f.province && f.ville && communeList.includes(f.commune) ? f.commune : ''
    }));
    // eslint-disable-next-line
  }, [formData.province, formData.ville]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedSchool) {
        await SchoolService.updateSchool(selectedSchool.id, formData);
        alert('École modifiée');
      } else {
        await SchoolService.createSchool(formData);
        alert('École ajoutée');
      }
      setShowAddForm(false);
      setSelectedSchool(null);
      fetchSchools();
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
      console.error(error);
    }
  };

  const confirmDelete = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = async () => {
    if (confirmDeleteId !== null) {
      try {
        await SchoolService.deleteSchool(confirmDeleteId);
        fetchSchools();
      } catch (error) {
        alert("Impossible de supprimer cette école (peut-être liée à d'autres données)");
      } finally {
        setConfirmDeleteId(null);
      }
    }
  };

  const filteredSchools = schools.filter(school =>
    school.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.code_ecole.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'nom', header: 'Nom' },
    { key: 'code_ecole', header: 'Code' },
    { key: 'province', header: 'Province' },
    { key: 'ville', header: 'Ville' },
    { key: 'commune', header: 'Commune' },
    { 
      key: 'statut', 
      header: 'Statut',
      render: (value: string) => (
        <span className="capitalize">{value}</span>
      )
    },
    { 
      key: 'type_ecole', 
      header: 'Type',
      render: (value: string) => (
        <span className="capitalize">{value}</span>
      )
    },
    {
      key: 'id',
      header: 'Action',
      render: (_: number, item: SchoolData) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedSchool(item);
              setShowAddForm(true);
            }}
            className="text-blue-600 hover:text-blue-900"
          >
            Modifier
          </button>
          <button
            onClick={() => confirmDelete(item.id)}
            className="text-red-600 hover:text-red-900"
          >
            Supprimer
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des écoles</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setSelectedSchool(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Ajouter une école
        </button>
      </div>

      <Card>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher par nom ou code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredSchools}
        />
      </Card>

      {/* Modal pour ajout/modification */}
      <Modal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setSelectedSchool(null);
        }}
        title={selectedSchool ? "Modifier l'école" : "Ajouter une école"}
        size="lg"
      >
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'école
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={e => setFormData(f => ({ ...f, nom: e.target.value }))}
                required
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code de l'école
              </label>
              <input
                type="text"
                value={formData.code_ecole}
                onChange={e => setFormData(f => ({ ...f, code_ecole: e.target.value }))}
                required
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province
              </label>
              <select
                value={formData.province}
                onChange={e => setFormData(f => ({
                  ...f,
                  province: e.target.value,
                  ville: '',
                  commune: ''
                }))}
                required
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner une province</option>
                {provinceList.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <select
                value={formData.ville}
                onChange={e => setFormData(f => ({
                  ...f,
                  ville: e.target.value,
                  commune: ''
                }))}
                required
                disabled={!formData.province}
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner une ville</option>
                {villeList.map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>
            {/* Commune */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commune
              </label>
              <select
                value={formData.commune}
                onChange={e => setFormData(f => ({
                  ...f,
                  commune: e.target.value
                }))}
                required
                disabled={!formData.ville}
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner une commune</option>
                {communeList.map(commune => (
                  <option key={commune} value={commune}>{commune}</option>
                ))}
              </select>
            </div>
            {/* Statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                value={formData.statut}
                onChange={e => setFormData(f => ({ ...f, statut: e.target.value }))}
                required
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="publique">Publique</option>
                <option value="privée">Privée</option>
              </select>
            </div>
            {/* Type d'école */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'école
              </label>
              <select
                value={formData.type_ecole}
                onChange={e => setFormData(f => ({ ...f, type_ecole: e.target.value }))}
                required
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="général">Général</option>
                <option value="technique">Technique</option>
                <option value="professionnel">Professionnel</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setSelectedSchool(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {selectedSchool ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Boîte de dialogue de confirmation */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-red-600">Confirmer la suppression</h2>
            <p className="mb-4">
              Êtes-vous sûr de vouloir supprimer cette école ?<br />
              <span className="text-sm text-gray-600">
                <b>Attention :</b> Cette action supprimera aussi tous les résultats annuels liés à cette école de façon irréversible.
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageSchools;