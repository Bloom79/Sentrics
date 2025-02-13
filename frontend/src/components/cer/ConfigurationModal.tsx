import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { NewConfiguration } from '@/types/cer/configuration';

const configurationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(['basic', 'advanced', 'enterprise']),
  version: z.string().min(1, 'Version is required'),
  status: z.enum(['draft', 'active', 'suspended']).default('draft'),
  features: z.object({
    maxMembers: z.number().min(1),
    maxProductionUnits: z.number().min(0),
    reportingFrequency: z.array(z.string()),
    analytics: z.string(),
    enabledModules: z.array(z.string()),
  }),
  restrictions: z.object({
    allowedLegalForms: z.array(z.string()),
    maxCapacity: z.number().min(0),
    documentStorage: z.string(),
    geographicalLimit: z.number().min(0),
    voltageLevel: z.enum(['low', 'medium', 'high']),
  }),
});

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewConfiguration) => Promise<void>;
}

export function ConfigurationModal({
  isOpen,
  onClose,
  onSubmit,
}: ConfigurationModalProps) {
  const form = useForm<NewConfiguration>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      status: 'draft',
      type: 'basic',
      features: {
        maxMembers: 10,
        maxProductionUnits: 5,
        reportingFrequency: ['monthly'],
        analytics: 'basic',
        enabledModules: ['billing', 'reporting'],
      },
      restrictions: {
        allowedLegalForms: ['cooperative'],
        maxCapacity: 100,
        documentStorage: '1GB',
        geographicalLimit: 50,
        voltageLevel: 'low',
      },
    },
  });

  const handleSubmit = async (data: NewConfiguration) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      // Error will be handled by the parent component
      console.error('Error submitting configuration:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Configuration</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Configuration name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input placeholder="1.0.0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
