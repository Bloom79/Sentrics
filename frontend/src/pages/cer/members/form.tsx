import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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
  ChevronRight,
  Plug,
  Zap,
  Battery,
  UserPlus
} from 'lucide-react';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ConfigurationService } from '@/services/cer/configuration.service';

interface User {
  id: number;
  full_name: string;
  email: string;
  fiscal_code: string;
  type: string;
  user_type: string;
  address?: string;
  pod_id?: string;
  smart_meter_id?: string;
}

interface Configuration {
  id: number;
  name: string;
  type: string;
  status: string;
}

const memberSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().nullable(),
  configuration_id: z.number(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  address: z.string().min(1, 'Address is required'),
  type: z.enum(['consumer', 'producer', 'prosumer']).default('consumer'),
  user_type: z.enum(['real', 'simulated']).default('real'),
  status: z.enum(['active', 'inactive', 'pending']).default('active'),
  pod_id: z.string().min(1, 'POD ID is required'),
  smart_meter_id: z.string().nullable(),
  meter_type: z.string().nullable(),
  load_profile_type: z.enum(['residential', 'commercial', 'industrial', 'custom']).default('residential'),
  load_profile_data: z.record(z.any()).nullable().default({}),
  contracted_power: z.number().min(0).default(0),
  voltage_level: z.string().nullable(),
  is_active: z.boolean().default(true),
  activation_date: z.string().transform(str => str ? new Date(str).toISOString() : null).nullable(),
  verification_status: z.string().nullable(),
  technical_info: z.object({
    total_capacity: z.number().min(0).max(200).default(0),
    voltage_level: z.enum(['low', 'medium', 'high']).default('low'),
    metering_interval: z.enum(['quarter_hourly', 'half_hourly', 'hourly']).default('quarter_hourly'),
    smart_meter_required: z.boolean().default(false),
    grid_connection_type: z.enum(['single_point', 'multiple_points']).default('single_point'),
  }).nullable().default({
    total_capacity: 0,
    voltage_level: 'low',
    metering_interval: 'quarter_hourly',
    smart_meter_required: false,
    grid_connection_type: 'single_point'
  }),
  device_info: z.record(z.any()).nullable().default({}),
  energy_sharing_preferences: z.record(z.any()).nullable().default({}),
  fiscal_code: z.string().nullable(),
  billing_address: z.string().nullable(),
  billing_preferences: z.record(z.any()).nullable().default({}),
});

type MemberForm = z.infer<typeof memberSchema>;

