import React from 'react';
import { CERConfiguration, NewConfiguration } from '@/types/cer/configuration';
import { ConfigurationForm } from '../ConfigurationForm';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  configuration?: CERConfiguration;
  onSubmit: (config: NewConfiguration) => Promise<void>;
}

export function ConfigurationModal({ isOpen, onClose, configuration, onSubmit }: ConfigurationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl sm:align-middle">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                  {configuration ? 'Edit Configuration' : 'Create New Configuration'}
                </h3>
                <div className="mt-2">
                  <ConfigurationForm
                    configuration={configuration}
                    onSubmit={async (config) => {
                      await onSubmit(config);
                      onClose();
                    }}
                    onCancel={onClose}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 