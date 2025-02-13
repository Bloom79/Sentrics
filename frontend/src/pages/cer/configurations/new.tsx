import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
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
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, PlayIcon, PowerIcon, MapPinIcon, CloudSunIcon, EuroIcon, FileTextIcon, Download, Upload, Search, Trash2, ChevronRight, UserPlus, Users, UserCheck, UserX, Clock, BarChart3, LineChart, CalendarDays, Settings } from 'lucide-react';
import Map, { getCoordinatesFromAddress } from '@/components/Map';
import { WeatherForecast } from '@/components/weather-forecast';
import { EnergyFlowDiagram } from '@/components/energy-flow';
import { CostBreakdown } from '@/components/cost-breakdown';
import { useTranslation } from 'react-i18next';
import { AddressAutocomplete } from '@/components/AddressAutocomplete';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Monitoring } from '@/components/monitoring';

const configurationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  type: z.enum(['simulation', 'active']),
  legal_type: z.enum(['cooperative', 'association']),
  status: z.enum(['draft', 'active', 'inactive']).default('draft'),
  primary_substation_id: z.string().min(1, 'Substation ID is required'),
  region: z.string().min(1, 'Region is required'),
  address: z.string().min(1, 'Address is required'),
  location: z.object({
    lat: z.number(),
    lng: z.number(),
  }).default({
    lat: 41.9028,
    lng: 12.4964
  }),
  is_active: z.boolean().default(true),
  technical_info: z.object({
    total_capacity: z.number().min(0).max(200),
    voltage_level: z.enum(['low', 'medium', 'high']),
    metering_interval: z.enum(['quarter_hourly', 'half_hourly', 'hourly']),
    weather_integration: z.boolean(),
    smart_meter_required: z.boolean(),
    grid_connection_type: z.enum(['single_point', 'multiple_points']),
    load_profiles: z.array(z.object({
      name: z.string(),
      type: z.enum(['residential', 'commercial', 'industrial']),
      visibility: z.enum(['public', 'private']),
      data_source: z.enum(['historical', 'template', 'custom']),
      file: z.any().optional(),
    })).optional(),
  }),
  gse_compliance: z.object({
    regulation: z.enum(['DM_MASE_24012024', 'pre_DM_MASE_24012024']),
    documentation_complete: z.boolean(),
    incentive_type: z.enum(['standard', 'premium', 'custom']),
    alignment_status: z.enum(['pending', 'in_progress', 'completed']),
  }),
  simulation_settings: z.object({
    duration_days: z.number().min(1).max(365),
    include_weather: z.boolean(),
    include_historical_data: z.boolean(),
    participant_scenarios: z.array(z.object({
      type: z.enum(['consumer', 'producer', 'prosumer']),
      count: z.number(),
      profile: z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['residential', 'commercial', 'industrial']),
        visibility: z.enum(['public', 'private']),
        data_source: z.enum(['historical', 'template', 'custom']),
      }).optional(),
    })),
  }).optional(),
  billing_settings: z.object({
    billing_cycle: z.enum(['monthly', 'quarterly', 'yearly']),
    revenue_distribution: z.enum(['proportional', 'equal', 'custom']),
    incentive_scheme: z.enum(['standard', 'premium', 'custom']),
    setup_fee: z.number().optional(),
    monthly_fee: z.number(),
    annual_fee: z.number().optional(),
    metering_fee: z.number().optional(),
  }).optional(),
  member_limits: z.object({
    max_producers: z.number(),
    max_consumers: z.number(),
    max_prosumers: z.number(),
    geographical_limit_km: z.number(),
  }),
  participants: z.array(z.object({
    type: z.enum(['consumer', 'producer', 'prosumer']),
    user_type: z.enum(['real', 'simulated']),
    user_id: z.string().optional(),
    name: z.string(),
    pod_id: z.string(),
    smart_meter_id: z.string().optional(),
    profile: z.object({
      id: z.string(),
      name: z.string(),
      type: z.enum(['residential', 'commercial', 'industrial']),
      data_source: z.enum(['historical', 'template', 'custom']),
    }).optional(),
  })).default([]),
  participation_requests: z.array(z.object({
    id: z.string(),
    user_id: z.string(),
    name: z.string(),
    email: z.string(),
    fiscal_code: z.string(),
    pod_id: z.string(),
    type: z.enum(['consumer', 'producer', 'prosumer']),
    status: z.enum(['pending', 'approved', 'rejected']),
    requested_at: z.string(),
    pod_verification: z.object({
      status: z.enum(['pending', 'verified', 'failed']),
      meter_type: z.string().optional(),
      ownership_verified: z.boolean().optional(),
    }),
  })).default([]),
});