const configService = new ConfigurationService();

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
        {form.watch('load_profile_type') ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{form.watch('load_profile_type')}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">
                  {form.watch('load_profile_type')}
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

function TechnicalInfoSection({
  form
}: {
  form: any;
}) {
  return (
    <div className="space-y-6">
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
                <SelectItem value="LOW">Low Voltage</SelectItem>
                <SelectItem value="MEDIUM">Medium Voltage</SelectItem>
                <SelectItem value="HIGH">High Voltage</SelectItem>
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
                <SelectItem value="QUARTER_HOURLY">15 Minutes</SelectItem>
                <SelectItem value="HALF_HOURLY">30 Minutes</SelectItem>
                <SelectItem value="HOURLY">1 Hour</SelectItem>
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
                Require smart meter for this member
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
                <SelectItem value="SINGLE_POINT">Single Point</SelectItem>
                <SelectItem value="MULTIPLE_POINTS">Multiple Points</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

export default function MemberForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { memberId } = useParams();
  const isEditMode = Boolean(memberId);
  const location = useLocation();
  const { user_id, configuration_id, user_data } = location.state || {};
  const [activeTab, setActiveTab] = useState('basic');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch users for selection
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get('/api/v1/users');
      return response.data.items;
    },
    enabled: !user_id,
  });

  // Fetch configurations for selection
  const { data: configurations } = useQuery({
    queryKey: ['configurations'],
    queryFn: async () => {
      const response = await api.get('/api/v1/configurations');
      return response.data.items;
    },
    enabled: !configuration_id,
  });

  // Fetch single user if user_id is provided
  const { data: selectedUserData } = useQuery({
    queryKey: ['user', user_id],
    queryFn: async () => {
      if (!user_id) return null;
      const response = await api.get(`/api/v1/users/${user_id}`);
      return response.data;
    },
    enabled: !!user_id,
  });

  // Fetch single configuration if configuration_id is provided
  const { data: selectedConfigData } = useQuery({
    queryKey: ['configuration', configuration_id],
    queryFn: async () => {
      if (!configuration_id) return null;
      const response = await api.get(`/api/v1/configurations/${configuration_id}`);
      return response.data;
    },
    enabled: !!configuration_id,
  });

  const { data: existingMember, isLoading: isLoadingMember } = useQuery({
    queryKey: ['member', memberId],
    queryFn: async () => {
      if (!memberId) return null;
      const response = await api.get(`/api/v1/members/${memberId}`);
      return response.data;
    },
    enabled: isEditMode,
  });

  const form = useForm<MemberForm>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      user_id: user_id ? parseInt(user_id) : null,
      configuration_id: configuration_id ? parseInt(configuration_id) : undefined,
      name: '',
      type: 'consumer',
      pod_id: '',
      smart_meter_id: null,
      meter_type: null,
      address: '',
      fiscal_code: null,
      billing_address: null,
      load_profile_type: 'residential',
      load_profile_data: {},
      contracted_power: 0,
      voltage_level: null,
      is_active: true,
      user_type: 'real',
      status: 'active',
      activation_date: null,
      verification_status: null,
      technical_info: {
        total_capacity: 0,
        voltage_level: 'low',
        metering_interval: 'quarter_hourly',
        smart_meter_required: false,
        grid_connection_type: 'single_point',
      },
      device_info: {},
      energy_sharing_preferences: {},
      billing_preferences: {},
    },
    mode: 'onChange',
  });

  // Add form state change monitoring
  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log(`Form field changed - Name: ${name}, Type: ${type}, Value:`, value);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Add validation state monitoring
  useEffect(() => {
    console.log('Form validation state:', {
      errors: form.formState.errors,
      isValid: form.formState.isValid,
      isDirty: form.formState.isDirty,
      dirtyFields: form.formState.dirtyFields,
    });
  }, [form.formState]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      // Cleanup any potential portals or DOM elements
      const portals = document.querySelectorAll('[role="listbox"]');
      portals.forEach(portal => {
        if (portal.parentNode) {
          portal.parentNode.removeChild(portal);
        }
      });
    };
  }, []);

  useEffect(() => {
    if (user_data && configuration_id) {
      // Pre-fill form with user data when creating a new member
      const formData = {
        ...form.getValues(),
        user_id: parseInt(user_id),
        configuration_id: parseInt(configuration_id),
        name: user_data.name || '',
        type: (user_data.type || 'consumer').toLowerCase(),
        pod_id: user_data.pod_id || '',
        smart_meter_id: user_data.smart_meter_id || null,
        meter_type: user_data.meter_type || null,
        address: user_data.address || '',
        fiscal_code: user_data.fiscal_code || null,
        billing_address: user_data.billing_address || null,
        load_profile_type: 'residential' as const,
        contracted_power: 0,
        is_active: true,
        user_type: 'real' as const,
        status: 'active' as const,
        activation_date: null,
        verification_status: null,
        technical_info: {
          total_capacity: 0,
          voltage_level: 'low' as const,
          metering_interval: 'quarter_hourly' as const,
          smart_meter_required: false,
          grid_connection_type: 'single_point' as const,
        },
        device_info: {},
        energy_sharing_preferences: {},
        billing_preferences: {},
      };

      // Use setTimeout to ensure the form is ready
      setTimeout(() => {
        form.reset(formData);
        // Set selected user in state
        if (selectedUserData) {
          setSelectedUser(selectedUserData);
        }
      }, 0);
    }
  }, [user_data, configuration_id, user_id, selectedUserData, form]);

  useEffect(() => {
    if (existingMember) {
      console.log('Initializing form with existing member:', existingMember);
      setTimeout(() => {
        const formData = {
          ...existingMember,
          user_id: existingMember.user_id,
          configuration_id: existingMember.configuration_id,
          name: existingMember.name || '',
          type: existingMember.type?.toLowerCase() || 'consumer',
          pod_id: existingMember.pod_id || '',
          smart_meter_id: existingMember.smart_meter_id || null,
          meter_type: existingMember.meter_type || null,
          address: existingMember.address || '',
          fiscal_code: existingMember.fiscal_code || null,
          billing_address: existingMember.billing_address || null,
          load_profile_type: existingMember.load_profile_type?.toLowerCase() || 'residential',
          contracted_power: existingMember.contracted_power || 0,
          voltage_level: existingMember.voltage_level || null,
          is_active: existingMember.is_active ?? true,
          user_type: existingMember.user_type?.toLowerCase() || 'real',
          status: existingMember.status?.toLowerCase() || 'active',
          activation_date: existingMember.activation_date || null,
          verification_status: existingMember.verification_status || null,
          technical_info: {
            total_capacity: existingMember.technical_info?.total_capacity || 0,
            voltage_level: existingMember.technical_info?.voltage_level?.toLowerCase() || 'low',
            metering_interval: existingMember.technical_info?.metering_interval?.toLowerCase() || 'quarter_hourly',
            smart_meter_required: existingMember.technical_info?.smart_meter_required ?? false,
            grid_connection_type: existingMember.technical_info?.grid_connection_type?.toLowerCase() || 'single_point',
          },
          device_info: existingMember.device_info || {},
          energy_sharing_preferences: existingMember.energy_sharing_preferences || {},
          billing_preferences: existingMember.billing_preferences || {},
        };
        console.log('Setting form data:', formData);
        form.reset(formData);
        
        const user = users?.find(u => u.id === existingMember.user_id);
        if (user) {
          console.log('Setting selected user:', user);
          setSelectedUser(user);
        }
      }, 0);
    }
  }, [existingMember, users, form]);

  // Add debug logging for form values
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('Form values updated:', {
        formValues: value,
        fiscalCode: form.getValues('fiscal_code'),
        billingAddress: form.getValues('billing_address'),
        technicalInfo: form.getValues('technical_info'),
        podId: form.getValues('pod_id'),
        smartMeterId: form.getValues('smart_meter_id'),
        activationDate: form.getValues('activation_date'),
      });
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: MemberForm) => {
    console.log('Form submission triggered');
    console.log('Raw form data:', data);
    
    // Validate the data against the schema directly
    try {
      const validatedData = memberSchema.parse(data);
      console.log('Schema validation passed:', validatedData);
      
      // Check required fields
      console.log('Checking required fields:');
      console.log('- user_id:', validatedData.user_id);
      console.log('- configuration_id:', validatedData.configuration_id);
      console.log('- name:', validatedData.name);
      console.log('- address:', validatedData.address);
      console.log('- type:', validatedData.type);
      console.log('- pod_id:', validatedData.pod_id);
      
      // Log routing information
      console.log('Routing information:');
      console.log('- Current path:', location.pathname);
      console.log('- isEditMode:', isEditMode);
      console.log('- memberId:', memberId);
      
      try {
        saveMember(validatedData);
      } catch (error) {
        console.error('Error in saveMember:', error);
      }
    } catch (error) {
      console.error('Schema validation failed:', error);
      // Show validation errors to user
      toast({
        title: 'Validation Error',
        description: 'Please check the form for errors',
        variant: 'destructive'
      });
    }
  };

  // Add logging to form initialization
  useEffect(() => {
    console.log('Form initialized with values:', form.getValues());
  }, [form]);

  // Modify the mutation function to properly handle the data
  const { mutate: saveMember, isPending } = useMutation({
    mutationFn: async (data: MemberForm) => {
      console.log('Starting mutation with validated data:', data);
      
      // Ensure proper case transformation for enum fields
      const transformedData = {
        ...data,
        // Keep enums in lowercase as they are in the schema
        type: data.type.toLowerCase(),
        user_type: data.user_type.toLowerCase(),
        status: data.status.toLowerCase(),
        load_profile_type: data.load_profile_type.toLowerCase(),
        // Add load_profile_data with default if not present
        load_profile_data: data.load_profile_data || {},
        // Handle optional fields with null coalescing
        smart_meter_id: data.smart_meter_id || null,
        meter_type: data.meter_type || null,
        voltage_level: data.voltage_level || null,
        fiscal_code: data.fiscal_code || null,
        billing_address: data.billing_address || null,
        activation_date: data.activation_date || null,
        verification_status: data.verification_status || null,
        // Ensure technical_info fields are properly transformed
        technical_info: {
          ...data.technical_info,
          voltage_level: data.technical_info?.voltage_level?.toLowerCase(),
          metering_interval: data.technical_info?.metering_interval?.toLowerCase(),
          grid_connection_type: data.technical_info?.grid_connection_type?.toLowerCase(),
          total_capacity: data.technical_info?.total_capacity || 0,
          smart_meter_required: data.technical_info?.smart_meter_required ?? false,
        },
        // Ensure other objects have default values
        device_info: data.device_info || {},
        energy_sharing_preferences: data.energy_sharing_preferences || {},
        billing_preferences: data.billing_preferences || {},
      };

      console.log('Transformed payload for API:', transformedData);

      const url = isEditMode 
        ? `/api/v1/members/${memberId}`
        : '/api/v1/members/';
      console.log(`Making ${isEditMode ? 'PUT' : 'POST'} request to: ${url}`);

      try {
        const response = isEditMode
          ? await api.put(url, transformedData)
          : await api.post(url, transformedData);
        console.log('API Response:', response);
        return response.data;
      } catch (error: any) {
        console.error('API request failed:', error);
        console.error('Request payload:', transformedData);
        if (error.response?.data?.detail) {
          console.error('API error details:', error.response.data.detail);
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Mutation succeeded:', data);
      toast({
        title: isEditMode ? 'Member updated' : 'Member created',
        description: isEditMode 
          ? 'The member has been updated successfully'
          : 'The member has been created successfully'
      });
      console.log('Navigating to:', '/cer/members');
      navigate('/cer/members');
    },
    onError: (error: any) => {
      console.error('Mutation error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      
      let errorMessage = 'An error occurred while saving the member';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: isEditMode ? 'Error updating member' : 'Error creating member',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  });

  const breadcrumbs = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/cer', label: 'Energy Management', icon: Settings2 },
    { href: '/cer/configurations/members', label: 'Members', icon: Users },
    { href: '#', label: isEditMode ? 'Edit Member' : 'New Member', current: true }
  ];

  if (isEditMode && isLoadingMember) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading member...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            {isEditMode ? 'Edit Member' : 'New Member'}
          </h1>
          <p className="text-muted-foreground">
            {isEditMode ? 'Update member information' : 'Create a new member'}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form 
          onSubmit={(e) => {
            console.log('Form submit event triggered');
            console.log('Form values at submission:', form.getValues());
            console.log('Form validation state at submission:', form.formState);
            e.preventDefault();
            form.handleSubmit(onSubmit)(e);
          }} 
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>User Selection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select User</FormLabel>
                    <Select
                      key={`user-select-${field.value}`}
                      onValueChange={(value) => {
                        field.onChange(parseInt(value));
                        const user = users?.find(u => u.id === parseInt(value));
                        if (user) setSelectedUser(user);
                      }}
                      value={field.value?.toString()}
                      disabled={!!user_id}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user">
                            {selectedUserData?.full_name || (users?.find(u => u.id === field.value)?.full_name)}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {user.full_name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="configuration_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Configuration</FormLabel>
                    <Select
                      key={`config-select-${field.value}`}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                      disabled={!!configuration_id}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a configuration">
                            {selectedConfigData?.name || (configurations?.find(c => c.id === field.value)?.name)}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {configurations?.map((config) => (
                          <SelectItem key={config.id} value={config.id.toString()}>
                            {config.name} ({config.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="technical">Technical Info</TabsTrigger>
              <TabsTrigger value="profile">Load Profile</TabsTrigger>
              <TabsTrigger value="billing">Billing Info</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name" {...field} />
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
                        <FormLabel>Member Type</FormLabel>
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <AddressAutocomplete
                            value={field.value}
                            onChange={field.onChange}
                            onLocationSelect={(lat, lng) => {
                              // Store location data if needed
                              console.log('Location selected:', lat, lng);
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
                    name="is_active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Active Status
                          </FormLabel>
                          <FormDescription>
                            Enable or disable this member
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
                    name="user_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select user type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="real">Real</SelectItem>
                            <SelectItem value="simulated">Simulated</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Specify if this is a real or simulated user
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Current status of the member
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical">
              <Card>
                <CardHeader>
                  <CardTitle>Technical Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <TechnicalInfoSection form={form} />
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

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
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

                  <FormField
                    control={form.control}
                    name="billing_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Billing Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter billing address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/cer/configurations/members')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Member' : 'Create Member')}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 