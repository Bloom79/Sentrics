import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  }),
  total_capacity: z.number()
    .min(0, 'Capacity must be positive')
    .max(200, 'Maximum capacity is 200kW')
    .optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function EditCommunity() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [boundary, setBoundary] = useState<number[][]>([]);
  const [boundaryError, setBoundaryError] = useState<string | null>(null);

  // Fetch community data
  const { data: community, isLoading } = useQuery({
    queryKey: ['community', id],
    queryFn: async () => {
      const response = await api.get(`/api/cer/communities/${id}`);
      return response.data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      legal_type: 'cooperative',
      description: '',
      primary_substation_id: '',
      total_capacity: 0
    },
  });

  // Update form values when community data is loaded
  useEffect(() => {
    if (community) {
      form.reset({
        name: community.name,
        legal_type: community.legal_type,
        description: community.description,
        primary_substation_id: community.primary_substation_id,
        total_capacity: community.total_capacity
      });
      setBoundary(community.boundary_coordinates || []);
    }
  }, [community, form]);

  const updateCommunity = useMutation({
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
          total_capacity: data.total_capacity || 0,
          boundary_coordinates: boundary,
          updated_at: new Date().toISOString()
        };

        const response = await api.put(`/api/cer/communities/${id}`, payload);
        return response.data;
      } catch (error: any) {
        console.error('Error updating community:', error.response?.data || error);
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
        throw new Error('Failed to update community');
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Community updated successfully",
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
    updateCommunity.mutate(data);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Edit Energy Community</h1>
        <p className="text-muted-foreground">
          Update the details and boundary of your energy community
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

          <FormField
            control={form.control}
            name="total_capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Capacity (kW)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter total capacity" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormDescription>
                  Enter the total capacity in kilowatts (kW). Maximum allowed is 200kW.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Community Boundary</h3>
              <p className="text-muted-foreground">
                Update the boundary of your energy community on the map
              </p>
            </div>
            
            <div className="h-[400px] border rounded-lg overflow-hidden">
              <Map onBoundaryChange={setBoundary} />
            </div>
            {boundaryError && (
              <p className="text-sm text-destructive">{boundaryError}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/cer/communities')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={updateCommunity.isPending}>
              {updateCommunity.isPending ? 'Updating...' : 'Update Community'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 