import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  ChartBarIcon,
  CubeIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  PlusIcon,
  ArrowRightIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { api } from '../lib/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';

interface DashboardStats {
  totalVaults: number;
  totalItems: number;
  expiredItems: number;
  expiringSoonItems: number;
}

const Dashboard: React.FC = () => {
  // Fetch vaults
  const { data: vaults, isLoading: vaultsLoading, error: vaultsError } = useQuery({
    queryKey: ['vaults'],
    queryFn: api.getVaults,
  });

  // Fetch items for the first vault to show recent activity
  const { data: recentItems, isLoading: itemsLoading } = useQuery({
    queryKey: ['recent-items'],
    queryFn: () => vaults && vaults.length > 0 ? api.getItems(vaults[0].id) : Promise.resolve([]),
    enabled: !!vaults && vaults.length > 0,
  });

  // Calculate stats
  const stats: DashboardStats = React.useMemo(() => {
    if (!vaults || !recentItems) {
      return { totalVaults: 0, totalItems: 0, expiredItems: 0, expiringSoonItems: 0 };
    }

    const totalVaults = vaults.length;
    const totalItems = recentItems.length;
    const expiredItems = recentItems.filter(item => item.isExpired).length;
    const expiringSoonItems = recentItems.filter(item => item.isExpiringSoon && !item.isExpired).length;

    return { totalVaults, totalItems, expiredItems, expiringSoonItems };
  }, [vaults, recentItems]);

  if (vaultsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="material-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (vaultsError) {
    return <ErrorMessage message="Failed to load dashboard data" />;
  }

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ElementType;
    color: 'blue' | 'green' | 'red' | 'yellow';
    description?: string;
    trend?: string;
  }> = ({ title, value, icon: Icon, color, description, trend }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-yellow-600',
    };

    const iconColorClasses = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
    };

    return (
      <div className="stat-card fade-in-up group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 mb-2 uppercase tracking-wide">{title}</p>
            <div className="flex items-baseline space-x-2">
              <p className="text-4xl font-bold text-gray-900 group-hover:scale-105 transition-transform duration-200">
                {value.toLocaleString()}
              </p>
              {trend && (
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {trend}
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-gray-500 mt-2">{description}</p>
            )}
          </div>
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${colorClasses[color]} elevation-2 group-hover:elevation-3 transition-all duration-200`}>
            <Icon className={`h-8 w-8 text-white`} />
          </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${colorClasses[color]}`}></div>
            <span className="text-xs text-gray-500 font-medium">Live data</span>
          </div>
          <SparklesIcon className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    );
  };

  const QuickAction: React.FC<{
    title: string;
    description: string;
    icon: React.ElementType;
    to: string;
    isPrimary?: boolean;
  }> = ({ title, description, icon: Icon, to, isPrimary = false }) => {
    return (
      <Link
        to={to}
        className={`material-card-clickable p-8 group fade-in-up ${
          isPrimary 
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
            : 'bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-2xl ${
              isPrimary 
                ? 'bg-white bg-opacity-20' 
                : 'bg-gradient-to-br from-blue-500 to-blue-600'
            }`}>
              <Icon className={`h-8 w-8 ${isPrimary ? 'text-white' : 'text-white'}`} />
            </div>
            <div>
              <h3 className={`text-xl font-bold mb-1 ${isPrimary ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h3>
              <p className={`text-sm ${isPrimary ? 'text-blue-100' : 'text-gray-600'}`}>
                {description}
              </p>
            </div>
          </div>
          <ArrowRightIcon className={`h-6 w-6 group-hover:translate-x-2 transition-transform duration-200 ${
            isPrimary ? 'text-white' : 'text-gray-400'
          }`} />
        </div>
      </Link>
    );
  };

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="fade-in-down">
        <div className="flex items-center space-x-3 mb-2">
          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center elevation-2">
            <ChartBarIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's what's happening with your warranties.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-4">
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
          <span className="text-sm text-gray-500 font-medium">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="material-grid-responsive">
        <StatCard
          title="Total Vaults"
          value={stats.totalVaults}
          icon={CubeIcon}
          color="blue"
          description="Collections created"
          trend={stats.totalVaults > 0 ? '+' + stats.totalVaults : undefined}
        />
        <StatCard
          title="Total Items"
          value={stats.totalItems}
          icon={ChartBarIcon}
          color="green"
          description="Items being tracked"
          trend={stats.totalItems > 0 ? '+' + stats.totalItems : undefined}
        />
        <StatCard
          title="Expired Items"
          value={stats.expiredItems}
          icon={ExclamationTriangleIcon}
          color="red"
          description="Need immediate attention"
        />
        <StatCard
          title="Expiring Soon"
          value={stats.expiringSoonItems}
          icon={ClockIcon}
          color="yellow"
          description="Within 30 days"
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="fade-in-left">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Quick Actions</h2>
          <p className="text-gray-600">Get started with these common tasks</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickAction
            title="Create New Vault"
            description="Organize your items into collections"
            icon={PlusIcon}
            to="/vaults"
            isPrimary
          />
          <QuickAction
            title="Add New Item"
            description="Track warranties and important dates"
            icon={PlusIcon}
            to="/items"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <div className="fade-in-right">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Recent Activity</h2>
          <p className="text-gray-600">Your latest items and warranty updates</p>
        </div>
        <div className="material-card p-6">
          {itemsLoading ? (
            <div className="p-12 text-center">
              <div className="material-spinner mx-auto mb-4"></div>
              <p className="text-gray-500">Loading recent items...</p>
            </div>
          ) : !recentItems || recentItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="h-24 w-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <CubeIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No items yet</h3>
              <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                Get started by creating your first vault and adding items to track their warranties.
              </p>
              <Link
                to="/vaults"
                className="material-btn material-btn-primary"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create First Vault
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentItems.slice(0, 5).map((item, index) => (
                <div 
                  key={item.id} 
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors duration-200 fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center">
                      <ChartBarIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">{item.title}</p>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        <span>{item.brand}</span>
                        {item.categoryName && (
                          <>
                            <span>•</span>
                            <span>{item.categoryName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {item.isExpired ? (
                      <span className="material-badge material-badge-danger">
                        <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                        Expired
                      </span>
                    ) : item.isExpiringSoon ? (
                      <span className="material-badge material-badge-warning">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Expiring Soon
                      </span>
                    ) : (
                      <span className="material-badge material-badge-success">
                        <SparklesIcon className="h-3 w-3 mr-1" />
                        Active
                      </span>
                    )}
                    {item.expiryDate && (
                      <p className="text-xs text-gray-500 mt-2">
                        Expires: {new Date(item.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 