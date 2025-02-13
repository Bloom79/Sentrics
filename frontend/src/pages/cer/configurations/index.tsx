import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ConfigurationManagement } from '@/components/cer/ConfigurationManagement';
import { ConfigurationModal } from '@/components/cer/ConfigurationModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { PlusIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Community {
  id: string;
  name: string;
}

export default function ConfigurationsPage() {
  const [selectedCommunityId, setSelectedCommunityId] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  // Fetch communities
  const { data: communities, isLoading: isLoadingCommunities } = useQuery<Community[]>({
    queryKey: ['communities'],
    queryFn: async () => {
      const response = await api.get('/api/cer/communities');
      return response.data.data;
    },
  });

  const handleCreateConfiguration = () => {
    if (!selectedCommunityId) {
      toast({
        title: "Error",
        description: "Please select a community first",
        variant: "destructive",
      });
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">CER Configurations</h1>
          <p className="text-muted-foreground">
            Manage configurations for your energy communities
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={selectedCommunityId}
            onValueChange={setSelectedCommunityId}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a community" />
            </SelectTrigger>
            <SelectContent>
              {communities?.map((community) => (
                <SelectItem key={community.id} value={community.id}>
                  {community.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleCreateConfiguration}>
            <PlusIcon className="h-4 w-4 mr-2" />
            New Configuration
          </Button>
        </div>
      </div>

      {selectedCommunityId ? (
        <ConfigurationManagement cerId={selectedCommunityId} />
      ) : (
        <Card className="p-8">
          <div className="text-center">
            <h2 className="text-lg font-medium">No Community Selected</h2>
            <p className="text-muted-foreground mt-1">
              Please select a community to view or create configurations
            </p>
          </div>
        </Card>
      )}

      <ConfigurationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={async (config) => {
          try {
            // Handle configuration creation
            // This will be handled by the ConfigurationManagement component
            setIsModalOpen(false);
            toast({
              title: "Success",
              description: "Configuration created successfully",
            });
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to create configuration",
              variant: "destructive",
            });
          }
        }}
      />
    </div>
  );
} 