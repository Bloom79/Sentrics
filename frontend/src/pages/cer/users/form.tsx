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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  InfoIcon, 
  MapPinIcon, 
  Settings2, 
  Home,
  Users,
  Building2,
  Factory,
  Sun,
  Upload,
  Download,
  Search,
  ChevronRight
} from 'lucide-react';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const userSchema = z.object({
  id: z.number().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  full_name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  fiscal_code: z.string().min(1, 'Fiscal code is required'),
  type: z.enum(['consumer', 'producer', 'prosumer']),
  user_type: z.enum(['real', 'simulated']),
  status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  address: z.string().min(1, 'Address is required'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).default({
    lat: 41.9028,
    lng: 12.4964
  }),
  pod_id: z.string().optional(),
  smart_meter_id: z.string().optional(),
  activation_date: z.string().optional(),
  has_asset_management: z.boolean().default(false),
  is_active: z.boolean().default(true),
  is_verified: z.boolean().default(false),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  technical_info: z.object({
    total_capacity: z.number().min(0).max(200).optional(),
    voltage_level: z.enum(['low', 'medium', 'high']).optional(),
    metering_interval: z.enum(['quarter_hourly', 'half_hourly', 'hourly']).optional(),
    smart_meter_required: z.boolean().optional(),
    grid_connection_type: z.enum(['single_point', 'multiple_points']).optional(),
    load_profiles: z.array(z.object({
      name: z.string(),
      type: z.enum(['residential', 'commercial', 'industrial']),
      visibility: z.enum(['public', 'private']),
      data_source: z.enum(['historical', 'template', 'custom']),
      file: z.any().optional(),
    })).optional(),
  }).optional(),
  plant_info: z.object({
    name: z.string(),
    type: z.enum(['solar', 'wind', 'hydro', 'biomass', 'other']),
    capacity: z.number().min(0),
    installation_date: z.string(),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    inverter_type: z.string().optional(),
    orientation: z.number().optional(),
    tilt: z.number().optional(),
    location: z.object({
      lat: z.number(),
      lng: z.number(),
    }).optional(),
  }).optional(),
  total_consumption: z.number().optional(),
  total_production: z.number().optional(),
  self_consumption_rate: z.number().optional(),
  configurations_count: z.number().optional(),
});

type UserForm = z.infer<typeof userSchema>;

