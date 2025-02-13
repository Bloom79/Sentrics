import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { 
  AlertCircle, 
  MapPin, 
  Users, 
  Calendar, 
  PlayCircle, 
  Settings2, 
  Search,
  SlidersHorizontal,
  ChevronDown,
  Info,
  ArrowUpDown,
  Home,
  ChevronRight,
  Filter,
  X,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  Zap,
  Building2,
  Factory,
  Sun,
  Wind,
  Battery,
  Lightbulb,
  Gauge,
  Share2,
  MoreVertical,
  Pencil,
  Copy,
  Trash,
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
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import React from 'react';
import { Zap as ZapIcon, Gauge as GaugeIcon } from 'lucide-react';

type Configuration = {
  id: number;
  name: string;
  description: string;
  type: string;
  legal_type: 'cooperative' | 'association';
  status: 'draft' | 'pending_gse' | 'active' | 'archived';
  address: string;
  location: string;
  region: string;
  participant_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  image_url?: string;
  total_production: number;
  total_consumption: number;
  self_consumption_rate: number;
  shared_energy: number;
};

type Translations = {
  [key: string]: {
    title: string;
    simulate: string;
    activate: string;
    search: string;
    filterByType: string;
    allTypes: string;
    participants: {
      single: string;
      multiple: string;
    };
    status: {
      active: string;
      pending_gse: string;
      draft: string;
      archived: string;
    };
    createdOn: string;
    pagination: {
      previous: string;
      next: string;
    };
  };
};

const translations: Translations = {
  en: {
    title: "Energy Configurations List",
    simulate: "Simulate energy configuration",
    activate: "Activate energy configuration",
    search: "Search configurations...",
    filterByType: "Filter by type",
    allTypes: "All types",
    participants: {
      single: "Participant",
      multiple: "Participants",
    },
    status: {
      active: "Active",
      pending_gse: "GSE Pending",
      draft: "Draft",
      archived: "Archived",
    },
    createdOn: "Created on",
    pagination: {
      previous: "Previous",
      next: "Next",
    },
  },
  it: {
    title: "Lista Configurazioni Energetiche",
    simulate: "Simula una configurazione energetica",
    activate: "Attiva una configurazione energetica",
    search: "Cerca configurazioni...",
    filterByType: "Filtra per tipo",
    allTypes: "Tutti i tipi",
    participants: {
      single: "Partecipante",
      multiple: "Partecipanti",
    },
    status: {
      active: "Attiva",
      pending_gse: "In attesa GSE",
      draft: "Bozza",
      archived: "Archiviata",
    },
    createdOn: "Creata il",
    pagination: {
      previous: "Precedente",
      next: "Successivo",
    },
  },
};

const energyTypeIcons = {
  CER: <Sun className="w-6 h-6" />,
  GAC: <Factory className="w-6 h-6" />,
  CS: <Building2 className="w-6 h-6" />,
  default: <Lightbulb className="w-6 h-6" />
};

const configurationTypeInfo = {
  CER: {
    title: 'Renewable Energy Community',
    description: 'A local energy community focused on renewable energy production and sharing',
    icon: Sun,
  },
  GAC: {
    title: 'Self-Consumption Group',
    description: 'A group of users sharing energy within a single building or area',
    icon: Factory,
  },
  CS: {
    title: 'Consumption Sharing',
    description: 'Energy sharing arrangement between multiple consumption points',
    icon: Building2,
  },
};

function EnergyStats({ config }: { config: Configuration }) {
  return (
    <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 text-yellow-500" />
        <div>
          <div className="text-xs text-muted-foreground">Production</div>
          <div className="font-medium">{config.total_production || '0'} kWh</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Gauge className="w-4 h-4 text-blue-500" />
        <div>
          <div className="text-xs text-muted-foreground">Consumption</div>
          <div className="font-medium">{config.total_consumption || '0'} kWh</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Battery className="w-4 h-4 text-green-500" />
        <div>
          <div className="text-xs text-muted-foreground">Self-Consumption</div>
          <div className="font-medium">{config.self_consumption_rate || '0'}%</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Share2 className="w-4 h-4 text-purple-500" />
        <div>
          <div className="text-xs text-muted-foreground">Shared Energy</div>
          <div className="font-medium">{config.shared_energy || '0'} kWh</div>
        </div>
      </div>
    </div>
  );
}

const getConfigurationIcon = (config: Configuration) => {
  if (config.image_url) {
    return (
      <div className="w-12 h-12 rounded-full overflow-hidden">
        <img 
          src={config.image_url} 
          alt={config.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const typeIcon = energyTypeIcons[config.type as keyof typeof energyTypeIcons] || energyTypeIcons.default;
  const bgColor = {
    CER: 'bg-emerald-100',
    GAC: 'bg-blue-100',
    CS: 'bg-purple-100'
  }[config.type] || 'bg-gray-100';

  const textColor = {
    CER: 'text-emerald-600',
    GAC: 'text-blue-600',
    CS: 'text-purple-600'
  }[config.type] || 'text-gray-600';
        
        return (
    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", bgColor)}>
      <div className={textColor}>{typeIcon}</div>
          </div>
        );
};

const getConfigurationTypeInfo = (type: string) => {
  const info = configurationTypeInfo[type as keyof typeof configurationTypeInfo];
  if (!info) return {
    title: type,
    description: 'Energy configuration for sharing and managing resources',
    icon: Lightbulb
  };
  return info;
};

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success';
    case 'draft':
      return 'secondary';
    case 'inactive':
      return 'destructive';
    default:
      return 'default';
  }
};

export default function ConfigurationList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>(searchParams.get('type') || 'all');
  const [statusFilter, setStatusFilter] = useState<string>(searchParams.get('status') || 'all');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(searchParams.get('order') as 'asc' | 'desc' || 'desc');
  const [view, setView] = useState<'grid' | 'list'>(localStorage.getItem('configView') as 'grid' | 'list' || 'grid');
  const { i18n } = useTranslation();
  const t = translations[i18n.language] || translations.en;

  // Update URL when filters change
  const updateFilters = (updates: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === 'all') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    setSearchParams(newParams);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['configurations', pageIndex, pageSize, searchTerm, typeFilter, statusFilter, sortBy, sortOrder],
    queryFn: async () => {
      const response = await api.get('/api/v1/configurations', {
        params: {
          skip: pageIndex * pageSize,
          limit: pageSize,
          search: searchTerm || undefined,
          type_filter: typeFilter === 'all' ? undefined : typeFilter,
          status: statusFilter === 'all' ? undefined : statusFilter,
          sort_by: sortBy,
          sort_order: sortOrder,
        },
      });
      return response.data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending_gse':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'archived':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'CER':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'GAC':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'CS':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    return t.status[status as keyof typeof t.status] || status;
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load configurations. Please try again later.
          {error instanceof Error ? ` Error: ${error.message}` : ''}
        </AlertDescription>
      </Alert>
    );
  }

  const breadcrumbs = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/cer', label: 'Energy Management', icon: Settings2 },
    { href: '/cer/configurations', label: 'Energy Configurations Overview', current: true }
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t.title}</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your energy configurations
          </p>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <Button asChild variant="outline" className="gap-2 flex-1 sm:flex-none">
            <Link to="/cer/configurations/new?mode=simulation">
              <PlayCircle className="w-4 h-4" />
              {t.simulate}
            </Link>
          </Button>
          <Button asChild className="gap-2 flex-1 sm:flex-none">
            <Link to="/cer/configurations/new?mode=active">
              <Settings2 className="w-4 h-4" />
              {t.activate}
          </Link>
        </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search configurations by name, type, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select 
            value={typeFilter} 
            onValueChange={(value) => {
              setTypeFilter(value);
              updateFilters({ type: value });
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder={t.filterByType} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allTypes}</SelectItem>
              <SelectItem value="CER">CER</SelectItem>
              <SelectItem value="GAC">GAC</SelectItem>
              <SelectItem value="CS">CS</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              updateFilters({ status: value });
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending_gse">GSE Pending</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
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
                  Refine your configuration list
                </SheetDescription>
              </SheetHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={sortBy}
                    onValueChange={(value) => {
                      setSortBy(value);
                      updateFilters({ sort: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="created_at">Creation Date</SelectItem>
                      <SelectItem value="participant_count">Participants</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort Order</label>
                  <Select
                    value={sortOrder}
                    onValueChange={(value: 'asc' | 'desc') => {
                      setSortOrder(value);
                      updateFilters({ order: value });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort order..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Ascending</SelectItem>
                      <SelectItem value="desc">Descending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">View</label>
                  <div className="flex rounded-lg border p-1">
                    <button
                      className={cn(
                        "flex-1 px-3 py-1.5 text-sm rounded-md transition-colors flex items-center justify-center gap-2",
                        view === 'grid' ? "bg-background shadow-sm" : "text-muted-foreground"
                      )}
                      onClick={() => {
                        setView('grid');
                        localStorage.setItem('configView', 'grid');
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
                        localStorage.setItem('configView', 'list');
                      }}
                    >
                      <ListIcon className="h-4 w-4" />
                      List
                    </button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filters */}
      {(typeFilter !== 'all' || statusFilter !== 'all' || searchTerm) && (
        <div className="flex flex-wrap gap-2">
          {typeFilter !== 'all' && (
            <Badge variant="secondary" className="gap-2">
              Type: {typeFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setTypeFilter('all');
                  updateFilters({ type: 'all' });
                }}
              />
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="gap-2">
              Status: {statusFilter}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setStatusFilter('all');
                  updateFilters({ status: 'all' });
                }}
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
              setStatusFilter('all');
              setSearchTerm('');
              setSearchParams({});
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className={cn(
          "grid gap-6",
          view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="h-32 bg-muted" />
              <CardContent className="h-24 bg-muted/50" />
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Empty State */}
          {!data?.items?.length ? (
            <Card className="p-12 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Settings2 className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardTitle className="mb-2">No configurations found</CardTitle>
              <CardDescription className="mb-4">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                  ? "Try adjusting your filters or search terms"
                  : "Get started by creating your first energy configuration"}
              </CardDescription>
              <Button asChild>
                <Link to="/cer/configurations/new">
                  Create Configuration
                </Link>
              </Button>
            </Card>
          ) : (
            // Configuration Grid/List
            <div className={cn(
              "grid gap-6",
              view === 'grid' ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            )}>
              {data.items.map((config) => (
                <Link
                  key={config.id}
                  to={`/cer/configurations/${config.id}/edit`}
                  className="block group"
                >
                  <Card className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                        config.type === 'CER' ? "bg-emerald-100" :
                        config.type === 'GAC' ? "bg-blue-100" :
                        "bg-purple-100"
                      )}>
                        {getConfigurationIcon(config)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {config.name}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {config.description}
                            </p>
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <Badge className={cn(
                              "rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap",
                              config.type === 'CER' ? "bg-emerald-50 text-emerald-700" :
                              config.type === 'GAC' ? "bg-blue-50 text-blue-700" :
                              "bg-purple-50 text-purple-700"
                            )}>
                              {config.type}
                            </Badge>
                            <Badge variant={getStatusVariant(config.status)} className="rounded-md px-2 py-1 text-xs font-medium whitespace-nowrap">
                              {config.status}
                            </Badge>
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2 min-w-0">
                            <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                            <span className="truncate">{config.address}</span>
                          </div>
                        </div>

                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <Users className="h-4 w-4 text-gray-400 shrink-0" />
                            <span>{config.participant_count}</span>
                            <span>Participants</span>
                          </div>
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                            <span>Created on {formatDate(config.created_at)}</span>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
                          <div className="flex items-center gap-2">
                            <Zap className="h-4 w-4 text-yellow-500 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm text-gray-600 whitespace-nowrap">Production</div>
                              <div className="text-base font-medium text-gray-900">
                                {config.total_production || '0'} kWh
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-blue-500 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm text-gray-600 whitespace-nowrap">Consumption</div>
                              <div className="text-base font-medium text-gray-900">
                                {config.total_consumption || '0'} kWh
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Battery className="h-4 w-4 text-green-500 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm text-gray-600 whitespace-nowrap">Self-Consumption</div>
                              <div className="text-base font-medium text-gray-900">
                                {config.self_consumption_rate || '0'}%
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-purple-500 shrink-0" />
                            <div className="min-w-0">
                              <div className="text-sm text-gray-600 whitespace-nowrap">Shared Energy</div>
                              <div className="text-base font-medium text-gray-900">
                                {config.shared_energy || '0'} kWh
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <div className="flex items-center gap-3">
                        {React.createElement(
                          getConfigurationTypeInfo(config.type).icon,
                          { className: cn(
                            "h-5 w-5 shrink-0",
                            config.type === 'CER' ? "text-emerald-500" :
                            config.type === 'GAC' ? "text-blue-500" :
                            "text-purple-500"
                          )}
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-gray-900 truncate">
                            {getConfigurationTypeInfo(config.type).title}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {getConfigurationTypeInfo(config.type).description}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.total > pageSize && (
            <div className="flex items-center justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {pageIndex * pageSize + 1} to {Math.min((pageIndex + 1) * pageSize, data.total)} of {data.total} configurations
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPageIndex(p => Math.max(0, p - 1))}
                  disabled={pageIndex === 0}
                >
                  {t.pagination.previous}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPageIndex(p => p + 1)}
                  disabled={pageIndex >= Math.ceil(data.total / pageSize) - 1}
                >
                  {t.pagination.next}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 