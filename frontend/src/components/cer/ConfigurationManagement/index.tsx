import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusIcon, CogIcon, TrashIcon, PencilIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ConfigurationModal } from '@/components/cer/ConfigurationModal';
import { CERConfiguration, NewConfiguration } from '@/types/cer/configuration';
import { ConfigurationService } from '../../../services/cer/configuration.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const configService = new ConfigurationService();

export function ConfigurationManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<CERConfiguration | undefined>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['configurations'],
    queryFn: () => configService.getConfigurations(),
  });

  const handleEdit = (config: CERConfiguration) => {
    setEditingConfig(config);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await configService.deleteConfiguration(id);
      toast({
        title: "Success",
        description: "Configuration deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete configuration",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (config: NewConfiguration) => {
    try {
      if (editingConfig) {
        await configService.updateConfiguration(editingConfig.id, config);
        toast({
          title: "Success",
          description: "Configuration updated successfully",
        });
      } else {
        await configService.createConfiguration(config);
        toast({
          title: "Success",
          description: "Configuration created successfully",
        });
      }
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['configurations'] });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save configuration",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading configurations...</div>;
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-500">
          Failed to load configurations. Please try again.
        </div>
      </Card>
    );
  }

  if (!data?.items?.length) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Configurations</h3>
          <p className="text-muted-foreground mt-1">
            Create a new configuration to get started
          </p>
          <Button onClick={() => setIsModalOpen(true)} className="mt-4">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Configuration
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Configurations</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Configuration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.items.map((config) => (
          <Card key={config.id} className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium">{config.name}</h3>
                <p className="text-sm text-gray-500">{config.type}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(config)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(config.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm">
                <span className="font-medium">Status:</span>{' '}
                <span className={`capitalize ${config.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                  {config.status}
                </span>
              </div>
              <div className="text-sm">
                <span className="font-medium">Participants:</span>{' '}
                {config.participant_count}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ConfigurationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingConfig(undefined);
        }}
        configuration={editingConfig}
        onSubmit={handleSubmit}
      />
    </div>
  );
} 