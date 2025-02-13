import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { PlusCircle, Loader2 } from 'lucide-react';
import { AssetType, AssetInstance } from '@/types/assets';
import { Plant } from '@/types/site';

interface AssetInstanceDialogProps {
  open: boolean;
  assetType: AssetType;
  existingInstances: AssetInstance[];
  onSelectInstance: (instance: AssetInstance) => void;
  onCreateNew: (plantId?: string, attributes?: Record<string, any>) => void;
  onClose: () => void;
  isLoading?: boolean;
  site: {
    id: string;
    plants: Plant[];
  };
}

const CONSUMER_TYPES = [
  { id: 'residential', name: 'Residential', description: 'Homes and residential buildings' },
  { id: 'commercial', name: 'Commercial', description: 'Offices and retail spaces' },
  { id: 'industrial', name: 'Industrial', description: 'Factories and industrial facilities' },
  { id: 'agricultural', name: 'Agricultural', description: 'Farms and agricultural facilities' },
];

export const AssetInstanceDialog: React.FC<AssetInstanceDialogProps> = ({
  open,
  assetType,
  existingInstances,
  onSelectInstance,
  onCreateNew,
  onClose,
  isLoading = false,
  site,
}) => {
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>('');
  const [selectedPlantId, setSelectedPlantId] = useState<string>('site');
  const [consumerType, setConsumerType] = useState<string>('');
  const [customName, setCustomName] = useState('');

  const isConsumer = assetType.normalizedName === 'consumer';

  const handleConfirm = () => {
    if (selectedInstanceId === 'new') {
      const attributes: Record<string, any> = {};
      
      if (isConsumer) {
        attributes.consumerType = consumerType;
      }

      onCreateNew(
        selectedPlantId === 'site' || selectedPlantId === 'none' ? undefined : selectedPlantId,
        {
          ...attributes,
          name: customName || `New ${assetType.name}`
        }
      );
    } else {
      const instance = existingInstances.find(i => i.id === selectedInstanceId);
      if (instance) {
        onSelectInstance(instance);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select {assetType.name} Instance</DialogTitle>
          <DialogDescription>
            Choose an existing {assetType.name.toLowerCase()} or create a new one.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="max-h-[300px] mt-4">
            <RadioGroup
              value={selectedInstanceId}
              onValueChange={setSelectedInstanceId}
              className="gap-4"
            >
              <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent cursor-pointer">
                <RadioGroupItem value="new" id="new" />
                <Label htmlFor="new" className="flex items-center gap-2 cursor-pointer">
                  <PlusCircle className="w-4 h-4" />
                  Create New {assetType.name}
                </Label>
              </div>

              {existingInstances.map((instance) => (
                <div
                  key={instance.id}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-accent cursor-pointer"
                >
                  <RadioGroupItem value={instance.id} id={instance.id} />
                  <Label htmlFor={instance.id} className="cursor-pointer">
                    <div className="font-medium">{instance.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {Object.entries(instance.dynamicAttributes || {})
                        .map(([key, value]) => `${key}: ${value}`)
                        .join(' | ')}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedInstanceId === 'new' && (
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="custom-name">Name</Label>
                  <Input
                    id="custom-name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={`New ${assetType.name}`}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="plant-select">Associate with:</Label>
                  <Select
                    value={selectedPlantId}
                    onValueChange={setSelectedPlantId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select association" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="site">Site Level</SelectItem>
                      <SelectItem value="none">No Plant Assignment</SelectItem>
                      {site?.plants?.map((plant) => (
                        <SelectItem key={plant.id} value={plant.id}>
                          Plant: {plant.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {isConsumer && (
                  <div>
                    <Label htmlFor="consumer-type">Consumer Type</Label>
                    <Select
                      value={consumerType}
                      onValueChange={setConsumerType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select consumer type" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONSUMER_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {consumerType && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {CONSUMER_TYPES.find(t => t.id === consumerType)?.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        )}

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedInstanceId || (selectedInstanceId === 'new' && (
              !customName || (isConsumer && !consumerType)
            )) || isLoading}
          >
            {selectedInstanceId === 'new' ? 'Create' : 'Select'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 