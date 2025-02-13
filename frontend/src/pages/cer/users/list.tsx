import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { 
  AlertCircle,
  Search,
  SlidersHorizontal,
  Filter,
  X,
  LayoutGrid,
  List as ListIcon,
  Users,
  Home,
  Settings2,
  UserPlus,
  MapPin,
  Zap,
  Battery,
  Gauge,
  Calendar,
  ChevronRight,
  Map as MapIcon,
  Plug,
  Edit
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import Map from '@/components/Map';
import { getCoordinatesFromAddress } from '@/lib/utils';
import L from 'leaflet';
import MarkerIcons from '@/lib/MarkerIcons';
import { UserMapMarker } from '@/types/map';

type User = {
  id: string;
  name: string;
  type: 'consumer' | 'producer' | 'prosumer';
  user_type: 'real' | 'simulated';
  status: 'active' | 'inactive' | 'pending';
  email: string;
  fiscal_code: string;
  pod_id?: string;
  smart_meter_id?: string;
  address?: string;
  activation_date?: string;
  has_asset_management: boolean;
  total_production?: number;
  total_consumption?: number;
  self_consumption_rate?: number;
  configurations_count: number;
  created_at: string;
};

export default function UsersList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [view, setView] = useState<'grid' | 'list' | 'map'>(localStorage.getItem('userView') as 'grid' | 'list' | 'map' || 'grid');
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [markers, setMarkers] = useState<UserMapMarker[]>([]);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', pageIndex, pageSize, searchTerm, typeFilter, userTypeFilter, statusFilter],
    queryFn: async () => {
      const response = await api.get('/api/v1/users', {
        params: {
          skip: pageIndex * pageSize,
          limit: pageSize,
          search: searchTerm || undefined,
          type: typeFilter === 'all' ? undefined : typeFilter,
          user_type: userTypeFilter === 'all' ? undefined : userTypeFilter,
          status: statusFilter === 'all' ? undefined : statusFilter,
        },
      });
      return response.data;
    },
  });

  useEffect(() => {
    const loadMarkers = async () => {
      if (!data?.items || view !== 'map') return;

      const usersWithAddresses = data.items.filter((user: any) => user.address);
      const markersPromises = usersWithAddresses.map(async (user: any) => {
        const location = await getCoordinatesFromAddress(user.address);
        if (!location) return null;

        const popupContent = (
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <Badge className={cn(
                "rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap",
                getTypeColor(user.type)
              )}>
                {user.type}
              </Badge>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-sm text-gray-600">{user.email}</p>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <p className="text-sm">{user.address}</p>
              </div>
              {user.pod_id && (
                <div className="flex items-center gap-2">
                  <Plug className="h-4 w-4 text-gray-400" />
                  <p className="text-sm">POD: {user.pod_id}</p>
                </div>
              )}
            </div>

            {(user.type === 'producer' || user.type === 'prosumer') && (
              <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <div>
                    <div className="text-xs text-gray-600">Production</div>
                    <div className="font-medium">{user.total_production || '0'} kWh</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="text-xs text-gray-600">Consumption</div>
                    <div className="font-medium">{user.total_consumption || '0'} kWh</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/cer/users/${user.id}/edit`)}
              >
                <Edit className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </div>
          </div>
        );

        return {
          id: user.id,
          lat: location.lat,
          lng: location.lng,
          name: user.name,
          email: user.email,
          type: user.type,
          status: user.status,
          address: user.address,
          pod_id: user.pod_id,
          total_production: user.total_production,
          total_consumption: user.total_consumption,
          markerType: user.type as 'consumer' | 'producer' | 'prosumer',
          popup: popupContent
        } as UserMapMarker;
      });

      const loadedMarkers = (await Promise.all(markersPromises)).filter((marker): marker is UserMapMarker => marker !== null);
      setMarkers(loadedMarkers);
    };

    loadMarkers();
  }, [data?.items, view, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'producer':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'consumer':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'prosumer':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const breadcrumbs = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/cer', label: 'Energy Management', icon: Settings2 },
    { href: '/cer/users', label: 'Users', current: true }
  ];

  const renderViewToggle = () => (
    <div className="flex rounded-lg border p-1">
      <button
        className={cn(
          "flex-1 px-3 py-1.5 text-sm rounded-md transition-colors flex items-center justify-center gap-2",
          view === 'grid' ? "bg-background shadow-sm" : "text-muted-foreground"
        )}
        onClick={() => {
          setView('grid');
          localStorage.setItem('userView', 'grid');
        }}
      >
        <LayoutGrid className="h-4 w-4" />
        Grid
      </button>
      <button
        className={cn(
          "flex-1 px-3 py-1.5 text-sm rounded-md transition-colors flex items-center justify-center gap-2",
          view === 'list' ? "bg-background shadow-sm" : "text-muted-foreground"
        )}
        onClick={() => {
          setView('list');
          localStorage.setItem('userView', 'list');
        }}
      >
        <ListIcon className="h-4 w-4" />
        List
      </button>
      <button
        className={cn(
          "flex-1 px-3 py-1.5 text-sm rounded-md transition-colors flex items-center justify-center gap-2",
          view === 'map' ? "bg-background shadow-sm" : "text-muted-foreground"
        )}
        onClick={() => {
          setView('map');
          localStorage.setItem('userView', 'map');
        }}
      >
        <MapIcon className="h-4 w-4" />
        Map
      </button>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className={cn(
          "grid gap-6",
          view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-32 bg-muted" />
              <CardContent className="h-24 bg-muted/50" />
            </Card>
          ))}
        </div>
      );
    }

    if (!data?.items?.length) {
      return (
        <Card className="p-12 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-muted-foreground" />
          </div>
          <CardTitle className="mb-2">No users found</CardTitle>
          <CardDescription className="mb-4">
            {searchTerm || typeFilter !== 'all' || userTypeFilter !== 'all' || statusFilter !== 'all'
              ? "Try adjusting your filters or search terms"
              : "Get started by adding your first user"}
          </CardDescription>
          <Button asChild>
            <Link to="/cer/users/new">
              Add User
            </Link>
          </Button>
        </Card>
      );
    }

    if (view === 'map') {
      const defaultCenter = { lat: 41.9028, lng: 12.4964 }; // Default to Rome if no users
      const defaultZoom = 6; // Start with a wider view of Italy

      if (!markers.length) {
        return (
          <Card className="p-6">
            <CardTitle className="mb-2">No Users with Locations</CardTitle>
            <CardDescription>
              None of the users in the current view have address data.
              {searchTerm || typeFilter !== 'all' || userTypeFilter !== 'all' || statusFilter !== 'all'
                ? " Try adjusting your filters."
                : " Add address information to users to see them on the map."}
            </CardDescription>
            <div className="mt-4 border rounded-lg overflow-hidden">
              <Map
                height="600px"
                showMarker={false}
                defaultLocation={defaultCenter}
                defaultZoom={defaultZoom}
                markers={[]}
              />
            </div>
          </Card>
        );
      }

      return (
        <div className="border rounded-lg overflow-hidden">
          <Map
            height="600px"
            showMarker={false}
            markers={markers}
            fitMarkers={true}
            defaultLocation={defaultCenter}
            defaultZoom={defaultZoom}
          />
        </div>
      );
    }

    return (
      <div className={cn(
        "grid gap-6",
        view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {data.items.map((user: User) => (
          <Link
            key={user.id}
            to={`/cer/users/${user.id}/edit`}
            className="block group"
          >
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                  user.type === 'producer' ? "bg-emerald-100" :
                  user.type === 'consumer' ? "bg-blue-100" :
                  "bg-purple-100"
                )}>
                  <Users className={cn(
                    "w-6 h-6",
                    user.type === 'producer' ? "text-emerald-600" :
                    user.type === 'consumer' ? "text-blue-600" :
                    "text-purple-600"
                  )} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Badge className={cn(
                        "rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap",
                        getTypeColor(user.type)
                      )}>
                        {user.type}
                      </Badge>
                      <Badge variant="outline" className={cn(
                        "rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap",
                        getStatusColor(user.status)
                      )}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>

                  {user.address && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                      <span className="truncate">{user.address}</span>
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Badge variant="outline">
                        {user.user_type}
                      </Badge>
                    </div>
                    {user.activation_date && (
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                        <span>Active since {formatDate(user.activation_date)}</span>
                      </div>
                    )}
                  </div>

                  {(user.type === 'producer' || user.type === 'prosumer') && (
                    <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-500 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm text-gray-600 whitespace-nowrap">Production</div>
                          <div className="text-base font-medium text-gray-900">
                            {user.total_production || '0'} kWh
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Gauge className="h-4 w-4 text-blue-500 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm text-gray-600 whitespace-nowrap">Consumption</div>
                          <div className="text-base font-medium text-gray-900">
                            {user.total_consumption || '0'} kWh
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Battery className="h-4 w-4 text-green-500 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-sm text-gray-600 whitespace-nowrap">Self-Consumption</div>
                          <div className="text-base font-medium text-gray-900">
                            {user.self_consumption_rate || '0'}%
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Member of {user.configurations_count} configuration{user.configurations_count !== 1 ? 's' : ''}
                      </div>
                      {user.has_asset_management && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                          Asset Management
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load users. Please try again later.
          {error instanceof Error ? ` Error: ${error.message}` : ''}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground mt-1">
            Manage users for energy configurations
          </p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button asChild className="gap-2 flex-1 sm:flex-none">
            <Link to="/cer/users/new">
              <UserPlus className="w-4 h-4" />
              Add User
            </Link>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users by name, email, or POD ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select 
            value={typeFilter} 
            onValueChange={setTypeFilter}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="consumer">Consumer</SelectItem>
              <SelectItem value="producer">Producer</SelectItem>
              <SelectItem value="prosumer">Prosumer</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={userTypeFilter}
            onValueChange={setUserTypeFilter}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="User type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="real">Real Users</SelectItem>
              <SelectItem value="simulated">Simulated</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
                <SheetDescription>
                  Refine your users list
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">View</label>
                  {renderViewToggle()}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {(typeFilter !== 'all' || userTypeFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
        <div className="flex flex-wrap gap-2">
          {typeFilter !== 'all' && (
            <Badge variant="secondary" className="gap-2">
              Type: {typeFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setTypeFilter('all')}
              />
            </Badge>
          )}
          {userTypeFilter !== 'all' && (
            <Badge variant="secondary" className="gap-2">
              User Type: {userTypeFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setUserTypeFilter('all')}
              />
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="gap-2">
              Status: {statusFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setStatusFilter('all')}
              />
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="gap-2">
              Search: {searchTerm}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearchTerm('')}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground"
            onClick={() => {
              setTypeFilter('all');
              setUserTypeFilter('all');
              setStatusFilter('all');
              setSearchTerm('');
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Content */}
      {renderContent()}

      {/* Pagination */}
      {data && data.total > pageSize && view !== 'map' && (
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, data.total)} of {data.total} users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPageIndex(p => Math.max(0, p - 1))}
              disabled={pageIndex === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setPageIndex(p => p + 1)}
              disabled={pageIndex >= Math.ceil(data.total / pageSize) - 1}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 