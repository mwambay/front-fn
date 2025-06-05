import { useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import Card from '../../components/Card';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

function ManageUsers() {
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Sample user data
  const users: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', createdAt: '2023-10-15' },
    { id: '2', name: 'Inspector User', email: 'inspector@example.com', role: 'inspector', status: 'active', createdAt: '2023-11-20' },
    { id: '3', name: 'Director User', email: 'director@example.com', role: 'director', status: 'active', createdAt: '2024-01-05' },
    { id: '4', name: 'Parent User', email: 'parent@example.com', role: 'parent', status: 'active', createdAt: '2024-02-10' },
    { id: '5', name: 'Student User', email: 'student@example.com', role: 'student', status: 'inactive', createdAt: '2024-03-15' },
  ];

  const columns = [
    { key: 'name', header: 'Nom' },
    { key: 'email', header: 'Email' },
    { 
      key: 'role', 
      header: 'Rôle',
      render: (value: string) => {
        const roleLabels: Record<string, string> = {
          admin: 'Administrateur',
          inspector: 'Inspecteur',
          director: 'Directeur',
          parent: 'Parent',
          student: 'Élève'
        };
        return <span className="capitalize">{roleLabels[value] || value}</span>;
      }
    },
    { 
      key: 'status', 
      header: 'Statut',
      render: (value: string) => (
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {value === 'active' ? 'Actif' : 'Inactif'}
        </span>
      )
    },
    { key: 'createdAt', header: 'Date de création' },
    {
      key: 'id',
      header: 'Action',
      render: (_: string, item: User) => (
        <button
          onClick={() => setSelectedUser(item)}
          className="text-blue-600 hover:text-blue-900"
        >
          Modifier
        </button>
      )
    }
  ];

  const handleEditUser = () => {
    alert("Utilisateur modifié avec succès");
    setSelectedUser(null);
  };

  const handleAddUser = () => {
    alert("Utilisateur ajouté avec succès");
    setShowAddUser(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gérer les utilisateurs</h1>
        <button
          onClick={() => setShowAddUser(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus size={18} className="mr-2" />
          Ajouter un utilisateur
        </button>
      </div>
      
      <Card>
        <DataTable
          columns={columns}
          data={users}
        />
      </Card>
      
      <Modal
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        title="Ajouter un utilisateur"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entrez le nom complet"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entrez l'adresse email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Entrez le mot de passe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Sélectionner un rôle</option>
                <option value="admin">Administrateur</option>
                <option value="inspector">Inspecteur</option>
                <option value="director">Directeur</option>
                <option value="parent">Parent</option>
                <option value="student">Élève</option>
              </select>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Permissions</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="view_data"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="view_data" className="font-medium text-gray-700">Voir les données</label>
                  <p className="text-gray-500">Peut visualiser les statistiques et palmarès</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="edit_data"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="edit_data" className="font-medium text-gray-700">Modifier les données</label>
                  <p className="text-gray-500">Peut ajouter ou modifier des palmarès</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="manage_users"
                    type="checkbox"
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="manage_users" className="font-medium text-gray-700">Gérer les utilisateurs</label>
                  <p className="text-gray-500">Peut ajouter, modifier ou désactiver des utilisateurs</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowAddUser(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleAddUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Ajouter
            </button>
          </div>
        </form>
      </Modal>
      
      <Modal
        isOpen={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        title="Modifier l'utilisateur"
        size="lg"
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                defaultValue={selectedUser?.name}
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                defaultValue={selectedUser?.email}
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                defaultValue={selectedUser?.role}
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="admin">Administrateur</option>
                <option value="inspector">Inspecteur</option>
                <option value="director">Directeur</option>
                <option value="parent">Parent</option>
                <option value="student">Élève</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                defaultValue={selectedUser?.status}
                className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
              </select>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium mb-4">Permissions</h3>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="view_data_edit"
                    type="checkbox"
                    defaultChecked
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="view_data_edit" className="font-medium text-gray-700">Voir les données</label>
                  <p className="text-gray-500">Peut visualiser les statistiques et palmarès</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="edit_data_edit"
                    type="checkbox"
                    defaultChecked={selectedUser?.role === 'admin' || selectedUser?.role === 'inspector'}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="edit_data_edit" className="font-medium text-gray-700">Modifier les données</label>
                  <p className="text-gray-500">Peut ajouter ou modifier des palmarès</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="manage_users_edit"
                    type="checkbox"
                    defaultChecked={selectedUser?.role === 'admin'}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="manage_users_edit" className="font-medium text-gray-700">Gérer les utilisateurs</label>
                  <p className="text-gray-500">Peut ajouter, modifier ou désactiver des utilisateurs</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setSelectedUser(null)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleEditUser}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ManageUsers;