import React, { useState, useEffect } from 'react';
import { ConfigurationManagement } from '@/components/cer/ConfigurationManagement';
import { ConfigurationModal } from '@/components/cer/ConfigurationModal';
import { ConfigurationService } from '@/services/cer/configuration.service';
import { CERConfiguration, NewConfiguration } from '@/types/cer/configuration';

interface CERDetailsProps {
  cerId: string;
}

export function CERDetails({ cerId }: CERDetailsProps) {
  const [activeConfig, setActiveConfig] = useState<CERConfiguration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<CERConfiguration | undefined>();
  const configService = new ConfigurationService();

  const handleConfigurationChange = async (configId: string | null) => {
    if (!configId) {
      setActiveConfig(null);
      return;
    }

    try {
      const configs = await configService.getConfigurations(cerId);
      const config = configs.find(c => c.id === configId);
      setActiveConfig(config || null);
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  };

  const handleCreateConfiguration = () => {
    setEditingConfig(undefined);
    setIsModalOpen(true);
  };

  const handleEditConfiguration = (config: CERConfiguration) => {
    setEditingConfig(config);
    setIsModalOpen(true);
  };

  const handleSubmitConfiguration = async (config: NewConfiguration) => {
    try {
      if (editingConfig) {
        await configService.updateConfiguration(cerId, editingConfig.id, config);
      } else {
        await configService.createConfiguration(config, cerId);
      }
      setIsModalOpen(false);
      // Refresh configurations
      if (activeConfig) {
        handleConfigurationChange(activeConfig.id);
      }
    } catch (error) {
      console.error('Error saving configuration:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">CER Details</h1>
            {activeConfig && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {activeConfig.name}
              </span>
            )}
          </div>
          <button
            onClick={handleCreateConfiguration}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            New Configuration
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Configuration Management */}
          <div className="bg-white rounded-lg shadow">
            <ConfigurationManagement
              cerId={cerId}
              onConfigurationChange={handleConfigurationChange}
            />
          </div>

          {/* Configuration Details */}
          {activeConfig && (
            <div className="mt-6 bg-white rounded-lg shadow">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  Configuration Details
                </h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Type</dt>
                    <dd className="mt-1 text-sm text-gray-900">{activeConfig.type}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Version</dt>
                    <dd className="mt-1 text-sm text-gray-900">{activeConfig.version}</dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Max Members</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {activeConfig.features.maxMembers}
                    </dd>
                  </div>
                  <div className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">Max Capacity</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {activeConfig.restrictions.maxCapacity} kW
                    </dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <button
                    onClick={() => handleEditConfiguration(activeConfig)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Edit Configuration
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Modal */}
      <ConfigurationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        configuration={editingConfig}
        onSubmit={handleSubmitConfiguration}
      />
    </div>
  );
} 