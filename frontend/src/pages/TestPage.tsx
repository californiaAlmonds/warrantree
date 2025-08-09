import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, CreateVaultRequest, CreateItemRequest } from '../lib/api';
import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  PlayIcon,
} from '@heroicons/react/24/outline';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message?: string;
  duration?: number;
}

const TestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const queryClient = useQueryClient();

  const updateTestResult = (name: string, status: 'success' | 'error', message?: string, duration?: number) => {
    setTestResults(prev => 
      prev.map(test => 
        test.name === name 
          ? { ...test, status, message, duration }
          : test
      )
    );
  };

  const addTestResult = (name: string) => {
    setTestResults(prev => [...prev, { name, status: 'pending' }]);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    const tests = [
      { name: 'Authentication - Login', test: testLogin },
      { name: 'Vaults - Read', test: testReadVaults },
      { name: 'Vaults - Create', test: testCreateVault },
      { name: 'Vaults - Update', test: testUpdateVault },
      { name: 'Items - Read', test: testReadItems },
      { name: 'Items - Create', test: testCreateItem },
      { name: 'Items - Update', test: testUpdateItem },
      { name: 'Items - Delete', test: testDeleteItem },
      { name: 'Categories - Read', test: testReadCategories },
      { name: 'Vaults - Delete', test: testDeleteVault },
    ];

    for (const test of tests) {
      addTestResult(test.name);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UI
      
      const startTime = Date.now();
      try {
        await test.test();
        const duration = Date.now() - startTime;
        updateTestResult(test.name, 'success', 'Passed', duration);
      } catch (error: any) {
        const duration = Date.now() - startTime;
        updateTestResult(test.name, 'error', error.message || 'Failed', duration);
      }
    }
    
    setIsRunning(false);
    toast.success('All tests completed!');
  };

  // Test functions
  const testLogin = async () => {
    const result = await api.login({ email: 'demo@warrantree.com', password: 'password' });
    if (!result.token || !result.user) {
      throw new Error('Login failed - missing token or user data');
    }
  };

  const testReadVaults = async () => {
    const vaults = await api.getVaults();
    if (!Array.isArray(vaults)) {
      throw new Error('Vaults should be an array');
    }
  };

  let createdVaultId: number | null = null;

  const testCreateVault = async () => {
    const vaultData: CreateVaultRequest = {
      name: 'Test Vault ' + Date.now(),
      description: 'A test vault created by automated testing'
    };
    const vault = await api.createVault(vaultData);
    if (!vault.id || vault.name !== vaultData.name) {
      throw new Error('Created vault data mismatch');
    }
    createdVaultId = vault.id;
  };

  const testUpdateVault = async () => {
    if (!createdVaultId) throw new Error('No vault to update');
    
    const updateData: CreateVaultRequest = {
      name: 'Updated Test Vault ' + Date.now(),
      description: 'Updated description'
    };
    const vault = await api.updateVault(createdVaultId, updateData);
    if (vault.name !== updateData.name) {
      throw new Error('Vault update failed');
    }
  };

  const testReadItems = async () => {
    if (!createdVaultId) throw new Error('No vault to read items from');
    
    const items = await api.getItems(createdVaultId);
    if (!Array.isArray(items)) {
      throw new Error('Items should be an array');
    }
  };

  let createdItemId: number | null = null;

  const testCreateItem = async () => {
    if (!createdVaultId) throw new Error('No vault to create item in');
    
    const itemData: CreateItemRequest = {
      title: 'Test Item ' + Date.now(),
      vaultId: createdVaultId,
      brand: 'Test Brand',
      model: 'Test Model',
      purchaseDate: '2024-01-01',
      price: 99.99,
      warrantyMonths: 12,
      notes: 'Test item created by automated testing'
    };
    const item = await api.createItem(itemData);
    if (!item.id || item.title !== itemData.title) {
      throw new Error('Created item data mismatch');
    }
    createdItemId = item.id;
  };

  const testUpdateItem = async () => {
    if (!createdItemId || !createdVaultId) throw new Error('No item to update');
    
    const updateData: CreateItemRequest = {
      title: 'Updated Test Item ' + Date.now(),
      vaultId: createdVaultId,
      brand: 'Updated Brand',
      model: 'Updated Model',
      purchaseDate: '2024-01-01',
      price: 199.99,
      warrantyMonths: 24,
      notes: 'Updated test item'
    };
    const item = await api.updateItem(createdItemId, updateData);
    if (item.title !== updateData.title) {
      throw new Error('Item update failed');
    }
  };

  const testDeleteItem = async () => {
    if (!createdItemId) throw new Error('No item to delete');
    
    await api.deleteItem(createdItemId);
    // Verify item is deleted by trying to get it (should fail)
    try {
      await api.getItem(createdItemId);
      throw new Error('Item should have been deleted');
    } catch (error: any) {
      if (error.response?.status !== 404) {
        throw new Error('Unexpected error when verifying deletion');
      }
    }
  };

  const testReadCategories = async () => {
    const categories = await api.getCategories();
    if (!Array.isArray(categories) || categories.length === 0) {
      throw new Error('Categories should be a non-empty array');
    }
  };

  const testDeleteVault = async () => {
    if (!createdVaultId) throw new Error('No vault to delete');
    
    await api.deleteVault(createdVaultId);
    // Verify vault is deleted
    try {
      await api.getVault(createdVaultId);
      throw new Error('Vault should have been deleted');
    } catch (error: any) {
      if (error.response?.status !== 404) {
        throw new Error('Unexpected error when verifying vault deletion');
      }
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 animate-pulse" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'pending':
        return 'bg-yellow-50 border-yellow-200';
    }
  };

  const successCount = testResults.filter(t => t.status === 'success').length;
  const errorCount = testResults.filter(t => t.status === 'error').length;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">API Test Suite</h1>
        <p className="mt-2 text-sm text-gray-600">
          Comprehensive testing of all CRUD operations and API endpoints
        </p>
      </div>

      {/* Test Summary */}
      {testResults.length > 0 && (
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Summary</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{testResults.length}</div>
              <div className="text-sm text-gray-500">Total Tests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{successCount}</div>
              <div className="text-sm text-gray-500">Passed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{errorCount}</div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
          </div>
        </div>
      )}

      {/* Run Tests Button */}
      <div className="mb-8">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayIcon className="h-5 w-5 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </button>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Test Results</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {testResults.map((test, index) => (
              <div key={index} className={`p-6 ${getStatusColor(test.status)}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(test.status)}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{test.name}</h3>
                      {test.message && (
                        <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                      )}
                    </div>
                  </div>
                  {test.duration && (
                    <div className="text-sm text-gray-500">
                      {test.duration}ms
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Usage Instructions */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-2">How to Use</h3>
        <ul className="text-sm text-blue-700 space-y-2">
          <li>• Click "Run All Tests" to execute comprehensive CRUD testing</li>
          <li>• Tests will run sequentially to avoid conflicts</li>
          <li>• Each test creates, reads, updates, and deletes data</li>
          <li>• Green results indicate successful operations</li>
          <li>• Red results indicate failures with error messages</li>
          <li>• Test data is automatically cleaned up after testing</li>
        </ul>
      </div>
    </div>
  );
};

export default TestPage; 