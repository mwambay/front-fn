import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { Search } from 'lucide-react';
import { AnneeService, AnneeData } from '../../api/Annee.service';

function ManageYears() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState<AnneeData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [years, setYears] = useState<AnneeData[]>([]);
  const [yearLabel, setYearLabel] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      const data = await AnneeService.getAllAnnees();
      setYears(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des années');
      console.error('Erreur lors du chargement des années :', error);
    }
  };

  useEffect(() => {
    if (selectedYear) {
      setYearLabel(selectedYear.libelle);
    } else {
      setYearLabel('');
    }
  }, [selectedYear]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const promise = selectedYear
      ? AnneeService.updateAnnee(selectedYear.id, { libelle: yearLabel })
      : AnneeService.createAnnee({ libelle: yearLabel });

    toast.promise(promise, {
      loading: selectedYear ? 'Modification en cours...' : 'Ajout en cours...',
      success: selectedYear ? 'Année modifiée avec succès' : 'Année ajoutée avec succès',
      error: "Une erreur s'est produite"
    });

    try {
      await promise;
      setShowAddForm(false);
      setSelectedYear(null);
      setYearLabel('');
      fetchYears();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (confirmDeleteId !== null) {
      const promise = AnneeService.deleteAnnee(confirmDeleteId);

      toast.promise(promise, {
        loading: 'Suppression en cours...',
        success: 'Année supprimée avec succès',
        error: "Impossible de supprimer cette année (peut-être liée à d'autres données)"
      });

      try {
        await promise;
        fetchYears();
      } catch (error) {
        console.error(error);
      } finally {
        setConfirmDeleteId(null);
      }
    }
  };

  const filteredYears = years.filter(year =>
    year.libelle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'libelle', header: 'Année scolaire' },
    {
      key: 'id',
      header: 'Action',
      render: (_: number, item: AnneeData) => (
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setSelectedYear(item);
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
        <h1 className="text-2xl font-bold text-gray-800">Gestion des années scolaires</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setSelectedYear(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Ajouter une année
        </button>
      </div>

      <Card>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une année..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredYears}
        />
      </Card>

      <Modal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setSelectedYear(null);
          setYearLabel('');
        }}
        title={selectedYear ? "Modifier l'année scolaire" : "Ajouter une année scolaire"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Libellé de l'année
            </label>
            <input
              type="text"
              value={yearLabel}
              onChange={(e) => setYearLabel(e.target.value)}
              placeholder="Ex: 2023-2024"
              required
              pattern="\d{4}-\d{4}"
              title="Format requis: AAAA-AAAA (ex: 2023-2024)"
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="mt-1 text-sm text-gray-500">Format: AAAA-AAAA (ex: 2023-2024)</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setSelectedYear(null);
                setYearLabel('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {selectedYear ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </Modal>

      {confirmDeleteId !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-bold mb-4 text-red-600">Confirmer la suppression</h2>
            <p className="mb-4">
              Êtes-vous sûr de vouloir supprimer cette année scolaire ?<br />
              <span className="text-sm text-gray-600">
                <b>Attention :</b> Cette action supprimera aussi tous les résultats liés à cette année de façon irréversible.
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

export default ManageYears;