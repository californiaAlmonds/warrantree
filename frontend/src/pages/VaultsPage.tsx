import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  CubeIcon,
  UsersIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { api, CreateVaultRequest } from '../lib/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import toast from 'react-hot-toast';

const VaultsPage: React.FC = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingVault, setEditingVault] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch vaults
  const { data: vaults, isLoading, error } = useQuery({
    queryKey: ['vaults'],
    queryFn: api.getVaults,
  });

  // Create vault mutation
  const createMutation = useMutation({
    mutationFn: api.createVault,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vaults'] });
      setIsCreateModalOpen(false);
      toast.success('Vault created successfully!');
    },
    onError: () => {
      toast.error('Failed to create vault');
    },
  });

  const VaultCard: React.FC<{ vault: any }> = ({ vault }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <CubeIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">{vault.name}</h3>
              <p className="text-gray-500 text-sm">{vault.description}</p>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
            >
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-400" />
            </button>
            
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setEditingVault(vault);
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <PencilIcon className="h-4 w-4 mr-3" />
                    Edit Vault
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this vault?')) {
                        toast.error('Delete functionality not implemented yet');
                      }
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4 mr-3" />
                    Delete Vault
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <ChartBarIcon className="h-4 w-4 text-gray-400" />
              <span className="font-semibold text-gray-900">{vault.itemCount || 0}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Items</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <UsersIcon className="h-4 w-4 text-gray-400" />
                             <span className="font-semibold text-gray-900">{vault.members?.length || 1}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Members</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
              <span className="font-semibold text-gray-900">{vault.expiringSoonCount || 0}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Expiring</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Owner: {vault.ownerName}</span>
          <span>Created {new Date(vault.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            to={`/vaults/${vault.id}/items`}
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View Items
            <ChartBarIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
      </div>
    );
  };

  const CreateVaultModal: React.FC = () => {
    const [formData, setFormData] = useState<CreateVaultRequest>({
      name: '',
      description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.name.trim()) {
        toast.error('Please enter a vault name');
        return;
      }
      createMutation.mutate(formData);
    };

    const handleClose = () => {
      setIsCreateModalOpen(false);
      setFormData({ name: '', description: '' });
    };

    if (!isCreateModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Create New Vault</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Vault Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Family Electronics, Work Equipment"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe what this vault will contain..."
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {createMutation.isPending ? 'Creating...' : 'Create Vault'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditVaultModal: React.FC = () => {
    const [formData, setFormData] = useState<CreateVaultRequest>({
      name: editingVault?.name || '',
      description: editingVault?.description || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Edit functionality would go here
      toast.success('Edit functionality not implemented yet');
      setEditingVault(null);
    };

    const handleClose = () => {
      setEditingVault(null);
    };

    if (!editingVault) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Edit Vault</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-400" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700 mb-1">
                Vault Name *
              </label>
              <input
                type="text"
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message="Failed to load vaults" />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vaults</h1>
          <p className="text-gray-600 mt-1">Organize your items into collections</p>
        </div>
        
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Vault
        </button>
      </div>

      {/* Stats Bar */}
      {vaults && vaults.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{vaults.length}</p>
              <p className="text-sm text-gray-500">Total Vaults</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {vaults.reduce((sum, vault) => sum + (vault.itemCount || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Total Items</p>
            </div>
            <div className="text-center">
                             <p className="text-2xl font-bold text-gray-900">
                 {vaults.reduce((sum, vault) => sum + (vault.members?.length || 1), 0)}
               </p>
              <p className="text-sm text-gray-500">Total Members</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {vaults.reduce((sum, vault) => sum + (vault.expiringSoonCount || 0), 0)}
              </p>
              <p className="text-sm text-gray-500">Expiring Soon</p>
            </div>
          </div>
        </div>
      )}

      {/* Vaults Grid */}
      {!vaults || vaults.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <CubeIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No vaults yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            Create your first vault to start organizing your items and tracking warranties.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Your First Vault
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaults.map((vault) => (
            <VaultCard key={vault.id} vault={vault} />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateVaultModal />
      <EditVaultModal />
    </div>
  );
};

export default VaultsPage; 