type ConfigurationForm = z.infer<typeof configurationSchema>;

function ParticipantScenarioSection({ 
  form 
}: { 
  form: any;
}) {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number | null>(null);
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

  const addScenario = () => {
    const currentScenarios = form.watch('simulation_settings.participant_scenarios') || [];
    form.setValue('simulation_settings.participant_scenarios', [
      ...currentScenarios,
      {
        type: 'consumer',
        count: 1,
        profile: null
      }
    ]);
  };

  const removeScenario = (index: number) => {
    const currentScenarios = form.watch('simulation_settings.participant_scenarios') || [];
    form.setValue(
      'simulation_settings.participant_scenarios',
      currentScenarios.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Participant Scenarios</h3>
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
            onClick={addScenario}
          >
            Add Scenario
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {form.watch('simulation_settings.participant_scenarios')?.map((scenario: any, index: number) => (
          <div
            key={index}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-4 flex-1">
                <FormField
                  control={form.control}
                  name={`simulation_settings.participant_scenarios.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Participant Type</FormLabel>
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
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`simulation_settings.participant_scenarios.${index}.count`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of Participants</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <div>
                    <FormLabel>Load Profile</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      {scenario.profile ? (
                        <div className="flex items-center gap-2">
                          <span>{scenario.profile.name}</span>
                          <Badge variant="outline">
                            {scenario.profile.type}
                          </Badge>
                        </div>
                      ) : (
                        "No profile selected"
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedScenarioIndex(index);
                      setShowProfileDialog(true);
                    }}
                  >
                    {scenario.profile ? "Change Profile" : "Select Profile"}
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeScenario(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {!form.watch('simulation_settings.participant_scenarios')?.length && (
          <div className="text-center py-8 border rounded-lg">
            <p className="text-muted-foreground">
              No participant scenarios defined. Add a scenario to get started.
            </p>
          </div>
        )}
      </div>

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Load Profile Selection</DialogTitle>
            <DialogDescription>
              Select an existing load profile or create a new one.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="search">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Search Existing</TabsTrigger>
              <TabsTrigger value="import">Import New</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-4">
              <Input
                placeholder="Search profiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="h-[300px] overflow-y-auto border rounded-lg p-2">
                {/* Add profile list here */}
                <div className="space-y-2">
                  {['Residential', 'Commercial Office', 'Industrial'].map((profile) => (
                    <div
                      key={profile}
                      className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer"
                      onClick={() => {
                        if (selectedScenarioIndex !== null) {
                          form.setValue(
                            `simulation_settings.participant_scenarios.${selectedScenarioIndex}.profile`,
                            {
                              id: profile.toLowerCase(),
                              name: profile,
                              type: 'commercial',
                              visibility: 'public',
                              data_source: 'template'
                            }
                          );
                        }
                        setShowProfileDialog(false);
                      }}
                    >
                      <div>
                        <p className="font-medium">{profile}</p>
                        <p className="text-sm text-muted-foreground">Template Profile</p>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="import" className="space-y-4">
              {/* Import form fields */}
              <div className="grid gap-4">
                <FormField
                  name="profile_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter profile name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  name="profile_type"
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
                          <SelectItem value="residential">Residential</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                          <SelectItem value="industrial">Industrial</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-center border-2 border-dashed rounded-lg p-8">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Button variant="secondary">Select CSV File</Button>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Upload CSV file with consumption data
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowProfileDialog(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ParticipantManagement({ 
  form,
  configType,
  configurationId 
}: { 
  form: any;
  configType: 'simulation' | 'active';
  configurationId?: string;
}) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [selectedParticipantIndex, setSelectedParticipantIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [selectedUserType, setSelectedUserType] = useState<'existing' | 'simulated' | 'new'>('existing');
  const [selectedType, setSelectedType] = useState<'consumer' | 'producer' | 'prosumer'>('consumer');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [localParticipants, setLocalParticipants] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users', userSearchQuery],
    queryFn: async () => {
      const response = await api.get('/api/v1/users', {
        params: {
          search: userSearchQuery || undefined,
          limit: 10
        }
      });
      return response.data.items;
    },
    enabled: showAddDialog && selectedUserType === 'existing'
  });

  useEffect(() => {
    const participants = form.watch('participants');
    setLocalParticipants(Array.isArray(participants) ? participants : []);
  }, [form.watch('participants')]);

  const addParticipant = (data: any) => {
    setLocalParticipants(prev => [...prev, data]);
    setShowAddDialog(false);
    setSelectedUser(null);
    setUserSearchQuery('');
  };

  const removeParticipant = (index: number) => {
    setLocalParticipants(prev => prev.filter((_: any, i: number) => i !== index));
  };

  const saveChanges = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    form.setValue('participants', localParticipants);
  };

  const handleUserSelect = (user: any) => {
    setSelectedUser(user);
    setSelectedType(user.type as 'consumer' | 'producer' | 'prosumer');
  };

  const handleAddParticipant = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    e.stopPropagation(); // Stop event propagation
    
    if (selectedUserType === 'existing' && selectedUser) {
      addParticipant({
        type: selectedType,
        user_type: 'real',
        user_id: selectedUser.id,
        name: selectedUser.name,
        email: selectedUser.email,
        pod_id: selectedUser.pod_id || '',
        smart_meter_id: selectedUser.smart_meter_id,
        address: selectedUser.address,
        fiscal_code: selectedUser.fiscal_code
      });
    } else if (selectedUserType === 'simulated') {
      addParticipant({
        type: selectedType,
        user_type: 'simulated',
        name: `Simulated ${selectedType} ${Math.floor(Math.random() * 1000)}`,
        pod_id: `SIM_POD_${Math.floor(Math.random() * 10000)}`,
      });
    }
  };

  return (
    <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Configuration Participants</h3>
          <p className="text-sm text-muted-foreground">
            {configType === 'simulation' 
              ? 'Add simulated participants for testing'
              : 'Add real users as participants'}
          </p>
        </div>
        <div className="space-x-2">
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowAddDialog(true);
            }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Participant
          </Button>
          {JSON.stringify(localParticipants) !== JSON.stringify(form.watch('participants')) && (
            <Button
              type="button"
              variant="default"
              onClick={saveChanges}
            >
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg">
        <div className="p-4 border-b bg-muted/50">
          <div className="flex items-center gap-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search participants..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="divide-y">
          {localParticipants?.map((participant: any, index: number) => (
            <div
              key={index}
              className="p-4 flex items-center justify-between hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  participant.type === 'producer' ? "bg-green-500" :
                  participant.type === 'consumer' ? "bg-blue-500" :
                  "bg-purple-500"
                )} />
                <div>
                  <p className="font-medium">{participant.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {participant.type.charAt(0).toUpperCase() + participant.type.slice(1)} • 
                    {participant.user_type === 'real' ? ' Real User' : ' Simulated'} •
                    POD: {participant.pod_id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {participant.profile ? (
                  <Badge variant="outline">
                    {participant.profile.name}
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (participant.user_type === 'real' && participant.user_id) {
                        // Check if user is already a member
                        api.get('/api/v1/members', {
                          params: {
                            user_id: participant.user_id,
                            configuration_id: configurationId
                          }
                        }).then(response => {
                          const members = response.data.items;
                          if (members && members.length > 0) {
                            // User is already a member, navigate to edit mode
                            navigate(`/cer/members/${members[0].id}`);
                          } else {
                            // User is not a member, navigate to new member form with user_id preset
                            navigate('/cer/members/new', {
                              replace: false,
                              state: {
                                user_id: participant.user_id,
                                configuration_id: configurationId,
                                user_data: {
                                  name: participant.name,
                                  type: participant.type,
                                  pod_id: participant.pod_id || '',
                                  smart_meter_id: participant.smart_meter_id || '',
                                  address: participant.address || '',
                                  fiscal_code: participant.fiscal_code || '',
                                  email: participant.email || '',
                                  user_type: participant.user_type
                                }
                              }
                            });
                          }
                        }).catch(error => {
                          console.error('Error checking member status:', error);
                          toast({
                            title: 'Error',
                            description: 'Failed to check member status. Please try again.',
                            variant: 'destructive'
                          });
                        });
                      }
                    }}
                  >
                    Assign Profile
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeParticipant(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {!localParticipants?.length && (
            <div className="p-8 text-center text-muted-foreground">
              No participants added yet. Click "Add Participant" to get started.
            </div>
          )}
        </div>
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Participant</DialogTitle>
            <DialogDescription>
              {configType === 'simulation'
                ? 'Add a participant for simulation - you can create a simulated user or select an existing one'
                : 'Add a real user as a participant'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Participant Type</Label>
              <Select
                value={selectedType}
                onValueChange={(value: 'consumer' | 'producer' | 'prosumer') => {
                  setSelectedType(value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="producer">Producer</SelectItem>
                  <SelectItem value="prosumer">Prosumer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>User Type</Label>
              <Select
                value={selectedUserType}
                onValueChange={(value: 'existing' | 'simulated' | 'new') => {
                  setSelectedUserType(value);
                  setSelectedUser(null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select user type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="existing">Select Existing User</SelectItem>
                  {configType === 'simulation' && (
                    <SelectItem value="simulated">Create Simulated User</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedUserType === 'existing' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Search Users</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Search by name, email, or fiscal code"
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-md h-[200px] overflow-y-auto p-2">
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
                    </div>
                  ) : users?.length ? (
                    <div className="space-y-1">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className={cn(
                            "flex items-center justify-between p-2 hover:bg-accent rounded-sm cursor-pointer",
                            selectedUser?.id === user.id && "bg-accent"
                          )}
                          onClick={() => handleUserSelect(user)}
                        >
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant="outline">{user.type}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No users found
                    </div>
                  )}
                </div>

                {selectedUser && (
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Selected User Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span>{selectedUser.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span>{selectedUser.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="outline">{selectedUser.type}</Badge>
                      </div>
                      {selectedUser.pod_id && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">POD ID:</span>
                          <span>{selectedUser.pod_id}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddDialog(false);
              setSelectedUser(null);
              setUserSearchQuery('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddParticipant}
              disabled={selectedUserType === 'existing' && !selectedUser}
            >
              Add Participant
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ParticipationRequests({
  form,
  configType
}: {
  form: any;
  configType: 'simulation' | 'active';
}) {
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);

  const handleVerification = async (request: any) => {
    setSelectedRequest(request);
    setShowVerificationDialog(true);
  };

  const handleApprove = (request: any) => {
    // Add to participants and remove from requests
    const currentParticipants = form.watch('participants') || [];
    const currentRequests = form.watch('participation_requests') || [];

    form.setValue('participants', [...currentParticipants, {
      type: request.type,
      user_type: 'real',
      user_id: request.user_id,
      name: request.name,
      pod_id: request.pod_id,
    }]);

    form.setValue(
      'participation_requests',
      currentRequests.map((r: any) => 
        r.id === request.id ? { ...r, status: 'approved' } : r
      )
    );
  };

  const handleReject = (request: any) => {
    const currentRequests = form.watch('participation_requests') || [];
    form.setValue(
      'participation_requests',
      currentRequests.map((r: any) => 
        r.id === request.id ? { ...r, status: 'rejected' } : r
      )
    );
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Participation Requests</CardTitle>
          <p className="text-sm text-muted-foreground">
            Manage user requests to join this configuration
          </p>
        </div>
        <Badge variant="outline">
          {form.watch('participation_requests')?.filter((r: any) => r.status === 'pending').length || 0} Pending
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              className="flex-1"
            />
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Requests</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg divide-y">
            {form.watch('participation_requests')?.map((request: any) => (
              <div
                key={request.id}
                className="p-4 flex items-center justify-between hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-2 h-2 rounded-full",
                    request.status === 'pending' ? "bg-yellow-500" :
                    request.status === 'approved' ? "bg-green-500" :
                    "bg-red-500"
                  )} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{request.name}</p>
                      <Badge variant="outline">
                        {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>POD: {request.pod_id}</p>
                      <p>Requested: {new Date(request.requested_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {request.status === 'pending' ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleVerification(request)}
                      >
                        Verify POD
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleApprove(request)}
                      >
                        <UserCheck className="w-4 h-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(request)}
                      >
                        <UserX className="w-4 h-4 text-red-500" />
                      </Button>
                    </>
                  ) : (
                    <Badge variant={request.status === 'approved' ? 'success' : 'destructive'}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Badge>
                  )}
                </div>
              </div>
            ))}

            {!form.watch('participation_requests')?.length && (
              <div className="p-8 text-center text-muted-foreground">
                No participation requests yet.
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>POD Verification</DialogTitle>
            <DialogDescription>
              Verify POD ownership and meter compatibility
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label>POD ID</Label>
                <div className="flex gap-2">
                  <Input value={selectedRequest.pod_id} readOnly className="flex-1" />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Owner Details</Label>
                <div className="p-2 rounded-md bg-muted">
                  <p className="font-medium">{selectedRequest.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Fiscal Code: {selectedRequest.fiscal_code}
                  </p>
                </div>
              </div>

              <div className="border rounded-lg p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Verification Results</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Meter Type:</span>
                    <Badge>Open Meter 2.0</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Ownership:</span>
                    <Badge variant="outline">Verified</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge variant="success">Active</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVerificationDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              if (selectedRequest) {
                handleApprove(selectedRequest);
                setShowVerificationDialog(false);
              }
            }}>
              Approve & Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export default function NewConfiguration() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('description');
  const { configurationId } = useParams();
  const isEditMode = Boolean(configurationId);

  const { data: existingConfiguration, isLoading: isLoadingConfiguration } = useQuery({
    queryKey: ['configuration', configurationId],
    queryFn: async () => {
      if (!configurationId) return null;
      const response = await api.get(`/api/v1/configurations/${configurationId}`);
      
      // Fetch members for this configuration
      const membersResponse = await api.get('/api/v1/members', {
        params: {
          configuration_id: configurationId,
          limit: 100
        }
      });
      
      // Combine configuration with members data
      return {
        ...response.data,
        participants: membersResponse.data.items.map((member: any) => ({
          type: member.type,
          user_type: member.user_id ? 'real' : 'simulated',
          user_id: member.user_id,
          name: member.name,
          pod_id: member.pod_id,
          smart_meter_id: member.smart_meter_id,
          profile: member.load_profile_type ? {
            id: member.load_profile_type.toLowerCase(),
            name: member.load_profile_type,
            type: member.load_profile_type.toLowerCase(),
            data_source: 'template'
          } : undefined
        }))
      };
    },
    enabled: isEditMode,
  });

  const form = useForm<ConfigurationForm>({
    resolver: zodResolver(configurationSchema),
    defaultValues: {
      type: searchParams.get('mode') === 'active' ? 'active' : 'simulation',
      legal_type: 'cooperative',
      location: {
        lat: 41.9028,
        lng: 12.4964
      },
      participants: [],
      technical_info: {
        total_capacity: 0,
        voltage_level: 'low',
        metering_interval: 'quarter_hourly',
        weather_integration: true,
        smart_meter_required: false,
        grid_connection_type: 'single_point'
      },
      gse_compliance: {
        regulation: 'DM_MASE_24012024',
        documentation_complete: false,
        incentive_type: 'standard',
        alignment_status: 'pending'
      },
      simulation_settings: {
        duration_days: 365,
        include_weather: true,
        include_historical_data: true,
        participant_scenarios: [],
      },
      billing_settings: {
        billing_cycle: 'monthly',
        revenue_distribution: 'proportional',
        incentive_scheme: 'standard',
        setup_fee: undefined,
        monthly_fee: 0,
        annual_fee: undefined,
        metering_fee: undefined,
      },
      member_limits: {
        max_producers: 0,
        max_consumers: 0,
        max_prosumers: 0,
        geographical_limit_km: 0,
      },
    },
  });

  useEffect(() => {
    if (existingConfiguration) {
      console.log('Loading existing configuration:', existingConfiguration);
      
      // First, reset form to its default values
      form.reset({
        ...form.getValues(),
        type: 'active',
        participants: Array.isArray(existingConfiguration.participants) 
          ? existingConfiguration.participants 
          : [],
      });
      
      // Then set each field explicitly to ensure proper initialization
      Object.keys(existingConfiguration).forEach(key => {
        if (key === 'id' || key === 'participants') return; // Skip id and participants fields
        
        if (typeof existingConfiguration[key] === 'object' && existingConfiguration[key] !== null) {
          // Handle nested objects
          form.setValue(key as any, {
            ...form.getValues()[key],
            ...existingConfiguration[key]
          });
        } else {
          form.setValue(key as any, existingConfiguration[key]);
        }
      });
    }
  }, [existingConfiguration, form]);

  const { mutate: saveConfiguration, isPending } = useMutation({
    mutationFn: async (data: ConfigurationForm) => {
      console.log('Saving configuration in mode:', isEditMode ? 'edit' : 'create');
      console.log('Configuration data:', data);
      
      try {
        // Remove any undefined or null values
        const cleanData = Object.fromEntries(
          Object.entries(data).filter(([_, v]) => v != null)
        );

        if (isEditMode && configurationId) {
          console.log('Updating configuration:', configurationId);
          const response = await api.put(`/api/v1/configurations/${configurationId}`, {
            ...cleanData,
            id: parseInt(configurationId),
            is_active: true,
            status: data.status || 'draft'
          });
          console.log('Update response:', response.data);
          return response.data;
        } else {
          console.log('Creating new configuration');
          const response = await api.post('/api/v1/configurations/', {
            ...cleanData,
            status: 'draft',
            is_active: true
          });
          console.log('Create response:', response.data);
          return response.data;
        }
      } catch (error) {
        console.error('API error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Operation successful:', data);
      toast({
        title: isEditMode ? t('cer.configurations.edit.success') : t('cer.configurations.new.success'),
        description: isEditMode ? t('cer.configurations.edit.success_description') : t('cer.configurations.new.success_description')
      });
      navigate('/cer/configurations');
    },
    onError: (error: any) => {
      console.error('Error saving configuration:', error);
      toast({
        title: isEditMode ? t('cer.configurations.edit.error') : t('cer.configurations.new.error'),
        description: error.response?.data?.detail || (isEditMode ? t('cer.configurations.edit.error_description') : t('cer.configurations.new.error_description')),
        variant: 'destructive'
      });
    }
  });

  const onSubmit = async (data: ConfigurationForm) => {
    console.log('Form submitted with data:', data);
    console.log('Mode:', isEditMode ? 'edit' : 'create');
    console.log('Configuration ID:', configurationId);
    
    // Ensure all form data is included
    const formData = {
      ...data,
      participants: form.getValues('participants') || [],
      type: form.getValues('type'),
      status: isEditMode ? form.getValues('status') : 'draft',
      is_active: true
    };
    
    try {
      await saveConfiguration(formData);
    } catch (error) {
      console.error('Error in form submission:', error);
      toast({
        title: 'Error',
        description: 'Failed to save configuration. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Add form validation before submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get all form errors
      const result = await form.trigger();
      const errors = form.formState.errors;
      
      if (!result) {
        console.log('Validation errors:', errors);
        
        // Create a more detailed error message
        const errorMessages = Object.entries(errors)
          .map(([field, error]) => {
            if (typeof error === 'object' && error?.message) {
              return `${field}: ${error.message}`;
            }
            return null;
          })
          .filter(Boolean);

        toast({
          title: 'Validation Error',
          description: (
            <div className="space-y-2">
              <p>Please check the following fields:</p>
              <ul className="list-disc pl-4">
                {errorMessages.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          ),
          variant: 'destructive'
        });
        return;
      }
      
      const values = form.getValues();
      console.log('Form values before submission:', values);
      await onSubmit(values);
    } catch (error) {
      console.error('Error during form submission:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const configType = form.watch('type');

  if (isEditMode && isLoadingConfiguration) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading configuration...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {isEditMode ? 'Edit Configuration' : 'New Configuration'}
        </h1>
      </div>

      {configType === 'simulation' && (
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Simulation mode is limited to 365 days and has no associated costs.
            Perfect for testing and planning configurations.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="technical">Technical Info</TabsTrigger>
          <TabsTrigger value="compliance">GSE Compliance</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="costs">Costs & Incentives</TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <TabsContent value="description">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Configuration Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter configuration name" {...field} />
                          </FormControl>
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
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Configuration Type</FormLabel>
                        <FormControl>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                              className={cn(
                                "flex items-center justify-between space-x-4 rounded-lg border p-4 cursor-pointer hover:border-primary",
                                field.value === 'simulation' && "border-2 border-primary bg-primary/5"
                              )}
                              onClick={() => field.onChange('simulation')}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <PlayIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium">Simulation</div>
                                  <div className="text-sm text-muted-foreground">
                                    Test and plan your configuration without real deployment
                                  </div>
                                </div>
                              </div>
                              <div className={cn(
                                "h-4 w-4 rounded-full border flex items-center justify-center",
                                field.value === 'simulation' && "border-2 border-primary"
                              )}>
                                {field.value === 'simulation' && (
                                  <div className="h-2 w-2 rounded-full bg-primary" />
                                )}
                              </div>
                            </div>
                            <div
                              className={cn(
                                "flex items-center justify-between space-x-4 rounded-lg border p-4 cursor-pointer hover:border-primary",
                                field.value === 'active' && "border-2 border-primary bg-primary/5"
                              )}
                              onClick={() => field.onChange('active')}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <PowerIcon className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium">Active</div>
                                  <div className="text-sm text-muted-foreground">
                                    Deploy a real energy configuration
                                  </div>
                                </div>
                              </div>
                              <div className={cn(
                                "h-4 w-4 rounded-full border flex items-center justify-center",
                                field.value === 'active' && "border-2 border-primary"
                              )}>
                                {field.value === 'active' && (
                                  <div className="h-2 w-2 rounded-full bg-primary" />
                                )}
                              </div>
                            </div>
                          </div>
                        </FormControl>
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
                            placeholder="Enter a detailed description of this energy configuration"
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                      <h3 className="text-lg font-medium">Location Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter region" {...field} />
                            </FormControl>
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
                              value={field.value}
                              onChange={async (value) => {
                                field.onChange(value);
                                if (value) {
                                  try {
                                    const coords = await getCoordinatesFromAddress(value);
                                    if (coords) {
                                      form.setValue('location', coords, { shouldValidate: true });
                                    }
                                  } catch (error) {
                                    console.error('Error getting coordinates:', error);
                                  }
                                }
                              }}
                              onLocationSelect={(lat, lng) => {
                                form.setValue('location', { lat, lng }, { shouldValidate: true });
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
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Map Location</FormLabel>
                          <FormDescription>
                            Click on the map to set the location or drag the marker
                          </FormDescription>
                          <FormControl>
                            <div className="border rounded-lg overflow-hidden">
                              <Map
                                defaultLocation={{
                                  lat: Number(field.value?.lat ?? 41.9028),
                                  lng: Number(field.value?.lng ?? 12.4964)
                                }}
                                showMarker={true}
                                height="400px"
                                onLocationSelect={async (lat, lng) => {
                                  field.onChange({ lat: Number(lat), lng: Number(lng) });
                                  try {
                                    const response = await fetch(
                                      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
                                    );
                                    const data = await response.json();
                                    if (data.display_name) {
                                      form.setValue('address', data.display_name);
                                    }
                                  } catch (error) {
                                    console.error('Error getting address:', error);
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants">
              <div className="space-y-6">
                <ParticipationRequests form={form} configType={configType} />
                <Card>
                  <CardHeader>
                    <CardTitle>Current Participants</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ParticipantManagement 
                      form={form} 
                      configType={configType} 
                      configurationId={configurationId}
                    />
                  </CardContent>
                </Card>
              </div>
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
                    name="technical_info.weather_integration"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Weather Forecast Integration
                          </FormLabel>
                          <FormDescription>
                            Enable weather data integration for better energy predictions
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
                    name="technical_info.smart_meter_required"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Smart Meter Required
                          </FormLabel>
                          <FormDescription>
                            Require smart meters for all participants
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

            <TabsContent value="compliance">
              <Card>
                <CardHeader>
                  <CardTitle>GSE Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="gse_compliance.regulation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Applicable Regulation</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select regulation" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DM_MASE_24012024">DM MASE 24/01/2024</SelectItem>
                            <SelectItem value="pre_DM_MASE_24012024">Pre DM MASE 24/01/2024</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select the regulatory framework applicable to this configuration
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gse_compliance.documentation_complete"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Documentation Complete
                          </FormLabel>
                          <FormDescription>
                            Confirm all required GSE documentation is complete
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring">
              <Monitoring 
                configurationId={form.watch('name') || 'new'} 
                location={{
                  lat: form.watch('location.lat') ?? 41.9028,
                  lng: form.watch('location.lng') ?? 12.4964
                }}
              />
            </TabsContent>

            <TabsContent value="simulation">
              <Card>
                <CardHeader>
                  <CardTitle>Simulation Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="simulation_settings.duration_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Simulation Duration (Days)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            max={365}
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>Maximum: 365 days</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="simulation_settings.include_weather"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Include Weather Data
                          </FormLabel>
                          <FormDescription>
                            Use historical weather data in simulation
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
                    name="simulation_settings.include_historical_data"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Include Historical Data
                          </FormLabel>
                          <FormDescription>
                            Use historical consumption and production data
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

                  <ParticipantScenarioSection form={form} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="costs">
              <Card>
                <CardHeader>
                  <CardTitle>Costs & Incentives</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {configType === 'simulation' ? (
                    <Alert>
                      <InfoIcon className="h-4 w-4" />
                      <AlertDescription>
                        Cost and incentive settings are only available for active configurations.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="billing_settings.billing_cycle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Billing Cycle</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select billing cycle" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">Quarterly</SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billing_settings.revenue_distribution"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Revenue Distribution Method</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select distribution method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="proportional">Proportional</SelectItem>
                                <SelectItem value="equal">Equal</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="billing_settings.incentive_scheme"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Incentive Scheme</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select incentive scheme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="standard">Standard</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                                <SelectItem value="custom">Custom</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/cer/configurations')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isPending}
              >
                {isPending 
                  ? (isEditMode ? 'Updating...' : 'Creating...') 
                  : (isEditMode ? 'Update Configuration' : 'Create Configuration')
                }
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  );
} 