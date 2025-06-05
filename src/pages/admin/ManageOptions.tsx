import { useState, useEffect } from 'react';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { BookOpen, Search } from 'lucide-react';
import { OptionService, OptionData } from '../../api/Option.service';

function ManageOptions() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedOption, setSelectedOption] = useState<OptionData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<OptionData[]>([]);
  const [optionName, setOptionName] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const data = await OptionService.getAllOptions();
      setOptions(data);
    } catch (error) {
      console.error('Erreur lors du chargement des options :', error);
    }
  };

  useEffect(() => {
    if (selectedOption) {
      setOptionName(selectedOption.nom);
      setShowAddForm(true);
    } else {
      setOptionName('');
    }
  }, [selectedOption]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (selectedOption) {
        await OptionService.updateOption(selectedOption.id, { nom: optionName });
        alert("Option modifiée");
      } else {
        await OptionService.createOption({ nom: optionName });
        alert("Option ajoutée");
      }
      setShowAddForm(false);
      setSelectedOption(null);
      setOptionName('');
      fetchOptions();
    } catch (error) {
      alert("Erreur lors de l'enregistrement");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (confirmDeleteId !== null) {
      try {
        await OptionService.deleteOption(confirmDeleteId);
        fetchOptions();
      } catch (error) {
        alert("Impossible de supprimer cette option (peut-être liée à d'autres données)");
      } finally {
        setConfirmDeleteId(null);
      }
    }
  };

  const filteredOptions = options.filter(option =>
    option.nom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { key: 'nom', header: "Nom de l'option" },
    {
      key: 'id',
      header: 'Action',
      render: (_: number, item: OptionData) => (
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedOption(item)}
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
        <h1 className="text-2xl font-bold text-gray-800">Gestion des options</h1>
        <button
          onClick={() => {
            setShowAddForm(true);
            setSelectedOption(null);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Ajouter une option
        </button>
      </div>

      <Card>
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher une option..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <DataTable
          columns={columns}
          data={filteredOptions}
        />
      </Card>

      {/* Modal pour ajout/modification */}
      <Modal
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setSelectedOption(null);
          setOptionName('');
        }}
        title={selectedOption ? "Modifier l'option" : "Ajouter une option"}
        size="sm"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'option
            </label>
            <input
              type="text"
              value={optionName}
              onChange={e => setOptionName(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setSelectedOption(null);
                setOptionName('');
              }}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {selectedOption ? 'Modifier' : 'Ajouter'}
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
              Êtes-vous sûr de vouloir supprimer cette option ?<br />
              <span className="text-sm text-gray-600">
                <b>Attention :</b> Cette action supprimera aussi tous les résultats annuels liés à cette option de façon irréversible.
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

export default ManageOptions;