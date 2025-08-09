import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  TagIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon,
  CalendarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { api } from '../lib/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

const CategoriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: api.getCategories,
  });

  // Fetch all vaults to get items
  const { data: vaults } = useQuery({
    queryKey: ['vaults'],
    queryFn: api.getVaults,
  });

  // Fetch items for the first vault (simplified for demo)
  const { data: allItems } = useQuery({
    queryKey: ['all-items'],
    queryFn: async () => {
      if (!vaults || vaults.length === 0) return [];
      const itemsPromises = vaults.map(vault => api.getItems(vault.id));
      const results = await Promise.all(itemsPromises);
      return results.flat();
    },
    enabled: !!vaults && vaults.length > 0,
  });

  // Filter items based on selected category and search
  const filteredItems = React.useMemo(() => {
    if (!allItems) return [];
    
    let items = allItems;
    
    if (selectedCategory) {
      const category = categories?.find(c => c.id === selectedCategory);
      if (category) {
        items = items.filter(item => item.categoryName === category.name);
      }
    }
    
    if (searchTerm) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.model?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return items;
  }, [allItems, selectedCategory, searchTerm, categories]);

  // Calculate category statistics
  const categoryStats = React.useMemo(() => {
    if (!categories || !allItems) return {};
    
    return categories.reduce((stats, category) => {
      const categoryItems = allItems.filter(item => item.categoryName === category.name);
      const expiredItems = categoryItems.filter(item => item.isExpired);
      const expiringSoonItems = categoryItems.filter(item => item.isExpiringSoon && !item.isExpired);
      
      stats[category.id] = {
        totalItems: categoryItems.length,
        expiredItems: expiredItems.length,
        expiringSoonItems: expiringSoonItems.length,
        activeItems: categoryItems.length - expiredItems.length - expiringSoonItems.length,
        averagePrice: categoryItems.length > 0 
          ? categoryItems.reduce((sum, item) => sum + (item.price || 0), 0) / categoryItems.length 
          : 0,
      };
      
      return stats;
    }, {} as Record<number, any>);
  }, [categories, allItems]);

  const CategoryCard: React.FC<{ category: any }> = ({ category }) => {
    const stats = categoryStats[category.id] || {
      totalItems: 0,
      expiredItems: 0,
      expiringSoonItems: 0,
      activeItems: 0,
      averagePrice: 0,
    };

    const isSelected = selectedCategory === category.id;

    return (
      <div
        onClick={() => setSelectedCategory(isSelected ? null : category.id)}
        className={`cursor-pointer rounded-xl border p-6 transition-all hover:shadow-lg ${
          isSelected 
            ? 'border-primary-500 bg-primary-50 shadow-md' 
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary-200' : 'bg-gray-100'}`}>
              <TagIcon className={`h-6 w-6 ${isSelected ? 'text-primary-700' : 'text-gray-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold text-lg ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                {category.name}
              </h3>
              <p className={`text-sm ${isSelected ? 'text-primary-700' : 'text-gray-500'}`}>
                {category.description}
              </p>
            </div>
          </div>
          
          <div className={`text-2xl font-bold ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
            {stats.totalItems}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <CheckCircleIcon className="h-4 w-4 text-green-500" />
              <span className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                {stats.activeItems}
              </span>
            </div>
            <p className={`text-xs ${isSelected ? 'text-primary-600' : 'text-gray-500'} mt-1`}>Active</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <ClockIcon className="h-4 w-4 text-yellow-500" />
              <span className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                {stats.expiringSoonItems}
              </span>
            </div>
            <p className={`text-xs ${isSelected ? 'text-primary-600' : 'text-gray-500'} mt-1`}>Expiring</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />
              <span className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                {stats.expiredItems}
              </span>
            </div>
            <p className={`text-xs ${isSelected ? 'text-primary-600' : 'text-gray-500'} mt-1`}>Expired</p>
          </div>
        </div>

        {stats.averagePrice > 0 && (
          <div className={`mt-4 pt-4 border-t ${isSelected ? 'border-primary-200' : 'border-gray-100'}`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isSelected ? 'text-primary-700' : 'text-gray-500'}`}>
                Avg. Value
              </span>
              <span className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                ${stats.averagePrice.toFixed(0)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ItemCard: React.FC<{ item: any }> = ({ item }) => {
    const getStatusColor = (item: any) => {
      if (item.isExpired) return 'bg-red-100 text-red-800 border-red-200';
      if (item.isExpiringSoon) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      return 'bg-green-100 text-green-800 border-green-200';
    };

    const getStatusIcon = (item: any) => {
      if (item.isExpired) return <ExclamationTriangleIcon className="h-4 w-4" />;
      if (item.isExpiringSoon) return <ClockIcon className="h-4 w-4" />;
      return <CheckCircleIcon className="h-4 w-4" />;
    };

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900">{item.title}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
              {item.brand && <span>{item.brand}</span>}
              {item.model && (
                <>
                  {item.brand && <span>•</span>}
                  <span>{item.model}</span>
                </>
              )}
            </div>
          </div>
          
          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item)}`}>
            {getStatusIcon(item)}
            <span className="ml-1">
              {item.isExpired ? 'Expired' : item.isExpiringSoon ? 'Expiring' : 'Active'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          {item.price && (
            <div className="flex items-center space-x-1">
              <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">${item.price}</span>
            </div>
          )}
          
          {item.expiryDate && (
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {new Date(item.expiryDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (categoriesError) {
    return <ErrorMessage message="Failed to load categories" />;
  }

  const selectedCategoryData = categories?.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="text-gray-600 mt-2">Browse items by category and view statistics</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search items across all categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          All Categories {selectedCategory && '- Click to deselect'}
        </h2>
        {!categories || categories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <TagIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No categories available</h3>
            <p className="text-gray-500">Categories will appear here once items are added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>

      {/* Items in Selected Category */}
      {selectedCategory && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Items in {selectedCategoryData?.name}
              <span className="text-gray-500 ml-2">({filteredItems.length})</span>
            </h2>
            {filteredItems.length > 0 && (
              <Link
                to="/vaults"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                View all vaults
              </Link>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <CubeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No items in {selectedCategoryData?.name}
              </h3>
              <p className="text-gray-500">
                Add items to this category to see them here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchTerm && !selectedCategory && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Search Results for "{searchTerm}"
            <span className="text-gray-500 ml-2">({filteredItems.length})</span>
          </h2>

          {filteredItems.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg border border-gray-200">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No matching items</h3>
              <p className="text-gray-500">Try a different search term.</p>
              <button
                onClick={() => setSearchTerm('')}
                className="mt-3 text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overview Statistics */}
      {!selectedCategory && !searchTerm && allItems && allItems.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <ChartBarIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900">{allItems.length}</span>
                </div>
                <p className="text-sm text-gray-500">Total Items</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {allItems.filter(item => !item.isExpired && !item.isExpiringSoon).length}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Active</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <ClockIcon className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {allItems.filter(item => item.isExpiringSoon && !item.isExpired).length}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Expiring Soon</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  <span className="text-2xl font-bold text-gray-900">
                    {allItems.filter(item => item.isExpired).length}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Expired</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage; 