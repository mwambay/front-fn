import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { GraduationCap, Search } from 'lucide-react';
import { ClasseService, ClasseData } from '../../api/Classe.service';

// Schéma des noms de classes selon le niveau
const CLASS_NAMES: Record<string, string[]> = {
  'Primaire': [
    '1ère Primaire', '2ème Primaire', '3ème Primaire', '4ème Primaire', '5ème Primaire', '6ème Primaire'
  ],
  'Secondaire - Base': [
    '7ème', '8ème'
  ],
  'Secondaire': [
    '1ère Secondaire', '2ème Secondaire', '3ème Secondaire', '4ème Secondaire'
  ]
};

// Map pour générer le numéro d'ordre automatiquement
const ORDRE_MAP: Record<string, number> = {
  '1ère Primaire': 1,
  '2ème Primaire': 2,
  '3ème Primaire': 3,
  '4ème Primaire': 4,
  '5ème Primaire': 5,
  '6ème Primaire': 6,
  '7ème': 7,
  '8ème': 8,
  '1ère Secondaire': 9,
  '2ème Secondaire': 10,
  '3ème Secondaire': 11,
  '4ème Secondaire': 12,
};

function ManageClasses() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClasseData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState<ClasseData[]>([]);
  const [formData, setFormData] = useState<Omit<ClasseData, 'id'>>({
    nom: '',
    niveau: '',
    numero_ordre: 1,
  });

  // Ajout pour la confirmation de suppression
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // Liste des niveaux
  const niveauList = Object.keys(CLASS_NAMES);
  // Liste des noms de classe selon le niveau sélectionné
  const nomClasseList = formData.niveau ? CLASS_NAMES[formData.niveau] : [];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await ClasseService.getAllClasses();
      setClasses(data);
    } catch (error) {
      console.error('Erreur lors du chargement des classes :', error);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      const { id, ...rest } = selectedClass;
      setFormData(rest);
    } else {
      setFormData({
        nom: '',
        niveau: '',
        numero_ordre: 1,
      });
    }
  }, [selectedClass, showAddForm]);

  // Remise à zéro du nom de classe si le niveau change
  useEffect(() => {
    setFormData(f => ({
      ...f,
      nom: nomClasseList.includes(f.nom) ? f.nom : '',
      numero_ordre: f.nom && ORDRE_MAP[f.nom] ? ORDRE_MAP[f.nom] : 1
    }));
    // eslint-disable-next-line
  }, [formData.niveau]);

  // Générer automatiquement le numéro d'ordre quand le nom de la classe change
  useEffect(() => {
    setFormData(f => ({
      ...f,
      numero_ordre: f.nom && ORDRE_MAP[f.nom] ? ORDRE_MAP[f.nom] : 1
    }));
  }, [formData.nom]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedClass) {
        await ClasseService.updateClasse(selectedClass.id, formData);
        alert('Classe modifiée');
      } else {
        await ClasseService.createClasse(formData);
        alert('Classe ajoutée');
      }
      setShowAddForm(false);
      setSelectedClass(null);
      fetchClasses();
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (confirmDeleteId !== null) {
      try {
        await ClasseService.deleteClasse(confirmDeleteId);
        fetchClasses();
      } catch (error) {
        alert("Impossible de supprimer cette classe (peut-être liée à d'autres données)");
      } finally {
        setConfirmDeleteId(null);
      }
    }
  };

  const filteredClasses = classes.filter(cls =>
    cls.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.niveau.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'nom', header: 'Nom de la classe' },
    { key: 'niveau', header: 'Niveau' },
    { key: 'numero_ordre', header: 'Ordre' },
    {
      key: 'id',
      header: 'Action',
      render: (_: number, item: ClasseData) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedClass(item);
              setShowAddForm(true);
            }}
            className="text-blue-600 hover:text-blue-900"
          >
            Modifier
          </button>
          <button
            onClick={() => setConfirmDeleteId(item.id)}
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
        <h1 className="text-2xl font-bold text-gray-800">Gestion des classes</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setSelectedClass(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Ajouter une classe
        </button>
      </div>

      <Card>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une classe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredClasses}
        />
      </Card>

      <Modal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setSelectedClass(null);
        }}
        title={selectedClass ? "Modifier la classe" : "Ajouter une classe"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Niveau */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Niveau
              </label>
              <select
                value={formData.niveau}
                onChange={e => setFormData(f => ({
                  ...f,
                  niveau: e.target.value,
                  nom: ''
                }))}
                required
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner un niveau</option>
                {niveauList.map(niv => (
                  <option key={niv} value={niv}>{niv}</option>
                ))}
              </select>
            </div>
            {/* Nom de la classe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom de la classe
              </label>
              <select
                value={formData.nom}
                onChange={e => setFormData(f => ({
                  ...f,
                  nom: e.target.value
                }))}
                required
                disabled={!formData.niveau}
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner un nom</option>
                {nomClasseList.map(nom => (
                  <option key={nom} value={nom}>{nom}</option>
                ))}
              </select>
            </div>
            {/* Numéro d'ordre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro d'ordre
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.numero_ordre}
                readOnly
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-100 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setSelectedClass(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {selectedClass ? 'Modifier' : 'Ajouter'}
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
              Êtes-vous sûr de vouloir supprimer cette classe ?<br />
              <span className="text-sm text-gray-600">
                <b>Attention :</b> Cette action supprimera aussi tous les résultats annuels liés à cette classe de façon irréversible.
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

export default ManageClasses;