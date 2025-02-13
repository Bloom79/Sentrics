import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ConfigurationService } from '@/services/cer/configuration.service';
import { CERConfiguration } from '@/types/cer/configuration';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EditIcon, TrashIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ConfigurationManagementProps {
  cerId: string;
}

const configService = new ConfigurationService();

export function ConfigurationManagement({ cerId }: ConfigurationManagementProps) {
  const { toast } = useToast();
  
  const { data: configurations, isLoading, error, refetch } = useQuery<CERConfiguration[]>({
    queryKey: ['configurations', cerId],
    queryFn: () => configService.getConfigurations(cerId),
  });

  const handleEdit = async (configId: string) => {
    // TODO: Implement edit functionality
    console.log('Edit configuration:', configId);
  };

  const handleDelete = async (configId: string) => {
    try {
      await configService.deleteConfiguration(cerId, configId);
      toast({
        title: "Success",
        description: "Configuration deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete configuration",
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

  if (!configurations?.length) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <h3 className="text-lg font-medium">No Configurations</h3>
          <p className="text-muted-foreground mt-1">
            Create a new configuration to get started
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Version</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configurations.map((config) => (
            <TableRow key={config.id}>
              <TableCell className="font-medium">{config.name}</TableCell>
              <TableCell>{config.type}</TableCell>
              <TableCell>{config.version}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    config.status === 'active'
                      ? 'success'
                      : config.status === 'draft'
                      ? 'default'
                      : 'destructive'
                  }
                >
                  {config.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(config.id)}
                >
                  <EditIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(config.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