function LoadProfileSection({ 
  form 
}: { 
  form: any;
}) {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const downloadTemplate = () => {
    const template = 'timestamp,consumption_kwh\n00:00,0\n00:15,0\n00:30,0\n00:45,0\n01:00,0\n...';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'load_profile_template.csv';
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Load Profile</h3>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTemplate}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Profile Template
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => setShowProfileDialog(true)}
          >
            Select Profile
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-4">
        {form.watch('technical_info.load_profiles')?.[0] ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{form.watch('technical_info.load_profiles')[0].name}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">
                  {form.watch('technical_info.load_profiles')[0].type}
                </Badge>
                <Badge variant="outline">
                  {form.watch('technical_info.load_profiles')[0].data_source}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowProfileDialog(true)}
            >
              Change Profile
            </Button>
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              No load profile selected. Choose a profile to get started.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function PlantInfoSection({
  form
}: {
  form: any;
}) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="plant_info.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plant Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter plant name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="plant_info.type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plant Type</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select plant type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="solar">Solar PV</SelectItem>
                <SelectItem value="wind">Wind</SelectItem>
                <SelectItem value="hydro">Hydro</SelectItem>
                <SelectItem value="biomass">Biomass</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="plant_info.capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Capacity (kW)</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter capacity"
                {...field}
                onChange={e => field.onChange(parseFloat(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="plant_info.installation_date"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Installation Date</FormLabel>
            <FormControl>
              <Input
                type="date"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch('plant_info.type') === 'solar' && (
        <>
          <FormField
            control={form.control}
            name="plant_info.manufacturer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Panel Manufacturer</FormLabel>
                <FormControl>
                  <Input placeholder="Enter manufacturer" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plant_info.model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Panel Model</FormLabel>
                <FormControl>
                  <Input placeholder="Enter model" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plant_info.inverter_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Inverter Type</FormLabel>
                <FormControl>
                  <Input placeholder="Enter inverter type" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="plant_info.orientation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orientation (°)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter orientation"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plant_info.tilt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tilt (°)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter tilt"
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default function UserForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userId } = useParams();
  const isEditMode = Boolean(userId);
  const [activeTab, setActiveTab] = useState('basic');

  console.log('Rendering UserForm, userId:', userId, 'isEditMode:', isEditMode);

  const { data: existingUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      if (!userId) return null;
      console.log('Fetching existing user data for userId:', userId);
      const response = await api.get(`/api/v1/users/${userId}`);
      console.log('Existing user data:', response.data);
      return response.data;
    },
    enabled: isEditMode,
  });

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      full_name: '',
      email: '',
      fiscal_code: '',
      type: 'consumer',
      user_type: 'real',
      status: 'pending',
      has_asset_management: false,
      is_active: true,
      is_verified: false,
      location: {
        lat: 41.9028,
        lng: 12.4964
      },
      address: '',
      pod_id: '',
      smart_meter_id: '',
      total_consumption: 0,
      total_production: 0,
      self_consumption_rate: 0,
      configurations_count: 0,
      technical_info: {
        total_capacity: 0,
        voltage_level: 'low',
        metering_interval: 'quarter_hourly',
        smart_meter_required: false,
        grid_connection_type: 'single_point',
        load_profiles: []
      }
    },
  });

  useEffect(() => {
    if (existingUser) {
      console.log('Resetting form with existing user data:', existingUser);
      
      const formData = {
        ...existingUser,
        username: existingUser.username || '',
        full_name: existingUser.full_name || '',
        email: existingUser.email || '',
        fiscal_code: existingUser.fiscal_code || '',
        type: existingUser.type?.toLowerCase() || 'consumer',
        user_type: existingUser.user_type || 'real',
        status: existingUser.status || 'pending',
        is_active: existingUser.is_active ?? true,
        is_verified: existingUser.is_verified ?? false,
        has_asset_management: existingUser.has_asset_management ?? false,
        address: existingUser.address || '',
        pod_id: existingUser.pod_id || '',
        smart_meter_id: existingUser.smart_meter_id || '',
        activation_date: existingUser.activation_date || '',
        created_at: existingUser.created_at || '',
        updated_at: existingUser.updated_at || '',
        location: {
          lat: existingUser.location?.lat || 41.9028,
          lng: existingUser.location?.lng || 12.4964
        },
        technical_info: {
          total_capacity: existingUser.technical_info?.total_capacity ?? 0,
          voltage_level: existingUser.technical_info?.voltage_level || 'low',
          metering_interval: existingUser.technical_info?.metering_interval || 'quarter_hourly',
          smart_meter_required: existingUser.technical_info?.smart_meter_required ?? false,
          grid_connection_type: existingUser.technical_info?.grid_connection_type || 'single_point',
          load_profiles: existingUser.technical_info?.load_profiles || []
        },
        ...(existingUser.type === 'producer' || existingUser.type === 'prosumer' ? {
          plant_info: {
            name: existingUser.plant_info?.name || '',
            type: existingUser.plant_info?.type || 'solar',
            capacity: existingUser.plant_info?.capacity ?? 0,
            installation_date: existingUser.plant_info?.installation_date || '',
            manufacturer: existingUser.plant_info?.manufacturer || '',
            model: existingUser.plant_info?.model || '',
            inverter_type: existingUser.plant_info?.inverter_type || '',
            orientation: existingUser.plant_info?.orientation ?? 0,
            tilt: existingUser.plant_info?.tilt ?? 0,
            location: existingUser.plant_info?.location || { lat: 0, lng: 0 }
          }
        } : {}),
        total_consumption: existingUser.total_consumption ?? 0,
        total_production: existingUser.total_production ?? 0,
        self_consumption_rate: existingUser.self_consumption_rate ?? 0,
        configurations_count: existingUser.configurations_count ?? 0
      };

      console.log('Prepared form data for reset:', formData);
      form.reset(formData);
      
      if (existingUser.address) {
        console.log('Setting address:', existingUser.address);
        form.setValue('address', existingUser.address);
      }

      form.setValue('type', existingUser.type?.toLowerCase() || 'consumer');
      form.setValue('user_type', existingUser.user_type || 'real');
      
      if (existingUser.pod_id) {
        form.setValue('pod_id', existingUser.pod_id);
      }
      if (existingUser.smart_meter_id) {
        form.setValue('smart_meter_id', existingUser.smart_meter_id);
      }
    }
  }, [existingUser, form]);

  const { mutate: saveUser, isPending } = useMutation({
    mutationFn: async (data: UserForm) => {
      console.log('Starting user save mutation with data:', data);
      
      try {
        const submitData = {
          ...data,
          id: isEditMode ? parseInt(userId!) : undefined,
          full_name: data.full_name,
          password: !isEditMode && data.password ? data.password : undefined,
          type: data.type.toLowerCase(),
          location: {
            lat: data.location.lat,
            lng: data.location.lng
          },
          is_active: data.is_active,
          is_verified: data.is_verified,
          technical_info: data.technical_info || {},
          plant_info: (data.type === 'producer' || data.type === 'prosumer') ? data.plant_info : undefined
        };

        console.log('Prepared submit data:', submitData);
        console.log('Making API request to:', isEditMode ? `/api/v1/users/${userId}` : '/api/v1/users/');

        if (isEditMode && userId) {
          console.log('Sending PUT request for user update');
          const response = await api.put(`/api/v1/users/${userId}`, submitData);
          console.log('Update response:', response.data);
          return response.data;
        } else {
          console.log('Sending POST request for new user');
          const response = await api.post('/api/v1/users/', submitData);
          console.log('Create response:', response.data);
          return response.data;
        }
      } catch (error) {
        console.error('API request failed:', error);
        throw error;
      }
    },
    onMutate: (data) => {
      console.log('Mutation starting with data:', data);
    },
    onSuccess: (data) => {
      console.log('User save successful:', data);
      toast({
        title: isEditMode ? 'User updated' : 'User created',
        description: isEditMode 
          ? 'The user has been updated successfully'
          : 'The user has been created successfully'
      });
      navigate('/cer/users');
    },
    onError: (error: any) => {
      console.error('Error saving user:', error);
      let errorMessage = 'An error occurred while saving the user';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error('Error details:', errorMessage);

      toast({
        title: isEditMode ? 'Error updating user' : 'Error creating user',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  });

  const onSubmit = async (data: UserForm) => {
    console.log('Form submitted with data:', data);
    try {
      await saveUser(data);
    } catch (error) {
      console.error('Error in onSubmit:', error);
    }
  };

  const breadcrumbs = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/cer', label: 'Energy Management', icon: Settings2 },
    { href: '/cer/users', label: 'Users', icon: Users },
    { href: '#', label: isEditMode ? 'Edit User' : 'New User', current: true }
  ];

  const renderStatistics = () => (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="total_consumption"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Consumption (kWh)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value || 0}
                onChange={e => field.onChange(parseFloat(e.target.value))}
                disabled
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="total_production"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Total Production (kWh)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value || 0}
                onChange={e => field.onChange(parseFloat(e.target.value))}
                disabled
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="self_consumption_rate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Self-Consumption Rate (%)</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value || 0}
                onChange={e => field.onChange(parseFloat(e.target.value))}
                disabled
              />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="configurations_count"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Configurations Count</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                value={field.value || 0}
                onChange={e => field.onChange(parseInt(e.target.value))}
                disabled
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );

  if (isEditMode && isLoadingUser) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading user...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit User' : 'New User'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? 'Update user information' : 'Create a new user'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Form submit event triggered');
            const formData = form.getValues();
            console.log('Current form values:', formData);
            form.handleSubmit(onSubmit)(e);
          }} 
          className="space-y-6"
        >
          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="technical">Technical Info</TabsTrigger>
              <TabsTrigger value="plant" disabled={form.watch('type') === 'consumer'}>
                Plant Info
              </TabsTrigger>
              <TabsTrigger value="profile">Load Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter password" type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter email address" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="fiscal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fiscal Code / VAT Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter fiscal code or VAT number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Type</FormLabel>
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
                              <SelectItem value="consumer">Consumer</SelectItem>
                              <SelectItem value="producer">Producer</SelectItem>
                              <SelectItem value="prosumer">Prosumer</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="user_type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="real">Real User</SelectItem>
                              <SelectItem value="simulated">Simulated User</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <AddressAutocomplete
                            value={field.value || ''}
                            onChange={(value) => {
                              console.log('Address changing to:', value);
                              field.onChange(value);
                            }}
                            onLocationSelect={(lat, lng) => {
                              console.log('Location selected:', { lat, lng });
                              form.setValue('location', { lat, lng });
                            }}
                            placeholder="Enter full address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pod_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>POD ID</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            <Input placeholder="Enter POD ID" {...field} className="flex-1" />
                          </FormControl>
                          <Button variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                          </Button>
                        </div>
                        <FormDescription>
                          Enter POD ID to verify meter type and ownership
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="smart_meter_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Smart Meter ID (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter smart meter ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="activation_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activation Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="has_asset_management"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Asset Management Access
                          </FormLabel>
                          <FormDescription>
                            Enable access to Asset Management module
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {isEditMode && (
                    <>
                      <h3 className="text-lg font-medium mt-6">Statistics</h3>
                      {renderStatistics()}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="technical_info.total_capacity"
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
                        <FormDescription>Maximum allowed: 200 kW</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technical_info.voltage_level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voltage Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select voltage level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low Voltage</SelectItem>
                            <SelectItem value="medium">Medium Voltage</SelectItem>
                            <SelectItem value="high">High Voltage</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technical_info.metering_interval"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Metering Interval</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select metering interval" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="quarter_hourly">15 Minutes</SelectItem>
                            <SelectItem value="half_hourly">30 Minutes</SelectItem>
                            <SelectItem value="hourly">1 Hour</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technical_info.smart_meter_required"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Smart Meter Required
                          </FormLabel>
                          <FormDescription>
                            Require smart meter for this user
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="technical_info.grid_connection_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Grid Connection Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select connection type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single_point">Single Point</SelectItem>
                            <SelectItem value="multiple_points">Multiple Points</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plant">
              <Card>
                <CardHeader>
                  <CardTitle>Plant Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <PlantInfoSection form={form} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Load Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <LoadProfileSection form={form} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/cer/users')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isPending}
              onClick={() => console.log('Submit button clicked')}
            >
              {isPending ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update User' : 'Create User')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 