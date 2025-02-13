import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import Map from '@/components/Map';

const formSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  legal_type: z.enum(['cooperative', 'association', 'consortium']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  primary_substation_id: z.string({
    required_error: "Primary substation is required"
  })
});

type FormValues = z.infer<typeof formSchema>;

export default function NewCommunity() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [boundary, setBoundary] = useState<number[][]>([]);
  const [boundaryError, setBoundaryError] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      legal_type: 'cooperative',
      description: '',
      primary_substation_id: ''
    },
  });

  const createCommunity = useMutation({
    mutationFn: async (data: FormValues) => {
      if (!boundary || boundary.length === 0) {
        throw new Error('Community boundary is required');
      }

      try {
        // Ensure we have valid coordinates
        if (boundary.length < 4) {
          throw new Error('Invalid boundary: polygon must have at least 3 points plus closing point');
        }

        // Validate each coordinate pair
        for (const coord of boundary) {
          if (!Array.isArray(coord) || coord.length !== 2 || 
              typeof coord[0] !== 'number' || typeof coord[1] !== 'number') {
            throw new Error('Invalid coordinate format: each point must be [longitude, latitude]');
          }
        }

        const payload = {
          name: data.name,
          legal_type: data.legal_type,
          description: data.description,
          primary_substation_id: data.primary_substation_id,
          boundary_coordinates: boundary,
          status: 'pending',
          gse_compliance_status: 'pending',
          total_capacity: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        console.log('Sending payload:', JSON.stringify(payload, null, 2));
        const response = await api.post('/api/cer/communities', payload);
        
        // Log the response for debugging
        console.log('Response:', response.data);
        
        return response.data;
      } catch (error: any) {
        console.error('Error creating community:', error.response?.data || error);
        if (error.response?.data?.detail) {
          const detail = error.response.data.detail;
          if (Array.isArray(detail)) {
            const messages = detail.map(err => {
              if (err.loc && err.msg) {
                const field = err.loc[err.loc.length - 1];
                return `${field}: ${err.msg}`;
              }
              return err.msg || err;
            });
            throw new Error(messages.join('\n'));
          } else {
            throw new Error(detail);
          }
        }
        throw new Error('Failed to create community');
      }
    },
    onSuccess: () => {
      // Invalidate and refetch communities query
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      toast({
        title: "Success",
        description: "Community created successfully",
      });
      navigate('/cer/communities');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormValues) => {
    if (!boundary || boundary.length === 0) {
      setBoundaryError('Please draw the community boundary on the map');
      return;
    }
    setBoundaryError(null);
    createCommunity.mutate(data);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Create Energy Community</h1>
        <p className="text-muted-foreground">
          Define the details and boundary of your new energy community
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Community Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter community name" {...field} />
                </FormControl>
                <FormDescription>
                  Choose a unique name for your energy community
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="legal_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Legal Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select legal type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="cooperative">Cooperative</SelectItem>
                    <SelectItem value="association">Association</SelectItem>
                    <SelectItem value="consortium">Consortium</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the legal structure of your community
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe your energy community's goals and activities"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Provide a brief description of your community's goals and activities
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="primary_substation_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Substation ID</FormLabel>
                <FormControl>
                  <Input placeholder="Enter primary substation ID" {...field} />
                </FormControl>
                <FormDescription>
                  Enter the ID of the primary substation for this community
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Community Boundary</h3>
              <p className="text-muted-foreground">
                Draw the boundary of your energy community on the map
              </p>
            </div>
            
            <div className="h-[400px] border rounded-lg overflow-hidden">
              <Map onBoundaryChange={setBoundary} />
            </div>
            {boundaryError && (
              <p className="text-sm text-destructive">{boundaryError}</p>
            )}
          </div>

          <Button type="submit" disabled={createCommunity.isPending}>
            {createCommunity.isPending ? 'Creating...' : 'Create Community'}
          </Button>
        </form>
      </Form>
    </div>
  );
} 